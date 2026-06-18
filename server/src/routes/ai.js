import express from 'express';
import { authenticate } from '../middleware/auth.js';
import prisma from '../prismaClient.js';
import OpenAI from 'openai';

const router = express.Router();
const nvidia = new OpenAI({ 
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

router.post('/query', authenticate, async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    const systemPrompt = `You are a specialized SQL assistant for an Asset Lifecycle and Inventory Tracking System.
The database schema includes the following tables:
- User (id, email, password, role, createdAt)
- Department (id, name, code, createdAt)
- Employee (id, employeeId, firstName, lastName, email, role, departmentId, status, userId, createdAt)
- Asset (id, assetId, name, category, departmentId, manufacturer, model, serialNumber, purchaseDate, purchaseCost, status, location, createdAt, updatedAt)
- Allocation (id, assetId, employeeId, allocatedAt, expectedReturnDate, actualReturnDate, status, notes)
- ReturnEvent (id, assetId, employeeId, returnedAt, condition, notes)
- DamageReport (id, assetId, reportedById, reportedAt, severity, description, imageUrl, status)
- Request (id, type, description, status, employeeId, createdAt, updatedAt)
- AiQueryHistory (id, query, sql, timestamp)

Role-based access:
- admin: All access (inventory, history, all employees)
- it_support: Access to allocations, returns, damages, inventory
- user: Limited access to their own allocations and requests

Convert the user's natural language request into a valid SQL query. Note that we are using SQLite in this environment.
Return ONLY the SQL query, no explanation. If the request is not related to the database, return "I can only help with database queries."
Be careful with joins and table names. Always prioritize safety.`;

    const response = await nvidia.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0,
    });

    let sql = response.choices[0].message.content.trim();

    // Clean up potential markdown blocks from AI response
    if (sql.includes('```')) {
      sql = sql.replace(/```sql|```/g, '').trim();
    }

    if (sql.startsWith("I can only help")) {
      return res.status(400).json({ message: sql });
    }

    // Basic sanitization (simple check for dangerous keywords if not a SELECT)
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'GRANT', 'REVOKE'];
    if (dangerousKeywords.some(keyword => sql.toUpperCase().includes(keyword))) {
        // Allow deletion if the user is super_admin and it's intended, but for safety in this demo, let's limit it.
        if (req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Unauthorized query type' });
        }
    }

    const result = await prisma.$queryRawUnsafe(sql);

    // Save to history
    await prisma.aiQueryHistory.create({
      data: {
        query,
        sql,
      }
    });

    // Serialize BigInt for JSON
    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    res.json({ sql, result: serializedResult });
  } catch (error) {
    console.error('AI Query Error:', error);
    res.status(500).json({ message: 'Failed to process AI query', error: error.message });
  }
});

export default router;
