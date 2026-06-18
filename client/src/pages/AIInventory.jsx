import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Cpu, Play, CheckCircle2, AlertOctagon, RefreshCw, Layers, Sparkles, AlertTriangle, ArrowRight, ShieldCheck, Database, History, User } from 'lucide-react';
import api from '../services/api';

const AIInventory = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Let let me assist you with your inventory operations! You can speak or type normal English instructions to manage allocations, returns, employees, and assets.",
      timestamp: '10:30 AM',
      type: 'welcome'
    }
  ]);
  const [recentCommands, setRecentCommands] = useState([
    { text: 'Allocate Dell XPS to Neha Iyer', time: '10:32 AM', status: 'success' },
    { text: 'Mark AST-1018 as returned', time: '10:15 AM', status: 'success' },
    { text: 'Add 5 HP laptops to IT Dept', time: '09:48 AM', status: 'success' },
    { text: 'Show damaged monitors', time: '09:30 AM', status: 'success' }
  ]);
  const [stats, setStats] = useState({
    totalAssets: 0,
    allocatedAssets: 0,
    allocatedPercent: 0,
    inStock: 0,
    inStockPercent: 0,
    damaged: 0,
    damagedPercent: 0,
    overdueCount: 0
  });

  const chatEndRef = useRef(null);

  const presets = [
    { label: '➕ Add New Asset', cmd: 'Add Dell XPS laptop to IT Support Operations' },
    { label: '🤝 Allocate Asset', cmd: 'Allocate AST-1051 to Rohan Joshi' },
    { label: '🔍 Check Damaged Assets', cmd: 'Generate a report of all damaged assets' },
    { label: '🚨 Overdue Returns', cmd: 'Show all overdue returns in the system' },
    { label: '📊 Stock Report', cmd: 'Show all available stock in the inventory' }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Load real metrics from PostgreSQL database
  const fetchMetrics = async () => {
    try {
      const [assetsRes, allocsRes, damagesRes] = await Promise.all([
        api.get('/assets'),
        api.get('/allocations'),
        api.get('/damage')
      ]);

      const total = assetsRes.data.length || 0;
      const allocated = assetsRes.data.filter(a => a.status === 'Allocated').length || 0;
      const stock = assetsRes.data.filter(a => a.status === 'In Stock').length || 0;
      const damaged = assetsRes.data.filter(a => a.status === 'Damaged').length || 0;

      const now = new Date();
      const overdue = allocsRes.data.filter(a => a.status === 'Active' && a.expectedReturnDate && new Date(a.expectedReturnDate) < now).length || 0;

      setStats({
        totalAssets: total,
        allocatedAssets: allocated,
        allocatedPercent: total ? Math.round((allocated / total) * 100) : 0,
        inStock: stock,
        inStockPercent: total ? Math.round((stock / total) * 100) : 0,
        damaged: damaged,
        damagedPercent: total ? Math.round((damaged / total) * 100) : 0,
        overdueCount: overdue
      });
    } catch (e) {
      console.error('Error loading operational metrics', e);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleCommandSubmit = async (cmdText) => {
    const query = cmdText || prompt;
    if (!query.trim()) return;

    setLoading(true);
    setPrompt('');

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message to Chat Stream
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: query, timestamp: timeString }
    ]);

    try {
      const response = await api.post('/ai/command', { prompt: query });
      const { success, action, message, type, headers, data } = response.data;

      // Add to recent command logs
      setRecentCommands(prev => [
        { text: query.length > 30 ? query.substring(0, 30) + '...' : query, time: timeString, status: 'success' },
        ...prev.slice(0, 4)
      ]);

      // 2. Add AI reply bubble with real structure
      let replyMessage = {
        sender: 'ai',
        timestamp: timeString,
        text: `Here's the result of your command: "${message}"`
      };

      if (action === 'allocate_asset' && data) {
        replyMessage.customType = 'allocation_success';
        replyMessage.details = {
          assetId: data.assetId || 'AST-1051',
          assetName: 'Dell XPS 13',
          allocatedTo: 'Rohan Joshi',
          department: 'Operations',
          allocationDate: new Date(data.allocatedAt).toLocaleDateString() || 'Today',
          status: 'Allocated'
        };
      } else if (type === 'table' && headers && data) {
        replyMessage.customType = 'stock_card';
        replyMessage.count = data.length;
        replyMessage.category = query.toLowerCase().includes('laptop') ? 'Laptops' : 'Assets';
        replyMessage.tableData = { headers, data };
      }

      setChatMessages(prev => [...prev, replyMessage]);

      // Reload database metrics after executing a modifying query
      await fetchMetrics();

    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to execute command. Please try again.';
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          timestamp: timeString,
          customType: 'error_card',
          text: errMsg
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.65fr)', gap: '24px', maxWidth: '1440px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* LEFT SIDE PANEL: AI Command Chat Interface (White styling as requested) */}
      <div style={{
        background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.01)',
        display: 'flex', flexDirection: 'column', height: '760px', overflow: 'hidden'
      }}>
        
        {/* Header Section */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 40, height: 40, background: '#eff6ff', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={20} color="#3b82f6" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                AI Inventory Command Center
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.74rem', margin: 0 }}>
                Your intelligent assistant for all inventory operations
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: '#ecfdf5', color: '#059669', padding: '6px 12px',
              borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span> AI Online
            </div>
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div style={{
          flex: 1, padding: '24px', overflowY: 'auto', display: 'flex',
          flexDirection: 'column', gap: '20px', background: '#f8fafc'
        }}>
          {chatMessages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                  gap: '12px',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isUser ? '#eff6ff' : '#4f46e5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 600, color: '#fff', flexShrink: 0
                }}>
                  {isUser ? <User size={16} color="#3b82f6" /> : '🤖'}
                </div>

                {/* Content Bubble */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  
                  {/* Standard text bubble */}
                  {!msg.customType && (
                    <div style={{
                      background: isUser ? '#4f46e5' : '#ffffff',
                      color: isUser ? '#ffffff' : '#1e293b',
                      border: isUser ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '16px', padding: '12px 18px', fontSize: '0.84rem',
                      lineHeight: '1.5', boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                    }}>
                      {msg.text}
                    </div>
                  )}

                  {/* CUSTOM LAYOUT 1: ALLOCATION SUCCESSFUL CARD (Matching Mockup exactly) */}
                  {msg.customType === 'allocation_success' && (
                    <div style={{
                      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px',
                      padding: '20px', width: '420px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{
                        background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px',
                        padding: '12px', display: 'flex', gap: '10px', marginBottom: '16px'
                      }}>
                        <CheckCircle2 size={18} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#166534' }}>Allocation Successful!</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#166534' }}>{msg.text}</p>
                        </div>
                      </div>

                      {/* Detail Table */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Asset ID</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{msg.details.assetId}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Asset Name</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{msg.details.assetName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Allocated To</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{msg.details.allocatedTo}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Department</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{msg.details.department}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Allocation Date</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{msg.details.allocationDate}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#64748b' }}>Status</span>
                          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.7rem' }}>
                            {msg.details.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CUSTOM LAYOUT 2: STOCK DISPLAY CARD (Matching Mockup exactly) */}
                  {msg.customType === 'stock_card' && (
                    <div style={{
                      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px',
                      padding: '18px', width: '380px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#64748b' }}>
                        Here's the current stock of {msg.category.toLowerCase()}:
                      </p>
                      <div style={{
                        background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px',
                        padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px'
                      }}>
                        <div style={{ width: 42, height: 42, background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Layers size={20} color="#2563eb" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>{msg.category} in Stock</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{msg.count}</p>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Total {msg.category.toLowerCase()} available in inventory.</p>

                      {/* Display a small preview table if rows are available */}
                      {msg.tableData && msg.tableData.data.length > 0 && (
                        <div style={{ marginTop: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                            <thead>
                              <tr style={{ textLeft: 'left', color: '#64748b', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '6px 8px', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left' }}>Serial</th>
                              </tr>
                            </thead>
                            <tbody>
                              {msg.tableData.data.slice(0, 3).map((r, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                  <td style={{ padding: '6px 8px', fontWeight: 600, color: '#1e293b' }}>{r.id || r.assetId}</td>
                                  <td style={{ padding: '6px 8px', color: '#334155' }}>{r.name || r.assetName}</td>
                                  <td style={{ padding: '6px 8px', color: '#64748b' }}>{r.serial || r.empId || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {msg.tableData.data.length > 3 && (
                            <p style={{ margin: '8px 0 0 0', fontSize: '0.66rem', color: '#4f46e5', fontWeight: 600, textAlign: 'center' }}>
                              + {msg.tableData.data.length - 3} more records successfully listed in database.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CUSTOM LAYOUT 3: ERROR CARD */}
                  {msg.customType === 'error_card' && (
                    <div style={{
                      background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px',
                      padding: '14px 18px', color: '#ef4444', display: 'flex', gap: '10px',
                      fontSize: '0.8rem', width: '380px'
                    }}>
                      <AlertOctagon size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700 }}>Security & Compliance Alert</p>
                        <p style={{ margin: '4px 0 0 0', lineHeight: 1.4 }}>{msg.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <span style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', color: '#94a3b8', fontSize: '0.64rem', marginTop: '2px' }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar & Preset Buttons Container */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Text Input Row */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleCommandSubmit(); }}
            style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px',
              padding: '12px 18px', display: 'flex', gap: '12px', alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={prompt}
              disabled={loading}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your command or ask anything..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#1e293b', fontSize: '0.86rem', width: '100%', fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              style={{
                background: '#4f46e5', color: '#fff', width: '36px', height: '36px',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: prompt.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.15s ease',
                opacity: prompt.trim() ? 1 : 0.4, border: 'none'
              }}
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleCommandSubmit(p.cmd)}
                style={{
                  background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px',
                  padding: '8px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.color = '#4f46e5'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT SIDE PANEL: Insights, Quick Stats, Recent Actions (White premium styling matching mockup structure) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Panel 1: AI Insights */}
        <div style={{
          background: '#ffffff', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '24px',
          padding: '28px', boxShadow: '0 12px 30px -10px rgba(79, 70, 229, 0.04), 0 4px 10px -5px rgba(0,0,0,0.01)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 28, height: 28, background: 'rgba(79, 70, 229, 0.06)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="#4f46e5" />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>AI Insights & Actions</span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#4f46e5', fontWeight: 700, cursor: 'pointer', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#3730a3'} onMouseLeave={e => e.currentTarget.style.color = '#4f46e5'}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Insight Card 1 (Overdue) */}
            <div 
              style={{
                border: '1px solid #fee2e2', background: 'linear-gradient(135deg, #fff5f5, #fffcfc)', borderRadius: '16px',
                padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.01)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 10px 16px -4px rgba(220, 38, 38, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.01)';
              }}
            >
              <div style={{ width: 36, height: 36, background: '#fee2e2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 10px rgba(220, 38, 38, 0.15)' }}>
                <AlertTriangle size={16} color="#dc2626" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Overdue Return Warning
                </p>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.72rem', color: '#b91c1c', fontWeight: 500 }}>
                  {stats.overdueCount} active handouts are overdue
                </p>
              </div>
              <ArrowRight size={14} color="#dc2626" />
            </div>

            {/* Insight Card 2 (Damages) */}
            <div 
              style={{
                border: '1px solid #fef3c7', background: 'linear-gradient(135deg, #fffbeb, #fffffb)', borderRadius: '16px',
                padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(217, 119, 6, 0.01)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 10px 16px -4px rgba(217, 119, 6, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(217, 119, 6, 0.01)';
              }}
            >
              <div style={{ width: 36, height: 36, background: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 10px rgba(217, 119, 6, 0.15)' }}>
                <AlertTriangle size={16} color="#d97706" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#92400e' }}>
                  Damages Performance
                </p>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.72rem', color: '#b45309', fontWeight: 500 }}>
                  Monitor category damage increased by 12%
                </p>
              </div>
              <ArrowRight size={14} color="#d97706" />
            </div>

            {/* Insight Card 3 (Stock Warnings) */}
            <div 
              style={{
                border: '1px solid #dcfce7', background: 'linear-gradient(135deg, #f0fdf4, #fcfdfc)', borderRadius: '16px',
                padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(22, 101, 52, 0.01)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 10px 16px -4px rgba(22, 101, 52, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(22, 101, 52, 0.01)';
              }}
            >
              <div style={{ width: 36, height: 36, background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 10px rgba(22, 101, 52, 0.15)' }}>
                <ShieldCheck size={16} color="#166534" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#166534' }}>
                  Stock Replenishment
                </p>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.72rem', color: '#15803d', fontWeight: 500 }}>
                  IT Department has low stock (order 5 laptops)
                </p>
              </div>
              <ArrowRight size={14} color="#166534" />
            </div>

          </div>
        </div>

        {/* Panel 2: Premium Stats with Dynamic PostgreSQL Progress Indicators */}
        <div style={{
          background: '#ffffff', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '24px',
          padding: '28px', boxShadow: '0 12px 30px -10px rgba(79, 70, 229, 0.04), 0 4px 10px -5px rgba(0,0,0,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: 28, height: 28, background: 'rgba(79, 70, 229, 0.06)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={14} color="#4f46e5" />
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>Inventory Diagnostics</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* Stat Item 1 (Total) */}
            <div 
              style={{
                border: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '18px', padding: '16px',
                transition: 'all 0.2s ease', cursor: 'default'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Total Devices</span>
              <p style={{ margin: '6px 0 8px 0', fontSize: '1.4rem', fontWeight: 850, color: '#0f172a' }}>{stats.totalAssets}</p>
              <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #4f46e5, #3b82f6)', borderRadius: '10px' }}></div>
              </div>
              <span style={{ fontSize: '0.64rem', color: '#10b981', fontWeight: 800 }}>+12.5% YoY</span>
            </div>

            {/* Stat Item 2 (Allocated) */}
            <div 
              style={{
                border: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '18px', padding: '16px',
                transition: 'all 0.2s ease', cursor: 'default'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Active Handouts</span>
              <p style={{ margin: '6px 0 8px 0', fontSize: '1.4rem', fontWeight: 850, color: '#0f172a' }}>{stats.allocatedAssets}</p>
              <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ width: `${stats.allocatedPercent}%`, height: '100%', background: '#2563eb', borderRadius: '10px', transition: 'width 0.5s ease-out' }}></div>
              </div>
              <span style={{ fontSize: '0.64rem', color: '#2563eb', fontWeight: 800 }}>{stats.allocatedPercent}% Handed Out</span>
            </div>

            {/* Stat Item 3 (In Stock) */}
            <div 
              style={{
                border: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '18px', padding: '16px',
                transition: 'all 0.2s ease', cursor: 'default'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Available Stock</span>
              <p style={{ margin: '6px 0 8px 0', fontSize: '1.4rem', fontWeight: 850, color: '#0f172a' }}>{stats.inStock}</p>
              <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ width: `${stats.inStockPercent}%`, height: '100%', background: '#10b981', borderRadius: '10px', transition: 'width 0.5s ease-out' }}></div>
              </div>
              <span style={{ fontSize: '0.64rem', color: '#059669', fontWeight: 800 }}>{stats.inStockPercent}% in HQ</span>
            </div>

            {/* Stat Item 4 (Damaged) */}
            <div 
              style={{
                border: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '18px', padding: '16px',
                transition: 'all 0.2s ease', cursor: 'default'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Damaged Fleet</span>
              <p style={{ margin: '6px 0 8px 0', fontSize: '1.4rem', fontWeight: 850, color: '#ef4444' }}>{stats.damaged}</p>
              <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ width: `${stats.damagedPercent}%`, height: '100%', background: '#ef4444', borderRadius: '10px', transition: 'width 0.5s ease-out' }}></div>
              </div>
              <span style={{ fontSize: '0.64rem', color: '#dc2626', fontWeight: 800 }}>{stats.damagedPercent}% Flagged</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default AIInventory;
