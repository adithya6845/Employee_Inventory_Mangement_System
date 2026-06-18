import express from 'express';
import { authenticate } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const allocations = await prisma.allocation.findMany({
      include: { 
        asset: true, 
        employee: {
          include: { department: true }
        }
      }
    });
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  const { assetId, employeeId, expectedReturnDate, notes } = req.body;
  try {
    const allocation = await prisma.$transaction(async (tx) => {
      // 1. Enforce business rule: An asset cannot be assigned to TWO employees at the SAME TIME
      const activeAllocation = await tx.allocation.findFirst({
        where: {
          assetId,
          status: 'Active'
        },
        include: { employee: true }
      });

      if (activeAllocation) {
        throw new Error(
          `Double-allocation blocked: This asset is currently actively allocated to ${activeAllocation.employee.firstName} ${activeAllocation.employee.lastName} (${activeAllocation.employee.employeeId}). It must be returned first.`
        );
      }

      // 2. Create Allocation Event
      const alloc = await tx.allocation.create({
        data: {
          assetId,
          employeeId,
          expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : null,
          notes,
          status: 'Active'
        }
      });

      // 3. Update Asset Status to Allocated
      await tx.asset.update({
        where: { id: assetId },
        data: { status: 'Allocated' }
      });

      return alloc;
    });

    res.status(201).json(allocation);
  } catch (error) {
    res.status(400).json({ 
      message: 'Bad request', 
      error: error.message 
    });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.$transaction(async (tx) => {
      const alloc = await tx.allocation.findUnique({
        where: { id }
      });
      if (!alloc) {
        throw new Error('Allocation record not found');
      }

      // Revert asset status to In Stock if the deleted allocation was active
      if (alloc.status === 'Active') {
        await tx.asset.update({
          where: { id: alloc.assetId },
          data: { status: 'In Stock' }
        });
      }

      return await tx.allocation.delete({
        where: { id }
      });
    });

    res.json({ message: 'Allocation record deleted successfully', deleted });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete allocation', error: error.message });
  }
});

export default router;
