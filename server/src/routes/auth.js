import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      select: { id: true, name: true, code: true }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching departments' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, role, departmentId } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    let targetDeptId = departmentId;
    if (!targetDeptId) {
      const defaultDept = await prisma.department.findFirst();
      if (!defaultDept) {
        const newDept = await prisma.department.create({
          data: { name: 'General', code: 'GEN' }
        });
        targetDeptId = newDept.id;
      } else {
        targetDeptId = defaultDept.id;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const randomSuffix = Math.floor(100 + Math.random() * 900) + Date.now().toString().slice(-4);
    const empId = `EMP${randomSuffix}`;

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || 'user',
        }
      });

      await tx.employee.create({
        data: {
          employeeId: empId,
          firstName,
          lastName,
          email,
          role: role || 'user',
          departmentId: targetDeptId,
          userId: user.id
        }
      });

      return user;
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName,
        lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { employee: true }
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.employee?.firstName || '',
        lastName: user.employee?.lastName || ''
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/google-login', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { employee: true }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found in corporate directory.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.employee?.firstName || '',
        lastName: user.employee?.lastName || ''
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during Google SSO authentication.' });
  }
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { employee: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.employee?.firstName || '',
      lastName: user.employee?.lastName || ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/profile', authenticate, async (req, res) => {
  const { firstName, lastName, email, role, password } = req.body;
  try {
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update User
      const updateUserData = {};
      if (email) updateUserData.email = email;
      if (role) updateUserData.role = role;
      if (password) {
        updateUserData.password = await bcrypt.hash(password, 10);
      }
      
      const user = await tx.user.update({
        where: { id: req.user.id },
        data: updateUserData
      });
      
      // 2. Update Employee if exists
      const emp = await tx.employee.findUnique({
        where: { userId: req.user.id }
      });
      
      let employee = null;
      if (emp) {
        const updateEmpData = {};
        if (firstName !== undefined) updateEmpData.firstName = firstName;
        if (lastName !== undefined) updateEmpData.lastName = lastName;
        if (email !== undefined) updateEmpData.email = email;
        if (role !== undefined) updateEmpData.role = role;
        
        employee = await tx.employee.update({
          where: { id: emp.id },
          data: updateEmpData
        });
      }
      
      return { user, employee };
    });
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updated.user.id,
        email: updated.user.email,
        role: updated.user.role,
        firstName: updated.employee?.firstName || '',
        lastName: updated.employee?.lastName || ''
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update profile', error: error.message });
  }
});

export default router;
