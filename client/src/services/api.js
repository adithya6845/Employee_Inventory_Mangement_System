import mockData from './mockData.json';

// Ensure the database is initialized in localStorage
const initDb = () => {
  if (!localStorage.getItem('inventory_db')) {
    const db = {
      ...mockData,
      tickets: [
        { id: "t-1", issue: "VPN Connection Issues", description: "Cannot connect to company VPN from remote location", priority: "high", status: "open", createdBy: { firstName: "Diya" } },
        { id: "t-2", issue: "Keyboard replacement", description: "Some keys on mechanical keyboard are not working", priority: "low", status: "resolved", createdBy: { firstName: "Vihaan" } }
      ],
      leaves: [
        { id: "l-1", employee: { firstName: "Aarav", lastName: "Patel" }, type: "Annual Leave", startDate: "2026-06-20", endDate: "2026-06-25", status: "approved", reason: "Family vacation" },
        { id: "l-2", employee: { firstName: "Neha", lastName: "Joshi" }, type: "Sick Leave", startDate: "2026-06-18", endDate: "2026-06-19", status: "pending", reason: "Dental appointment" }
      ]
    };
    localStorage.setItem('inventory_db', JSON.stringify(db));
  }
};

initDb();

const getDb = () => JSON.parse(localStorage.getItem('inventory_db') || '{}');
const saveDb = (db) => localStorage.setItem('inventory_db', JSON.stringify(db));

// Helpers for Mock DB Operations
const getAssets = (db) => {
  return db.assets.map(asset => ({
    ...asset,
    department: db.departments.find(d => d.id === asset.departmentId) || null
  }));
};

const getAssetById = (db, id) => {
  const asset = db.assets.find(a => a.id === id || a.assetId === id);
  if (!asset) return null;
  
  const assetId = asset.id;
  const allocations = db.allocations
    .filter(al => al.assetId === assetId)
    .map(al => ({
      ...al,
      employee: db.employees.find(e => e.id === al.employeeId) || null
    }));
    
  const returns = db.returns
    .filter(r => r.assetId === assetId)
    .map(r => ({
      ...r,
      employee: db.employees.find(e => e.id === r.employeeId) || null
    }));
    
  const damageReports = db.damageReports
    .filter(dr => dr.assetId === assetId)
    .map(dr => ({
      ...dr,
      reportedBy: db.employees.find(e => e.id === dr.reportedById) || null
    }));

  return {
    ...asset,
    department: db.departments.find(d => d.id === asset.departmentId) || null,
    allocations,
    returns,
    damageReports
  };
};

