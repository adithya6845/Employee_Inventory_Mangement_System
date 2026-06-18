import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Layers, Users, Zap, Search, Server } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg-sidebar)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontWeight: 700, fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>
          <ShieldCheck size={32} color="var(--primary)" />
          <span>EIMS</span>
        </div>
        <nav style={{ display: 'flex', gap: '32px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='rgba(255,255,255,0.8)'}>Home</a>
          <a href="#features" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='rgba(255,255,255,0.8)'}>Features</a>
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='rgba(255,255,255,0.8)'}>Departments</a>
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='rgba(255,255,255,0.8)'}>Contact</a>
        </nav>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: 'white', fontWeight: 600, padding: '10px 24px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background='rgba(255,255,255,0.1)'} onMouseOut={e => e.target.style.background='transparent'}>Login</button>
          <button onClick={() => navigate('/login')} className="btn-primary">Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'var(--bg-sidebar)', padding: '80px 40px 120px', display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '600px' }}
          >
            <h1 style={{ fontSize: '3.5rem', color: 'white', lineHeight: 1.2, marginBottom: '24px' }}>Smart Employee &<br/>Inventory Management<br/>for Modern Teams</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginBottom: '40px', lineHeight: 1.6 }}>Manage employees, assets, software, and requests across departments with full visibility and AI insights.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Get Started</button>
              <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '1.1rem', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background='rgba(255,255,255,0.2)'} onMouseOut={e => e.target.style.background='rgba(255,255,255,0.1)'}>Learn More</button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ position: 'relative' }}
          >
            {/* Abstract 3D Illustration Placeholder */}
            <div style={{ width: '500px', height: '400px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(139, 92, 246, 0.4))', borderRadius: '24px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Server size={100} color="rgba(255,255,255,0.5)" />
            </div>
          </motion.div>
        </div>
        
        {/* Curved Bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '80px' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C50.19,116.5,108.18,124.64,166.4,124,218.4,123.47,270.6,108.28,321.39,56.44Z" fill="var(--bg-main)"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', color: 'var(--text-main)' }}>Why EIMS?</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', maxWidth: '1200px', width: '100%' }}>
          <motion.div whileHover={{ y: -10 }} className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Layers size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Centralized Management</h3>
            <p style={{ color: 'var(--text-muted)' }}>Manage employees, assets and software in one place.</p>
          </motion.div>
          
          <motion.div whileHover={{ y: -10 }} className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Users size={32} color="var(--chart-purple)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Role Based Access</h3>
            <p style={{ color: 'var(--text-muted)' }}>Secure & custom access for every department.</p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(20, 184, 166, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Zap size={32} color="var(--chart-teal)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>AI Powered Insights</h3>
            <p style={{ color: 'var(--text-muted)' }}>Get smart recommendations and predictive alerts.</p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Search size={32} color="var(--chart-orange)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Real-time Tracking</h3>
            <p style={{ color: 'var(--text-muted)' }}>Track assets and requests in real-time.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
