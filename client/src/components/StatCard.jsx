import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, trendValue, colorClass }) => {
  return (
    <motion.div 
      className="card stat-card"
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</h3>
        <div className={`icon-container ${colorClass}`} style={{ 
            padding: '10px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: `var(--${colorClass}-bg, rgba(0,0,0,0.05))`
        }}>
          {icon}
        </div>
      </div>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>{value}</h2>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <span style={{ 
              color: trend === 'up' ? 'var(--success)' : 'var(--error)', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center'
            }}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