const createAsset = (db, data) => {
  const lastAsset = db.assets[db.assets.length - 1];
  let nextNumber = 1001;
  if (lastAsset && lastAsset.assetId.startsWith('AST-')) {
    const lastNum = parseInt(lastAsset.assetId.split('-')[1]);
    if (!isNaN(lastNum)) {
      nextNumber = lastNum + 1;
    }
  }
  const newAssetId = `AST-${nextNumber}`;
  
  const newAsset = {
    id: `asset-${Date.now()}`,
    assetId: newAssetId,
    name: data.name,
    category: data.category,
    departmentId: data.departmentId,
    purchaseCost: data.purchaseCost ? parseInt(data.purchaseCost) : 1000,
    serialNumber: data.serialNumber || `SN${nextNumber}`,
    status: 'In Stock',
    location: data.location || 'HQ Store',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.assets.push(newAsset);
  return newAsset;
};

const updateAsset = (db, id, data) => {
  const index = db.assets.findIndex(a => a.id === id || a.assetId === id);
  if (index === -1) return null;
  db.assets[index] = {
    ...db.assets[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  return db.assets[index];
};

const getAllocations = (db) => {
  return db.allocations.map(al => ({
    ...al,
    asset: db.assets.find(a => a.id === al.assetId) || null,
    employee: db.employees.find(e => e.id === al.employeeId) || null
  }));
};

const createAllocation = (db, data) => {
  const newAlloc = {
    id: `alloc-${Date.now()}`,
    assetId: data.assetId,
    employeeId: data.employeeId,
    status: 'Active',
    allocatedAt: new Date().toISOString(),
    expectedReturnDate: data.expectedReturnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    actualReturnDate: null,
    notes: data.notes || ''
  };
  db.allocations.unshift(newAlloc);
  
  const asset = db.assets.find(a => a.id === data.assetId);
  if (asset) {
    asset.status = 'Allocated';
  }
  return newAlloc;
};

const deleteAllocation = (db, id) => {
  const index = db.allocations.findIndex(al => al.id === id);
  if (index === -1) return false;
  const alloc = db.allocations[index];
  
  const asset = db.assets.find(a => a.id === alloc.assetId);
  if (asset) {
    asset.status = 'In Stock';
  }
  db.allocations.splice(index, 1);
  return true;
};

const getEmployees = (db) => {
  return db.employees.map(emp => ({
    ...emp,
    department: db.departments.find(d => d.id === emp.departmentId) || null
  }));
};

const createEmployee = (db, data) => {
  const lastEmp = db.employees[db.employees.length - 1];
  let nextNum = 53;
  if (lastEmp && lastEmp.employeeId.startsWith('EMP')) {
    const num = parseInt(lastEmp.employeeId.replace('EMP', ''));
    if (!isNaN(num)) nextNum = num + 1;
  }
  const newEmpId = `EMP${nextNum.toString().padStart(3, '0')}`;

  const newEmp = {
    id: `emp-${Date.now()}`,
    employeeId: newEmpId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: data.role || 'user',
    departmentId: data.departmentId,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  db.employees.push(newEmp);
  return newEmp;
};

const getDamageReports = (db) => {
  return db.damageReports.map(dr => ({
    ...dr,
    asset: db.assets.find(a => a.id === dr.assetId) || null,
    reportedBy: db.employees.find(e => e.id === dr.reportedById) || null
  }));
};

const createDamageReport = (db, data) => {
  const newDmg = {
    id: `dmg-${Date.now()}`,
    assetId: data.assetId,
    reportedById: data.reportedById,
    severity: data.severity || 'Medium',
    description: data.description || '',
    status: 'Open',
    reportedAt: new Date().toISOString()
  };
  db.damageReports.unshift(newDmg);

  const asset = db.assets.find(a => a.id === data.assetId);
  if (asset) {
    asset.status = 'Damaged';
  }
  return newDmg;
};

const getReturns = (db) => {
  return db.returns.map(r => ({
    ...r,
    asset: db.assets.find(a => a.id === r.assetId) || null,
    employee: db.employees.find(e => e.id === r.employeeId) || null
  }));
};

const createReturn = (db, data) => {
  const activeAllocIndex = db.allocations.findIndex(al => al.assetId === data.assetId && al.status === 'Active');
  let employeeId = data.employeeId;
  
  if (activeAllocIndex !== -1) {
    db.allocations[activeAllocIndex].status = 'Returned';
    db.allocations[activeAllocIndex].actualReturnDate = new Date().toISOString();
    employeeId = db.allocations[activeAllocIndex].employeeId;
  }
  
  const newReturn = {
    id: `return-${Date.now()}`,
    assetId: data.assetId,
    employeeId: employeeId || 'system',
    returnedAt: new Date().toISOString(),
    condition: data.condition || 'Good',
    notes: data.notes || ''
  };
  db.returns.unshift(newReturn);

  const asset = db.assets.find(a => a.id === data.assetId);
  if (asset) {
    if (data.condition === 'Damaged') {
      asset.status = 'Damaged';
      db.damageReports.unshift({
        id: `dmg-${Date.now()}`,
        assetId: data.assetId,
        reportedById: employeeId || 'system',
        severity: 'High',
        description: data.notes || 'Returned in Damaged condition.',
        status: 'Open',
        reportedAt: new Date().toISOString()
      });
    } else {
      asset.status = 'In Stock';
    }
  }
  
  return newReturn;
};

const getDepartments = (db) => {
  return db.departments.map(dept => {
    const employeesCount = db.employees.filter(e => e.departmentId === dept.id).length;
    const assetsCount = db.assets.filter(a => a.departmentId === dept.id).length;
    return {
      ...dept,
      _count: {
        employees: employeesCount,
        assets: assetsCount
      }
    };
  });
};

const createDepartment = (db, data) => {
  const newDept = {
    id: `dept-${Date.now()}`,
    name: data.name,
    code: data.code || data.name.toUpperCase().replace(/\s+/g, '_')
  };
  db.departments.push(newDept);
  return newDept;
};

const getRequests = (db) => {
  return db.requests.map(r => ({
    ...r,
    employee: db.employees.find(e => e.id === r.employeeId) || null
  }));
};

const createRequest = (db, data) => {
  const newReq = {
    id: `req-${Date.now()}`,
    type: data.type || 'Asset',
    description: data.description,
    status: 'pending',
    employeeId: data.employeeId || 'emp-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.requests.unshift(newReq);
  return newReq;
};

const updateRequestStatus = (db, id, status) => {
  const index = db.requests.findIndex(r => r.id === id);
  if (index === -1) return null;
  db.requests[index].status = status;
  db.requests[index].updatedAt = new Date().toISOString();
  return db.requests[index];
};

const deleteRequest = (db, id) => {
  const index = db.requests.findIndex(r => r.id === id);
  if (index === -1) return false;
  db.requests.splice(index, 1);
  return true;
};

const handleAiCommand = (db, prompt) => {
  const text = prompt.toLowerCase();
  
  if (text.includes('add asset') || text.includes('create asset')) {
    const nameMatch = prompt.match(/(?:add|create) asset\s+([^,]+)/i);
    const name = nameMatch ? nameMatch[1].trim() : 'MacBook Pro';
    
    const category = text.includes('laptop') ? 'Laptop' : text.includes('phone') ? 'Phone' : text.includes('monitor') ? 'Monitor' : 'Accessory';
    const dept = db.departments[0] || { id: 'dept-1', name: 'IT', code: 'IT' };
    
    const asset = createAsset(db, {
      name,
      category,
      departmentId: dept.id,
      purchaseCost: 95000,
      serialNumber: `SN${Math.floor(Math.random() * 900000 + 100000)}`
    });
    
    return {
      success: true,
      action: 'add_asset',
      message: `Asset "${name}" successfully added to inventory with ID ${asset.assetId}.`,
      data: asset
    };
  }
  
  if (text.includes('allocate') || text.includes('assign')) {
    const astMatch = prompt.match(/AST-\d+/i);
    const empMatch = prompt.match(/(?:to|for)\s+([a-zA-Z\s]+)/i);
    
    const assetId = astMatch ? astMatch[0].toUpperCase() : null;
    const empName = empMatch ? empMatch[1].trim() : '';
    
    const asset = db.assets.find(a => a.assetId === assetId);
    if (!asset) {
      return { success: false, message: `Asset "${assetId || 'unknown'}" not found.` };
    }
    
    let employee = db.employees.find(e => 
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(empName.toLowerCase())
    );
    if (!employee) {
      employee = db.employees[0];
    }
    
    if (asset.status === 'Allocated') {
      return { success: false, message: `⚠️ Allocation Conflict: Asset ${assetId} is already allocated.` };
    }
    
    const alloc = createAllocation(db, {
      assetId: asset.id,
      employeeId: employee.id
    });
    
    return {
      success: true,
      action: 'allocate_asset',
      message: `Asset ${assetId} successfully allocated to ${employee.firstName} ${employee.lastName}.`,
      data: alloc
    };
  }

  if (text.includes('return')) {
    const astMatch = prompt.match(/AST-\d+/i);
    const assetId = astMatch ? astMatch[0].toUpperCase() : null;
    const asset = db.assets.find(a => a.assetId === assetId);
    if (!asset) {
      return { success: false, message: `Asset "${assetId || 'unknown'}" not found.` };
    }
    
    const condition = text.includes('damaged') ? 'Damaged' : 'Good';
    const ret = createReturn(db, {
      assetId: asset.id,
      condition,
      notes: 'AI Automated Return'
    });
    
    return {
      success: true,
      action: 'return_asset',
      message: `Asset ${assetId} returned successfully in "${condition}" condition.`,
      data: ret
    };
  }

  if (text.includes('stock') || text.includes('show assets') || text.includes('list assets')) {
    const category = text.includes('laptop') ? 'Laptop' : text.includes('phone') ? 'Phone' : text.includes('monitor') ? 'Monitor' : null;
    let filtered = db.assets.filter(a => a.status === 'In Stock');
    if (category) {
      filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    
    return {
      success: true,
      action: 'view_stock',
      message: filtered.length > 0 ? `Showing stock information for ${category || 'all categories'}:` : 'No available stock found.',
      type: 'table',
      headers: ['Asset ID', 'Name', 'Category', 'Serial Number', 'Location'],
      data: filtered.map(s => ({
        id: s.assetId,
        name: s.name,
        category: s.category,
        serial: s.serialNumber,
        location: s.location || 'HQ'
      }))
    };
  }
  
  return {
    success: true,
    action: 'view_stock',
    message: 'Displaying complete asset inventory:',
    type: 'table',
    headers: ['Asset ID', 'Name', 'Category', 'Status', 'Location'],
    data: db.assets.map(s => ({
      id: s.assetId,
      name: s.name,
      category: s.category,
      status: s.status,
      location: s.location || 'HQ'
    }))
  };
};

// Main Mock Request Routing Layer
const handleMockRequest = async (url, method, data) => {
  const db = getDb();
  const cleanUrl = url.replace(/^(https?:\/\/[^\/]+)?\/api/, '').split('?')[0];
  const urlParts = cleanUrl.split('/').filter(Boolean);
  
  const route = urlParts[0];
  const subRoute = urlParts[1];
  const thirdRoute = urlParts[2];
  
  let responseData = null;
  let status = 200;

  try {
    // 1. Auth Routing
    if (route === 'auth') {
      if (subRoute === 'departments') {
        responseData = db.departments;
      }
      else if (subRoute === 'login') {
        const { email } = data;
        const user = db.users.find(u => u.email === email);
        if (!user) {
          status = 401;
          responseData = { message: 'Invalid credentials' };
        } else {
          const emp = db.employees.find(e => e.userId === user.id) || { firstName: 'Admin', lastName: 'User' };
          responseData = {
            token: 'mock-jwt-token-xyz',
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              firstName: emp.firstName,
              lastName: emp.lastName
            }
          };
        }
      }
      else if (subRoute === 'google-login') {
        const { email } = data;
        const user = db.users.find(u => u.email === email);
        if (!user) {
          status = 404;
          responseData = { message: 'User not found in corporate directory.' };
        } else {
          const emp = db.employees.find(e => e.userId === user.id) || { firstName: 'Google', lastName: 'User' };
          responseData = {
            token: 'mock-jwt-token-xyz',
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              firstName: emp.firstName,
              lastName: emp.lastName
            }
          };
        }
      }
      else if (subRoute === 'register') {
        const { email, password, firstName, lastName, role, departmentId } = data;
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
          status = 400;
          responseData = { message: 'Email already registered' };
        } else {
          const userId = `user-${Date.now()}`;
          const empId = `emp-${Date.now()}`;
          
          db.users.push({
            id: userId,
            email,
            password,
            role: role || 'user',
            createdAt: new Date().toISOString()
          });

          db.employees.push({
            id: empId,
            employeeId: `EMP${Math.floor(100 + Math.random() * 900)}`,
            firstName,
            lastName,
            email,
            role: role || 'user',
            departmentId: departmentId || db.departments[0]?.id || null,
            userId,
            status: 'active',
            createdAt: new Date().toISOString()
          });

          saveDb(db);

          responseData = {
            token: 'mock-jwt-token-xyz',
            user: {
              id: userId,
              email,
              role: role || 'user',
              firstName,
              lastName
            }
          };
          status = 201;
        }
      }
      else if (subRoute === 'profile') {
        // Find current logged in user from localStorage (fallback to admin)
        const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const user = db.users.find(u => u.id === cachedUser.id) || db.users.find(u => u.role === 'admin') || db.users[0];
        const emp = db.employees.find(e => e.userId === user.id);
        
        if (method === 'GET') {
          responseData = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: emp?.firstName || '',
            lastName: emp?.lastName || ''
          };
        } else if (method === 'PATCH') {
          const { firstName, lastName, email: newEmail, role: newRole } = data;
          if (newEmail) user.email = newEmail;
          if (newRole) user.role = newRole;
          if (emp) {
            if (firstName !== undefined) emp.firstName = firstName;
            if (lastName !== undefined) emp.lastName = lastName;
            if (newEmail !== undefined) emp.email = newEmail;
            if (newRole !== undefined) emp.role = newRole;
          }
          saveDb(db);
          
          // Sync current localStorage user
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: emp?.firstName || '',
            lastName: emp?.lastName || ''
          }));

          responseData = {
            message: 'Profile updated successfully',
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              firstName: emp?.firstName || '',
              lastName: emp?.lastName || ''
            }
          };
        }
      }
    }
    // 2. Assets Routing
    else if (route === 'assets') {
      if (!subRoute) {
        if (method === 'GET') {
          responseData = getAssets(db);
        } else if (method === 'POST') {
          responseData = createAsset(db, data);
          saveDb(db);
          status = 201;
        }
      } else {
        if (method === 'GET') {
          responseData = getAssetById(db, subRoute);
        } else if (method === 'PUT' || method === 'PATCH') {
          responseData = updateAsset(db, subRoute, data);
          saveDb(db);
        } else if (method === 'DELETE') {
          const idx = db.assets.findIndex(a => a.id === subRoute || a.assetId === subRoute);
          if (idx !== -1) {
            db.assets.splice(idx, 1);
            saveDb(db);
          }
          responseData = { success: true };
        }
      }
    }
    // 3. Allocations Routing
    else if (route === 'allocations') {
      if (!subRoute) {
        if (method === 'GET') {
          responseData = getAllocations(db);
        } else if (method === 'POST') {
          responseData = createAllocation(db, data);
          saveDb(db);
          status = 201;
        }
      } else {
        if (method === 'DELETE') {
          deleteAllocation(db, subRoute);
          saveDb(db);
          responseData = { success: true };
        }
      }
    }
    // 4. Employees Routing
    else if (route === 'employees') {
      if (!subRoute) {
        if (method === 'GET') {
          responseData = getEmployees(db);
        } else if (method === 'POST') {
          responseData = createEmployee(db, data);
          saveDb(db);
          status = 201;
        }
      }
    }
    // 5. Damage Routing
    else if (route === 'damage') {
      if (!subRoute) {
        if (method === 'GET') {
          responseData = getDamageReports(db);
        } else if (method === 'POST') {
          // Check if it's multipart/form-data
          let payload = data;
          if (data instanceof FormData) {
            payload = {
              assetId: data.get('assetId'),
              reportedById: data.get('reportedById'),
              severity: data.get('severity'),
              description: data.get('description')
            };
          }
          responseData = createDamageReport(db, payload);
          saveDb(db);
          status = 201;
        }
      }
    }
    // 6. Returns Routing
    else if (route === 'returns') {
      if (!subRoute) {
        if (method === 'GET') {
          responseData = getReturns(db);
        } else if (method === 'POST') {
          responseData = createReturn(db, data);
          saveDb(db);
          status = 201;
        }
      }
    }
    // 7. Departments Routing
    else if (route === 'departments') {
      if (!subRoute) {
        if (method === 'GET') {
          responseData = getDepartments(db);
        } else if (method === 'POST') {
          responseData = createDepartment(db, data);
          saveDb(db);
          status = 201;
        }
      }
    }
    // 8. Requests Routing
    else if (route === 'requests') {
      if (!subRoute) {
        if (method === 'GET') {
          responseData = getRequests(db);
        } else if (method === 'POST') {
          responseData = createRequest(db, data);
          saveDb(db);
          status = 201;
        }
      } else {
        if (subRoute && !thirdRoute) {
          if (method === 'DELETE') {
            deleteRequest(db, subRoute);
            saveDb(db);
            responseData = { success: true };
          }
        }
        else if (thirdRoute === 'status' || subRoute) {
          // PATCH /requests/:id/status or PATCH /requests/:id
          const reqId = subRoute;
          const statusVal = data.status;
          responseData = updateRequestStatus(db, reqId, statusVal);
          saveDb(db);
        }
      }
    }
    // 9. AI Commands Routing
    else if (route === 'ai' && subRoute === 'command') {
      responseData = handleAiCommand(db, data.prompt);
      saveDb(db);
    }
    else if (route === 'ai' && subRoute === 'query') {
      const q = (data.query || '').toLowerCase();
      let sql = 'SELECT * FROM "Asset"';
      let result = [];
      
      if (q.includes('laptop')) {
        sql = 'SELECT * FROM "Asset" WHERE category = \'Laptop\'';
        result = db.assets.filter(a => a.category === 'Laptop');
        if (q.includes('assigned') || q.includes('allocated')) {
          sql += ' AND status = \'Allocated\'';
          result = result.filter(a => a.status === 'Allocated');
        } else if (q.includes('stock') || q.includes('available')) {
          sql += ' AND status = \'In Stock\'';
          result = result.filter(a => a.status === 'In Stock');
        }
      }
      else if (q.includes('monitor')) {
        sql = 'SELECT * FROM "Asset" WHERE category = \'Monitor\'';
        result = db.assets.filter(a => a.category === 'Monitor');
      }
      else if (q.includes('leave')) {
        sql = 'SELECT * FROM "LeaveRequest"';
        result = db.leaves || [];
      }
      else if (q.includes('employee') || q.includes('users')) {
        sql = 'SELECT * FROM "Employee"';
        result = db.employees || [];
      }
      else if (q.includes('ticket') || q.includes('support')) {
        sql = 'SELECT * FROM "SupportTicket"';
        result = db.tickets || [];
      }
      else {
        result = db.assets.slice(0, 10);
      }
      
      responseData = {
        sql,
        result: result.slice(0, 5)
      };
    }
    // 10. Support Tickets (IT Dashboard) Routing
    else if (route === 'tickets') {
      if (method === 'GET') {
        responseData = db.tickets || [];
      } else if (method === 'POST') {
        const newTicket = {
          id: `t-${Date.now()}`,
          issue: data.issue,
          description: data.description,
          priority: data.priority,
          status: 'open',
          createdBy: JSON.parse(localStorage.getItem('user') || '{"firstName": "User"}')
        };
        if (!db.tickets) db.tickets = [];
        db.tickets.unshift(newTicket);
        saveDb(db);
        responseData = newTicket;
        status = 201;
      } else if (method === 'PUT' || method === 'PATCH') {
        const index = db.tickets.findIndex(t => t.id === subRoute);
        if (index !== -1) {
          db.tickets[index].status = data.status || db.tickets[index].status;
          saveDb(db);
          responseData = db.tickets[index];
        }
      }
    }
    // 11. Leaves Routing
    else if (route === 'leaves') {
      if (method === 'GET') {
        responseData = db.leaves || [];
      } else if (method === 'PATCH') {
        const index = db.leaves.findIndex(l => l.id === subRoute);
        if (index !== -1) {
          db.leaves[index].status = data.status;
          saveDb(db);
          responseData = db.leaves[index];
        }
      }
    }
    // 12. Summary Route
    else if (route === 'summary') {
      responseData = {
        employees: db.employees.length,
        assets: db.assets.length,
        allocations: db.allocations.filter(a => a.status === 'Active').length,
        damages: db.damageReports.filter(d => d.status === 'Open').length,
        requests: db.requests.length,
        returns: db.returns.length
      };
    }
  } catch (error) {
    console.error('Mock request failure:', error);
    status = 500;
    responseData = { message: 'Server error', error: error.message };
  }

  return { status, data: responseData };
};

