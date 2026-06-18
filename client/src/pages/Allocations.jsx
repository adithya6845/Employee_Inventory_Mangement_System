import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, Plus, ChevronRight, Search, Calendar, FileText, CheckCircle, 
  User, Award, Layers, Scale, Filter, MoreVertical, Eye, X, ArrowRight, ShieldAlert
} from 'lucide-react';
import api from '../services/api';

// High-fidelity mini vector illustrations for device types in table
const DeviceIcon = ({ category }) => {
  const norm = (category || '').toLowerCase();
  if (norm.includes('laptop')) {
    return (
      <div style={{ width: '36px', height: '36px', background: '#e0e7ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
          <line x1="12" y1="17" x2="12" y2="20" />
        </svg>
      </div>
    );
  }
  if (norm.includes('phone') || norm.includes('mobile')) {
    return (
      <div style={{ width: '36px', height: '36px', background: '#d1fae5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      </div>
    );
  }
  if (norm.includes('monitor') || norm.includes('screen')) {
    return (
      <div style={{ width: '36px', height: '36px', background: '#ede9fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="13" rx="2" ry="2" />
          <line x1="12" y1="16" x2="12" y2="21" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      </div>
    );
  }
  // Default (Mouse / Keyboard / Accessories)
  return (
    <div style={{ width: '36px', height: '36px', background: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z" />
        <path d="M12 2v6" />
        <path d="M7 7h10" />
      </svg>
    </div>
  );
};

// Premium visual illustrations inside select preview boxes
const AssetIllustration = ({ category }) => {
  const normalized = (category || '').toLowerCase();
  
  if (normalized.includes('laptop')) {
    return (
      <svg viewBox="0 0 120 120" style={{ width: 80, height: 80 }}>
        <rect x="20" y="25" width="80" height="52" rx="4" fill="#1e293b" />
        <rect x="24" y="29" width="72" height="44" fill="#38bdf8" />
        <rect x="28" y="33" width="64" height="36" fill="#0284c7" opacity="0.3" />
        <path d="M10,80 L110,80 L102,94 L18,94 Z" fill="#64748b" />
        <rect x="48" y="82" width="24" height="8" rx="1" fill="#475569" />
        <rect x="16" y="80" width="88" height="2" fill="#475569" />
      </svg>
    );
  }
  
  if (normalized.includes('monitor') || normalized.includes('screen')) {
    return (
      <svg viewBox="0 0 120 120" style={{ width: 80, height: 80 }}>
        <rect x="15" y="20" width="90" height="56" rx="4" fill="#1e293b" />
        <rect x="19" y="24" width="82" height="48" fill="#3b82f6" />
        <rect x="54" y="76" width="12" height="24" fill="#64748b" />
        <ellipse cx="60" cy="100" rx="26" ry="6" fill="#475569" />
      </svg>
    );
  }
  
  if (normalized.includes('phone') || normalized.includes('mobile')) {
    return (
      <svg viewBox="0 0 120 120" style={{ width: 80, height: 80 }}>
        <rect x="38" y="15" width="44" height="90" rx="10" fill="#1e293b" />
        <rect x="42" y="21" width="36" height="78" rx="6" fill="#10b981" />
        <rect x="52" y="17" width="16" height="2" rx="1" fill="#475569" />
        <circle cx="60" cy="101" r="3.5" fill="#fff" />
      </svg>
    );
  }
  
  // Default/Accessory
  return (
    <svg viewBox="0 0 120 120" style={{ width: 80, height: 80 }}>
      <rect x="40" y="25" width="40" height="70" rx="20" fill="#8b5cf6" />
      <line x1="60" y1="25" x2="60" y2="50" stroke="#1e293b" strokeWidth="3" />
      <line x1="40" y1="50" x2="80" y2="50" stroke="#1e293b" strokeWidth="2" />
      <circle cx="60" cy="38" r="5" fill="#f59e0b" />
    </svg>
  );
};

const AvatarIllustration = ({ seed = 'A', size = 60 }) => {
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
        border: `2px solid ${isFemale ? '#f472b6' : '#60a5fa'}`,
        padding: '3px',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }} 
    />
  );
};

// Sleek circular initials avatar
const EmployeeAvatar = ({ firstName, lastName }) => {
  const initials = `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase() || 'EMP';
  const charCode = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  ];
  const bg = gradients[charCode % gradients.length];
  
  return (
    <div style={{
      width: '38px', height: '38px', borderRadius: '50%',
      background: bg, color: '#fff', fontWeight: 700, fontSize: '0.82rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      {initials}
    </div>
  );
};

const Allocations = () => {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [showDueThisWeekOnly, setShowDueThisWeekOnly] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // New Allocation Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Return asset modal state
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnAllocId, setReturnAllocId] = useState('');
  const [returnAssetId, setReturnAssetId] = useState('');
  const [returnEmployeeId, setReturnEmployeeId] = useState('');
  const [returnCondition, setReturnCondition] = useState('Excellent');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);

  // Context Dropdown Active Row
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // Detail viewer drawer state
  const [selectedAllocDetails, setSelectedAllocDetails] = useState(null);

  const fetchData = async () => {
    try {
      const [allocRes, empRes, assetRes, deptRes] = await Promise.all([
        api.get('/allocations'),
        api.get('/employees'),
        api.get('/assets'),
        api.get('/departments')
      ]);
      setAllocations(allocRes.data || []);
      setEmployees(empRes.data || []);
      setAssets(assetRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard allocations data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Close context action dropdown when clicking anywhere
    const closeDropdown = () => setActiveActionMenuId(null);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedAssetId || !selectedEmployeeId || !expectedReturnDate) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/allocations', {
        assetId: selectedAssetId,
        employeeId: selectedEmployeeId,
        expectedReturnDate,
        notes
      });
      
      setIsModalOpen(false);
      setSelectedAssetId('');
      setSelectedEmployeeId('');
      setExpectedReturnDate('');
      setNotes('');
      fetchData(); // Refresh records
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to allocate asset');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReturnModal = (alloc) => {
    setReturnAllocId(alloc.id);
    setReturnAssetId(alloc.assetId);
    setReturnEmployeeId(alloc.employeeId);
    setReturnCondition('Excellent');
    setReturnNotes('');
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = async (e) => {
    e.preventDefault();
    setReturnSubmitting(true);
    try {
      await api.post('/returns', {
        assetId: returnAssetId,
        employeeId: returnEmployeeId,
        condition: returnCondition,
        notes: returnNotes
      });
      
      setIsReturnModalOpen(false);
      fetchData(); // Refresh
      alert('Asset returned successfully! Stock inventory and status have been updated in PostgreSQL.');
    } catch (err) {
      console.error('Return error:', err);
      alert(err.response?.data?.message || 'Failed to return asset');
    } finally {
      setReturnSubmitting(false);
    }
  };

  const handleDeleteAllocation = async (id, displayId) => {
    if (!window.confirm(`Are you absolutely sure you want to delete allocation record ${displayId}?`)) {
      return;
    }
    try {
      await api.delete(`/allocations/${id}`);
      fetchData(); // Refresh
      alert('Allocation record successfully removed from PostgreSQL database!');
    } catch (error) {
      alert('Failed to delete allocation record');
    }
  };

  // Metric Computations
  const activeAllocationsCount = allocations.filter(a => a.status === 'Active' && a.asset?.status === 'Allocated').length;
  const totalAllocationsCount = allocations.length;
  const availableAssetsCount = assets.filter(a => a.status === 'In Stock').length;
  
  // Calculate Returns Due this week
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeekCount = allocations.filter(a => {
    if (!a.expectedReturnDate || a.status !== 'Active' || a.asset?.status !== 'Allocated') return false;
    const rDate = new Date(a.expectedReturnDate);
    return rDate >= now && rDate <= sevenDaysFromNow;
  }).length;

  // Filter Logic
  const filteredAllocations = allocations.filter((alloc, idx) => {
    const searchLower = searchQuery.toLowerCase();
    const assetName = (alloc.asset?.name || '').toLowerCase();
    const serial = (alloc.asset?.serialNumber || '').toLowerCase();
    const assetCode = (alloc.asset?.assetId || '').toLowerCase();
    const empName = `${alloc.employee?.firstName || ''} ${alloc.employee?.lastName || ''}`.toLowerCase();
    const empEmail = (alloc.employee?.email || '').toLowerCase();
    const displayId = `ALLOC-${String(1001 + idx).padStart(4, '0')}`.toLowerCase();

    const matchesSearch = 
      assetName.includes(searchLower) ||
      serial.includes(searchLower) ||
      assetCode.includes(searchLower) ||
      empName.includes(searchLower) ||
      empEmail.includes(searchLower) ||
      displayId.includes(searchLower);

    let matchesStatus = true;
    if (statusFilter !== 'All Status') {
      matchesStatus = alloc.status === statusFilter;
    }

    let matchesDept = true;
    if (deptFilter !== 'All Departments') {
      matchesDept = alloc.employee?.departmentId === deptFilter;
    }

    let matchesDates = true;
    if (startDateFilter) {
      matchesDates = matchesDates && new Date(alloc.allocatedAt) >= new Date(startDateFilter);
    }
    if (endDateFilter) {
      matchesDates = matchesDates && new Date(alloc.allocatedAt) <= new Date(endDateFilter);
    }

    let matchesDueThisWeek = true;
    if (showDueThisWeekOnly) {
      if (!alloc.expectedReturnDate || alloc.status !== 'Active') {
        matchesDueThisWeek = false;
      } else {
        const rDate = new Date(alloc.expectedReturnDate);
        matchesDueThisWeek = rDate >= now && rDate <= sevenDaysFromNow;
      }
    }

    return matchesSearch && matchesStatus && matchesDept && matchesDates && matchesDueThisWeek;
  });

  // Pagination Computations
  const totalItems = filteredAllocations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAllocations.slice(indexOfFirstItem, indexOfLastItem);

  const availableAssetsList = assets.filter(a => a.status === 'In Stock');
  const chosenAsset = assets.find(a => a.id === selectedAssetId);
  const chosenEmployee = employees.find(e => e.id === selectedEmployeeId);

  const getDaysLeftText = (alloc) => {
    if (alloc.status !== 'Active') return { text: 'Returned', style: { color: '#64748b' } };
    if (!alloc.expectedReturnDate) return { text: 'No return date', style: { color: '#64748b' } };
    
    const diffTime = new Date(alloc.expectedReturnDate) - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        text: `Overdue by ${Math.abs(diffDays)} days`, 
        style: { color: '#ef4444', fontWeight: 600 } 
      };
    } else if (diffDays === 0) {
      return { 
        text: 'Due today', 
        style: { color: '#f59e0b', fontWeight: 600 } 
      };
    } else {
      return { 
        text: `${diffDays} days left`, 
        style: { color: '#10b981', fontWeight: 500 } 
      };
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setDeptFilter('All Departments');
    setStartDateFilter('');
    setEndDateFilter('');
    setShowDueThisWeekOnly(false);
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Allocations</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>View and manage all asset allocations.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#4338ca'}
          onMouseOut={e => e.currentTarget.style.background = '#4f46e5'}
        >
          <Plus size={16} /> Allocate Asset
        </button>
      </div>

      {/* 2. Stat Cards Row matching mockup - Now using real HTML button elements for absolute click guarantee */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        
        {/* Total Allocations Card */}
        <button 
          type="button"
          onClick={() => { setStatusFilter('All Status'); setShowDueThisWeekOnly(false); setCurrentPage(1); }}
          style={metricCardButtonStyle((statusFilter === 'All Status' && !showDueThisWeekOnly), '#4f46e5')}
          onMouseOver={e => { if (statusFilter !== 'All Status' || showDueThisWeekOnly) e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseOut={e => { if (statusFilter !== 'All Status' || showDueThisWeekOnly) e.currentTarget.style.borderColor = '#f1f5f9'; }}
        >
          <div style={iconBoxStyle('#e0e7ff')}>
            <Scale size={20} color="#4f46e5" />
          </div>
          <div>
            <p style={metricTitleStyle}>Total Allocations</p>
            <p style={metricValueStyle}>{loading ? '...' : totalAllocationsCount}</p>
            <p style={metricSubtextStyle}>All-time assignments</p>
          </div>
        </button>

        {/* Currently Allocated Card */}
        <button 
          type="button"
          onClick={() => { setStatusFilter('Active'); setShowDueThisWeekOnly(false); setCurrentPage(1); }}
          style={metricCardButtonStyle((statusFilter === 'Active' && !showDueThisWeekOnly), '#10b981')}
          onMouseOver={e => { if (statusFilter !== 'Active' || showDueThisWeekOnly) e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseOut={e => { if (statusFilter !== 'Active' || showDueThisWeekOnly) e.currentTarget.style.borderColor = '#f1f5f9'; }}
        >
          <div style={iconBoxStyle('#d1fae5')}>
            <CheckCircle size={20} color="#10b981" />
          </div>
          <div>
            <p style={metricTitleStyle}>Currently Allocated</p>
            <p style={metricValueStyle}>{loading ? '...' : activeAllocationsCount}</p>
            <p style={metricSubtextStyle}>Assets allocated</p>
          </div>
        </button>

        {/* Available Assets Card */}
        <button 
          type="button"
          onClick={() => navigate('/inventory?status=In Stock')}
          style={metricCardButtonStyle(false, '#059669')}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={iconBoxStyle('#e2fbf0')}>
            <Database size={20} color="#059669" />
          </div>
          <div>
            <p style={metricTitleStyle}>Available Assets</p>
            <p style={metricValueStyle}>{loading ? '...' : availableAssetsCount}</p>
            <p style={metricSubtextStyle}>Ready to allocate</p>
          </div>
        </button>

        {/* Due This Week Card */}
        <button 
          type="button"
          onClick={() => { setShowDueThisWeekOnly(true); setCurrentPage(1); }}
          style={metricCardButtonStyle(showDueThisWeekOnly, '#f97316')}
          onMouseOver={e => { if (!showDueThisWeekOnly) e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseOut={e => { if (!showDueThisWeekOnly) e.currentTarget.style.borderColor = '#f1f5f9'; }}
        >
          <div style={iconBoxStyle('#fff7ed')}>
            <Calendar size={20} color="#f97316" />
          </div>
          <div>
            <p style={metricTitleStyle}>Due This Week</p>
            <p style={metricValueStyle}>{loading ? '...' : dueThisWeekCount}</p>
            <p style={metricSubtextStyle}>Returns due this week</p>
          </div>
        </button>

      </div>

      {/* 3. Filter Bar matching mockup */}
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9',
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap'
      }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by asset, employee or serial number..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%', padding: '10px 16px 10px 38px', borderRadius: '8px', border: '1px solid #e2e8f0',
              fontSize: '0.85rem', fontWeight: 500, outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setShowDueThisWeekOnly(false); setCurrentPage(1); }}
          style={filterDropdownStyle}
        >
          <option value="All Status">All Status</option>
          <option value="Active">Active</option>
          <option value="Returned">Returned</option>
        </select>

        {/* Department Dropdown */}
        <select
          value={deptFilter}
          onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
          style={filterDropdownStyle}
        >
          <option value="All Departments">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        {/* Date Inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="date" 
            value={startDateFilter}
            onChange={e => { setStartDateFilter(e.target.value); setCurrentPage(1); }}
            style={dateInputStyle} 
          />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>→</span>
          <input 
            type="date" 
            value={endDateFilter}
            onChange={e => { setEndDateFilter(e.target.value); setCurrentPage(1); }}
            style={dateInputStyle} 
          />
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={handleResetFilters}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px',
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
            color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
          onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
        >
          <Filter size={14} /> Filters
        </button>
      </div>

      {/* 4. Allocations Table Area */}
      <div style={{
        background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9',
        overflow: 'visible', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              <th style={thStyle}>Allocation ID</th>
              <th style={thStyle}>Asset</th>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Allocated On</th>
              <th style={thStyle}>Expected Return</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ display: 'inline-block', width: 24, height: 24, border: '2.5px solid #cbd5e1', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Loading allocations records...</p>
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                  No allocations match your search criteria. Click <strong>Allocate Asset</strong> to make a new record.
                </td>
              </tr>
            ) : (
              currentItems.map((alloc, idx) => {
                const globalIndex = indexOfFirstItem + idx;
                const displayId = `ALLOC-${String(1001 + globalIndex).padStart(4, '0')}`;
                const daysLeft = getDaysLeftText(alloc);

                return (
                  <tr key={alloc.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                    
                    {/* Allocation ID */}
                    <td style={{ ...tdStyle, color: '#334155', fontWeight: 600 }}>{displayId}</td>
                    
                    {/* Asset info */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DeviceIcon category={alloc.asset?.category} />
                        <div>
                          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                            {alloc.asset?.name} <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 500 }}>({alloc.asset?.serialNumber || 'No SN'})</span>
                          </p>
                          <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '2px 0 0' }}>{alloc.asset?.category}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Employee Info */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <EmployeeAvatar firstName={alloc.employee?.firstName} lastName={alloc.employee?.lastName} />
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                            {alloc.employee?.firstName} {alloc.employee?.lastName}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>{alloc.employee?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ ...tdStyle, color: '#475569', fontWeight: 600 }}>
                      {alloc.employee?.department?.name || 'Operations'}
                    </td>

                    {/* Allocated On */}
                    <td style={{ ...tdStyle, color: '#475569' }}>
                      {new Date(alloc.allocatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Expected Return with days left subtext */}
                    <td style={tdStyle}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', margin: 0 }}>
                        {alloc.expectedReturnDate ? new Date(alloc.expectedReturnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </p>
                      {alloc.expectedReturnDate && (
                        <p style={{ fontSize: '0.75rem', margin: '2px 0 0', ...daysLeft.style }}>
                          {daysLeft.text}
                        </p>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                        background: alloc.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        color: alloc.status === 'Active' ? '#10b981' : '#64748b'
                      }}>
                        {alloc.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ ...tdStyle, textAlign: 'center', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedAllocDetails({ ...alloc, displayId })}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px',
                            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px',
                            color: '#4f46e5', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                          onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                          <Eye size={12} /> View
                        </button>
                        
                        <button 
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenuId(activeActionMenuId === alloc.id ? null : alloc.id);
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Dropdown Action Menu */}
                      {activeActionMenuId === alloc.id && (
                        <div 
                          onClick={e => e.stopPropagation()}
                          style={{
                            position: 'absolute', right: '20px', top: '44px', background: '#fff',
                            border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 9999, width: '160px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', 
                            display: 'flex', flexDirection: 'column', padding: '6px', textAlign: 'left'
                          }}
                        >
                          <button
                            onClick={() => {
                              setSelectedAllocDetails({ ...alloc, displayId });
                              setActiveActionMenuId(null);
                            }}
                            style={actionDropdownBtnStyle}
                          >
                            <Eye size={12} style={{ marginRight: '6px' }} /> View Details
                          </button>
                          
                          {alloc.status === 'Active' && (
                            <button
                              onClick={() => {
                                handleOpenReturnModal(alloc);
                                setActiveActionMenuId(null);
                              }}
                              style={{ ...actionDropdownBtnStyle, color: '#10b981' }}
                            >
                              <CheckCircle size={12} style={{ marginRight: '6px' }} /> Return to Stock
                            </button>
                          )}

                          <button
                            onClick={() => {
                              handleDeleteAllocation(alloc.id, displayId);
                              setActiveActionMenuId(null);
                            }}
                            style={{ ...actionDropdownBtnStyle, color: '#ef4444' }}
                          >
                            <X size={12} style={{ marginRight: '6px' }} /> Delete Record
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Controls matching mockup */}
        {!loading && totalItems > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#fff'
          }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Showing <strong style={{ color: '#1e293b' }}>{indexOfFirstItem + 1}</strong> to <strong style={{ color: '#1e293b' }}>{Math.min(indexOfLastItem, totalItems)}</strong> of <strong style={{ color: '#1e293b' }}>{totalItems}</strong> allocations
            </p>

            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              
              {/* Previous page */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={pageBtnStyle(currentPage === 1)}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }).map((_, pageIdx) => {
                const pageNum = pageIdx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={pageNumStyle(pageNum === currentPage)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next page */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={pageBtnStyle(currentPage === totalPages)}
              >
                &gt;
              </button>

            </div>
          </div>
        )}
      </div>

      {/* 5. Allocate Asset Modal Popup (Glassmorphism Overlay) */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          
          <div style={{
            background: '#fff', borderRadius: '16px', width: '900px', maxWidth: '95%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column'
          }}>
            
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>Allocate Corporate Asset</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Assign available hardware or mobile devices to employees.</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setSelectedAssetId(''); setSelectedEmployeeId(''); }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAllocate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Asset & Employee Selector row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                
                {/* Select Asset */}
                <div style={modalSelectCardStyle}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px', display: 'block' }}>1. Select Asset (In Stock)</label>
                  <select
                    required
                    value={selectedAssetId}
                    onChange={e => setSelectedAssetId(e.target.value)}
                    style={modalDropdownStyle}
                  >
                    <option value="">Choose asset by model or serial...</option>
                    {availableAssetsList.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} - {asset.assetId} ({asset.serialNumber || 'No SN'})
                      </option>
                    ))}
                  </select>

                  {chosenAsset ? (
                    <div style={selectorPreviewStyle}>
                      <AssetIllustration category={chosenAsset.category} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>{chosenAsset.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Serial: <strong style={{ color: '#334155' }}>{chosenAsset.serialNumber || 'N/A'}</strong></p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Category: <strong style={{ color: '#334155' }}>{chosenAsset.category}</strong></p>
                        <span style={{ 
                          alignSelf: 'flex-start', background: '#d1fae5', color: '#065f46',
                          padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, marginTop: '2px'
                        }}>
                          {chosenAsset.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={selectorPlaceholderStyle}>
                      <div style={roundPlaceStyle('#e0e7ff')}><Database size={20} color="#4f46e5" /></div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>No asset chosen yet.</p>
                    </div>
                  )}
                </div>

                {/* Select Employee */}
                <div style={modalSelectCardStyle}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px', display: 'block' }}>2. Select Employee</label>
                  <select
                    required
                    value={selectedEmployeeId}
                    onChange={e => setSelectedEmployeeId(e.target.value)}
                    style={modalDropdownStyle}
                  >
                    <option value="">Choose employee...</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeId})
                      </option>
                    ))}
                  </select>

                  {chosenEmployee ? (
                    <div style={selectorPreviewStyle}>
                      <AvatarIllustration seed={chosenEmployee.firstName} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>{chosenEmployee.firstName} {chosenEmployee.lastName}</h4>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>ID: <strong style={{ color: '#334155' }}>{chosenEmployee.employeeId}</strong></p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Dept: <strong style={{ color: '#334155' }}>{chosenEmployee.department?.name || 'N/A'}</strong></p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Email: <strong style={{ color: '#334155' }}>{chosenEmployee.email}</strong></p>
                      </div>
                    </div>
                  ) : (
                    <div style={selectorPlaceholderStyle}>
                      <div style={roundPlaceStyle('#fee2e2')}><User size={20} color="#ef4444" /></div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>No employee chosen yet.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Expected Return Date & Notes row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Expected Return Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      required
                      type="date"
                      value={expectedReturnDate}
                      onChange={e => setExpectedReturnDate(e.target.value)}
                      style={modalInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Notes (Optional)</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="E.g., Assigned for Project Alpha development"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      style={modalInputStyle}
                    />
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setSelectedAssetId(''); setSelectedEmployeeId(''); }}
                  style={{
                    padding: '11px 20px', borderRadius: '8px', border: '1px solid #cbd5e1',
                    background: '#fff', color: '#475569', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '11px 24px', borderRadius: '8px', border: 'none',
                    background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: '0.86rem',
                    cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                  }}
                >
                  {submitting ? 'Creating Allocation...' : 'Confirm Allocation'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Return Asset Modal Popup (Glassmorphism Overlay) */}
      {isReturnModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          
          <div style={{
            background: '#fff', borderRadius: '16px', width: '500px', maxWidth: '95%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', border: '1px solid #e2e8f0'
          }}>
            
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>Log Return Event</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>Release asset from assignment and return to stock.</p>
              </div>
              <button 
                onClick={() => setIsReturnModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleConfirmReturn} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Return Condition</label>
                <select
                  value={returnCondition}
                  onChange={e => setReturnCondition(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1',
                    fontSize: '0.88rem', fontWeight: 600, color: '#1e293b', outline: 'none'
                  }}
                >
                  <option value="Excellent">Excellent (Like New)</option>
                  <option value="Good">Good (Working Order)</option>
                  <option value="Needs Repair">Needs Repair (Minor Damage)</option>
                  <option value="Damaged">Damaged (Broken / Lost)</option>
                </select>
              </div>

              {returnCondition === 'Damaged' && (
                <div style={{
                  display: 'flex', gap: '8px', background: '#fee2e2', border: '1px solid #fca5a5',
                  padding: '12px', borderRadius: '8px', alignItems: 'center'
                }}>
                  <ShieldAlert size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#991b1b', lineHeight: 1.4 }}>
                    <strong>Note:</strong> Setting condition to <strong>Damaged</strong> will auto-flag the asset status as <em>Damaged</em> and trigger an intake audit.
                  </p>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Return Comments</label>
                <textarea
                  placeholder="Explain returned hardware condition or missing accessories..."
                  value={returnNotes}
                  onChange={e => setReturnNotes(e.target.value)}
                  rows="3"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1',
                    fontSize: '0.86rem', color: '#1e293b', outline: 'none', resize: 'vertical', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  style={{
                    padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1',
                    background: '#fff', color: '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={returnSubmitting}
                  style={{
                    padding: '10px 22px', borderRadius: '8px', border: 'none',
                    background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '0.82rem',
                    cursor: returnSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  {returnSubmitting ? 'Processing return...' : 'Release & Return Asset'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 7. View Details Overlay Drawer */}
      {selectedAllocDetails && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'flex-end', zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          
          <div style={{
            background: '#fff', width: '460px', height: '100%',
            boxShadow: '-10px 0 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px',
            borderLeft: '1px solid #cbd5e1', boxSizing: 'border-box', overflowY: 'auto'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                Allocation Record
              </h3>
              <button 
                onClick={() => setSelectedAllocDetails(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '0.05em' }}>RECORD ID</span>
              <p style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{selectedAllocDetails.displayId}</p>
            </div>

            {/* Asset Info Card */}
            <div>
              <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Asset Details</h4>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                <DeviceIcon category={selectedAllocDetails.asset?.category} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{selectedAllocDetails.asset?.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>Serial: <strong>{selectedAllocDetails.asset?.serialNumber || 'N/A'}</strong></p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>ID: <strong>{selectedAllocDetails.asset?.assetId}</strong></p>
                </div>
              </div>
            </div>

            {/* Employee Info Card */}
            <div>
              <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Employee Assignment</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }}>
                <EmployeeAvatar firstName={selectedAllocDetails.employee?.firstName} lastName={selectedAllocDetails.employee?.lastName} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{selectedAllocDetails.employee?.firstName} {selectedAllocDetails.employee?.lastName}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>ID: <strong>{selectedAllocDetails.employee?.employeeId}</strong></p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>Email: <strong>{selectedAllocDetails.employee?.email}</strong></p>
                </div>
              </div>
            </div>

            {/* Dates info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>ALLOCATED ON</span>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  {new Date(selectedAllocDetails.allocatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>EXPECTED RETURN</span>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  {selectedAllocDetails.expectedReturnDate ? new Date(selectedAllocDetails.expectedReturnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Indefinite Hold'}
                </p>
              </div>
            </div>

            {/* Return event detail if exist */}
            {selectedAllocDetails.actualReturnDate && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>RETURNED ON</span>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  {new Date(selectedAllocDetails.actualReturnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )}

            {/* Notes */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>NOTES / DEPLOYMENT DETAILS</span>
              <p style={{
                margin: '6px 0 0', fontSize: '0.85rem', color: '#475569',
                background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: '6px', padding: '12px',
                lineHeight: 1.5
              }}>
                {selectedAllocDetails.notes || 'No deployment notes provided for this allocation event.'}
              </p>
            </div>

            <button
              onClick={() => setSelectedAllocDetails(null)}
              style={{
                marginTop: 'auto', padding: '12px', background: '#334155', color: '#fff',
                border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.86rem',
                cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#1e293b'}
              onMouseOut={e => e.currentTarget.style.background = '#334155'}
            >
              Acknowledge & Close
            </button>

          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

    </div>
  );
};

// Beautiful style helpers
const metricCardStyle = {
  background: '#fff', borderRadius: '12px', padding: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
  display: 'flex', alignItems: 'center', gap: '16px'
};

const metricCardButtonStyle = (active, activeColor) => ({
  background: '#fff', 
  borderRadius: '12px', 
  padding: '20px',
  boxShadow: active ? `0 4px 6px -1px ${activeColor}22` : '0 1px 3px rgba(0,0,0,0.06)', 
  border: active ? `1.5px solid ${activeColor}` : '1px solid #f1f5f9',
  display: 'flex', 
  alignItems: 'center', 
  gap: '16px',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'Inter, sans-serif',
  width: '100%',
  outline: 'none',
  transition: 'all 0.2s',
  transform: active ? 'translateY(-2px)' : 'translateY(0)',
});

const iconBoxStyle = (bg) => ({
  width: '46px', height: '46px', borderRadius: '10px',
  background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0
});

const metricTitleStyle = {
  fontSize: '0.78rem', color: '#64748b', fontWeight: 600, margin: 0
};

const metricValueStyle = {
  fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: '4px 0'
};

const metricSubtextStyle = {
  fontSize: '0.74rem', color: '#94a3b8', fontWeight: 500, margin: 0
};

const filterDropdownStyle = {
  padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0',
  color: '#475569', fontSize: '0.85rem', fontWeight: 600, outline: 'none',
  background: '#fff', cursor: 'pointer'
};

const dateInputStyle = {
  padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
  color: '#475569', fontSize: '0.82rem', fontWeight: 500, outline: 'none'
};

const thStyle = {
  padding: '14px 20px', color: '#64748b', fontWeight: 700, fontSize: '0.8rem',
  textTransform: 'uppercase', letterSpacing: '0.04em'
};

const tdStyle = {
  padding: '14px 20px', verticalAlign: 'middle', borderBottom: '1px solid #f1f5f9'
};

const pageBtnStyle = (disabled) => ({
  width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #e2e8f0',
  background: disabled ? '#f8fafc' : '#fff', color: disabled ? '#cbd5e1' : '#475569',
  fontSize: '0.85rem', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
});

const pageNumStyle = (active) => ({
  width: '32px', height: '32px', borderRadius: '6px',
  border: active ? 'none' : '1px solid #e2e8f0',
  background: active ? '#4f46e5' : '#fff',
  color: active ? '#fff' : '#475569',
  fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
});

const modalSelectCardStyle = {
  background: '#f8fafc', borderRadius: '10px', padding: '16px',
  border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px',
  minHeight: '190px'
};

const modalDropdownStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1',
  background: '#fff', color: '#1e293b', fontSize: '0.85rem', fontWeight: 600, outline: 'none'
};

const selectorPreviewStyle = {
  display: 'flex', gap: '16px', alignItems: 'center', background: '#fff',
  borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0',
  animation: 'fadeIn 0.2s ease-out'
};

const selectorPlaceholderStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: '8px', flex: 1, padding: '10px'
};

const roundPlaceStyle = (bg) => ({
  width: '36px', height: '36px', borderRadius: '50%', background: bg,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
});

const modalInputStyle = {
  width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1',
  background: '#fff', color: '#1e293b', fontSize: '0.86rem', fontWeight: 600, outline: 'none',
  boxSizing: 'border-box'
};

const actionDropdownBtnStyle = {
  background: 'transparent', border: 'none', padding: '10px 12px',
  fontSize: '0.82rem', fontWeight: 600, color: '#475569', cursor: 'pointer',
  display: 'flex', alignItems: 'center', borderRadius: '6px', width: '100%',
  transition: 'background 0.1s'
};

export default Allocations;
