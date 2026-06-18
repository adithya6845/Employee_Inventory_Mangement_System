import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const sidebarWidth = isSidebarOpen ? 240 : 0;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        overflow: 'hidden',
      }}>
        <Topbar toggleSidebar={toggleSidebar} />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          background: '#f8fafc',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
