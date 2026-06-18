import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AIInventory from './pages/AIInventory';
import Inventory from './pages/Inventory';
import Allocations from './pages/Allocations';
import Returns from './pages/Returns';
import Damages from './pages/Damages';
import AssetHistory from './pages/AssetHistory';
import Employees from './pages/admin/Employees';
import Reports from './pages/admin/Reports';
import Categories from './pages/admin/Categories';
import Requests from './pages/admin/Requests';
import Reminders from './pages/admin/Reminders';
import Settings from './pages/admin/Settings';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  if (!token || !userStr) return <Navigate to="/login" replace />;
  try {
    JSON.parse(userStr);
    return children;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

const ComingSoon = ({ title }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '60vh', gap: '12px'
  }}>
    <div style={{ width: 64, height: 64, background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '1.8rem' }}>🚧</span>
    </div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{title}</h2>
    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>This module is coming soon.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/ai-inventory" element={<ProtectedRoute><AIInventory /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/allocations" element={<ProtectedRoute><Allocations /></ProtectedRoute>} />
          <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
          <Route path="/damages" element={<ProtectedRoute><Damages /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><AssetHistory /></ProtectedRoute>} />
          <Route path="/history/:assetId" element={<ProtectedRoute><AssetHistory /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
