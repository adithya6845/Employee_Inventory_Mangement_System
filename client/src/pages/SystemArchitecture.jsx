import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Globe, Cpu, Bell, Cloud, ArrowRight } from 'lucide-react';

const SystemArchitecture = () => {
  const nodes = [
    { id: 'client', title: 'Frontend', icon: <Globe size={32} color="var(--primary)" />, desc: 'React, HTML, CSS, JS', x: 20, y: 50 },
    { id: 'api', title: 'Backend', icon: <Server size={32} color="var(--chart-purple)" />, desc: 'Node.js, Express', x: 50, y: 50 },
    { id: 'db', title: 'Database', icon: <Database size={32} color="var(--chart-teal)" />, desc: 'MySQL / PostgreSQL', x: 80, y: 50 },
    
    { id: 'ai', title: 'AI/ML Service', icon: <Cpu size={32} color="var(--chart-orange)" />, desc: 'Python, ML Models', x: 50, y: 200 },
    
    { id: 'notify', title: 'Notifications & Alerts', icon: <Bell size={32} color="var(--warning)" />, desc: 'Email, In-App, Slack, SMS', x: 30, y: 350 },
    { id: 'deploy', title: 'Deployment', icon: <Cloud size={32} color="var(--success)" />, desc: 'AWS / Azure, SSL, Backups', x: 70, y: 350 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <h1 className="page-title">System Architecture</h1>
        <p style={{ color: 'var(--text-muted)' }}>Flowchart mapping based on EIMS architecture documentation.</p>
      </div>

      <div className="card" style={{ padding: '40px', minHeight: '600px', position: 'relative', overflow: 'hidden', background: 'var(--bg-main)' }}>
        
        {/* Drawing Connections */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          {/* Frontend <-> Backend */}
          <path d="M 30% 100 L 40% 100" stroke="var(--border-color)" strokeWidth="3" strokeDasharray="5,5" fill="none" />
          {/* Backend <-> Database */}
          <path d="M 60% 100 L 70% 100" stroke="var(--border-color)" strokeWidth="3" strokeDasharray="5,5" fill="none" />
          {/* Backend <-> AI Engine */}
          <path d="M 50% 140 L 50% 200" stroke="var(--border-color)" strokeWidth="3" strokeDasharray="5,5" fill="none" />
        </svg>

        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}px`,
              transform: 'translateX(-50%)',
              background: 'var(--card-bg)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              width: '260px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 1
            }}
          >
            <div style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '50%', marginBottom: '16px' }}>
              {node.icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>{node.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{node.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SystemArchitecture;
