import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({ title, children, style }) => {
  return (
    <motion.div 
      className="card chart-card"
      whileHover={{ y: -2, boxShadow: "0 6px 24px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px', ...style }}
    >
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{title}</h3>
      <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
