import React from 'react';
import ChartCard from '../../components/ChartCard';
import { motion } from 'framer-motion';

const DevStatCard = ({ title, value, link }) => (
  <motion.div whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</h3>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1 }}>{value}</h2>
      <a href={link} style={{ color: 'var(--chart-teal)', fontSize: '0.8rem', fontWeight: 600 }}>View all</a>
    </div>
  </motion.div>
);

const SimpleTable = ({ headers, data, link }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                {cell === 'Assigned' || cell === 'Approved' ? (
                  <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>{cell}</span>
                ) : cell === 'Pending' ? (
                  <span style={{ color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 600 }}>{cell}</span>
                ) : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '16px' }}>
      <a href={link} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>View All</a>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header" style={{ marginBottom: '0' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem' }}>Welcome Employee 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>View assigned assets, raise requests & updates.</p>
      </div>

      <div className="dashboard-grid">
        <DevStatCard title="My Assets" value="3" link="#" />
        <DevStatCard title="My Requests" value="1" link="#" />
        <DevStatCard title="Leave Balance" value="14" link="#" />
        <DevStatCard title="Notifications" value="5" link="#" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ChartCard title="My Assets">
          <SimpleTable 
            headers={['Asset Name', 'Category', 'Assigned On', 'Status']}
            data={[
              ['MacBook Air M2', 'Laptop', '15 Jan 2024', 'Assigned'],
              ['Dell 24" Monitor', 'Monitor', '15 Jan 2024', 'Assigned'],
              ['Wireless Mouse', 'Accessories', '20 Jan 2024', 'Assigned'],
            ]}
            link="#"
          />
        </ChartCard>

        <ChartCard title="My Requests & Leaves">
          <SimpleTable 
            headers={['Request Type', 'Details', 'Date', 'Status']}
            data={[
              ['Software License', 'Adobe Creative Cloud', '10 May 2024', 'Pending'],
              ['Leave Request', 'Sick Leave (2 days)', '05 May 2024', 'Approved'],
            ]}
            link="#"
          />
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <ChartCard title="My Profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600 }}>
              E
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Employee User</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Marketing Department | Employee ID: EMP-1042</p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}><strong>Email:</strong> employee@eims.com</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}><strong>Phone:</strong> +1 234 567 8900</span>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="AI Assistant">
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> You have an unused Adobe license. Do you want to return it?
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> Your pending software request should be approved by tomorrow.
            </li>
          </ul>
          <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '20px' }}>
            <a href="#" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>Chat with AI</a>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
