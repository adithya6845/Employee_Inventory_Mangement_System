import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Calendar, ChevronRight, Eye, MoreVertical, X, 
  FileText, Camera, Laptop, Monitor, Smartphone, Cpu, CheckCircle2, 
  AlertTriangle, Wrench, Trash2, ArrowRight
} from 'lucide-react';
import api from '../services/api';

// Vector illustration components for premium design (matches other forms)
const AssetIllustration = ({ category }) => {
  const normalized = (category || '').toLowerCase();
  
  if (normalized.includes('laptop')) {
    return (
      <svg viewBox="0 0 120 120" style={{ width: 100, height: 100 }}>
        <rect x="20" y="25" width="80" height="52" rx="4" fill="#1e293b" />
        <rect x="24" y="29" width="72" height="44" fill="#38bdf8" />
        <line x1="30" y1="35" x2="60" y2="60" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <line x1="60" y1="60" x2="75" y2="40" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <line x1="60" y1="60" x2="48" y2="68" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <path d="M10,80 L110,80 L102,94 L18,94 Z" fill="#64748b" />
        <rect x="48" y="82" width="24" height="8" rx="1" fill="#475569" />
        <rect x="16" y="80" width="88" height="2" fill="#475569" />
      </svg>
    );
  }
  
  if (normalized.includes('monitor') || normalized.includes('screen')) {
    return (
      <svg viewBox="0 0 120 120" style={{ width: 100, height: 100 }}>
        <rect x="15" y="20" width="90" height="56" rx="4" fill="#1e293b" />
        <rect x="19" y="24" width="82" height="48" fill="#3b82f6" />
        <line x1="40" y1="30" x2="65" y2="55" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="65" y1="55" x2="80" y2="40" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="54" y="76" width="12" height="24" fill="#64748b" />
        <ellipse cx="60" cy="100" rx="26" ry="6" fill="#475569" />
      </svg>
    );
  }
  
  if (normalized.includes('phone') || normalized.includes('mobile')) {
    return (
      <svg viewBox="0 0 120 120" style={{ width: 100, height: 100 }}>
        <rect x="38" y="15" width="44" height="90" rx="10" fill="#1e293b" />
        <rect x="42" y="21" width="36" height="78" rx="6" fill="#10b981" />
        <line x1="45" y1="35" x2="68" y2="65" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <rect x="52" y="17" width="16" height="2" rx="1" fill="#475569" />
        <circle cx="60" cy="101" r="3.5" fill="#fff" />
      </svg>
    );
  }
  
  return (
    <svg viewBox="0 0 120 120" style={{ width: 100, height: 100 }}>
      <rect x="40" y="25" width="40" height="70" rx="20" fill="#8b5cf6" />
      <line x1="60" y1="25" x2="60" y2="50" stroke="#1e293b" strokeWidth="3" />
      <line x1="40" y1="50" x2="80" y2="50" stroke="#1e293b" strokeWidth="2" />
      <circle cx="60" cy="38" r="5" fill="#f59e0b" />
    </svg>
  );
};

// Device specific icon selector
const DeviceIcon = ({ category }) => {
  const norm = (category || '').toLowerCase();
  if (norm.includes('laptop') || norm.includes('notebook')) return <Laptop size={18} color="#6366f1" />;
  if (norm.includes('monitor') || norm.includes('screen') || norm.includes('display')) return <Monitor size={18} color="#0ea5e9" />;
  if (norm.includes('phone') || norm.includes('mobile') || norm.includes('iphone')) return <Smartphone size={18} color="#10b981" />;
  return <Cpu size={18} color="#8b5cf6" />;
};

