import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, Download, Eye, Clock, Calendar, AlertTriangle, Users } from 'lucide-react';
import api from '../services/api';

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '-';
const fmtINR = (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '-';
const daysDiff = (d) => Math.round((new Date() - new Date(d)) / 86400000);

// Dynamic helper to calculate repair costs based on severity and real-world asset cost
const getEstimatedDamageCost = (d) => {
  const cost = d.asset?.purchaseCost || 50000;
  if (d.severity === 'High') return Math.round(cost * 0.45);
  if (d.severity === 'Medium') return Math.round(cost * 0.20);
  return Math.round(cost * 0.08);
};

// ─── Overdue Returns Panel ───────────────────────────────────────────────────
const OverduePanel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/allocations').then(r => {
      const now = new Date();
      const overdue = (r.data || []).filter(a => a.expectedReturnDate && new Date(a.expectedReturnDate) < now && a.status === 'Active' && a.asset?.status === 'Allocated');
      setData(overdue);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(a =>
    (a.asset?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (`${a.employee?.firstName || ''} ${a.employee?.lastName || ''}`).toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = data.reduce((s, a) => s + (a.asset?.purchaseCost || 0), 0);
  const avgDays = data.length ? Math.round(data.reduce((s, a) => s + daysDiff(a.expectedReturnDate), 0) / data.length) : 0;

  return (
    <div style={panelStyle}>
      <div style={panelHeaderStyle('#ef4444')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={iconBox('#fee2e2')}><Clock size={20} color="#ef4444" /></div>
          <div>
            <p style={panelTitle}>Overdue Returns</p>
            <p style={panelSub}>Assets that were not returned on the expected date</p>
          </div>
        </div>
      </div>
      <div style={statsRow}>
        {[
          { label: 'Total Overdue', value: data.length, icon: '📦' },
          { label: 'Total Employees', value: [...new Set(data.map(a => a.employeeId))].length, icon: '👤' },
          { label: 'Avg Overdue Days', value: `${avgDays} Days`, icon: '⏱' },
          { label: 'Total Estimated Value', value: fmtINR(totalValue), icon: '💰' },
        ].map(s => (
          <div key={s.label} style={statBox}>
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <div>
              <p style={statLabel}>{s.label}</p>
              <p style={statValue}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={tableSection}>
        <div style={toolbar}>
          <div style={searchBox}><Search size={14} color="#94a3b8" /><input style={searchInput} placeholder="Search assets, employees..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <button style={exportBtn}><Download size={13} /> Export CSV</button>
        </div>
        <table style={tableStyle}>
          <thead><tr>{['ID','Asset','Employee','Category','Expected Return','Days Overdue','Est. Value','Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} style={tdCenter}>Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={8} style={tdCenter}>No overdue returns</td></tr>
              : filtered.map(a => {
                const days = daysDiff(a.expectedReturnDate);
                return (
                  <tr key={a.id} style={trStyle}>
                    <td style={td}><span style={idBadge}>{a.asset?.assetId || a.id}</span></td>
                    <td style={td}><div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{a.asset?.name || '-'}</div><div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{a.asset?.serialNumber || ''}</div></td>
                    <td style={td}><div style={{ fontSize: '0.82rem' }}>{a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : '-'}</div><div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{a.employee?.employeeId || ''}</div></td>
                    <td style={td}><span style={catBadge}>{a.asset?.category || '-'}</span></td>
                    <td style={td}>{fmt(a.expectedReturnDate)}</td>
                    <td style={td}><span style={overdueBadge(days)}>{days} days</span></td>
                    <td style={td}>{fmtINR(a.asset?.purchaseCost)}</td>
                    <td style={td}><button style={actionBtn} onClick={() => navigate(`/history/${a.asset?.id}`)} title="View Asset History"><Eye size={13} /></button></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div style={tableFooter}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
      </div>
    </div>
  );
};

// ─── Assets Due Soon Panel ───────────────────────────────────────────────────
const DueSoonPanel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/allocations').then(r => {
      const now = new Date();
      const soon = new Date(now.getTime() + 7 * 86400000);
      const due = (r.data || []).filter(a => {
        if (!a.expectedReturnDate) return false;
        const d = new Date(a.expectedReturnDate);
        return d >= now && d <= soon && a.status === 'Active';
      });
      setData(due);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(a =>
    (a.asset?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (`${a.employee?.firstName || ''} ${a.employee?.lastName || ''}`).toLowerCase().includes(search.toLowerCase())
  );

  const within3 = data.filter(a => daysDiff(a.expectedReturnDate) <= -(-3)).length;
  const totalValue = data.reduce((s, a) => s + (a.asset?.purchaseCost || 0), 0);

  return (
    <div style={panelStyle}>
      <div style={panelHeaderStyle('#10b981')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={iconBox('#d1fae5')}><Calendar size={20} color="#10b981" /></div>
          <div>
            <p style={panelTitle}>Assets Due Soon</p>
            <p style={panelSub}>Assets that will be due for return within 7 days</p>
          </div>
        </div>
      </div>
      <div style={statsRow}>
        {[
          { label: 'Total Due Soon', value: data.length, icon: '📅' },
          { label: 'Within 3 Days', value: within3, icon: '⚡' },
          { label: 'Within 7 Days', value: data.length, icon: '🗓' },
          { label: 'Total Estimated Value', value: fmtINR(totalValue), icon: '💰' },
        ].map(s => (
          <div key={s.label} style={statBox}>
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <div>
              <p style={statLabel}>{s.label}</p>
              <p style={statValue}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={tableSection}>
        <div style={toolbar}>
          <div style={searchBox}><Search size={14} color="#94a3b8" /><input style={searchInput} placeholder="Search assets, employees..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <button style={exportBtn}><Download size={13} /> Export CSV</button>
        </div>
        <table style={tableStyle}>
          <thead><tr>{['ID','Asset','Employee','Expected Return','Days Left','Est. Value','Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={tdCenter}>Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} style={tdCenter}>No assets due soon</td></tr>
              : filtered.map(a => {
                const daysLeft = Math.ceil((new Date(a.expectedReturnDate) - new Date()) / 86400000);
                return (
                  <tr key={a.id} style={trStyle}>
                    <td style={td}><span style={idBadge}>{a.asset?.assetId || a.id}</span></td>
                    <td style={td}><div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{a.asset?.name || '-'}</div><div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{a.asset?.serialNumber || ''}</div></td>
                    <td style={td}><div style={{ fontSize: '0.82rem' }}>{a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : '-'}</div><div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{a.employee?.employeeId || ''}</div></td>
                    <td style={td}>{fmt(a.expectedReturnDate)}</td>
                    <td style={td}><span style={dueBadge(daysLeft)}>{daysLeft} days</span></td>
                    <td style={td}>{fmtINR(a.asset?.purchaseCost)}</td>
                    <td style={td}><button style={actionBtn} onClick={() => navigate(`/history/${a.asset?.id}`)} title="View Asset History"><Eye size={13} /></button></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div style={tableFooter}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
      </div>
    </div>
  );
};

// ─── Damage Reports Panel ────────────────────────────────────────────────────
const DamagePanel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/damage').then(r => {
      setData(r.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(a =>
    (a.asset?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (`${a.reportedBy?.firstName || ''} ${a.reportedBy?.lastName || ''}`).toLowerCase().includes(search.toLowerCase())
  );

  const openCount = data.filter(d => d.status !== 'Resolved').length;
  const resolved = data.filter(d => d.status === 'Resolved').length;
  const totalCost = data.reduce((s, d) => s + getEstimatedDamageCost(d), 0);

  return (
    <div style={panelStyle}>
      <div style={panelHeaderStyle('#f59e0b')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={iconBox('#fef3c7')}><AlertTriangle size={20} color="#f59e0b" /></div>
          <div>
            <p style={panelTitle}>Damage Reports</p>
            <p style={panelSub}>Track and manage reported damaged assets</p>
          </div>
        </div>
      </div>
      <div style={statsRow}>
        {[
          { label: 'Total Reports', value: data.length, icon: '📋' },
          { label: 'Unresolved Reports', value: openCount, icon: '🔴' },
          { label: 'Resolved Reports', value: resolved, icon: '✅' },
          { label: 'Total Estimated Cost', value: fmtINR(totalCost), icon: '💸' },
        ].map(s => (
          <div key={s.label} style={statBox}>
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <div>
              <p style={statLabel}>{s.label}</p>
              <p style={statValue}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={tableSection}>
        <div style={toolbar}>
          <div style={searchBox}><Search size={14} color="#94a3b8" /><input style={searchInput} placeholder="Search assets, employees..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <button style={exportBtn}><Download size={13} /> Export CSV</button>
        </div>
        <table style={tableStyle}>
          <thead><tr>{['ID','Asset','Reported By','Severity','Reported On','Status','Est. Cost','Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} style={tdCenter}>Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={8} style={tdCenter}>No damage reports</td></tr>
              : filtered.map(d => (
                <tr key={d.id} style={trStyle}>
                  <td style={td}><span style={idBadge}>{d.asset?.assetId || d.id}</span></td>
                  <td style={td}><div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{d.asset?.name || '-'}</div><div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{d.asset?.serialNumber || ''}</div></td>
                  <td style={td}><div style={{ fontSize: '0.82rem' }}>{d.reportedBy ? `${d.reportedBy.firstName} ${d.reportedBy.lastName}` : '-'}</div><div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{d.reportedBy?.employeeId || ''}</div></td>
                  <td style={td}><span style={severityBadge(d.severity)}>{d.severity || '-'}</span></td>
                  <td style={td}>{fmt(d.reportedAt)}</td>
                  <td style={td}><span style={statusBadge(d.status)}>{d.status === 'Pending' ? 'Open' : d.status || '-'}</span></td>
                  <td style={td}>{fmtINR(getEstimatedDamageCost(d))}</td>
                  <td style={td}><button style={actionBtn} onClick={() => navigate(`/history/${d.asset?.id}`)} title="View Asset History"><Eye size={13} /></button></td>
                </tr>
              ))}
          </tbody>
        </table>
        <div style={tableFooter}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
      </div>
    </div>
  );
};

// ─── Total Employees Panel ───────────────────────────────────────────────────
const EmployeesPanel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employees').then(r => {
      setData(r.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(e => {
    const fullName = `${e.firstName || ''} ${e.lastName || ''}`.trim();
    const deptName = e.department?.name || '';
    return fullName.toLowerCase().includes(search.toLowerCase()) ||
           (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
           deptName.toLowerCase().includes(search.toLowerCase());
  });

  const active = data.filter(e => e.status?.toLowerCase() === 'active').length;
  const inactive = data.filter(e => e.status?.toLowerCase() === 'inactive').length;
  const depts = [...new Set(data.map(e => e.department?.name).filter(Boolean))].length;

  return (
    <div style={panelStyle}>
      <div style={panelHeaderStyle('#3b82f6')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={iconBox('#dbeafe')}><Users size={20} color="#3b82f6" /></div>
          <div>
            <p style={panelTitle}>Total Employees</p>
            <p style={panelSub}>Overview of all employees in the system</p>
          </div>
        </div>
      </div>
      <div style={statsRow}>
        {[
          { label: 'Total Employees', value: data.length, icon: '👥' },
          { label: 'Active Employees', value: active, icon: '✅' },
          { label: 'Inactive Employees', value: inactive, icon: '⏸' },
          { label: 'Departments', value: depts, icon: '🏢' },
        ].map(s => (
          <div key={s.label} style={statBox}>
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <div>
              <p style={statLabel}>{s.label}</p>
              <p style={statValue}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={tableSection}>
        <div style={toolbar}>
          <div style={searchBox}><Search size={14} color="#94a3b8" /><input style={searchInput} placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <button style={exportBtn}><Download size={13} /> Export CSV</button>
        </div>
        <table style={tableStyle}>
          <thead><tr>{['ID','Employee','Email','Department','Role','Status','Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={tdCenter}>Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} style={tdCenter}>No employees found</td></tr>
              : filtered.map(e => {
                const fullName = `${e.firstName || ''} ${e.lastName || ''}`.trim();
                return (
                  <tr key={e.id} style={trStyle}>
                    <td style={td}><span style={idBadge}>{e.employeeId || e.id}</span></td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5' }}>
                          {(fullName || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{fullName}</span>
                      </div>
                    </td>
                    <td style={td}><span style={{ fontSize: '0.8rem', color: '#475569' }}>{e.email}</span></td>
                    <td style={td}><span style={{ fontSize: '0.8rem' }}>{e.department?.name || '-'}</span></td>
                    <td style={td}><span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{e.role || '-'}</span></td>
                    <td style={td}><span style={statusBadge(e.status)}>{e.status || '-'}</span></td>
                    <td style={td}><button style={actionBtn} onClick={() => navigate('/employees')} title="View Employees Page"><Eye size={13} /></button></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div style={tableFooter}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
      </div>
    </div>
  );
};

// ─── Main Exported Component ─────────────────────────────────────────────────
const CARDS = [
  { key: 'overdue',   title: 'Overdue Returns',      color: '#ef4444', bgColor: '#fee2e2', icon: <Clock size={20} color="#ef4444" />,         Panel: OverduePanel },
  { key: 'due',       title: 'Assets Due Soon',       color: '#10b981', bgColor: '#d1fae5', icon: <Calendar size={20} color="#10b981" />,      Panel: DueSoonPanel },
  { key: 'damage',    title: 'Damage Reports Open',   color: '#f59e0b', bgColor: '#fef3c7', icon: <AlertTriangle size={20} color="#f59e0b" />, Panel: DamagePanel },
  { key: 'employees', title: 'Total Employees',       color: '#3b82f6', bgColor: '#dbeafe', icon: <Users size={20} color="#3b82f6" />,         Panel: EmployeesPanel },
];

const DashboardPanels = ({ bottomStats }) => {
  const [open, setOpen] = useState(null);

  const toggle = (key) => setOpen(prev => prev === key ? null : key);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 4 stat cards in a row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {CARDS.map(card => {
          const value = bottomStats[card.key === 'overdue' ? 'overdueReturns' : card.key === 'due' ? 'assetsDueSoon' : card.key === 'damage' ? 'damageReportsOpen' : 'totalEmployees'];
          const isOpen = open === card.key;
          return (
            <div 
              key={card.key} 
              onClick={() => toggle(card.key)}
              style={{ 
                background: '#fff', 
                borderRadius: 12, 
                padding: 20, 
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', 
                border: `1px solid ${isOpen ? card.color : '#f1f5f9'}`, 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isOpen ? 'translateY(-2px)' : 'none',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = card.color + '80';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = isOpen ? card.color : '#f1f5f9';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>{card.title}</p>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: card.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </div>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>{value}</p>
              <div style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: card.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
                {isOpen ? 'Hide details' : 'View details'}
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded panel below */}
      {open && (() => {
        const card = CARDS.find(c => c.key === open);
        return card ? <card.Panel /> : null;
      })()}
    </div>
  );
};

export default DashboardPanels;

// ─── Shared styles ───────────────────────────────────────────────────────────
const panelStyle = { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden', animation: 'fadeIn 0.25s ease' };
const panelHeaderStyle = (c) => ({ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: c + '08' });
const iconBox = (bg) => ({ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });
const panelTitle = { fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 };
const panelSub = { fontSize: '0.75rem', color: '#64748b', margin: 0 };
const statsRow = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, borderBottom: '1px solid #f1f5f9' };
const statBox = { padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderRight: '1px solid #f1f5f9' };
const statLabel = { fontSize: '0.72rem', color: '#64748b', margin: 0 };
const statValue = { fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 };
const tableSection = { padding: '16px 20px' };
const toolbar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 };
const searchBox = { display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px' };
const searchInput = { border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', color: '#1e293b', width: 220 };
const exportBtn = { display: 'flex', alignItems: 'center', gap: 5, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' };
const th = { padding: '10px 12px', textAlign: 'left', fontSize: '0.72rem', color: '#64748b', fontWeight: 600, background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' };
const td = { padding: '10px 12px', borderBottom: '1px solid #f8fafc', color: '#334155', verticalAlign: 'middle' };
const tdCenter = { padding: 20, textAlign: 'center', color: '#94a3b8' };
const trStyle = { transition: 'background 0.15s' };
const tableFooter = { marginTop: 10, fontSize: '0.75rem', color: '#94a3b8' };
const idBadge = { fontSize: '0.72rem', color: '#4f46e5', background: '#e0e7ff', padding: '2px 7px', borderRadius: 4, fontWeight: 600 };
const catBadge = { fontSize: '0.72rem', color: '#475569', background: '#f1f5f9', padding: '2px 7px', borderRadius: 4 };
const actionBtn = { background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: '#475569' };
const overdueBadge = (days) => ({ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: days > 10 ? '#fee2e2' : '#fef3c7', color: days > 10 ? '#ef4444' : '#d97706' });
const dueBadge = (days) => ({ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: days <= 2 ? '#fee2e2' : days <= 4 ? '#fef3c7' : '#d1fae5', color: days <= 2 ? '#ef4444' : days <= 4 ? '#d97706' : '#10b981' });
const severityBadge = (s) => ({ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: s === 'High' ? '#fee2e2' : s === 'Medium' ? '#fef3c7' : '#d1fae5', color: s === 'High' ? '#ef4444' : s === 'Medium' ? '#d97706' : '#10b981' });
const statusBadge = (s) => {
  const norm = (s || '').toLowerCase();
  if (norm === 'resolved' || norm === 'active') {
    return { fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: '#d1fae5', color: '#10b981' };
  }
  if (norm === 'under repair') {
    return { fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: '#ffedd5', color: '#d97706' };
  }
  return { fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: '#fee2e2', color: '#ef4444' };
};
