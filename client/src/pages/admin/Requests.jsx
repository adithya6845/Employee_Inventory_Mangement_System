import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Trash2, Edit3, Check, X, Clock, AlertCircle, Sparkles, Filter 
} from 'lucide-react';
import api from '../../services/api';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  
  // Form fields
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formType, setFormType] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState('pending');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [reqRes, empRes] = await Promise.all([
        api.get('/requests'),
        api.get('/employees')
      ]);
      setRequests(reqRes.data || []);
      setEmployees(empRes.data || []);
      
      if (empRes.data?.length > 0) {
        setFormEmployeeId(empRes.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching requests dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingRequest(null);
    setFormType('');
    setFormDescription('');
    setFormStatus('pending');
    if (employees.length > 0) {
      setFormEmployeeId(employees[0].id);
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (req) => {
    setEditingRequest(req);
    setFormEmployeeId(req.employeeId);
    setFormType(req.type);
    setFormDescription(req.description);
    setFormStatus(req.status);
    setIsModalOpen(true);
  };

  const handleSaveRequest = async (e) => {
    e.preventDefault();
    if (!formType || !formDescription || !formEmployeeId) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      if (editingRequest) {
        // Edit existing
        const res = await api.patch(`/requests/${editingRequest.id}`, {
          type: formType,
          description: formDescription,
          employeeId: formEmployeeId,
          status: formStatus
        });
        setRequests(prev => prev.map(r => r.id === editingRequest.id ? { ...r, ...res.data, employee: employees.find(emp => emp.id === formEmployeeId) } : r));
      } else {
        // Create new
        const res = await api.post('/requests', {
          type: formType,
          description: formDescription,
          employeeId: formEmployeeId
        });
        // We reload to get the complete populated employee object or just fetch all
        loadAllData();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving request:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/requests/${id}/status`, { status: newStatus });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset request?')) return;
    try {
      await api.delete(`/requests/${id}`);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };

  // Filter requests based on current active tab
  const filteredRequests = requests.filter(r => (r.status || 'pending').toLowerCase() === activeTab.toLowerCase());

  // Count helper
  const getTabCount = (status) => {
    return requests.filter(r => (r.status || 'pending').toLowerCase() === status.toLowerCase()).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Premium Form Modal Popup */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                background: '#f1f5f9',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#64748b'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              {editingRequest ? 'Edit Request Details' : 'Create New Asset Request'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
              Submit hardware asset requests to IT department logs.
            </p>

            <form onSubmit={handleSaveRequest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Select Employee *</label>
                <select 
                  value={formEmployeeId} 
                  onChange={e => setFormEmployeeId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Asset Requested *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dell XPS Laptop, iPhone 14, Logitech Mouse"
                  value={formType}
                  onChange={e => setFormType(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Reason / Purpose *</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Required for remote project operations / software testing tasks"
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {editingRequest && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Request Status</label>
                  <select 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 20px', borderRadius: '8px', background: '#f1f5f9', border: 'none', color: '#475569', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: '8px', background: '#4f46e5', border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
                >
                  Save Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header section with Create Request Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Request (New)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Review and manage enterprise hardware asset request cycles</p>
        </div>

        <button 
          onClick={handleOpenCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={16} /> New Request
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          Loading corporate asset requests...
        </div>
      ) : (
        <>
          {/* Mockup Styled Tabs Section */}
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>
            {[
              { id: 'pending', label: `Pending (${getTabCount('pending')})` },
              { id: 'approved', label: `Approved (${getTabCount('approved')})` },
              { id: 'rejected', label: `Rejected (${getTabCount('rejected')})` }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  padding: '12px 4px', 
                  background: 'transparent', 
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                  color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table Container Card */}
          <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['ID', 'Employee', 'Asset Requested', 'Reason', 'Request Date', 'Status', 'Actions'].map((h, i) => (
                    <th 
                      key={h} 
                      style={{ 
                        padding: '16px 24px', 
                        fontSize: '0.8rem', 
                        fontWeight: 700, 
                        color: '#475569', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        textAlign: h === 'Actions' ? 'center' : 'left'
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, i) => {
                  const reqDate = req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
                  return (
                    <tr 
                      key={req.id} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9', 
                        background: '#fff',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = '#fafafa'; }}
                      onMouseOut={e => { e.currentTarget.style.background = '#fff'; }}
                    >
                      {/* ID */}
                      <td style={{ padding: '18px 24px', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                        {req.id}
                      </td>
                      
                      {/* Employee Name */}
                      <td style={{ padding: '18px 24px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        {req.employee ? `${req.employee.firstName} ${req.employee.lastName}` : 'System Admin'}
                      </td>
                      
                      {/* Asset Requested */}
                      <td style={{ padding: '18px 24px', fontSize: '0.88rem', fontWeight: 600, color: '#4f46e5' }}>
                        {req.type || '—'}
                      </td>
                      
                      {/* Reason */}
                      <td style={{ padding: '18px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.description || '—'}
                      </td>
                      
                      {/* Request Date */}
                      <td style={{ padding: '18px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        {reqDate}
                      </td>
                      
                      {/* Status badge */}
                      <td style={{ padding: '18px 24px' }}>
                        {req.status === 'pending' && (
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, background: '#fef3c7', color: '#d97706', textTransform: 'capitalize' }}>
                            Pending
                          </span>
                        )}
                        {req.status === 'approved' && (
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, background: '#d1fae5', color: '#10b981', textTransform: 'capitalize' }}>
                            Approved
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, background: '#fee2e2', color: '#ef4444', textTransform: 'capitalize' }}>
                            Rejected
                          </span>
                        )}
                      </td>
                      
                      {/* Actions */}
                      <td style={{ padding: '18px 24px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Status controllers for Pending items */}
                        {req.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(req.id, 'approved')}
                              title="Approve Request"
                              style={{
                                width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: '#d1fae5', color: '#10b981',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                              }}
                              onMouseOver={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#fff'; }}
                              onMouseOut={e => { e.currentTarget.style.background = '#d1fae5'; e.currentTarget.style.color = '#10b981'; }}
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(req.id, 'rejected')}
                              title="Reject Request"
                              style={{
                                width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#ef4444',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                              }}
                              onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                              onMouseOut={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}

                        {/* Edit Button */}
                        <button 
                          onClick={() => handleOpenEditModal(req)}
                          title="Edit Details"
                          style={{
                            width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: '#e0e7ff', color: '#4f46e5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = '#fff'; }}
                          onMouseOut={e => { e.currentTarget.style.background = '#e0e7ff'; e.currentTarget.style.color = '#4f46e5'; }}
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteRequest(req.id)}
                          title="Delete Request"
                          style={{
                            width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: '#f1f5f9', color: '#64748b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                          onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#64748b', fontWeight: 500 }}>
                      No {activeTab} asset requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Requests;
