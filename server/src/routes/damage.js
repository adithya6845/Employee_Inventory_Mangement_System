import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';
import prisma from '../prismaClient.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists securely outside public web root
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', authenticate, async (req, res) => {
  try {
    const reports = await prisma.damageReport.findMany({
      include: { asset: true, reportedBy: true }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Secure endpoint to fetch the image, requires authentication
router.get('/photo/:filename', authenticate, (req, res) => {
  const filename = req.params.filename;
  
  // Basic security check to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const filePath = path.join(uploadDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // If not found (e.g. for mock records), send a 404 or a fallback image
    res.status(404).json({ message: 'Image not found' });
  }
});

router.post('/', authenticate, upload.single('photo'), async (req, res) => {
  const { assetId, reportedById, severity, description } = req.body;
  
  // If multer processed a file, save the generated filename, else fallback (e.g. for mock data testing)
  let imageUrl = null;
  if (req.file) {
    imageUrl = req.file.filename;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }

  try {
    const report = await prisma.$transaction(async (tx) => {
      // 1. Create Damage Report
      const rep = await tx.damageReport.create({
        data: {
          assetId,
          reportedById,
          severity,
          description,
          imageUrl,
          status: 'Open'
        }
      });

      // 2. Update Asset Status
      await tx.asset.update({
        where: { id: assetId },
        data: { status: 'Damaged' }
      });

      return rep;
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
});

export default router;
