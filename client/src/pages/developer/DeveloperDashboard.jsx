import React, { useState, useEffect } from 'react';
import ChartCard from '../../components/ChartCard';
import ActionModal from '../../components/ActionModal';
import { motion } from 'framer-motion';
import { PlusSquare } from 'lucide-react';
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

const SimpleTable = ({ headers, data, loading, link }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
    {loading ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div> : 
     data.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No records found.</div> :
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
      <thead>
        <tr>
          {headers.map(h => <th key={h} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', color: j === 0 ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: j === 0 ? 500 : 400 }}>
                {cell === 'assigned' || cell === 'active' || cell === 'approved' ? (
                  <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{cell}</span>
                ) : cell === 'pending' ? (
                  <span style={{ color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{cell}</span>
                ) : <span style={{ textTransform: j === row.length-1 ? 'capitalize' : 'none' }}>{cell}</span>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>}
  </div>
);

const DeveloperDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ type: 'Software', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [assetsRes, reqRes] = await Promise.all([
        api.get('/assets'),
        api.get('/requests')
      ]);
      setAssets(assetsRes.data.slice(0, 5)); // Just take first 5 for demo
      setRequests(reqRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestAsset = async () => {
    setSubmitting(true);
    try {
      await api.post('/requests', newRequest);
      setRequestModalOpen(false);
      setNewRequest({ type: 'Software', description: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const assetRows = assets.map(a => [a.name, a.category, new Date(a.purchaseDate).toLocaleDateString(), a.status]);
  const reqRows = requests.map(r => [r.type, r.description.substring(0, 20) + '...', r.status]);
  const softwareRows = [['VS Code', 'active'], ['Postman', 'active'], ['Figma', 'active'], ['Docker Desktop', 'active']];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header" style={{ marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.8rem' }}>Welcome Developer 👋</h1>
          <p style={{ color: 'var(--text-muted)' }}>Access your tools, assets and resources.</p>
        </div>
        <button onClick={() => setRequestModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusSquare size={20} /> Request Asset
        </button>
      </div>

      <div className="dashboard-grid">
        <DevStatCard title="My Assets" value={loading ? "..." : assets.length} link="#" />
        <DevStatCard title="Active Software" value="4" link="#" />
        <DevStatCard title="Pending Requests" value={loading ? "..." : requests.filter(r => r.status === 'pending').length} link="#" />
        <DevStatCard title="Tickets Raised" value="3" link="#" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
        <ChartCard title="My Assets">
          <SimpleTable 
            headers={['Asset Name', 'Type', 'Assigned On', 'Status']}
            data={assetRows}
            loading={loading}
            link="#"
          />
        </ChartCard>

        <ChartCard title="My Software">
          <SimpleTable 
            headers={['Software', 'Status']}
            data={softwareRows}
            loading={false}
            link="#"
          />
        </ChartCard>

        <ChartCard title="My Requests">
          <SimpleTable 
            headers={['Type', 'Description', 'Status']}
            data={reqRows}
            loading={loading}
            link="#"
          />
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <ChartCard title="Development Resources">
          <div style={{ display: 'flex', gap: '32px', padding: '24px 0', flexWrap: 'wrap' }}>
            {['github', 'gitlab', 'jira', 'confluence', 'docker'].map(icon => (
              <div key={icon} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`} alt={icon} width="32" height="32" onError={(e) => e.target.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{icon}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        
        <ChartCard title="AI Suggestions">
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> Your system has 2 outdated software.
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> Consider updating Docker Desktop.
            </li>
          </ul>
        </ChartCard>
      </div>

      <ActionModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setRequestModalOpen(false)} 
        title="Submit Request"
        onSubmit={handleRequestAsset}
        loading={submitting}
      >
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Request Type</label>
          <select 
            value={newRequest.type}
            onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            <option value="Software">Software</option>
            <option value="Asset">Hardware/Asset</option>
            <option value="Access">Access</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>Description</label>
          <textarea 
            required 
            rows={4}
            value={newRequest.description}
            onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
            placeholder="What do you need?"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', resize: 'none' }}
          />
        </div>
      </ActionModal>
    </div>
  );
};

export default DeveloperDashboard;
