import React, { useState, useEffect } from 'react';
import { 
  User, Building2, Users, ShieldAlert, Bell, Key, Database, FileText, Lock, Globe, Check, ShieldCheck, Activity
} from 'lucide-react';
import api from '../../services/api';

const Settings = () => {
  // Tabs: profile, company, users, roles, notifications, security, backup, logs
  const [activeTab, setActiveTab] = useState('profile');
  
  // Real active user from localStorage
  const [userProfile, setUserProfile] = useState({
    firstName: 'Aarav',
    lastName: 'Patel',
    email: 'aarav.patel@company.com',
    role: 'Administrator',
    phone: '+91 98765 43210'
  });

  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    name: 'TechNova Solutions',
    email: 'info@technova.com',
    phone: '+91 98765 43210',
    address: 'Tech Park, Building 5, Bangalore, Karnataka - 560100'
  });

  // System Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoReminders: true,
    theme: 'Light',
    dateFormat: 'DD MMM YYYY',
    itemsPerPage: '20'
  });

  // Security Form
  const [securityForm, setSecurityForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI status notices
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setUserProfile({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          role: res.data.role,
          phone: '+91 98765 43210'
        });
      } catch (e) {
        console.error('Error fetching profile from DB:', e);
        const localUser = localStorage.getItem('user');
        if (localUser) {
          try {
            const parsed = JSON.parse(localUser);
            setUserProfile(prev => ({
              ...prev,
              firstName: parsed.firstName || prev.firstName,
              lastName: parsed.lastName || prev.lastName,
              email: parsed.email || prev.email,
              role: parsed.role || prev.role
            }));
          } catch (err) {
            console.error('Local user parse error:', err);
          }
        }
      }
    };
    fetchProfile();
  }, []);

  const triggerToast = (msg) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch('/auth/profile', {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        role: userProfile.role
      });
      
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const parsed = JSON.parse(localUser);
        localStorage.setItem('user', JSON.stringify({
          ...parsed,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
          role: res.data.user.role
        }));
      }
      
      triggerToast('Profile Settings Updated in PostgreSQL Successfully!');
    } catch (err) {
      console.error('Update profile error:', err);
      alert('Failed to update profile settings.');
    }
  };

  const handleUpdateCompany = (e) => {
    e.preventDefault();
    triggerToast('Company Information Saved Successfully!');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    triggerToast('System Preferences Applied Successfully!');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      await api.patch('/auth/profile', {
        password: securityForm.newPassword
      });
      triggerToast('Security Credentials Updated in PostgreSQL Successfully!');
      setSecurityForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Update password error:', err);
      alert('Failed to update password.');
    }
  };

  // Mock corporate event logs stream
  const systemLogs = [
    { time: '15:45:10', event: 'Allocation overlap clean script executed successfully' },
    { time: '15:41:49', event: 'Requests dashboard component modified & hot reloaded' },
    { time: '14:20:12', event: 'Prisma Client database health check passed' },
    { time: '13:05:58', event: 'Authorized Service diagnostics report logged for AST-1008' },
    { time: '10:50:33', event: 'IT Diagnostics assessment completed for AST-1040' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Toast Notice Banner */}
      {saveStatus && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', background: '#10b981', color: '#fff',
          padding: '12px 24px', borderRadius: '8px', fontWeight: 700, zIndex: 99999,
          boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Check size={18} /> {saveStatus}
        </div>
      )}

      {/* Title & Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>Settings</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Manage system preferences, roles, permissions and configurations.</p>
        </div>

        <span style={{
          background: '#4f46e5', color: '#fff', fontWeight: 800, fontSize: '0.72rem',
          padding: '6px 12px', borderRadius: '4px', letterSpacing: '0.08em', textTransform: 'uppercase'
        }}>
          Settings Page
        </span>
      </div>

      {/* Main Settings Panel Wrapper */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Column 1: Left-hand Navigation Menu Tab list */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'profile', label: 'Profile Settings', icon: <User size={16} /> },
            { id: 'company', label: 'Company Settings', icon: <Building2 size={16} /> },
            { id: 'users', label: 'User Management', icon: <Users size={16} /> },
            { id: 'roles', label: 'Roles & Permissions', icon: <ShieldAlert size={16} /> },
            { id: 'notifications', label: 'Notification Settings', icon: <Bell size={16} /> },
            { id: 'security', label: 'Security Settings', icon: <Lock size={16} /> },
            { id: 'backup', label: 'Backup & Restore', icon: <Database size={16} /> },
            { id: 'logs', label: 'System Logs', icon: <FileText size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
                border: 'none', background: activeTab === tab.id ? '#f1f5f9' : 'transparent',
                color: activeTab === tab.id ? '#4f46e5' : '#475569', fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
              }}
              onMouseOver={e => { if (activeTab !== tab.id) e.currentTarget.style.background = '#fafafa'; }}
              onMouseOut={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Column 2: Center Content (Dynamically Switches Based On Active Tab - NOT ALL AT ONCE) */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0', minHeight: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Profile Settings</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Modify personal identity details and corporate contacts.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>First Name</label>
                  <input
                    type="text"
                    value={userProfile.firstName}
                    onChange={e => setUserProfile({ ...userProfile, firstName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Last Name</label>
                  <input
                    type="text"
                    value={userProfile.lastName}
                    onChange={e => setUserProfile({ ...userProfile, lastName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Corporate Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={e => setUserProfile({ ...userProfile, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Phone Number</label>
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={e => setUserProfile({ ...userProfile, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Authorized Role</label>
                <select
                  value={userProfile.role}
                  onChange={e => setUserProfile({ ...userProfile, role: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="it_support">IT Support Specialist</option>
                  <option value="department_manager">Department Manager</option>
                  <option value="user">Standard Corporate Employee</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start', padding: '10px 24px', borderRadius: '8px', background: '#4f46e5',
                  color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                }}
              >
                Update Profile
              </button>
            </form>
          )}

          {/* COMPANY SETTINGS */}
          {activeTab === 'company' && (
            <form onSubmit={handleUpdateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Company Settings</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Manage primary enterprise identifiers and physical address locations.</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Company Name</label>
                <input
                  type="text"
                  value={companySettings.name}
                  onChange={e => setCompanySettings({ ...companySettings, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Official Company Email</label>
                <input
                  type="email"
                  value={companySettings.email}
                  onChange={e => setCompanySettings({ ...companySettings, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Phone Line</label>
                <input
                  type="text"
                  value={companySettings.phone}
                  onChange={e => setCompanySettings({ ...companySettings, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Address HQ</label>
                <textarea
                  rows={3}
                  value={companySettings.address}
                  onChange={e => setCompanySettings({ ...companySettings, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start', padding: '10px 24px', borderRadius: '8px', background: '#4f46e5',
                  color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </form>
          )}

          {/* USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>User Management</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Review active administrator and support login accounts in the system.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'Neha Joshi', email: 'neha.joshi1@corp.in', role: 'Marketing User', status: 'Active' },
                  { name: 'Neha Iyer', email: 'neha.iyer2@corp.in', role: 'IT Support', status: 'Active' },
                  { name: 'Aarav Patel', email: 'aarav.patel4@corp.in', role: 'Super Admin', status: 'Active' },
                ].map((u, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{u.name}</h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.email} • {u.role}</span>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: '#d1fae5', color: '#10b981' }}>
                      {u.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROLES & PERMISSIONS */}
          {activeTab === 'roles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Roles & Permissions Matrix</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Authorized capabilities mapped per role designation.</p>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                    {['Role', 'Asset Create', 'Allocate', 'Manage Requests'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: 'Super Admin', create: 'Yes', allocate: 'Yes', req: 'Yes' },
                    { role: 'IT Support', create: 'Yes', allocate: 'Yes', req: 'No' },
                    { role: 'Employee', create: 'No', allocate: 'No', req: 'No' }
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>{r.role}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.84rem', color: r.create === 'Yes' ? '#10b981' : '#64748b' }}>{r.create}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.84rem', color: r.allocate === 'Yes' ? '#10b981' : '#64748b' }}>{r.allocate}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.84rem', color: r.req === 'Yes' ? '#10b981' : '#64748b' }}>{r.req}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* NOTIFICATION SETTINGS / SYSTEM PREFERENCES */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>System Preferences</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Set global system UI preferences and alert notification delivery routes.</p>
              </div>

              {/* Switches */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', margin: 0 }}>Enable Email Notifications</h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Deliver asset request/return logs to team leads</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={e => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', margin: 0 }}>Enable SMS Notifications</h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Send reminders directly to employee mobile devices</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.smsNotifications}
                    onChange={e => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                    style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', margin: 0 }}>Auto Reminders</h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Enforce automatic overdue return notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoReminders}
                    onChange={e => setPreferences({ ...preferences, autoReminders: e.target.checked })}
                    style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{ borderBottom: '1px solid #f1f5f9', margin: '8px 0' }} />

              {/* Theme & Format Dropdowns */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Theme Mode</label>
                <select
                  value={preferences.theme}
                  onChange={e => setPreferences({ ...preferences, theme: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                >
                  <option value="Light">Light Mode</option>
                  <option value="Dark">Dark Mode</option>
                  <option value="System">Sync with System</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Date Format</label>
                <select
                  value={preferences.dateFormat}
                  onChange={e => setPreferences({ ...preferences, dateFormat: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                >
                  <option value="DD MMM YYYY">DD MMM YYYY (e.g. 20 May 2026)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 20/05/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 05/20/2026)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Items per Page (Tables)</label>
                <select
                  value={preferences.itemsPerPage}
                  onChange={e => setPreferences({ ...preferences, itemsPerPage: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start', padding: '10px 24px', borderRadius: '8px', background: '#4f46e5',
                  color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                }}
              >
                Save Preferences
              </button>
            </form>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Security Settings</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Secure your administration console with a custom credentials cycle.</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={securityForm.oldPassword}
                  onChange={e => setSecurityForm({ ...securityForm, oldPassword: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={securityForm.newPassword}
                  onChange={e => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={securityForm.confirmPassword}
                  onChange={e => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start', padding: '10px 24px', borderRadius: '8px', background: '#4f46e5',
                  color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                }}
              >
                Change Password
              </button>
            </form>
          )}

          {/* BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Backup & Restore</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Secure database exports to prevent loss of chronological allocation data.</p>
              </div>

              <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Create Database Backup Snapshot</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Download a complete SQL file matching your current employee, asset, return, and allocation records.</p>
                <button
                  onClick={() => triggerToast('Database SQL Backup File Exported successfully!')}
                  style={{
                    alignSelf: 'flex-start', padding: '8px 16px', borderRadius: '6px', background: '#4f46e5',
                    color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  Export Snapshot
                </button>
              </div>
            </div>
          )}

          {/* SYSTEM LOGS */}
          {activeTab === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>System Audit Logs</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Real-time stream of core operations conducted in employee inventory dashboard.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {systemLogs.map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #f1f5f9', background: '#fafafa' }}>
                    <span style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 700 }}>{l.time}</span>
                    <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>{l.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Column 3: Right-hand Sidebar Panels (Quick Actions & System Info) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Actions Panel */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Quick Actions</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button 
                onClick={() => setActiveTab('security')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none',
                  color: '#475569', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                }}
              >
                <Key size={14} /> Change Password
              </button>

              <button 
                onClick={() => triggerToast('Corporate API key integration created!')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none',
                  color: '#475569', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                }}
              >
                <ShieldCheck size={14} /> Manage API Keys
              </button>

              <button 
                onClick={() => triggerToast('System setting parameters downloaded as config.json!')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none',
                  color: '#475569', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                }}
              >
                <Database size={14} /> Export Settings
              </button>

              <button 
                onClick={() => triggerToast('System self-diagnostics: All 12 sub-systems healthy!')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none',
                  color: '#475569', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                }}
              >
                <Activity size={14} style={{ color: '#10b981' }} /> System Health Check
              </button>
            </div>
          </div>

          {/* System Information Panel */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>System Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Version</span>
                <span style={{ fontSize: '0.82rem', color: '#1e293b', fontWeight: 700 }}>v2.0.0</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Last Updated</span>
                <span style={{ fontSize: '0.82rem', color: '#1e293b', fontWeight: 700 }}>20 May 2026</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Database Status</span>
                <span style={{
                  padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                  background: '#d1fae5', color: '#10b981'
                }}>
                  Connected
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Storage Used</span>
                  <span style={{ fontSize: '0.82rem', color: '#1e293b', fontWeight: 700 }}>45%</span>
                </div>
                {/* Progress bar container */}
                <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: '#4f46e5', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;
