import React from 'react';
import ChartCard from '../../components/ChartCard';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const DevStatCard = ({ title, value, link, highlight }) => (
  <motion.div whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</h3>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: highlight ? 'var(--success)' : 'var(--text-main)', lineHeight: 1 }}>{value}</h2>
      <a href={link} style={{ color: 'var(--chart-teal)', fontSize: '0.8rem', fontWeight: 600 }}>View all</a>
    </div>
  </motion.div>
);

const AlertsList = () => {
  const alerts = [
    { event: 'Unauthorized login attempt', time: '2 min ago', severity: 'High' },
    { event: 'Malware detected in system', time: '15 min ago', severity: 'High' },
    { event: 'Unusual data access', time: '1 hr ago', severity: 'Medium' },
    { event: 'Firewall rule modified', time: '3 hrs ago', severity: 'Medium' },
    { event: 'New device connected', time: '5 hrs ago', severity: 'Low' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {alerts.map((alert, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: alert.severity === 'High' ? 'var(--error)' : alert.severity === 'Medium' ? 'var(--warning)' : 'var(--chart-blue)' }}>●</span>
            <div>
              <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>{alert.event}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{alert.time}</div>
            </div>
          </div>
          <span style={{ color: alert.severity === 'High' ? 'var(--error)' : alert.severity === 'Medium' ? 'var(--warning)' : 'var(--chart-blue)', fontSize: '0.8rem', fontWeight: 600 }}>{alert.severity}</span>
        </div>
      ))}
      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '16px' }}>
        <a href="#" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>View All Alerts</a>
      </div>
    </div>
  );
};

const CyberDashboard = () => {
  const threatData = [
    { name: 'High', value: 40 },
    { name: 'Medium', value: 35 },
    { name: 'Low', value: 25 },
  ];
  const COLORS = ['var(--error)', 'var(--warning)', 'var(--chart-blue)'];

  const vulnData = [
    { name: 'High', count: 6 },
    { name: 'Medium', count: 7 },
    { name: 'Low', count: 5 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header" style={{ marginBottom: '0' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem' }}>Welcome Cyber Security 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor and secure your organization.</p>
      </div>

      <div className="dashboard-grid">
        <DevStatCard title="Security Alerts" value="24" link="#" />
        <DevStatCard title="High Risk Assets" value="12" link="#" />
        <DevStatCard title="Vulnerabilities" value="18" link="#" />
        <DevStatCard title="Compliance Score" value="92%" link="#" highlight={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
        <ChartCard title="Security Alerts">
          <AlertsList />
        </ChartCard>

        <ChartCard title="Threat Overview">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={threatData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {threatData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '1.5rem', fontWeight: 700, fill: 'var(--text-main)' }}>24</text>
              <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '0.8rem', fill: 'var(--text-muted)' }}>Alerts</text>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', marginTop: '10px' }}>
            {threatData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name} <span style={{ fontWeight: 'bold', marginLeft: 'auto', color: 'var(--text-main)' }}>{entry.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ChartCard title="Vulnerability Summary">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vulnData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'var(--bg-main)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {vulnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Security Recommendations (AI)">
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> Update 6 outdated software.
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> Enable multi-factor authentication for all.
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--chart-purple)', marginTop: '2px' }}>✧</span> 3 accounts have weak passwords.
            </li>
          </ul>
          <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '20px' }}>
            <a href="#" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>View All Recommendations</a>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default CyberDashboard;
