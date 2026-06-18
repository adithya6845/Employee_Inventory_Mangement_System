import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, Plus, ChevronRight, Calendar, FileText, CheckCircle, 
  RefreshCw, AlertTriangle, RotateCcw, ClipboardCheck, Search, Filter, 
  MoreVertical, Eye, Download, X, Clock, ArrowRight
} from 'lucide-react';
import api from '../services/api';

// Vector illustration components for premium design
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
  
  return (
    <svg viewBox="0 0 120 120" style={{ width: 80, height: 80 }}>
      <rect x="40" y="25" width="40" height="70" rx="20" fill="#8b5cf6" />
      <line x1="60" y1="25" x2="60" y2="50" stroke="#1e293b" strokeWidth="3" />
      <line x1="40" y1="50" x2="80" y2="50" stroke="#1e293b" strokeWidth="2" />
      <circle cx="60" cy="38" r="5" fill="#f59e0b" />
    </svg>
  );
};

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
      width: '32px', height: '32px', borderRadius: '50%',
      background: bg, color: '#fff', fontWeight: 700, fontSize: '0.75rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      {initials}
    </div>
  );
};

const DeviceIcon = ({ category }) => {
  const norm = (category || '').toLowerCase();
  if (norm.includes('laptop')) {
    return (
      <div style={{ width: '32px', height: '32px', background: '#e0e7ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
          <line x1="12" y1="17" x2="12" y2="20" />
        </svg>
      </div>
    );
  }
  if (norm.includes('phone') || norm.includes('mobile')) {
    return (
      <div style={{ width: '32px', height: '32px', background: '#d1fae5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      </div>
    );
  }
  if (norm.includes('monitor') || norm.includes('screen')) {
    return (
      <div style={{ width: '32px', height: '32px', background: '#ede9fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="13" rx="2" ry="2" />
          <line x1="12" y1="16" x2="12" y2="21" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      </div>
    );
  }
  return (
    <div style={{ width: '32px', height: '32px', background: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z" />
        <path d="M12 2v6" />
        <path d="M7 7h10" />
      </svg>
    </div>
  );
};

const Returns = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // View State: 'list' | 'return'
  const [view, setView] = useState('list');

  // Form State
  const [selectedAllocationId, setSelectedAllocationId] = useState('');
  const [condition, setCondition] = useState('Good');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Damage sub-form state (shown when condition === 'Damaged')
  const [damageSeverity, setDamageSeverity] = useState('High');
  const [damageDescription, setDamageDescription] = useState('');
  const [damagePhotos, setDamagePhotos] = useState([]);

  const handleDamageFileChange = (e) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setDamagePhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removeDamagePhoto = (idx) => setDamagePhotos(damagePhotos.filter((_, i) => i !== idx));

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [showThisWeekOnly, setShowThisWeekOnly] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const [retRes, allocRes, deptRes] = await Promise.all([
        api.get('/returns'),
        api.get('/allocations'),
        api.get('/departments')
      ]);
      setReturns(retRes.data);
      setAllocations(allocRes.data);
      setDepartments(deptRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (e) => {
    e.preventDefault();
    if (!selectedAllocationId) {
      alert('Please select an active allocation to return.');
      return;
    }
    if (condition === 'Damaged' && !damageDescription.trim()) {
      alert('Please provide a damage description.');
      return;
    }

    const alloc = allocations.find(a => a.id === selectedAllocationId);
    if (!alloc) return;

    setSubmitting(true);
    try {
      // Step 1: Submit the return
      await api.post('/returns', {
        assetId: alloc.assetId,
        employeeId: alloc.employeeId,
        condition,
        notes,
        returnedAt: new Date(returnDate).toISOString()
      });

      // Step 2: If damaged, also file a damage report with optional photo
      if (condition === 'Damaged') {
        const formData = new FormData();
        formData.append('assetId', alloc.assetId);
        formData.append('reportedById', alloc.employeeId);
        formData.append('severity', damageSeverity);
        formData.append('description', damageDescription);
        if (damagePhotos.length > 0 && damagePhotos[0].file) {
          formData.append('photo', damagePhotos[0].file);
        }
        await api.post('/damage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setView('list');
      setSelectedAllocationId('');
      setCondition('Good');
      setNotes('');
      setDamageSeverity('High');
      setDamageDescription('');
      setDamagePhotos([]);
      fetchData();
    } catch (error) {
      console.error('Return error:', error);
      alert('Failed to process return');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAllocDetails = allocations.find(a => a.id === selectedAllocationId);

  // Metric Calculations
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday start
  
  const totalReturnsCount = returns.length;
  
  const returnedTodayCount = returns.filter(r => {
    const d = new Date(r.returnedAt);
    return d >= startOfToday;
  }).length;
  
  const thisWeekCount = returns.filter(r => {
    const d = new Date(r.returnedAt);
    return d >= startOfWeek;
  }).length;
  
  const overdueAllocations = allocations.filter(a => {
    if (a.status !== 'Active' || !a.expectedReturnDate || a.asset?.status !== 'Allocated') return false;
    return new Date(a.expectedReturnDate) < now;
  });
  
  const completedLateReturns = returns.filter(ret => {
    const alloc = allocations.find(a => a.assetId === ret.assetId && a.employeeId === ret.employeeId);
    return alloc && alloc.expectedReturnDate && new Date(ret.returnedAt) > new Date(alloc.expectedReturnDate);
  });
  
  const overdueReturnsCount = overdueAllocations.length + completedLateReturns.length;

  // Data Source Logic
  const mappedOverdueActive = overdueAllocations.map(alloc => ({
    id: alloc.id,
    assetId: alloc.assetId,
    asset: alloc.asset,
    employeeId: alloc.employeeId,
    employee: alloc.employee,
    returnedAt: alloc.expectedReturnDate,
    condition: 'Overdue',
    status: 'Pending'
  }));
  
  const mappedCompletedLate = completedLateReturns.map(ret => ({ ...ret, status: 'Completed' }));
  
  const sourceData = showOverdueOnly 
    ? [...mappedOverdueActive, ...mappedCompletedLate] 
    : returns.map(ret => ({ ...ret, status: 'Completed' }));

  // Filter Logic
  const filteredReturns = sourceData.filter((ret) => {
    const searchLower = searchQuery.toLowerCase();
    const assetName = (ret.asset?.name || '').toLowerCase();
    const serial = (ret.asset?.serialNumber || '').toLowerCase();
    const retId = (ret.id || '').toLowerCase();
    const empName = `${ret.employee?.firstName || ''} ${ret.employee?.lastName || ''}`.toLowerCase();
    
    const matchesSearch = !searchQuery || 
      assetName.includes(searchLower) || 
      serial.includes(searchLower) || 
      retId.includes(searchLower) || 
      empName.includes(searchLower);
      
    const matchesDept = deptFilter === 'All Departments' || ret.employee?.department?.name === deptFilter;
    
    const dDate = new Date(ret.returnedAt);
    const matchesStart = !startDate || dDate >= new Date(startDate);
    const matchesEnd = !endDate || dDate <= new Date(endDate);
    
    const matchesToday = !showTodayOnly || dDate >= startOfToday;
    const matchesThisWeek = !showThisWeekOnly || dDate >= startOfWeek;
    
    const matchesStatus = statusFilter === 'All Status' || statusFilter === ret.status;

    return matchesSearch && matchesDept && matchesStart && matchesEnd && matchesToday && matchesThisWeek && matchesStatus;
  });

  const activeAllocationsList = allocations.filter(a => a.status === 'Active');

  // Pagination Logic
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const currentItems = filteredReturns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (view === 'return') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
          <span style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: 500 }} onClick={() => setView('list')}>Dashboard</span>
          <ChevronRight size={14} />
          <span style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: 500 }} onClick={() => setView('list')}>Returns</span>
          <ChevronRight size={14} />
          <span style={{ color: '#1e293b', fontWeight: 600 }}>New Return</span>
        </div>

        <div>
          <h1 className="page-title" style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Return Asset</h1>
        </div>

        <form onSubmit={handleReturn} style={formContainerStyle}>
          <div style={sectionCardStyle}>
            <h3 style={sectionHeaderStyle}>Allocated Asset</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select 
                required 
                value={selectedAllocationId} 
                onChange={e => setSelectedAllocationId(e.target.value)} 
                style={dropdownStyle}
              >
                <option value="">Search active allocation...</option>
                {activeAllocationsList.map(alloc => (
                  <option key={alloc.id} value={alloc.id}>
                    {alloc.asset?.name} ({alloc.asset?.serialNumber || 'No SN'}) - Assigned to {alloc.employee?.firstName} {alloc.employee?.lastName}
                  </option>
                ))}
              </select>

              {selectedAllocDetails ? (
                <div style={infoBoxStyle}>
                  <AssetIllustration category={selectedAllocDetails.asset?.category} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                      {selectedAllocDetails.asset?.name}
                    </h4>
                    <p style={infoTextStyle}>Serial: <span style={{ color: '#475569', fontWeight: 600 }}>{selectedAllocDetails.asset?.serialNumber || 'N/A'}</span></p>
                    <p style={infoTextStyle}>Allocated to: <span style={{ color: '#475569', fontWeight: 600 }}>{selectedAllocDetails.employee?.firstName} {selectedAllocDetails.employee?.lastName} ({selectedAllocDetails.employee?.employeeId})</span></p>
                    <p style={infoTextStyle}>Allocated on: <span style={{ color: '#475569', fontWeight: 600 }}>{new Date(selectedAllocDetails.allocatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                  </div>
                </div>
              ) : (
                <div style={placeholderBoxStyle}>
                  <div style={roundPlaceholderStyle('#fee2e2')}><RefreshCw size={24} color="#ef4444" /></div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>No allocation selected. Choose an active allocation from the list above.</p>
                </div>
              )}
            </div>
          </div>

          <div style={sectionCardStyle}>
            <h3 style={sectionHeaderStyle}>Return Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>Condition on Return</label>
                  <select 
                    required 
                    value={condition} 
                    onChange={e => setCondition(e.target.value)} 
                    style={dropdownStyle}
                  >
                    <option value="Good">Good</option>
                    <option value="Needs Repair">Needs Repair</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>

                {/* Inline Damage Report — appears when condition is Damaged */}
                {condition === 'Damaged' && (
                  <div style={{ gridColumn: '1 / -1', background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease-out' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #fecaca', paddingBottom: '12px' }}>
                      <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={18} color="#ef4444" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#b91c1c' }}>Damage Report Required</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#ef4444' }}>A damage report will be automatically filed on submission.</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Damage Severity</label>
                        <select value={damageSeverity} onChange={e => setDamageSeverity(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #fca5a5', background: '#fff', color: '#1e293b', fontSize: '0.88rem', fontWeight: 500, outline: 'none' }}>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Damage Description <span style={{ color: '#ef4444' }}>*</span></label>
                        <textarea
                          required={condition === 'Damaged'}
                          rows={3}
                          placeholder="Describe the damage in detail. E.g., Screen cracked near top-left corner..."
                          value={damageDescription}
                          onChange={e => setDamageDescription(e.target.value)}
                          style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #fca5a5', background: '#fff', color: '#1e293b', fontSize: '0.88rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Upload Damage Photos (Optional)</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input type="file" id="damage-photo-inline" accept="image/*" multiple onChange={handleDamageFileChange} style={{ display: 'none' }} />
                        {damagePhotos.map((photo, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #fca5a5' }}>
                            <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button onClick={() => removeDamagePhoto(idx)} type="button" style={{ position: 'absolute', top: '2px', right: '2px', background: '#ef4444', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700, lineHeight: 1 }}>✕</button>
                          </div>
                        ))}
                        <label htmlFor="damage-photo-inline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#fee2e2', border: '1.5px dashed #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#ef4444' }}>
                          📷 Attach Photo
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>Return Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      required 
                      type="date" 
                      value={returnDate} 
                      onChange={e => setReturnDate(e.target.value)} 
                      style={inputStyle} 
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={fieldLabelStyle}>Return Notes (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    placeholder="E.g., All working fine." 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    style={inputStyle} 
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting || !selectedAllocationId} 
            style={submitButtonStyle(!!selectedAllocationId)}
          >
            {submitting ? 'Processing Return...' : 'Mark as Returned'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>Returns</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Manage and track all asset returns.</p>
        </div>
        <button 
          onClick={() => setView('return')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 18px',
            borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
          }}
        >
          <Plus size={18} /> Process Return
        </button>
      </div>

      {/* 2. Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <button 
          type="button"
          onClick={() => { setShowTodayOnly(false); setShowThisWeekOnly(false); setShowOverdueOnly(false); setStatusFilter('All Status'); setCurrentPage(1); }}
          style={metricCardButtonStyle(!showTodayOnly && !showThisWeekOnly && !showOverdueOnly, '#4f46e5')}
        >
          <div style={iconBoxStyle('#e0e7ff')}>
            <RotateCcw size={20} color="#4f46e5" />
          </div>
          <div>
            <p style={metricTitleStyle}>Total Returns</p>
            <p style={metricValueStyle}>{loading ? '...' : totalReturnsCount}</p>
            <p style={metricSubtextStyle}>All time returns</p>
          </div>
        </button>

        <button 
          type="button"
          onClick={() => { setShowTodayOnly(true); setShowThisWeekOnly(false); setShowOverdueOnly(false); setStatusFilter('All Status'); setCurrentPage(1); }}
          style={metricCardButtonStyle(showTodayOnly, '#10b981')}
        >
          <div style={iconBoxStyle('#d1fae5')}>
            <ClipboardCheck size={20} color="#10b981" />
          </div>
          <div>
            <p style={metricTitleStyle}>Returned Today</p>
            <p style={metricValueStyle}>{loading ? '...' : returnedTodayCount}</p>
            <p style={metricSubtextStyle}>Returns completed</p>
          </div>
        </button>

        <button 
          type="button"
          onClick={() => { setShowOverdueOnly(true); setShowThisWeekOnly(false); setShowTodayOnly(false); setStatusFilter('All Status'); setCurrentPage(1); }}
          style={metricCardButtonStyle(showOverdueOnly, '#ef4444')}
        >
          <div style={iconBoxStyle('#fee2e2')}>
            <Clock size={20} color="#ef4444" />
          </div>
          <div>
            <p style={metricTitleStyle}>Overdue Returns</p>
            <p style={metricValueStyle}>{loading ? '...' : overdueReturnsCount}</p>
            <p style={metricSubtextStyle}>Not returned on time</p>
          </div>
        </button>

        <button 
          type="button"
          onClick={() => { setShowThisWeekOnly(true); setShowTodayOnly(false); setShowOverdueOnly(false); setStatusFilter('All Status'); setCurrentPage(1); }}
          style={metricCardButtonStyle(showThisWeekOnly, '#f97316')}
        >
          <div style={iconBoxStyle('#ffedd5')}>
            <Calendar size={20} color="#f97316" />
          </div>
          <div>
            <p style={metricTitleStyle}>This Week</p>
            <p style={metricValueStyle}>{loading ? '...' : thisWeekCount}</p>
            <p style={metricSubtextStyle}>Returns this week</p>
          </div>
        </button>
      </div>

      {/* 3. Filter Bar */}
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9',
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap'
      }}>
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
        
        <select 
          value={statusFilter} 
          onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          style={filterSelectStyle}
        >
          <option value="All Status">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>

        <select 
          value={deptFilter} 
          onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
          style={filterSelectStyle}
        >
          <option value="All Departments">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}>
          <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '0.85rem', color: '#475569', background: 'transparent' }} />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>→</span>
          <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} style={{ border: 'none', outline: 'none', padding: '10px 0', fontSize: '0.85rem', color: '#475569', background: 'transparent' }} />
          {(startDate || endDate) && (
            <X size={14} color="#ef4444" style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => { setStartDate(''); setEndDate(''); setCurrentPage(1); }} />
          )}
        </div>

        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px',
          color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
        }}>
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* 4. Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={thStyle}>Return ID</th>
              <th style={thStyle}>Asset</th>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Returned On</th>
              <th style={thStyle}>Condition</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading returns data...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No returns found matching criteria.</td></tr>
            ) : (
              currentItems.map(ret => {
                const assetName = ret.asset?.name || 'Unknown Asset';
                const assetSN = ret.asset?.serialNumber || 'No SN';
                const empName = `${ret.employee?.firstName || ''} ${ret.employee?.lastName || ''}`.trim() || 'Unknown Employee';
                
                return (
                  <tr key={ret.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                        RET-{ret.id.substring(ret.id.length - 4).toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DeviceIcon category={ret.asset?.category} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{assetName} ({assetSN})</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>{ret.asset?.category || 'Hardware'}</p>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <EmployeeAvatar firstName={ret.employee?.firstName} lastName={ret.employee?.lastName} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{empName}</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>{ret.employee?.department?.name || 'Department'}</p>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>
                        {new Date(ret.returnedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        {new Date(ret.returnedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {ret.condition === 'Good' || ret.condition === 'Excellent' ? (
                        <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>{ret.condition || 'Good'}</span>
                      ) : (
                        <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>{ret.condition}</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {ret.status === 'Completed' ? (
                        (() => {
                          const alloc = allocations.find(a => a.assetId === ret.assetId && a.employeeId === ret.employeeId);
                          const isLate = alloc && alloc.expectedReturnDate && new Date(ret.returnedAt) > new Date(alloc.expectedReturnDate);
                          if (isLate) {
                            return (
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#fff7ed', color: '#ea580c', display: 'inline-block', border: '1px solid #ffedd5' }}>
                                Returned Late
                              </span>
                            );
                          }
                          return (
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#d1fae5', color: '#059669', display: 'inline-block' }}>
                              Completed
                            </span>
                          );
                        })()
                      ) : (
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#fee2e2', color: '#ef4444', display: 'inline-block' }}>
                          Overdue
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {ret.status === 'Completed' ? (
                          <button onClick={() => navigate(`/history/${ret.assetId}`)} style={actionButtonStyle}>
                            View History
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setSelectedAllocationId(ret.id);
                              setView('return');
                            }} 
                            style={{
                              ...actionButtonStyle,
                              background: '#4f46e5',
                              color: '#fff',
                              border: 'none',
                              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.1)'
                            }}
                          >
                            Process Return
                          </button>
                        )}
                        <button style={{ ...actionButtonStyle, padding: '6px' }}>
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {!loading && currentItems.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredReturns.length)} of {filteredReturns.length} returns
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px',
                    border: currentPage === i + 1 ? 'none' : '1px solid #e2e8f0',
                    background: currentPage === i + 1 ? '#4f46e5' : '#fff',
                    color: currentPage === i + 1 ? '#fff' : '#475569',
                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{
                  width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #e2e8f0',
                  background: '#fff', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Styles ---

const metricCardButtonStyle = (isActive, activeColor) => ({
  background: '#fff',
  borderRadius: '12px',
  padding: '20px',
  border: `1px solid ${isActive ? activeColor : '#f1f5f9'}`,
  boxShadow: isActive ? `0 0 0 1px ${activeColor}20` : '0 1px 3px rgba(0,0,0,0.04)',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'left',
  width: '100%',
  outline: 'none',
  transform: 'translateY(0)'
});

const iconBoxStyle = (bg) => ({
  width: '48px', height: '48px', borderRadius: '12px',
  background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
});

const metricTitleStyle = { margin: '0 0 4px 0', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' };
const metricValueStyle = { margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' };
const metricSubtextStyle = { margin: 0, fontSize: '0.75rem', color: '#64748b' };

const filterSelectStyle = {
  padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
  background: '#fff', color: '#475569', fontSize: '0.85rem', fontWeight: 500, outline: 'none'
};

const thStyle = {
  padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em'
};

const tdStyle = {
  padding: '16px 24px', verticalAlign: 'middle'
};

const actionButtonStyle = {
  padding: '6px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px',
  color: '#4f46e5', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

// Form Styles
const formContainerStyle = {
  display: 'flex', flexDirection: 'column', gap: '20px', background: '#fff', borderRadius: '12px', padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9'
};

const sectionCardStyle = {
  display: 'flex', flexDirection: 'column', gap: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px'
};

const sectionHeaderStyle = { fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: 0 };
const dropdownStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.92rem', fontWeight: 500, outline: 'none', cursor: 'pointer' };
const infoBoxStyle = { display: 'flex', alignItems: 'center', gap: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', animation: 'fadeIn 0.2s ease-out' };
const infoTextStyle = { fontSize: '0.85rem', color: '#64748b', margin: 0 };
const placeholderBoxStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '30px', background: '#fafafa', borderRadius: '8px', border: '1px dashed #e2e8f0', textAlign: 'center' };
const roundPlaceholderStyle = (bg) => ({ width: '48px', height: '48px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' });
const fieldLabelStyle = { fontSize: '0.85rem', fontWeight: 600, color: '#475569' };
const inputStyle = { width: '100%', padding: '12px 16px 12px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', fontSize: '0.92rem', fontWeight: 500, outline: 'none', boxSizing: 'border-box' };
const submitButtonStyle = (active) => ({ width: '100%', padding: '14px', background: active ? '#4f46e5' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: active ? 'pointer' : 'not-allowed', transition: 'background 0.2s', marginTop: '10px' });

export default Returns;
