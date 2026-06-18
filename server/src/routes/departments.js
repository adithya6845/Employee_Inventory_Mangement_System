import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { employees: true, assets: true }
        }
      }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, authorize(['super_admin']), async (req, res) => {
  try {
    const department = await prisma.department.create({
      data: req.body,
    });
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
});

export default router;
