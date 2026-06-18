import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: { department: true }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, authorize(['super_admin', 'department_manager']), async (req, res) => {
  try {
    const employee = await prisma.employee.create({
      data: req.body,
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
});

export default router;
