import React, { useState, useEffect } from 'react';
import ChartCard from '../../components/ChartCard';
import ActionModal from '../../components/ActionModal';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusSquare, Download, AlertCircle } from 'lucide-react';
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

const SupportTicketsTable = ({ tickets, loading, onResolve }) => {
  const getPriorityColor = (p) => p === 'high' ? 'var(--error)' : p === 'medium' ? 'var(--warning)' : 'var(--success)';
  const getStatusColor = (s) => s === 'open' ? 'var(--chart-blue)' : s === 'resolved' ? 'var(--success)' : 'var(--chart-orange)';

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tickets...</div>;
  if (!tickets || tickets.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No tickets found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>Issue</th>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>Requested By</th>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>Priority</th>
            <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 500 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.slice(0, 6).map((row, i) => (
            <tr key={row.id || i}>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 500 }}>{row.issue}</td>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{row.createdBy?.firstName || 'System'}</td>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span style={{ color: getStatusColor(row.status), fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{row.status}</span></td>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span style={{ color: getPriorityColor(row.priority), fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{row.priority}</span></td>
              <td style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                {row.status === 'open' && (
                  <button onClick={() => onResolve(row.id)} style={{ padding: '4px 8px', background: 'var(--success)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Resolve</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ITDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ issue: '', description: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolveTicket = async (id) => {
    try {
      await api.put(`/tickets/${id}`, { status: 'resolved' });
      fetchTickets();
    } catch (err) {
      console.error('Failed to resolve ticket');
    }
  };

  const handleRaiseTicket = async () => {
    setSubmitting(true);
    try {
      await api.post('/tickets', newTicket);
      setTicketModalOpen(false);
      setNewTicket({ issue: '', description: '', priority: 'medium' });
      fetchTickets();
    } catch (err) {
      console.error('Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const assetData = [
    { name: 'In Use', value: 70 },
    { name: 'In Repair', value: 10 },
    { name: 'Available', value: 20 },
  ];
  const COLORS = ['var(--chart-blue)', 'var(--warning)', 'var(--success)'];

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header" style={{ marginBottom: '0' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem' }}>Welcome IT Support 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's your support overview.</p>
      </div>

      <div className="dashboard-grid">
        <DevStatCard title="Open Tickets" value={loading ? '...' : openTicketsCount} link="#" />
        <DevStatCard title="Pending Requests" value="25" link="#" />
        <DevStatCard title="Resolved Tickets" value={loading ? '...' : resolvedCount} link="#" />
        <DevStatCard title="Assets Assigned Today" value="7" link="#" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <ChartCard title="Support Tickets">
          <SupportTicketsTable tickets={tickets} loading={loading} onResolve={handleResolveTicket} />
        </ChartCard>

        <ChartCard title="Asset Overview">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={assetData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {assetData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', marginTop: '10px' }}>
            {assetData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name} <span style={{ fontWeight: 'bold', marginLeft: 'auto', color: 'var(--text-main)' }}>{entry.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <ChartCard title="Quick Actions">
          <div style={{ display: 'flex', gap: '16px', padding: '16px 0', flexWrap: 'wrap' }}>
            <motion.button onClick={() => alert('Not implemented in this demo')} whileHover={{ y: -2 }} className="card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', flex: 1, justifyContent: 'center', color: 'var(--chart-blue)', fontWeight: 600 }}>
              <PlusSquare size={20} /> Add New Asset
            </motion.button>
            <motion.button onClick={() => alert('Not implemented in this demo')} whileHover={{ y: -2 }} className="card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', flex: 1, justifyContent: 'center', color: 'var(--chart-purple)', fontWeight: 600 }}>
              <Download size={20} /> Install Software
            </motion.button>
            <motion.button onClick={() => setTicketModalOpen(true)} whileHover={{ y: -2 }} className="card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', flex: 1, justifyContent: 'center', color: 'var(--chart-orange)', fontWeight: 600 }}>
              <AlertCircle size={20} /> Raise Ticket
            </motion.button>
          </div>
        </ChartCard>
        
        <ChartCard title="AI Insights">
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> 3 assets are in repair for more than 7 days.
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> 15 software licenses are unused.
            </li>
          </ul>
        </ChartCard>
      </div>

      <ActionModal 
        isOpen={isTicketModalOpen} 
        onClose={() => setTicketModalOpen(false)} 
        title="Raise Support Ticket"
        onSubmit={handleRaiseTicket}
        loading={submitting}
      >
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Issue Subject</label>
          <input 
            type="text" 
            required 
            value={newTicket.issue}
            onChange={(e) => setNewTicket({...newTicket, issue: e.target.value})}
            placeholder="e.g. Broken screen"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Priority</label>
          <select 
            value={newTicket.priority}
            onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Description</label>
          <textarea 
            required 
            rows={4}
            value={newTicket.description}
            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
            placeholder="Describe the problem..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', resize: 'none' }}
          />
        </div>
      </ActionModal>
    </div>
  );
};

export default ITDashboard;
