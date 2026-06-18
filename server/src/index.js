import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import departmentRoutes from './routes/departments.js';
import employeeRoutes from './routes/employees.js';
import assetRoutes from './routes/assets.js';
import aiRoutes from './routes/ai.js';
import aiCommandRoutes from './routes/aiCommand.js';
import requestsRoutes from './routes/requests.js';
import allocationsRoutes from './routes/allocations.js';
import returnsRoutes from './routes/returns.js';
import damageRoutes from './routes/damage.js';
import { auditLogger } from './middleware/audit.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
// app.use(auditLogger);

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai', aiCommandRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/allocations', allocationsRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/damage', damageRoutes);

// Summary stats for dashboard
import prisma from './prismaClient.js';
app.get('/api/summary', async (req, res) => {
    try {
        const [employees, assets, allocations, damages, requests, returns] = await Promise.all([
            prisma.employee.count(),
            prisma.asset.count(),
            prisma.allocation.count({ where: { status: 'Active' } }),
            prisma.damageReport.count({ where: { status: 'Open' } }),
            prisma.request.count(),
            prisma.returnEvent.count()
        ]);
        res.json({ employees, assets, allocations, damages, requests, returns });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching summary' });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
