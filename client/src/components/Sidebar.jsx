import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, Tags, Database, RotateCcw, AlertTriangle, Users, BarChart2, History, ClipboardList, Bell, Settings, Box, Sparkles } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard',     icon: <LayoutDashboard size={18} />, path: '/admin' },
    { name: 'AI Inventory',  icon: <Sparkles size={18} />,        path: '/ai-inventory' },
    { name: 'Assets',        icon: <Package size={18} />,         path: '/inventory' },
    { name: 'Categories',    icon: <Tags size={18} />,            path: '/categories' },
    { name: 'Allocation',    icon: <Database size={18} />,        path: '/allocations' },
    { name: 'Returns',       icon: <RotateCcw size={18} />,       path: '/returns' },
    { name: 'Damage Reports',icon: <AlertTriangle size={18} />,   path: '/damages' },
    { name: 'Employees',     icon: <Users size={18} />,           path: '/employees' },
    { name: 'Reports',       icon: <BarChart2 size={18} />,       path: '/reports' },
    { name: 'History',       icon: <History size={18} />,         path: '/history' },
    { name: 'Request',       icon: <ClipboardList size={18} />,   path: '/requests', badge: 'New' },
    { name: 'Reminders',     icon: <Bell size={18} />,            path: '/notifications' },
    { name: 'Settings',      icon: <Settings size={18} />,        path: '/settings' },
  ];

  return (
    <div style={{
      width: isOpen ? '240px' : '0',
      background: 'linear-gradient(180deg, #0b1329 0%, #0f172a 100%)',
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: 50,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
    }}>
      {/* Logo Section */}
      <div style={{
        height: '68px', display: 'flex', alignItems: 'center', gap: '12px',
        padding: '0 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', flexShrink: 0
      }}>
        <div style={{
          width: 32, height: 32, background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)'
        }}>
          <Box size={16} color="white" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 800, fontSize: '0.92rem', whiteSpace: 'nowrap', color: '#f8fafc', letterSpacing: '-0.01em' }}>
            Inventory System
          </span>
          <span style={{ fontSize: '0.62rem', color: '#6366f1', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Corporate Portal
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{ 
        flex: 1, 
        padding: '16px 12px', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px',
        scrollbarWidth: 'none'
      }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          
          // Special styling for AI Inventory menu icon
          const isAIItem = item.name === 'AI Inventory';

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '12px',
                color: isActive ? '#ffffff' : '#94a3b8',
                background: isActive 
                  ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' 
                  : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84rem', textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 14px -3px rgba(79, 70, 229, 0.4)' : 'none',
                border: isActive ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              }}
              onMouseEnter={e => { 
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#f8fafc';
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.03)';
                }
              }}
              onMouseLeave={e => { 
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              {/* Highlight active or AI special sparkle icon color */}
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: isActive 
                  ? '#ffffff' 
                  : (isAIItem ? '#818cf8' : '#94a3b8'),
                transition: 'color 0.25s ease'
              }}>
                {item.icon}
              </span>
              
              <span style={{ flex: 1 }}>{item.name}</span>
              
              {item.badge && (
                <span style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)', 
                  color: '#ffffff', 
                  fontSize: '0.62rem',
                  padding: '2px 7px', 
                  borderRadius: '6px', 
                  fontWeight: 800,
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Row */}
      <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.04)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 14px', borderRadius: '12px', background: 'transparent',
            color: '#94a3b8', fontSize: '0.84rem', fontWeight: 500,
            transition: 'all 0.2s ease', border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; 
            e.currentTarget.style.color = '#f87171'; 
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.background = 'transparent'; 
            e.currentTarget.style.color = '#94a3b8'; 
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}><LogOut size={18} /></span>
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
