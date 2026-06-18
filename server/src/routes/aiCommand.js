import express from 'express';
import { authenticate } from '../middleware/auth.js';
import prisma from '../prismaClient.js';
import OpenAI from 'openai';

const router = express.Router();
const nvidia = new OpenAI({ 
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Helper: Find department loosely by code or name
async function findDeptLoosely(input) {
  if (!input) return null;
  const cleanInput = input.trim();
  // Try code match exactly
  let dept = await prisma.department.findUnique({
    where: { code: cleanInput.toUpperCase() }
  });
  if (dept) return dept;

  // Try name match case-insensitive
  dept = await prisma.department.findFirst({
    where: { name: { contains: cleanInput, mode: 'insensitive' } }
  });
  return dept;
}

// Helper: Find employee loosely by full name (first + last) or partial name
async function findEmployeeLoosely(fullName) {
  if (!fullName) return null;
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts.slice(1).join(' ');
    // Try matching both first and last
    let emp = await prisma.employee.findFirst({
      where: {
        AND: [
          { firstName: { contains: first, mode: 'insensitive' } },
          { lastName: { contains: last, mode: 'insensitive' } }
        ]
      }
    });
    if (emp) return emp;
  }

  // Try matching either first or last name
  const queryPart = parts[0];
  let emp = await prisma.employee.findFirst({
    where: {
      OR: [
        { firstName: { contains: queryPart, mode: 'insensitive' } },
        { lastName: { contains: queryPart, mode: 'insensitive' } }
      ]
    }
  });
  return emp;
}

router.post('/command', authenticate, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Command prompt is required' });
  }

  try {
    const systemPrompt = `You are an AI Inventory Automation Agent. Parse user's natural language requests and convert them into structured JSON actions to update or query the asset database.
You must return ONLY a JSON object representing the action and its arguments. Do NOT include conversational text, markdown blocks, or other characters.

Here are the supported JSON structures:

1. Add Asset:
{
  "action": "add_asset",
  "name": "Asset Name",
  "category": "Laptop" | "Monitor" | "Phone" | "Accessory",
  "department_code": "IT" | "CYBER" | "HR" etc,
  "purchaseCost": 120000,
  "serialNumber": "SN123"
}

2. Edit Asset:
{
  "action": "edit_asset",
  "asset_id": "AST-1018",
  "name": "New Asset Name" (optional),
  "category": "Laptop" etc (optional),
  "purchaseCost": 120000 (optional),
  "status": "In Stock" | "Allocated" etc (optional)
}

3. Delete Asset:
{
  "action": "delete_asset",
  "asset_id": "AST-1018"
}

4. Add Employee:
{
  "action": "add_employee",
  "firstName": "Neha",
  "lastName": "Patel",
  "email": "neha.patel@enterprise.com",
  "role": "Security Engineer",
  "department_code": "CYBER"
}

5. Allocate Asset:
{
  "action": "allocate_asset",
  "asset_id": "AST-1018",
  "employee_name": "Rohan Sharma"
}

6. Return Asset:
{
  "action": "return_asset",
  "asset_id": "AST-1018",
  "condition": "Excellent" | "Good" | "Damaged",
  "notes": "Reason/Note"
}

7. Update Asset Status:
{
  "action": "update_status",
  "asset_id": "AST-1018",
  "status": "In Stock" | "Allocated" | "Damaged" | "Retired"
}

8. View Stock Info:
{
  "action": "view_stock",
  "category": "Laptop" (optional)
}

9. View Employee Allocations:
{
  "action": "view_allocations",
  "employee_name": "Rohan Sharma" (optional)
}

10. View Damaged Assets:
{
  "action": "view_damaged",
  "category": "Monitor" (optional)
}

11. View Overdue Returns:
{
  "action": "view_overdue"
}

12. Generate Report:
{
  "action": "generate_report",
  "type": "all_assets" | "allocations" | "returns" | "damages"
}

Generate strictly valid JSON. If the command does not map to any action, return:
{ "action": "unknown", "error": "Command not understood." }`;

    console.log('Sending command to NVIDIA API:', prompt);
    const response = await nvidia.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 1024,
      top_p: 1
    });

    let rawOutput = response.choices[0].message.content.trim();
    console.log('NVIDIA AI raw output:', rawOutput);

    // Clean up potential markdown formatting from AI output
    if (rawOutput.includes('```')) {
      rawOutput = rawOutput.replace(/```json|```/g, '').trim();
    }

    let parsedAction;
    try {
      parsedAction = JSON.parse(rawOutput);
    } catch (e) {
      return res.status(422).json({
        message: 'AI returned non-JSON format. Please try again with clear instructions.',
        raw: rawOutput
      });
    }

    const { action } = parsedAction;

    // Validate execution context & business rules
    switch (action) {
      case 'add_asset': {
        const { name, category, department_code, purchaseCost, serialNumber } = parsedAction;
        if (!name || !category || !department_code) {
          return res.status(400).json({ message: 'Name, Category, and Department Code are required to add an asset.' });
        }

        const dept = await findDeptLoosely(department_code);
        if (!dept) {
          return res.status(404).json({ message: `Department code or name "${department_code}" does not exist.` });
        }

        // Auto-generate the AST-XXXX sequence
        const lastAsset = await prisma.asset.findFirst({
          orderBy: { assetId: 'desc' }
        });
        let nextNumber = 1001;
        if (lastAsset && lastAsset.assetId.startsWith('AST-')) {
          const lastNum = parseInt(lastAsset.assetId.split('-')[1]);
          if (!isNaN(lastNum)) {
            nextNumber = lastNum + 1;
          }
        }
        const newAssetId = `AST-${nextNumber}`;

        const asset = await prisma.asset.create({
          data: {
            assetId: newAssetId,
            name,
            category,
            departmentId: dept.id,
            purchaseCost: purchaseCost ? parseInt(purchaseCost) : 0,
            serialNumber: serialNumber || `SN${nextNumber}`,
            status: 'In Stock'
          }
        });

        // Log AI action
        await prisma.activityLog.create({
          data: { action: `Created asset ${asset.name} (${asset.assetId}) via AI`, type: 'asset' }
        });

        return res.json({
          success: true,
          action: 'add_asset',
          message: `Asset "${name}" successfully added to inventory with ID ${newAssetId}.`,
          data: asset
        });
      }

      case 'edit_asset': {
        const { asset_id, name, category, purchaseCost, status } = parsedAction;
        if (!asset_id) {
          return res.status(400).json({ message: 'Asset ID is required to edit an asset.' });
        }

        const asset = await prisma.asset.findUnique({ where: { assetId: asset_id } });
        if (!asset) {
          return res.status(404).json({ message: `Asset "${asset_id}" not found.` });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (category) updateData.category = category;
        if (purchaseCost) updateData.purchaseCost = parseInt(purchaseCost);
        if (status) updateData.status = status;

        const updated = await prisma.asset.update({
          where: { id: asset.id },
          data: updateData
        });

        await prisma.activityLog.create({
          data: { action: `Updated asset ${asset_id} via AI`, type: 'asset' }
        });

        return res.json({
          success: true,
          action: 'edit_asset',
          message: `Asset ${asset_id} updated successfully.`,
          data: updated
        });
      }

      case 'delete_asset': {
        const { asset_id } = parsedAction;
        if (!asset_id) {
          return res.status(400).json({ message: 'Asset ID is required to delete an asset.' });
        }

        const asset = await prisma.asset.findUnique({
          where: { assetId: asset_id },
          include: { allocations: { where: { status: 'Active' } } }
        });

        if (!asset) {
          return res.status(404).json({ message: `Asset "${asset_id}" not found.` });
        }

        if (asset.allocations.length > 0) {
          return res.status(400).json({
            message: `⚠️ Security Violation: Cannot delete asset ${asset_id} because it is currently allocated to an employee.`
          });
        }

        // Safe hard-delete or retired transition
        await prisma.allocation.deleteMany({ where: { assetId: asset.id } });
        await prisma.returnEvent.deleteMany({ where: { assetId: asset.id } });
        await prisma.damageReport.deleteMany({ where: { assetId: asset.id } });
        await prisma.asset.delete({ where: { id: asset.id } });

        await prisma.activityLog.create({
          data: { action: `Deleted asset ${asset_id} via AI`, type: 'asset' }
        });

        return res.json({
          success: true,
          action: 'delete_asset',
          message: `Asset ${asset_id} was successfully deleted from inventory.`
        });
      }

      case 'add_employee': {
        const { firstName, lastName, email, role, department_code } = parsedAction;
        if (!firstName || !lastName || !email || !role || !department_code) {
          return res.status(400).json({ message: 'First name, last name, email, role, and department code are required.' });
        }

        const dept = await findDeptLoosely(department_code);
        if (!dept) {
          return res.status(404).json({ message: `Department code/name "${department_code}" not found.` });
        }

        // Auto-generate employeeId sequence
        const lastEmp = await prisma.employee.findFirst({
          orderBy: { employeeId: 'desc' }
        });
        let nextNum = 53;
        if (lastEmp && lastEmp.employeeId.startsWith('EMP')) {
          const num = parseInt(lastEmp.employeeId.replace('EMP', ''));
          if (!isNaN(num)) nextNum = num + 1;
        }
        const newEmpId = `EMP${nextNum.toString().padStart(3, '0')}`;

        const employee = await prisma.employee.create({
          data: {
            employeeId: newEmpId,
            firstName,
            lastName,
            email,
            role,
            departmentId: dept.id,
            status: 'active'
          }
        });

        await prisma.activityLog.create({
          data: { action: `Added employee ${firstName} ${lastName} (${newEmpId}) via AI`, type: 'employee' }
        });

        return res.json({
          success: true,
          action: 'add_employee',
          message: `Employee "${firstName} ${lastName}" added with ID ${newEmpId}.`,
          data: employee
        });
      }

      case 'allocate_asset': {
        const { asset_id, employee_name } = parsedAction;
        if (!asset_id || !employee_name) {
          return res.status(400).json({ message: 'Asset ID and Employee Name are required.' });
        }

        const asset = await prisma.asset.findUnique({ where: { assetId: asset_id } });
        if (!asset) {
          return res.status(404).json({ message: `Asset "${asset_id}" not found.` });
        }

        if (asset.status === 'Allocated') {
          return res.status(400).json({ message: `⚠️ Allocation Conflict: Asset ${asset_id} is already allocated to another employee.` });
        }
        if (asset.status === 'Damaged') {
          return res.status(400).json({ message: `⚠️ Diagnostics Alert: Asset ${asset_id} is currently Damaged and cannot be allocated.` });
        }
        if (asset.status === 'Retired') {
          return res.status(400).json({ message: `⚠️ Safety Conflict: Asset ${asset_id} is Retired.` });
        }

        const emp = await findEmployeeLoosely(employee_name);
        if (!emp) {
          return res.status(404).json({ message: `Employee "${employee_name}" not found.` });
        }

        // Create Active Allocation
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 14); // 2-week standard return window

        const allocation = await prisma.allocation.create({
          data: {
            assetId: asset.id,
            employeeId: emp.id,
            allocatedAt: new Date(),
            expectedReturnDate: returnDate,
            status: 'Active',
            notes: 'AI Automated Allocation'
          }
        });

        // Update Asset status
        await prisma.asset.update({
          where: { id: asset.id },
          data: { status: 'Allocated' }
        });

        await prisma.activityLog.create({
          data: { action: `Allocated ${asset_id} to ${emp.firstName} ${emp.lastName} via AI`, type: 'allocation' }
        });

        return res.json({
          success: true,
          action: 'allocate_asset',
          message: `Asset ${asset_id} successfully allocated to ${emp.firstName} ${emp.lastName}. Expected return: ${returnDate.toDateString()}.`,
          data: allocation
        });
      }

      case 'return_asset': {
        const { asset_id, condition, notes } = parsedAction;
        if (!asset_id) {
          return res.status(400).json({ message: 'Asset ID is required to return.' });
        }

        const asset = await prisma.asset.findUnique({
          where: { assetId: asset_id },
          include: { allocations: { where: { status: 'Active' } } }
        });

        if (!asset) {
          return res.status(404).json({ message: `Asset "${asset_id}" not found.` });
        }

        const activeAlloc = asset.allocations[0];
        if (!activeAlloc) {
          return res.status(400).json({ message: `Asset ${asset_id} is not currently allocated to any employee.` });
        }

        const returnCond = condition || 'Excellent';

        // Create Return Event
        const returnEvent = await prisma.returnEvent.create({
          data: {
            assetId: asset.id,
            employeeId: activeAlloc.employeeId,
            returnedAt: new Date(),
            condition: returnCond,
            notes: notes || 'AI Automated Return'
          }
        });

        // Close Active Allocation
        await prisma.allocation.update({
          where: { id: activeAlloc.id },
          data: { status: 'Returned', actualReturnDate: new Date() }
        });

        // Update Asset Status based on return condition
        let nextStatus = 'In Stock';
        if (returnCond.toLowerCase() === 'damaged') {
          nextStatus = 'Damaged';
          // Create Damage Report in DB
          await prisma.damageReport.create({
            data: {
              assetId: asset.id,
              reportedById: activeAlloc.employeeId,
              severity: 'High',
              description: notes || 'Returned in Damaged condition via AI Automated Return.',
              status: 'Open'
            }
          });
        }

        await prisma.asset.update({
          where: { id: asset.id },
          data: { status: nextStatus }
        });

        await prisma.activityLog.create({
          data: { action: `Returned asset ${asset_id} (Condition: ${returnCond}) via AI`, type: 'return' }
        });

        return res.json({
          success: true,
          action: 'return_asset',
          message: `Asset ${asset_id} returned successfully in "${returnCond}" condition.`,
          data: returnEvent
        });
      }

      case 'update_status': {
        const { asset_id, status } = parsedAction;
        if (!asset_id || !status) {
          return res.status(400).json({ message: 'Asset ID and target status are required.' });
        }

        const asset = await prisma.asset.findUnique({ where: { assetId: asset_id } });
        if (!asset) {
          return res.status(404).json({ message: `Asset "${asset_id}" not found.` });
        }

        await prisma.asset.update({
          where: { id: asset.id },
          data: { status }
        });

        await prisma.activityLog.create({
          data: { action: `Updated status of ${asset_id} to "${status}" via AI`, type: 'asset' }
        });

        return res.json({
          success: true,
          action: 'update_status',
          message: `Status of ${asset_id} successfully updated to "${status}".`
        });
      }

      case 'view_stock': {
        const { category } = parsedAction;
        const queryCond = { status: 'In Stock' };
        if (category) queryCond.category = { contains: category, mode: 'insensitive' };

        const stock = await prisma.asset.findMany({
          where: queryCond,
          include: { department: true }
        });

        return res.json({
          success: true,
          action: 'view_stock',
          message: stock.length > 0 ? `Showing stock information for ${category || 'all categories'}:` : 'No available stock found.',
          type: 'table',
          headers: ['Asset ID', 'Name', 'Category', 'Serial Number', 'Department', 'Location'],
          data: stock.map(s => ({
            id: s.assetId,
            name: s.name,
            category: s.category,
            serial: s.serialNumber,
            dept: s.department?.name || '-',
            location: s.location || 'HQ'
          }))
        });
      }

      case 'view_allocations': {
        const { employee_name } = parsedAction;
        const queryCond = { status: 'Active' };

        if (employee_name) {
          const emp = await findEmployeeLoosely(employee_name);
          if (!emp) {
            return res.status(404).json({ message: `Employee "${employee_name}" not found.` });
          }
          queryCond.employeeId = emp.id;
        }

        const allocs = await prisma.allocation.findMany({
          where: queryCond,
          include: { asset: true, employee: true }
        });

        return res.json({
          success: true,
          action: 'view_allocations',
          message: allocs.length > 0 ? `Showing current active allocations:` : 'No active allocations found.',
          type: 'table',
          headers: ['Asset ID', 'Asset Name', 'Allocated To', 'Employee ID', 'Allocated On', 'Expected Return'],
          data: allocs.map(a => ({
            assetId: a.asset?.assetId || '-',
            assetName: a.asset?.name || '-',
            employeeName: `${a.employee?.firstName} ${a.employee?.lastName}`,
            empId: a.employee?.employeeId || '-',
            date: new Date(a.allocatedAt).toLocaleDateString(),
            returnDate: a.expectedReturnDate ? new Date(a.expectedReturnDate).toLocaleDateString() : '-'
          }))
        });
      }

      case 'view_damaged': {
        const { category } = parsedAction;
        const queryCond = { status: 'Damaged' };
        if (category) queryCond.category = { contains: category, mode: 'insensitive' };

        const damaged = await prisma.asset.findMany({
          where: queryCond,
          include: { department: true }
        });

        return res.json({
          success: true,
          action: 'view_damaged',
          message: damaged.length > 0 ? `Showing damaged assets list:` : 'No damaged assets found in this category.',
          type: 'table',
          headers: ['Asset ID', 'Name', 'Category', 'Serial Number', 'Department', 'Status'],
          data: damaged.map(d => ({
            assetId: d.assetId,
            name: d.name,
            category: d.category,
            serial: d.serialNumber,
            dept: d.department?.name || '-',
            status: d.status
          }))
        });
      }

      case 'view_overdue': {
        const now = new Date();
        const overdue = await prisma.allocation.findMany({
          where: {
            status: 'Active',
            expectedReturnDate: { lt: now }
          },
          include: { asset: true, employee: true }
        });

        return res.json({
          success: true,
          action: 'view_overdue',
          message: overdue.length > 0 ? `🚨 Warning: Found ${overdue.length} overdue return(s):` : '🎉 Wonderful! No overdue returns found.',
          type: 'table',
          headers: ['Asset ID', 'Asset Name', 'Allocated To', 'Due On', 'Days Overdue'],
          data: overdue.map(o => {
            const days = Math.ceil((now - new Date(o.expectedReturnDate)) / 86400000);
            return {
              assetId: o.asset?.assetId || '-',
              assetName: o.asset?.name || '-',
              employeeName: `${o.employee?.firstName} ${o.employee?.lastName}`,
              dueOn: new Date(o.expectedReturnDate).toLocaleDateString(),
              daysOverdue: `${days} days`
            };
          })
        });
      }

      case 'generate_report': {
        const { type } = parsedAction;
        let reportData = [];
        let headers = [];
        let title = '';

        if (type === 'allocations') {
          title = 'Asset Allocations Summary Report';
          headers = ['ID', 'Asset ID', 'Employee Name', 'Allocated On', 'Status'];
          const items = await prisma.allocation.findMany({ include: { asset: true, employee: true } });
          reportData = items.map(i => ({
            id: i.id.substring(0, 8),
            assetId: i.asset?.assetId || '-',
            emp: `${i.employee?.firstName} ${i.employee?.lastName}`,
            date: new Date(i.allocatedAt).toLocaleDateString(),
            status: i.status
          }));
        } else if (type === 'returns') {
          title = 'Asset Return Handovers Report';
          headers = ['ID', 'Asset ID', 'Employee Name', 'Returned On', 'Condition'];
          const items = await prisma.returnEvent.findMany({ include: { asset: true, employee: true } });
          reportData = items.map(i => ({
            id: i.id.substring(0, 8),
            assetId: i.asset?.assetId || '-',
            emp: `${i.employee?.firstName} ${i.employee?.lastName}`,
            date: new Date(i.returnedAt).toLocaleDateString(),
            condition: i.condition
          }));
        } else if (type === 'damages') {
          title = 'Diagnostics & Damage Reports Summary';
          headers = ['ID', 'Asset ID', 'Reported By', 'Reported On', 'Severity', 'Status'];
          const items = await prisma.damageReport.findMany({ include: { asset: true, reportedBy: true } });
          reportData = items.map(i => ({
            id: i.id.substring(0, 8),
            assetId: i.asset?.assetId || '-',
            emp: `${i.reportedBy?.firstName} ${i.reportedBy?.lastName}`,
            date: new Date(i.reportedAt).toLocaleDateString(),
            severity: i.severity,
            status: i.status
          }));
        } else {
          title = 'Complete Asset Inventory Report';
          headers = ['Asset ID', 'Name', 'Category', 'Purchase Cost', 'Status'];
          const items = await prisma.asset.findMany();
          reportData = items.map(i => ({
            assetId: i.assetId,
            name: i.name,
            category: i.category,
            cost: `₹${(i.purchaseCost || 0).toLocaleString('en-IN')}`,
            status: i.status
          }));
        }

        return res.json({
          success: true,
          action: 'generate_report',
          message: `📊 ${title} successfully generated:`,
          type: 'table',
          headers,
          data: reportData
        });
      }

      default: {
        return res.status(400).json({
          message: parsedAction.error || 'Command not understood. Please use clear inventory action commands.'
        });
      }
    }
  } catch (error) {
    console.error('NVIDIA AI Command Processing Error:', error);
    res.status(500).json({ message: 'Failed to process AI command', error: error.message });
  }
});

export default router;
