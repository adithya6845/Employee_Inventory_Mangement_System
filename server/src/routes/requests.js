import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      include: { employee: true },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Create new request
router.post('/', async (req, res) => {
  try {
    const { type, description, employeeId } = req.body;
    const newRequest = await prisma.request.create({
      data: { type, description, employeeId },
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Update request status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.request.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request status' });
  }
});

// Update request details (Edit)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, employeeId, status } = req.body;
    const updated = await prisma.request.update({
      where: { id },
      data: { type, description, employeeId, status },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit request details' });
  }
});

// Delete request
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.request.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

export default router;
