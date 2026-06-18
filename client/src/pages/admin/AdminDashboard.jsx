import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, FileText, User, AlertTriangle, ChevronRight,
  RotateCcw, Clock, Calendar, Users, Bell
} from 'lucide-react';
import DashboardPanels from '../../components/DashboardPanels';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#3b82f6', '#f97316'];

const StatCard = ({ title, value, icon, color, bgColor, link, linkText }) => (
  <div style={{
    background: '#fff', borderRadius: '12px', padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
    display: 'flex', flexDirection: 'column', gap: '12px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '4px' }}>{title}</p>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>{value}</p>
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: '10px',
        background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {React.cloneElement(icon, { size: 22, color })}
      </div>
    </div>
    <Link to={link} style={{
      fontSize: '0.78rem', color: '#3b82f6', fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none'
    }}>
      {linkText || 'View all'} <ChevronRight size={14} />
    </Link>
  </div>
);

const ActivityIcon = ({ type }) => {
  const styles = {
    allocation: { bg: '#dbeafe', color: '#3b82f6', icon: <Package size={14} /> },
    return: { bg: '#d1fae5', color: '#10b981', icon: <RotateCcw size={14} /> },
    damage: { bg: '#fee2e2', color: '#ef4444', icon: <AlertTriangle size={14} /> },
    employee: { bg: '#e0e7ff', color: '#4f46e5', icon: <User size={14} /> },
    import: { bg: '#f0fdf4', color: '#22c55e', icon: <FileText size={14} /> },
  };
  const s = styles[type] || styles.import;
  return (
    <div style={{ width: 30, height: 30, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
      {s.icon}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalAssets: 0, inStock: 0, allocated: 0, damaged: 0, lowStock: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [allocationTrend, setAllocationTrend] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [bottomStats, setBottomStats] = useState({ overdueReturns: 0, assetsDueSoon: 0, damageReportsOpen: 0, totalEmployees: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [assetsRes, allocsRes, empRes, dmgRes, returnsRes] = await Promise.all([
          api.get('/assets'),
          api.get('/allocations'),
          api.get('/employees'),
          api.get('/damage'),
          api.get('/returns'),
        ]);

        const assets = assetsRes.data || [];
        const allocations = allocsRes.data || [];
        const employees = empRes.data || [];
        const damages = dmgRes.data || [];
        const returns = returnsRes.data || [];

        // Main stats
        const totalAssets = assets.length;
        const inStock = assets.filter(a => a.status === 'In Stock').length;
        const allocated = assets.filter(a => a.status === 'Allocated').length;
        const damaged = assets.filter(a => a.status === 'Damaged').length;

        // Low stock = categories with < 10 in stock
        const catMap = {};
        assets.forEach(a => {
          if (!catMap[a.category]) catMap[a.category] = { inStock: 0 };
          if (a.status === 'In Stock') catMap[a.category].inStock++;
        });
        const lowStock = Object.values(catMap).filter(c => c.inStock < 10).length;

        setStats({ totalAssets, inStock, allocated, damaged, lowStock });

        // Category data for pie chart
        const catCount = {};
        assets.forEach(a => { catCount[a.category] = (catCount[a.category] || 0) + 1; });
        setCategoryData(Object.entries(catCount).map(([name, value]) => ({ name, value })));

        // Allocation trend — last 7 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const now = new Date();
        const trend = months.map((month, i) => {
          const targetMonth = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
          const alloc = allocations.filter(a => {
            const d = new Date(a.allocatedAt);
            return d.getFullYear() === targetMonth.getFullYear() && d.getMonth() === targetMonth.getMonth();
          }).length;
          const ret = returns.filter(r => {
            const d = new Date(r.returnedAt);
            return d.getFullYear() === targetMonth.getFullYear() && d.getMonth() === targetMonth.getMonth();
          }).length;
          return { month, Allocated: alloc, Returned: ret };
        });
        setAllocationTrend(trend);

        // Recent activities (from allocations + returns + damages, sorted by date)
        const activities = [];
        allocations.slice(0, 5).forEach(a => {
          activities.push({
            id: `alloc-${a.id}`,
            type: 'allocation',
            text: `${a.asset?.name || 'Asset'} allocated to ${a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : 'Employee'}`,
            time: a.allocatedAt,
          });
        });
        returns.slice(0, 3).forEach(r => {
          activities.push({
            id: `ret-${r.id}`,
            type: 'return',
            text: `${r.asset?.name || 'Asset'} returned`,
            time: r.returnedAt,
          });
        });
        damages.slice(0, 2).forEach(d => {
          activities.push({
            id: `dmg-${d.id}`,
            type: 'damage',
            text: `Damage reported for ${d.asset?.name || 'Asset'}`,
            time: d.reportedAt,
          });
        });
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivities(activities.slice(0, 6));

        // Bottom stats
        const now2 = new Date();
        const sevenDays = new Date(now2.getTime() + 7 * 24 * 60 * 60 * 1000);
        const overdueReturns = allocations.filter(a => a.expectedReturnDate && new Date(a.expectedReturnDate) < now2 && a.status === 'Active').length;
        const assetsDueSoon = allocations.filter(a => {
          if (!a.expectedReturnDate) return false;
          const d = new Date(a.expectedReturnDate);
          return d >= now2 && d <= sevenDays && a.status === 'Active';
        }).length;
        const damageReportsOpen = damages.filter(d => d.status !== 'Resolved').length;

        setBottomStats({ overdueReturns, assetsDueSoon, damageReportsOpen, totalEmployees: employees.length });

      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = (new Date() - new Date(dateStr)) / 1000;
    if (diff < 60) return `${Math.round(diff)} secs ago`;
    if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.round(diff / 3600)} hrs ago`;
    return `${Math.round(diff / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', fontFamily: 'Inter, sans-serif' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Dashboard</h1>
      </div>

      {/* Top 5 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard title="Total Assets" value={stats.totalAssets} icon={<Package />} color="#4f46e5" bgColor="#e0e7ff" link="/inventory" linkText="View all" />
        <StatCard title="In Stock" value={stats.inStock} icon={<FileText />} color="#10b981" bgColor="#d1fae5" link="/inventory" linkText="View details" />
        <StatCard title="Allocated" value={stats.allocated} icon={<User />} color="#f59e0b" bgColor="#fef3c7" link="/allocations" linkText="View details" />
        <StatCard title="Damaged" value={stats.damaged} icon={<AlertTriangle />} color="#ef4444" bgColor="#fee2e2" link="/damages" linkText="View details" />
        <StatCard title="Low Stock Alerts" value={stats.lowStock} icon={<Bell />} color="#8b5cf6" bgColor="#ede9fe" link="/inventory" linkText="View details" />
      </div>

      {/* Middle Row: Donut + Line Chart + Recent Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1fr', gap: '16px', marginBottom: '24px' }}>

        {/* Stock Summary Donut Chart */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>Stock Summary by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" label={false}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {categoryData.map((cat, i) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ color: '#475569' }}>{cat.name}</span>
                </div>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{cat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation Overview Line Chart */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>Allocation Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={allocationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.78rem' }} />
              <Line type="monotone" dataKey="Allocated" stroke="#4f46e5" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Returned" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentActivities.length > 0 ? recentActivities.map(act => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <ActivityIcon type={act.type} />
                <div>
                  <p style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>{act.text}</p>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{timeAgo(act.time)}</p>
                </div>
              </div>
            )) : (
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No recent activities</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Expandable Detail Cards */}
      <DashboardPanels bottomStats={bottomStats} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
