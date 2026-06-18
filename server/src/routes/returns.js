import express from 'express';
import { authenticate } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const returns = await prisma.returnEvent.findMany({
      include: { asset: true, employee: true }
    });
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  const { assetId, employeeId, condition, notes } = req.body;
  try {
    const returnEvent = await prisma.$transaction(async (tx) => {
      // 1. Create Return Event
      const ret = await tx.returnEvent.create({
        data: {
          assetId,
          employeeId,
          condition,
          notes
        }
      });

      // 2. Mark any active allocation as Returned
      await tx.allocation.updateMany({
        where: { assetId, status: 'Active' },
        data: { status: 'Returned', actualReturnDate: new Date() }
      });

      // 3. Update Asset Status based on condition
      const newStatus = condition.toLowerCase() === 'damaged' ? 'Damaged' : 'In Stock';
      await tx.asset.update({
        where: { id: assetId },
        data: { status: newStatus }
      });

      return ret;
    });

    res.status(201).json(returnEvent);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

export default router;
