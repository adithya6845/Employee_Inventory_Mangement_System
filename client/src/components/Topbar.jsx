import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.email?.split('@')[0]?.replace(/\./g, ' ')?.replace(/\b\w/g, c => c.toUpperCase()) || 'Admin User';
  const role = user.role === 'admin' ? 'Administrator' : (user.role || 'User');
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header style={{
      height: '68px',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 20px -10px rgba(0,0,0,0.03)',
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <button
          onClick={toggleSidebar}
          style={{ 
            background: 'transparent', border: 'none', color: '#475569', 
            cursor: 'pointer', display: 'flex', padding: '6px', borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Menu size={20} />
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: '10px', padding: '8px 16px', width: '300px',
          transition: 'all 0.2s ease'
        }}
        onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
        onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search assets, employees..."
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: '#0f172a', fontSize: '0.84rem', width: '100%',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        <button style={{
          background: 'transparent', border: 'none', color: '#475569',
          cursor: 'pointer', position: 'relative', display: 'flex', padding: '6px',
          borderRadius: '8px', transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#4f46e5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 3, right: 3,
            width: 8, height: 8, background: 'linear-gradient(135deg, #ef4444, #f43f5e)', borderRadius: '50%',
            boxShadow: '0 0 6px rgba(239,68,68,0.5)'
          }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.84rem',
            boxShadow: '0 3px 10px rgba(79, 70, 229, 0.25)'
          }}>
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <p style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1 }}>{name}</p>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1 }}>{role}</p>
          </div>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
