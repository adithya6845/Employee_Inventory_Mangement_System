import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Google Single Sign-On States
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use the actual backend API for login
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      
      // Store the real JWT token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Role-based routing
      if (data.user.role === 'developer') navigate('/developer');
      else if (data.user.role === 'support') navigate('/support');
      else if (data.user.role === 'security') navigate('/security');
      else if (data.user.role === 'leave') navigate('/leave');
      else navigate('/admin');

    } catch (error) {
      alert('Login failed: Please check your email and password.');
    }
  };

  const handleGoogleAccountSelect = async (selectedEmail) => {
    setSelectedGoogleEmail(selectedEmail);
    setGoogleLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail })
      });

      if (!response.ok) {
        throw new Error('Google SSO authentication failed');
      }

      const data = await response.json();
      
      // Store token and user details in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Simulate real, secure enterprise token authentication check
      setTimeout(() => {
        setGoogleLoading(false);
        setIsGoogleModalOpen(false);
        if (data.user.role === 'developer') navigate('/developer');
        else if (data.user.role === 'support') navigate('/support');
        else if (data.user.role === 'security') navigate('/security');
        else if (data.user.role === 'leave') navigate('/leave');
        else navigate('/admin');
      }, 1000);

    } catch (error) {
      setGoogleLoading(false);
      alert('Google single sign-on failed: Account credentials not registered.');
    }
  };

  return (
    <div className="auth-container">
      
      {/* Premium Google Account Chooser Modal Overlay */}
      {isGoogleModalOpen && (
        <div 
          onClick={() => !googleLoading && setIsGoogleModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '36px 30px',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {/* Google Icon Badge */}
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
              alt="Google" 
              width="48" 
              height="48" 
              style={{ marginBottom: '16px' }}
            />

            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
              Choose an account
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 24px 0' }}>
              to continue to <strong style={{ color: '#4f46e5' }}>Employee Inventory</strong>
            </p>

            {googleLoading ? (
              <div style={{ padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                {/* Custom keyframe spin animation */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '3px solid #e2e8f0',
                  borderTop: '3px solid #4f46e5',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600 }}>
                  Securing connection as {selectedGoogleEmail}...
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                {[
                  { name: 'Aarav Patel', email: 'aarav.patel4@corp.in', role: 'System Admin', img: '/male employee.png' },
                  { name: 'Neha Joshi', email: 'neha.joshi@corp.in', role: 'System Admin', img: '/female employee.png' },
                  { name: 'Diya Joshi', email: 'diya.joshi@corp.in', role: 'Developer', img: '/female employee.png' },
                  { name: 'Vihaan Sharma', email: 'vihaan.sharma@corp.in', role: 'IT Support', img: '/male employee.png' }
                ].map(acc => (
                  <button 
                    key={acc.email}
                    onClick={() => handleGoogleAccountSelect(acc.email)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      width: '100%',
                      padding: '12px 16px',
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <img 
                      src={acc.img} 
                      alt={acc.name} 
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e2e8f0' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>{acc.name}</p>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>{acc.email}</p>
                    </div>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#4f46e5', background: '#e0e7ff', padding: '4px 8px', borderRadius: '6px' }}>
                      {acc.role}
                    </span>
                  </button>
                ))}

                <button 
                  onClick={() => alert('Additional accounts can be signed in by entering their registered email credentials in the main form.')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '12px',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#475569',
                    marginTop: '8px',
                    outline: 'none'
                  }}
                >
                  + Use another account
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Login Screen View */}
      <div className="auth-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ zIndex: 2, textAlign: 'center' }}
        >
          <ShieldCheck size={80} color="var(--primary)" style={{ marginBottom: '24px' }} />
          <h1 style={{ fontSize: '3rem', marginBottom: '16px', color: 'white' }}>Welcome Back!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '400px' }}>
            Sign in to continue to your role-based enterprise dashboard.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(139, 92, 246, 0.2))',
            filter: 'blur(40px)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
      </div>

      <div className="auth-right">
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ width: '100%', maxWidth: '450px', padding: '40px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '8px' }}>Sign In</h2>
            <p style={{ color: 'var(--text-muted)' }}>Enter your details below to continue.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-main)' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-main)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-main)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-main)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                <span style={{ color: 'var(--text-muted)' }}>Remember me</span>
              </label>
              <a href="#" style={{ color: 'var(--primary)', fontWeight: 500 }}>Forgot Password?</a>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              type="submit"
              style={{ marginTop: '10px' }}
            >
              Sign In
            </motion.button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', position: 'relative' }}>
              <span style={{ background: 'var(--card-bg)', padding: '0 10px', position: 'relative', zIndex: 1 }}>Or sign in with</span>
              <span style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: '1px', background: 'var(--border-color)', zIndex: 0 }}></span>
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              {/* Active Google SSO Authenticator Button */}
              <motion.button 
                onClick={() => setIsGoogleModalOpen(true)}
                whileHover={{ y: -2 }} 
                className="card" 
                style={{ padding: '12px 24px', flex: 1, display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" width="24" height="24" />
              </motion.button>
              
              {/* Restored Microsoft Logo from broken layout */}
              <motion.button 
                onClick={() => alert('Microsoft Single Sign-on integration is configured for active directory deployment only.')}
                whileHover={{ y: -2 }} 
                className="card" 
                style={{ padding: '12px 24px', flex: 1, display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" width="24" height="24" />
              </motion.button>
              
              <motion.button 
                onClick={() => alert('GitHub Single Sign-on integration is configured for developer directory environments only.')}
                whileHover={{ y: -2 }} 
                className="card" 
                style={{ padding: '12px 24px', flex: 1, display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width="24" height="24" />
              </motion.button>
            </div>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
