import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Mail, Users, Building, HelpCircle } from 'lucide-react';
import api from '../../services/api';

// Premium SVG cartoon avatar generator based on employee name
const AvatarIllustration = ({ seed = 'A', size = 38 }) => {
  const name = (seed || '').toLowerCase();
  const femaleNames = [
    'neha', 'diya', 'priya', 'ananya', 'riya', 'kriti', 'aditi', 'shreya', 
    'kavya', 'sneha', 'tanvi', 'meera', 'ishita', 'aanya', 'anjali', 'pooja', 
    'aisha', 'divya', 'preeti', 'deepa', 'swati', 'rachel', 'sarah', 'emily', 
    'jessica', 'ashley', 'amanda', 'jennifer'
  ];
  
  const isFemale = femaleNames.some(f => name.startsWith(f) || name.includes(f));
  const src = isFemale ? '/female employee.png' : '/male employee.png';

  return (
    <img 
      src={src} 
      alt="Profile" 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        objectFit: 'cover', 
        border: `1.5px solid ${isFemale ? '#f472b6' : '#60a5fa'}`,
        padding: '2px',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }} 
    />
  );
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [allocations, setAllocations] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    api.get('/allocations')
      .then(r => setAllocations(r.data || []))
      .catch(console.error);
  }, []);

  // Dynamically extract unique departments for filter dropdown
  const departmentsList = [...new Set(employees.map(emp => emp.department?.name).filter(Boolean))];

  // Filtering Logic
  const filtered = employees.filter(emp => {
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(search.toLowerCase()) ||
                          (emp.email || '').toLowerCase().includes(search.toLowerCase()) ||
                          (emp.employeeId || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept ? emp.department?.name === selectedDept : true;
    const matchesStatus = selectedStatus ? emp.status?.toLowerCase() === selectedStatus.toLowerCase() : true;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Joined Date'];
    const rows = filtered.map(emp => [
      emp.employeeId,
      `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
      emp.email,
      emp.department?.name || 'N/A',
      emp.role || 'Employee',
      emp.status,
      emp.createdAt ? new Date(emp.createdAt).toLocaleDateString('en-GB') : 'N/A'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "employees_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header section with page title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Employees</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Manage company employees and view join dates.</p>
        </div>
      </div>

      {/* Toolbar - Styled exactly like the screenshot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
          {/* Search box with magnifying glass */}
          <div style={{ position: 'relative', flex: 2 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={toolbarInputStyle}
            />
          </div>

          {/* Departments Dropdown */}
          <select 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)} 
            style={{ ...toolbarInputStyle, flex: 1, padding: '10px 12px 10px 12px', cursor: 'pointer' }}
          >
            <option value="">All Departments</option>
            {departmentsList.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>

          {/* Status Dropdown */}
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)} 
            style={{ ...toolbarInputStyle, flex: 1, padding: '10px 12px 10px 12px', cursor: 'pointer' }}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Export CSV button matching prototype */}
        <button 
          onClick={exportToCSV}
          style={exportBtnStyle}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Table - Styled exactly like the screenshot */}
      <div className="card" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Joined Date</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Loading employees list...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No employees found.</td></tr>
            ) : (
              filtered.map(emp => {
                const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Admin';
                const statusLower = (emp.status || 'Active').toLowerCase();
                const isActive = statusLower === 'active';
                
                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#fff' }}>
                    {/* ID */}
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#475569' }}>{emp.employeeId || 'N/A'}</td>
                    
                    {/* Employee Profile & Name */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AvatarIllustration seed={emp.firstName || 'A'} size={32} />
                        <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{fullName}</span>
                      </div>
                    </td>
                    
                    {/* Email */}
                    <td style={{ ...tdStyle, color: '#475569', fontSize: '0.86rem' }}>{emp.email}</td>
                    
                    {/* Department */}
                    <td style={{ ...tdStyle, color: '#1e293b', fontWeight: 500 }}>{emp.department?.name || 'N/A'}</td>
                    
                    {/* Role */}
                    <td style={{ ...tdStyle, color: '#475569', textTransform: 'capitalize' }}>{emp.role || 'Employee'}</td>
                    
                    {/* Joined Date - Written dynamically into the dataset table */}
                    <td style={{ ...tdStyle, color: '#475569', fontSize: '0.86rem' }}>
                      {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>

                    {/* Status Badge */}
                    <td style={tdStyle}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700,
                        background: isActive ? '#ecfdf5' : '#fef2f2',
                        color: isActive ? '#10b981' : '#ef4444'
                      }}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions - Icon buttons exactly matching layout */}
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={actionBtnStyle} onClick={() => setSelectedEmp(emp)} title="View Details">
                          <Eye size={14} color="#6366f1" />
                        </button>
                        <a href={`mailto:${emp.email}`} style={actionBtnStyle} title="Send Email">
                          <Mail size={14} color="#6366f1" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Employee Details Modal Overlay */}
      {selectedEmp && (() => {
        const empAllocations = allocations.filter(a => a.employeeId === selectedEmp.id && a.status === 'Active');
        const fullName = `${selectedEmp.firstName || ''} ${selectedEmp.lastName || ''}`.trim() || 'Admin';
        const isActive = (selectedEmp.status || 'Active').toLowerCase() === 'active';
        
        return (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{
              background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '500px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden', border: '1px solid #f1f5f9', animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Employee Profile</h3>
                <button 
                  onClick={() => setSelectedEmp(null)}
                  style={{ background: 'transparent', border: 'none', fontSize: '1.3rem', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
                >
                  &times;
                </button>
              </div>

              {/* Profile Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <AvatarIllustration seed={selectedEmp.firstName || 'A'} size={60} />
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{fullName}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>{selectedEmp.employeeId || 'N/A'}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email</span>
                    <a href={`mailto:${selectedEmp.email}`} style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>{selectedEmp.email}</a>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status</span>
                    <br />
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
                      background: isActive ? '#ecfdf5' : '#fef2f2',
                      color: isActive ? '#10b981' : '#ef4444'
                    }}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Department</span>
                    <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{selectedEmp.department?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Role</span>
                    <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500, textTransform: 'capitalize' }}>{selectedEmp.role || 'Employee'}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Joined Date</span>
                    <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                      {selectedEmp.createdAt ? new Date(selectedEmp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                </div>

                {/* Assigned Assets */}
                <div>
                  <h5 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, margin: '0 0 10px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    Assigned Assets ({empAllocations.length})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                    {empAllocations.length === 0 ? (
                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, textAlign: 'center', padding: '10px' }}>No active asset allocations.</p>
                    ) : (
                      empAllocations.map(alloc => (
                        <div key={alloc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                          <div>
                            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.82rem', display: 'block' }}>{alloc.asset?.name}</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{alloc.asset?.assetId}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            Alloc: {new Date(alloc.allocatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  onClick={() => setSelectedEmp(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
                <a 
                  href={`mailto:${selectedEmp.email}`}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Mail size={14} /> Contact
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// Premium style declarations
const toolbarInputStyle = {
  width: '100%', 
  padding: '10px 10px 10px 36px', 
  borderRadius: '8px', 
  border: '1px solid #e2e8f0', 
  background: '#fff', 
  color: '#1e293b', 
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const exportBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 18px',
  background: '#fff',
  border: '1px solid #6366f1',
  borderRadius: '8px',
  color: '#6366f1',
  fontWeight: 600,
  fontSize: '0.88rem',
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
  ':hover': {
    background: '#6366f1',
    color: '#fff'
  }
};

const thStyle = {
  padding: '16px 20px', 
  color: '#475569', 
  fontWeight: 700, 
  fontSize: '0.8rem', 
  textTransform: 'uppercase',
  borderBottom: '1px solid #e2e8f0'
};

const tdStyle = {
  padding: '16px 20px', 
  color: '#1e293b', 
  fontSize: '0.88rem'
};

const actionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background 0.15s'
};

export default Employees;