// Employee Avatar
const EmployeeAvatar = ({ firstName, lastName }) => {
  const initials = `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase() || 'EMP';
  const colors = ['#818cf8', '#34d399', '#fb7185', '#60a5fa', '#f59e0b', '#a78bfa'];
  const hash = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  const bgColor = colors[hash % colors.length];

  return (
    <div style={{
      width: '32px', height: '32px', borderRadius: '50%', background: bgColor,
      display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '0.8rem', fontWeight: 600, border: '1.5px solid #fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {initials}
    </div>
  );
};

// Beautiful uploaded photo preview card
const MockupPhoto = ({ photo, onClick }) => {
  return (
    <div style={photoThumbStyle} onClick={onClick} title="Click to remove">
      <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
};

const Damages = () => {
  const navigate = useNavigate();

  // Data states
  const [reports, setReports] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // View states: 'list' | 'report'
  const [view, setView] = useState('list');

  // Form states
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [severity, setSeverity] = useState('High');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Active Metric Card filter states
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showResolvedOnly, setShowResolvedOnly] = useState(false);
  const [showThisMonthOnly, setShowThisMonthOnly] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    try {
      const [repRes, assetRes] = await Promise.all([
        api.get('/damage'),
        api.get('/assets')
      ]);
      // Normalize statuses for reports to render high-fidelity 'Open' or 'Resolved'
      const normalizedReports = (repRes.data || []).map(r => ({
        ...r,
        status: r.status === 'Resolved' ? 'Resolved' : r.status === 'Under Repair' ? 'Under Repair' : 'Open'
      }));
      setReports(normalizedReports);
      setAssets(assetRes.data || []);
    } catch (error) {
      console.error('Error fetching damage report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReport = async (e) => {
    e.preventDefault();
    if (!selectedAssetId || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('assetId', selectedAssetId);
      formData.append('reportedById', user.employeeId ? user.id : 1);
      formData.append('severity', severity);
      formData.append('description', description);
      
      if (photos.length > 0 && photos[0].file) {
        formData.append('photo', photos[0].file);
      } else if (photos.length > 0) {
        // Fallback for mock if no actual file object exists
        formData.append('imageUrl', 'mockup-damage-image.jpg');
      }

      await api.post('/damage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setView('list');
      setSelectedAssetId('');
      setSeverity('High');
      setDescription('');
      setPhotos([]);
      fetchData();
    } catch (error) {
      console.error('Submit damage report error:', error);
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAssetDetails = assets.find(a => a.id === selectedAssetId);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => ({
        file: file,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  // Extract unique departments for filter list
  const departments = useMemo(() => {
    const depts = new Set();
    reports.forEach(r => {
      const deptName = r.reportedBy?.department?.name;
      if (deptName) depts.add(deptName);
    });
    return ['All Departments', ...Array.from(depts)];
  }, [reports]);

  // Derived Counts for premium Metric Cards
  const totalReportsCount = reports.length;
  const openReportsCount = reports.filter(r => r.status === 'Open' || r.status === 'Under Repair').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return reports.filter(r => {
      const rDate = new Date(r.reportedAt);
      return rDate.getMonth() === currentMonth && rDate.getFullYear() === currentYear;
    }).length;
  }, [reports]);

  // Filter Logic
  const filteredReports = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return reports.filter(r => {
      // 1. Search Query Match
      const searchLower = searchQuery.toLowerCase();
      const assetName = (r.asset?.name || '').toLowerCase();
      const serial = (r.asset?.serialNumber || '').toLowerCase();
      const repId = `dmg-${r.id.substring(r.id.length - 4)}`.toLowerCase();
      const empName = `${r.reportedBy?.firstName || ''} ${r.reportedBy?.lastName || ''}`.toLowerCase();

      const matchesSearch = !searchQuery || 
        assetName.includes(searchLower) || 
        serial.includes(searchLower) || 
        repId.includes(searchLower) || 
        empName.includes(searchLower);

      // 2. Dropdown Status Match
      let matchesStatus = statusFilter === 'All Status' || r.status === statusFilter;
      if (showOpenOnly) matchesStatus = r.status === 'Open' || r.status === 'Under Repair';
      if (showResolvedOnly) matchesStatus = r.status === 'Resolved';

      // 3. Dropdown Department Match
      const matchesDept = deptFilter === 'All Departments' || r.reportedBy?.department?.name === deptFilter;

      // 4. Date Filter Match
      const rDate = new Date(r.reportedAt);
      const matchesStart = !startDate || rDate >= new Date(startDate);
      const matchesEnd = !endDate || rDate <= new Date(endDate);

      // 5. This Month Filter Match
      const matchesThisMonth = !showThisMonthOnly || (rDate.getMonth() === currentMonth && rDate.getFullYear() === currentYear);

      return matchesSearch && matchesStatus && matchesDept && matchesStart && matchesEnd && matchesThisMonth;
    });
  }, [reports, searchQuery, statusFilter, deptFilter, startDate, endDate, showOpenOnly, showResolvedOnly, showThisMonthOnly]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentItems = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setDeptFilter('All Departments');
    setStartDate('');
    setEndDate('');
    setShowOpenOnly(false);
    setShowResolvedOnly(false);
    setShowThisMonthOnly(false);
    setCurrentPage(1);
  };

  // Dynamic filter state handlers for metric cards
  const toggleOpenOnly = () => {
    setShowOpenOnly(!showOpenOnly);
    setShowResolvedOnly(false);
    setShowThisMonthOnly(false);
    setCurrentPage(1);
  };

  const toggleResolvedOnly = () => {
    setShowResolvedOnly(!showResolvedOnly);
    setShowOpenOnly(false);
    setShowThisMonthOnly(false);
    setCurrentPage(1);
  };

  const toggleThisMonthOnly = () => {
    setShowThisMonthOnly(!showThisMonthOnly);
    setShowOpenOnly(false);
    setShowResolvedOnly(false);
    setCurrentPage(1);
  };

  if (view === 'report') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
          <span style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: 500 }} onClick={() => setView('list')}>Dashboard</span>
          <ChevronRight size={14} />
          <span style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: 500 }} onClick={() => setView('list')}>Damage Reports</span>
          <ChevronRight size={14} />
          <span style={{ color: '#1e293b', fontWeight: 600 }}>New Report</span>
        </div>

        <div>
          <h1 className="page-title" style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Report Damage</h1>
        </div>

        <form onSubmit={handleReport} style={formContainerStyle}>
          {/* Section 1: Asset Selection */}
          <div style={sectionCardStyle}>
            <h3 style={sectionHeaderStyle}>Asset</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select 
                required 
                value={selectedAssetId} 
                onChange={e => setSelectedAssetId(e.target.value)} 
                style={dropdownStyle}
              >
                <option value="">Search asset to report damage...</option>
                {assets.filter(a => a.status === 'Allocated').map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.serialNumber || 'No SN'}) - {asset.assetId}
                  </option>
                ))}
              </select>

              {selectedAssetDetails ? (
                <div style={infoBoxStyle}>
                  <AssetIllustration category={selectedAssetDetails.category} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                      {selectedAssetDetails.name}
                    </h4>
                    <p style={infoTextStyle}>Serial: <span style={{ color: '#475569', fontWeight: 600 }}>{selectedAssetDetails.serialNumber || 'N/A'}</span></p>
                    <p style={infoTextStyle}>Status: <span style={{ color: '#475569', fontWeight: 600 }}>{selectedAssetDetails.status}</span></p>
                  </div>
                </div>
              ) : (
                <div style={placeholderBoxStyle}>
                  <div style={roundPlaceholderStyle('#fee2e2')}><AlertTriangle size={24} color="#ef4444" /></div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>No asset selected. Choose an asset from the list above.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Damage Details */}
          <div style={sectionCardStyle}>
            <h3 style={sectionHeaderStyle}>Damage Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>Severity</label>
                  <select 
                    required 
                    value={severity} 
                    onChange={e => setSeverity(e.target.value)} 
                    style={dropdownStyle}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={fieldLabelStyle}>Description</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: '#94a3b8' }} />
                    <textarea 
                      required 
                      rows="3"
                      placeholder="E.g., Laptop screen broken due to accidental drop. Needs replacement." 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      style={textareaStyle} 
                    />
                  </div>
                </div>
              </div>

              {/* Upload photos section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={fieldLabelStyle}>Upload Photos</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    type="file" 
                    id="damage-photo-upload" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                  {photos.map((photo, idx) => (
                    <MockupPhoto key={idx} photo={photo} onClick={() => removePhoto(idx)} />
                  ))}
                  
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('damage-photo-upload').click()}
                    style={addMoreBtnStyle}
                  >
                    <Plus size={16} color="#6366f1" />
                    <span>+ Add More</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting || !selectedAssetId} 
            style={submitButtonStyle(!!selectedAssetId)}
          >
            {submitting ? 'Submitting Report...' : 'Submit Report'}
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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>Damage Reports</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>View and manage all damage reports.</p>
        </div>
        <button 
          onClick={() => setView('report')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 18px',
            borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
          }}
        >
          <Plus size={18} /> Report Damage
        </button>
      </div>

      {/* 2. Premium Clickable Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <button 
          type="button"
          onClick={resetFilters}
          style={metricCardButtonStyle(!showOpenOnly && !showResolvedOnly && !showThisMonthOnly, '#4f46e5')}
        >
          <div style={iconBoxStyle('#e0e7ff')}>
            <Laptop size={20} color="#4f46e5" />
          </div>
          <div>
            <p style={metricTitleStyle}>Total Reports</p>
            <p style={metricValueStyle}>{loading ? '...' : totalReportsCount}</p>
            <p style={metricSubtextStyle}>All damage reports</p>
          </div>
        </button>

        <button 
          type="button"
          onClick={toggleOpenOnly}
          style={metricCardButtonStyle(showOpenOnly, '#f97316')}
        >
          <div style={iconBoxStyle('#ffedd5')}>
            <AlertTriangle size={20} color="#f97316" />
          </div>
          <div>
            <p style={metricTitleStyle}>Unresolved Reports</p>
            <p style={metricValueStyle}>{loading ? '...' : openReportsCount}</p>
            <p style={metricSubtextStyle}>Awaiting resolution</p>
          </div>
        </button>

        <button 
          type="button"
          onClick={toggleResolvedOnly}
          style={metricCardButtonStyle(showResolvedOnly, '#10b981')}
        >
          <div style={iconBoxStyle('#d1fae5')}>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div>
            <p style={metricTitleStyle}>Resolved</p>
            <p style={metricValueStyle}>{loading ? '...' : resolvedCount}</p>
            <p style={metricSubtextStyle}>Issues resolved</p>
          </div>
        </button>

        <button 
          type="button"
          onClick={toggleThisMonthOnly}
          style={metricCardButtonStyle(showThisMonthOnly, '#ec4899')}
        >
          <div style={iconBoxStyle('#fce7f3')}>
            <Calendar size={20} color="#ec4899" />
          </div>
          <div>
            <p style={metricTitleStyle}>This Month</p>
            <p style={metricValueStyle}>{loading ? '...' : thisMonthCount}</p>
            <p style={metricSubtextStyle}>Reports this month</p>
          </div>
        </button>
      </div>

      {/* 3. Search & Filters Bar */}
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9',
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by asset, employee or serial number..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%', padding: '10px 16px 10px 40px', borderRadius: '8px',
              border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.88rem',
              color: '#334155', boxSizing: 'border-box'
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          style={filterDropdownStyle}
        >
          <option value="All Status">All Status</option>
          <option value="Open">Open</option>
          <option value="Under Repair">Under Repair</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={deptFilter}
          onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
          style={filterDropdownStyle}
        >
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
            style={datePickerStyle}
          />
          <ArrowRight size={14} color="#94a3b8" />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
            style={datePickerStyle}
          />
        </div>

        {(searchQuery || statusFilter !== 'All Status' || deptFilter !== 'All Departments' || startDate || endDate || showOpenOnly || showResolvedOnly || showThisMonthOnly) && (
          <button 
            type="button"
            onClick={resetFilters}
            style={{
              padding: '10px 16px', background: '#f1f5f9', color: '#475569',
              border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* 4. Elegant Data Table */}
      <div style={{
        background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9',
        overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              <th style={thStyle}>Report ID</th>
              <th style={thStyle}>Asset</th>
              <th style={thStyle}>Reported By</th>
              <th style={thStyle}>Reported On</th>
              <th style={thStyle}>Damage Type</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={tdEmptyStyle}>Loading damage reports data...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan={7} style={tdEmptyStyle}>No damage reports found matching criteria.</td></tr>
            ) : (
              currentItems.map(rep => {
                const assetName = rep.asset?.name || 'Unknown Asset';
                const assetSN = rep.asset?.serialNumber || 'No SN';
                const empName = `${rep.reportedBy?.firstName || ''} ${rep.reportedBy?.lastName || ''}`.trim() || 'Admin';
                
                // Extrapolate a short description snippet as "Damage Type"
                const damageSnippet = rep.description && rep.description.length > 30 
                  ? `${rep.description.substring(0, 30)}...` 
                  : rep.description || 'Hardware Issue';

                return (
                  <tr 
                    key={rep.id} 
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                        DMG-{rep.id.substring(rep.id.length - 4).toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DeviceIcon category={rep.asset?.category} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{assetName} ({assetSN})</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>{rep.asset?.category || 'Hardware'}</p>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <EmployeeAvatar firstName={rep.reportedBy?.firstName} lastName={rep.reportedBy?.lastName} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{empName}</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>{rep.reportedBy?.department?.name || 'IT Operations'}</p>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>
                        {new Date(rep.reportedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        {new Date(rep.reportedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{damageSnippet}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                        background: rep.status === 'Resolved' ? '#d1fae5' : rep.status === 'Under Repair' ? '#ffedd5' : '#fee2e2', 
                        color: rep.status === 'Resolved' ? '#059669' : rep.status === 'Under Repair' ? '#d97706' : '#ef4444', 
                        display: 'inline-block'
                      }}>
                        {rep.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => navigate(`/history/${rep.asset?.id}`)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            background: '#e0e7ff', color: '#4f46e5', border: 'none',
                            padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem',
                            fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#c7d2fe'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                        >
                          <Eye size={12} /> View
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
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

        {/* 5. Pagination Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', background: '#fff'
        }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
            Showing {currentItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
          </p>

          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={pageNavButtonStyle(currentPage === 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  style={pageNumberButtonStyle(currentPage === idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={pageNavButtonStyle(currentPage === totalPages)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Premium Styles
const formContainerStyle = {
  display: 'flex', flexDirection: 'column', gap: '20px',
  background: '#fff', borderRadius: '12px', padding: '24px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
};

const sectionCardStyle = {
  display: 'flex', flexDirection: 'column', gap: '14px',
  borderBottom: '1px solid #f1f5f9', paddingBottom: '20px'
};

const sectionHeaderStyle = {
  fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: 0
};

const dropdownStyle = {
  width: '100%', padding: '12px 16px', borderRadius: '8px',
  border: '1px solid #e2e8f0', background: '#fff', color: '#475569',
  fontSize: '0.92rem', fontWeight: 500, outline: 'none', cursor: 'pointer'
};

const infoBoxStyle = {
  display: 'flex', alignItems: 'center', gap: '24px', padding: '16px',
  background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9'
};

const infoTextStyle = {
  fontSize: '0.85rem', color: '#64748b', margin: 0
};

const placeholderBoxStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', gap: '12px', padding: '30px',
  background: '#fafafa', borderRadius: '8px', border: '1px dashed #e2e8f0',
  textAlign: 'center'
};

const roundPlaceholderStyle = (bg) => ({
  width: '48px', height: '48px', borderRadius: '50%', background: bg,
  display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
});

const fieldLabelStyle = {
  fontSize: '0.85rem', fontWeight: 600, color: '#475569'
};

const textareaStyle = {
  width: '100%', padding: '12px 16px 12px 40px', borderRadius: '8px',
  border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b',
  fontSize: '0.92rem', fontWeight: 500, outline: 'none', boxSizing: 'border-box',
  resize: 'none', fontFamily: 'Inter, sans-serif'
};

const photoThumbStyle = {
  width: '74px', height: '74px', borderRadius: '8px', border: '1px solid #cbd5e1',
  overflow: 'hidden', display: 'flex', alignItems: 'center', justifySelf: 'center',
  justifyContent: 'center', background: '#fff', cursor: 'pointer'
};

const addMoreBtnStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', gap: '4px', width: '84px', height: '74px',
  background: '#e0e7ff', border: '1px dashed #818cf8', borderRadius: '8px',
  fontSize: '0.74rem', fontWeight: 600, color: '#4f46e5', cursor: 'pointer',
  outline: 'none'
};

const submitButtonStyle = (active) => ({
  width: '100%', padding: '14px', background: active ? '#7c3aed' : '#cbd5e1',
  color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem',
  fontWeight: 600, cursor: active ? 'pointer' : 'not-allowed', marginTop: '10px'
});

// Metric Card Buttons (Clickable Filters)
const metricCardButtonStyle = (isActive, color) => ({
  display: 'flex', gap: '16px', alignItems: 'center', padding: '20px',
  background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px',
  cursor: 'pointer', textAlign: 'left', outline: 'none', boxSizing: 'border-box',
  boxShadow: isActive ? `0 0 0 2px ${color}, 0 4px 6px -1px rgba(0,0,0,0.04)` : '0 1px 3px rgba(0,0,0,0.02)',
  transform: isActive ? 'translateY(-2px)' : 'none',
  transition: 'all 0.2s ease'
});

const iconBoxStyle = (bg) => ({
  width: '44px', height: '44px', borderRadius: '10px', background: bg,
  display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
});

const metricTitleStyle = {
  margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
};

const metricValueStyle = {
  margin: '4px 0 2px 0', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a'
};

const metricSubtextStyle = {
  margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500
};

// Filter input styling
const filterDropdownStyle = {
  padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
  background: '#fff', color: '#475569', fontSize: '0.88rem', fontWeight: 500,
  outline: 'none', cursor: 'pointer'
};

const datePickerStyle = {
  background: 'transparent', border: 'none', outline: 'none',
  fontSize: '0.85rem', color: '#475569', fontWeight: 500, cursor: 'pointer'
};

// Table styling
const thStyle = {
  padding: '16px 24px', color: '#475569', fontWeight: 600, fontSize: '0.78rem',
  textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9'
};

const tdStyle = {
  padding: '16px 24px', verticalAlign: 'middle'
};

const tdEmptyStyle = {
  padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem', fontWeight: 500
};

// Pagination styling
const pageNavButtonStyle = (disabled) => ({
  padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px',
  background: '#fff', color: disabled ? '#cbd5e1' : '#475569',
  fontSize: '0.8rem', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer'
});

const pageNumberButtonStyle = (active) => ({
  width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '6px',
  background: active ? '#4f46e5' : '#fff', color: active ? '#fff' : '#475569',
  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
});

export default Damages;
