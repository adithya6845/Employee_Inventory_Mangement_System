import React, { useState, useEffect } from 'react';
import ChartCard from '../../components/ChartCard';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../../services/api';

const DevStatCard = ({ title, value, link }) => (
  <motion.div whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</h3>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1 }}>{value}</h2>
      <a href={link} style={{ color: 'var(--chart-teal)', fontSize: '0.8rem', fontWeight: 600 }}>View all</a>
    </div>
  </motion.div>
);

const LeaveRequestsTable = ({ leaves, loading, onUpdateStatus }) => {
  const getStatusColor = (s) => s === 'approved' ? 'var(--success)' : s === 'rejected' ? 'var(--error)' : 'var(--warning)';

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading requests...</div>;
  if (!leaves || leaves.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No leave requests found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>Employee</th>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>Leave Type</th>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>From - To</th>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 500 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 500 }}>{row.employee?.firstName || 'System'}</td>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{row.type}</td>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{new Date(row.fromDate).toLocaleDateString()} - {new Date(row.toDate).toLocaleDateString()}</td>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span style={{ color: getStatusColor(row.status), fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{row.status}</span></td>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                {row.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => onUpdateStatus(row.id, 'approved')} style={{ padding: '4px 8px', background: 'var(--success)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Approve</button>
                    <button onClick={() => onUpdateStatus(row.id, 'rejected')} style={{ padding: '4px 8px', background: 'var(--error)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Reject</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LeaveDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (err) {
      console.error('Failed to update leave');
    }
  };

  const balanceData = [
    { name: 'Sufficient', value: 82 },
    { name: 'Low Balance', value: 24 },
    { name: 'No Balance', value: 14 },
  ];
  const COLORS = ['var(--success)', 'var(--chart-blue)', 'var(--chart-orange)'];

  const availabilityData = [
    { name: 'Mon', available: 95 },
    { name: 'Tue', available: 90 },
    { name: 'Wed', available: 85 },
    { name: 'Thu', available: 88 },
    { name: 'Fri', available: 80 },
    { name: 'Sat', available: 100 },
    { name: 'Sun', available: 100 },
  ];

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header" style={{ marginBottom: '0' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem' }}>Welcome Leave Manager 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage leave requests and team availability.</p>
      </div>

      <div className="dashboard-grid">
        <DevStatCard title="Total Requests" value={loading ? '...' : leaves.length} link="#" />
        <DevStatCard title="Pending Approval" value={loading ? '...' : pendingCount} link="#" />
        <DevStatCard title="Approved" value={loading ? '...' : approvedCount} link="#" />
        <DevStatCard title="Rejected" value={loading ? '...' : rejectedCount} link="#" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <ChartCard title="Leave Requests">
          <LeaveRequestsTable leaves={leaves} loading={loading} onUpdateStatus={handleUpdateStatus} />
        </ChartCard>

        <ChartCard title="Leave Balance Overview">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={balanceData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {balanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '1.5rem', fontWeight: 700, fill: 'var(--text-main)' }}>42</text>
              <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '0.8rem', fill: 'var(--text-muted)' }}>Total Employees</text>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', marginTop: '10px' }}>
            {balanceData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name} <span style={{ fontWeight: 'bold', marginLeft: 'auto', color: 'var(--text-main)' }}>{entry.value} ({Math.round((entry.value/120)*100)}%)</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <ChartCard title="Team Availability">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={availabilityData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="available" stroke="var(--chart-blue)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="AI Suggestions">
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> 5 employees have low leave balance.
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> Consider workload distribution for team.
            </li>
          </ul>
        </ChartCard>
      </div>
    </div>
  );
};

export default LeaveDashboard;