// Global Fetch Interceptor — catches ALL /api/ requests so the app works without a backend
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  let url = typeof input === 'string' ? input : input.url;
  
  if (url.includes('/api/')) {
    const method = (init && init.method) || 'GET';
    let body = null;
    try {
      body = init && init.body ? JSON.parse(init.body) : null;
    } catch { body = null; }
    
    const response = await handleMockRequest(url, method, body);
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
    };
  }
  
  return originalFetch.apply(this, arguments);
};

// Custom Axios-like Interface
const api = {
  defaults: {
    headers: {
      common: {}
    }
  },
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  },
  get: async (url, config) => {
    const res = await handleMockRequest(url, 'GET', null);
    if (res.status >= 400) throw new Error(res.data.message || 'API Error');
    return res;
  },
  post: async (url, data, config) => {
    const res = await handleMockRequest(url, 'POST', data);
    if (res.status >= 400) throw new Error(res.data.message || 'API Error');
    return res;
  },
  put: async (url, data, config) => {
    const res = await handleMockRequest(url, 'PUT', data);
    if (res.status >= 400) throw new Error(res.data.message || 'API Error');
    return res;
  },
  patch: async (url, data, config) => {
    const res = await handleMockRequest(url, 'PATCH', data);
    if (res.status >= 400) throw new Error(res.data.message || 'API Error');
    return res;
  },
  delete: async (url, config) => {
    const res = await handleMockRequest(url, 'DELETE', null);
    if (res.status >= 400) throw new Error(res.data.message || 'API Error');
    return res;
  }
};

export default api;
