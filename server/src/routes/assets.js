import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: { 
        department: true,
        allocations: { include: { employee: true }, orderBy: { allocatedAt: 'desc' } },
        returns: { include: { employee: true }, orderBy: { returnedAt: 'desc' } },
        damageReports: { include: { reportedBy: true }, orderBy: { reportedAt: 'desc' } }
      }
    });
    console.log(`[DEBUG] Fetched ${assets.length} assets`);
    res.json(assets);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', authenticate, authorize(['admin', 'it_support']), async (req, res) => {
  try {
    const asset = await prisma.asset.create({
      data: req.body,
    });
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { 
        department: true,
        allocations: { include: { employee: true }, orderBy: { allocatedAt: 'desc' } },
        returns: { include: { employee: true }, orderBy: { returnedAt: 'desc' } },
        damageReports: { include: { reportedBy: true }, orderBy: { reportedAt: 'desc' } }
      }
    });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authenticate, authorize(['admin', 'it_support']), async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await prisma.asset.update({
      where: { id },
      data: req.body,
    });
    res.json(asset);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

export default router;
