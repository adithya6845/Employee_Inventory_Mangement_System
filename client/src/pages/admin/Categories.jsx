import React, { useState, useEffect } from 'react';
import { 
  Tags, Sparkles, Box, CheckCircle, TrendingUp, AlertTriangle, 
  Layers, Compass, Maximize2, Cpu, Laptop, Smartphone, Activity 
} from 'lucide-react';
import api from '../../services/api';

const Categories = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    api.get('/assets')
      .then(r => setAssets(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Group assets by category
  const catMap = {};
  assets.forEach(a => {
    if (!catMap[a.category]) catMap[a.category] = { total: 0, inStock: 0, allocated: 0, damaged: 0 };
    catMap[a.category].total++;
    if (a.status === 'In Stock') catMap[a.category].inStock++;
    if (a.status === 'Allocated') catMap[a.category].allocated++;
    if (a.status === 'Damaged') catMap[a.category].damaged++;
  });

  const categories = Object.entries(catMap).map(([name, stats]) => ({ name, ...stats }));

  // Executive Metrics
  const totalAssets = assets.length;
  const totalInStock = assets.filter(a => a.status === 'In Stock').length;
  const totalAllocated = assets.filter(a => a.status === 'Allocated').length;
  const totalDamaged = assets.filter(a => a.status === 'Damaged').length;

  const categoryConfigs = {
    phone: {
      color: '#6366f1',
      bgGrad: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      accentBg: '#e0e7ff',
      icon: <Smartphone size={22} color="#4f46e5" />,
      subtext: 'Corporate mobile communication assets & tablets'
    },
    accessory: {
      color: '#10b981',
      bgGrad: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      accentBg: '#d1fae5',
      icon: <Cpu size={22} color="#059669" />,
      subtext: 'Peripherals, power modules & dock interfaces'
    },
    monitor: {
      color: '#f59e0b',
      bgGrad: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      accentBg: '#fef3c7',
      icon: <Layers size={22} color="#d97706" />,
      subtext: 'High-resolution workstation visual displays'
    },
    laptop: {
      color: '#ef4444',
      bgGrad: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      accentBg: '#fee2e2',
      icon: <Laptop size={22} color="#b91c1c" />,
      subtext: 'High-performance computing workstations'
    }
  };

  const getCatConfig = (name) => {
    const key = name.toLowerCase();
    return categoryConfigs[key] || {
      color: '#8b5cf6',
      bgGrad: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
      accentBg: '#f3e8ff',
      icon: <Tags size={22} color="#6d28d9" />,
      subtext: 'Enterprise physical assets inventory pool'
    };
  };

  const getGlbUrl = (catName) => {
    const name = catName.toLowerCase();
    if (name.includes('phone')) return '/Phone.glb';
    if (name.includes('accessory')) return '/Accessory.glb';
    if (name.includes('monitor')) return '/Monitor.glb';
    if (name.includes('laptop')) return '/laptop_dell_g7.glb';
    return '/laptop_dell_g7.glb';
  };

  return (
    <div style={{ fontFamily: 'Outfit, Inter, sans-serif', color: '#0f172a', paddingBottom: '40px' }}>
      
      {/* 3D Immersive Modal */}
      {selectedCategory && (
        <div 
          onClick={() => setSelectedCategory(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(8, 4, 21, 0.72)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '820px',
              width: '100%',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.45)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Backlight Decoration inside Modal */}
            <div style={{
              position: 'absolute',
              top: '-15%',
              right: '-10%',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: getCatConfig(selectedCategory.name).color + '15',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* Close Circle Button */}
            <button 
              onClick={() => setSelectedCategory(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                border: 'none',
                background: '#f1f5f9',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#475569',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#e2e8f0';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.transform = 'none';
              }}
            >
              ✕
            </button>

            <div style={{ zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: getCatConfig(selectedCategory.name).color + '18', padding: '4px 10px', borderRadius: '20px' }}>
                  <Sparkles size={13} color={getCatConfig(selectedCategory.name).color} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: getCatConfig(selectedCategory.name).color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Immersive 3D Space</span>
                </div>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {selectedCategory.name} Category Model
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '6px', margin: 0 }}>
                Interact directly in 3D. Click and drag to orbit model, scroll to zoom in/out, and inspect casing configurations.
              </p>
            </div>

            {/* Immersive 3D Canvas Box */}
            <div style={{ zIndex: 1, position: 'relative', width: '100%', height: '420px', background: 'radial-gradient(circle, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '18px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <model-viewer
                src={getGlbUrl(selectedCategory.name)}
                camera-controls
                auto-rotate
                shadow-intensity="2"
                environment-image="neutral"
                exposure="1.05"
                alt={`A 3D representation of ${selectedCategory.name}`}
                style={{ width: '100%', height: '100%', outline: 'none' }}
              />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '20px' }}>
                <Compass size={14} color="#fff" />
                <span style={{ color: '#fff', fontSize: '0.74rem', fontWeight: 600 }}>Interactive Orbital View Active</span>
              </div>
            </div>

            {/* Modal Bottom Stats */}
            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <div style={{ display: 'flex', gap: '28px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>In Stock</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>{selectedCategory.inStock} units</p>
                </div>
                <div style={{ width: '1px', background: '#e2e8f0' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Allocated</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>{selectedCategory.allocated} units</p>
                </div>
                <div style={{ width: '1px', background: '#e2e8f0' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Damaged</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>{selectedCategory.damaged} units</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedCategory(null)}
                style={{ 
                  padding: '12px 28px', 
                  borderRadius: '10px', 
                  background: getCatConfig(selectedCategory.name).color, 
                  border: 'none', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '0.9rem', 
                  cursor: 'pointer',
                  boxShadow: `0 4px 14px ${getCatConfig(selectedCategory.name).color}40`,
                  transition: 'transform 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                Close Space
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Elegant Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Tags size={18} color="#4f46e5" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inventory Intelligence</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Categories</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Explore inventory pools grouped by hardware class & inspect high-fidelity 3D assets.</p>
        </div>
      </div>

      {/* Premium Executive Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Catalog Pool size', value: totalAssets, sub: `${categories.length} active classes`, icon: <Box size={18} color="#4f46e5" />, bg: '#e0e7ff', text: '#4f46e5' },
          { label: 'Ready in stock', value: totalInStock, sub: 'In stock pool pool', icon: <CheckCircle size={18} color="#10b981" />, bg: '#d1fae5', text: '#059669' },
          { label: 'Deployed in field', value: totalAllocated, sub: 'Assigned to employees', icon: <TrendingUp size={18} color="#f59e0b" />, bg: '#fef3c7', text: '#d97706' },
          { label: 'Needs maintenance', value: totalDamaged, sub: 'Reports unresolved', icon: <AlertTriangle size={18} color="#ef4444" />, bg: '#fee2e2', text: '#b91c1c' }
        ].map(m => (
          <div 
            key={m.label} 
            style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              padding: '20px', 
              border: '1px solid #f1f5f9', 
              display: 'flex', 
              gap: '16px',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {m.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{loading ? '...' : m.value}</p>
              <p style={{ margin: '1px 0 0 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Category Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {loading ? (
          <p style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center', padding: '60px', fontSize: '0.92rem', fontWeight: 600 }}>Loading inventory statistics & category schemas...</p>
        ) : categories.map((cat, i) => {
          const cfg = getCatConfig(cat.name);
          const isHovered = hoveredCard === cat.name;
          const capacityPercent = cat.total > 0 ? Math.round((cat.inStock / cat.total) * 100) : 0;

          return (
            <div 
              key={cat.name} 
              onClick={() => setSelectedCategory(cat)}
              onMouseEnter={() => setHoveredCard(cat.name)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                background: '#fff', 
                borderRadius: '20px', 
                border: '1px solid',
                borderColor: isHovered ? cfg.color + '40' : '#f1f5f9', 
                boxShadow: isHovered 
                  ? `0 20px 25px -5px ${cfg.color}12, 0 8px 10px -6px ${cfg.color}12` 
                  : '0 4px 6px -1px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'translateY(-4px)' : 'none'
              }}
            >
              {/* Colored Card Accent Top Line */}
              <div style={{ height: '5px', background: `linear-gradient(90deg, ${cfg.color}dd, ${cfg.color}40)` }} />

              {/* Decorative Subtle Background Glow on Hover */}
              <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-20%',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: cfg.color + '05',
                filter: 'blur(30px)',
                transition: 'opacity 0.25s',
                opacity: isHovered ? 1 : 0.4
              }} />

              <div style={{ padding: '24px' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: 44, height: 44, borderRadius: '12px', 
                      background: isHovered ? cfg.color + '25' : cfg.accentBg, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      {cfg.icon}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', margin: 0 }}>{cat.name}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.74rem', margin: '2px 0 0 0', fontWeight: 600 }}>{cat.total} total assets</p>
                    </div>
                  </div>
                  
                  {/* Glassmorphic 3D Action Tag */}
                  <div style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    color: isHovered ? '#fff' : cfg.color, 
                    background: isHovered ? cfg.color : cfg.color + '15', 
                    padding: '6px 12px', 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                    boxShadow: isHovered ? `0 4px 10px ${cfg.color}40` : 'none'
                  }}>
                    <Maximize2 size={10} />
                    <span>3D View</span>
                  </div>
                </div>

                <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45, minHeight: '38px' }}>
                  {cfg.subtext}
                </p>

                {/* Main Asset Metrics Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '14px', marginBottom: '18px' }}>
                  {[
                    { label: 'In Stock Pool', value: cat.inStock, color: '#10b981', bg: '#d1fae5' },
                    { label: 'Allocated Deployed', value: cat.allocated, color: '#f59e0b', bg: '#fef3c7' },
                    { label: 'Damaged Logged', value: cat.damaged, color: '#ef4444', bg: '#fee2e2' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>{s.label}</span>
                      <span style={{ 
                        fontSize: '0.75rem', fontWeight: 800, color: s.color, 
                        background: s.bg, padding: '2px 8px', borderRadius: '8px'
                      }}>{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Capacity Progress Bar with Circular Indicator */}
                <div>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Readiness</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: cfg.color }}>{capacityPercent}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${capacityPercent}%`, 
                      height: '100%', 
                      background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}aa)`, 
                      borderRadius: '10px',
                      transition: 'width 0.4s ease-out'
                    }} />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
