import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Search, Plus, QrCode, Edit2, Copy, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
import api from '../services/api';
import ActionModal from '../components/ActionModal';

const LOCATIONS = [
  'IT Department',
  'Main Office',
  'Sales Room',
  'Storage Room',
  'Server Room',
  'Reception'
];

const CATEGORIES = ['Laptop', 'Monitor', 'Phone', 'Accessory', 'Furniture', 'Hardware'];

const initialForm = {
  assetId: '',
  name: '',
  category: 'Laptop',
  departmentId: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  purchaseDate: '',
  purchaseCost: '',
  status: 'In Stock',
  location: 'Main Office'
};

const Inventory = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  
  // Modals state
  const [selectedAssetForQR, setSelectedAssetForQR] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'copy'
  const [formData, setFormData] = useState(initialForm);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
      if (response.data.length > 0 && !formData.departmentId) {
        setFormData(prev => ({ ...prev, departmentId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchAssets(), fetchDepartments()]);
      
      // Support pre-filtering via URL query parameters (e.g. ?status=In%20Stock)
      const queryParams = new URLSearchParams(window.location.search);
      const statusParam = queryParams.get('status');
      if (statusParam) {
        setFilterStatus(statusParam);
      }
      
      setLoading(false);
    };
    init();
  }, []);

  const handleShowQR = (asset) => {
    setSelectedAssetForQR(asset);
    setIsQRModalOpen(true);
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      ...initialForm,
      departmentId: departments[0]?.id || ''
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (asset) => {
    setModalMode('edit');
    setSelectedAssetId(asset.id);
    setFormData({
      assetId: asset.assetId || '',
      name: asset.name || '',
      category: asset.category || 'Laptop',
      departmentId: asset.departmentId || '',
      manufacturer: asset.manufacturer || '',
      model: asset.model || '',
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      purchaseCost: asset.purchaseCost !== null ? String(asset.purchaseCost) : '',
      status: asset.status || 'In Stock',
      location: asset.location || 'Main Office'
    });
    setIsFormModalOpen(true);
  };

  const openCopyModal = (asset) => {
    setModalMode('copy');
    setFormData({
      assetId: `${asset.assetId}-COPY`,
      name: `${asset.name} (Copy)`,
      category: asset.category || 'Laptop',
      departmentId: asset.departmentId || '',
      manufacturer: asset.manufacturer || '',
      model: asset.model || '',
      serialNumber: asset.serialNumber ? `${asset.serialNumber}-NEW` : '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      purchaseCost: asset.purchaseCost !== null ? String(asset.purchaseCost) : '',
      status: 'In Stock', // Default copied asset to In Stock
      location: asset.location || 'Main Office'
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async () => {
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        purchaseCost: formData.purchaseCost ? parseInt(formData.purchaseCost, 10) : null,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : null
      };

      if (modalMode === 'add' || modalMode === 'copy') {
        await api.post('/assets', payload);
      } else if (modalMode === 'edit') {
        await api.put(`/assets/${selectedAssetId}`, payload);
      }

      await fetchAssets();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error saving asset:', error);
      alert(error.response?.data?.message || 'Error occurred while saving asset.');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return { bg: 'rgba(34, 197, 94, 0.1)', text: 'var(--success)' };
      case 'Allocated': return { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--chart-blue)' };
      case 'Damaged': return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--error)' };
      default: return { bg: 'rgba(100, 116, 139, 0.1)', text: 'var(--text-muted)' };
    }
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.assetId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? asset.category === filterCategory : true;
    const matchesStatus = filterStatus ? asset.status === filterStatus : true;
    const matchesLocation = filterLocation ? asset.location === filterLocation : true;
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header" style={{ marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Asset List</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff', color: 'var(--text-main)', fontSize: '0.9rem' }}
            />
          </div>
          
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <option value="">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Allocated">Allocated</option>
            <option value="Damaged">Damaged</option>
          </select>
          
          <select value={filterLocation} onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <option value="">All Locations</option>
            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <button onClick={openAddModal} className="primary-btn" style={{ padding: '10px 16px', borderRadius: '8px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Plus size={16} /> Add Asset
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Asset ID</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Model</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Serial Number</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Location</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading inventory...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No assets found.</td></tr>
            ) : (
              currentItems.map(asset => {
                const statusColors = getStatusColor(asset.status);
                return (
                  <tr key={asset.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fff' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>{asset.assetId}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-main)', fontSize: '0.9rem' }}>{asset.name}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{asset.category}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{asset.model || '-'}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{asset.serialNumber || '-'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                        background: statusColors.bg, color: statusColors.text
                      }}>
                        {asset.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{asset.location || '-'}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{ padding: '6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => navigate(`/history/${asset.id}`)} title="View Asset History">
                        <Eye size={14} />
                      </button>
                      <button style={{ padding: '6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => handleShowQR(asset)} title="Show QR Code">
                        <QrCode size={14} />
                      </button>
                      <button style={{ padding: '6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => openEditModal(asset)} title="Edit Asset">
                        <Edit2 size={14} />
                      </button>
                      <button style={{ padding: '6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => openCopyModal(asset)} title="Copy Asset">
                        <Copy size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px', border: 'none', background: 'transparent', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#cbd5e1' : 'var(--text-muted)' }}
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  style={{ 
                    padding: '6px 12px', 
                    border: '1px solid ' + (currentPage === i + 1 ? 'var(--primary)' : 'transparent'), 
                    background: currentPage === i + 1 ? 'var(--primary)' : 'transparent', 
                    color: currentPage === i + 1 ? '#fff' : 'var(--text-muted)', 
                    borderRadius: '4px', 
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px', border: 'none', background: 'transparent', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#cbd5e1' : 'var(--text-muted)' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <ActionModal 
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        title={`QR Code: ${selectedAssetForQR?.assetId}`}
      >
        {selectedAssetForQR && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px' }}>
            <div style={{ padding: '16px', background: 'white', borderRadius: '12px' }}>
              <QRCodeSVG 
                value={`http://localhost:5173/history/${selectedAssetForQR.id}`} 
                size={200}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>{selectedAssetForQR.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scan to view asset lifecycle history.</p>
            </div>
          </div>
        )}
      </ActionModal>

      {/* Add / Edit / Copy Form Modal */}
      <ActionModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={modalMode === 'add' ? 'Add New Asset' : modalMode === 'edit' ? 'Edit Asset' : 'Copy Asset (New Duplicate)'}
        submitText={modalMode === 'edit' ? 'Update Asset' : 'Create Asset'}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Asset ID *</label>
              <input 
                type="text" 
                required
                value={formData.assetId} 
                onChange={(e) => handleInputChange('assetId', e.target.value)}
                placeholder="E.g., AST-1006"
                style={formInputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Name *</label>
              <input 
                type="text" 
                required
                value={formData.name} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="E.g., Logitech Mouse"
                style={formInputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Category *</label>
              <select 
                value={formData.category} 
                onChange={(e) => handleInputChange('category', e.target.value)}
                style={formInputStyle}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Department *</label>
              <select 
                value={formData.departmentId} 
                onChange={(e) => handleInputChange('departmentId', e.target.value)}
                style={formInputStyle}
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Manufacturer</label>
              <input 
                type="text" 
                value={formData.manufacturer} 
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                placeholder="E.g., Logitech"
                style={formInputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Model</label>
              <input 
                type="text" 
                value={formData.model} 
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="E.g., MX Master 3S"
                style={formInputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Serial Number</label>
              <input 
                type="text" 
                value={formData.serialNumber} 
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                placeholder="E.g., SN-1002345"
                style={formInputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Location *</label>
              <select 
                value={formData.location} 
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={formInputStyle}
              >
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Purchase Cost (₹)</label>
              <input 
                type="number" 
                value={formData.purchaseCost} 
                onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
                placeholder="E.g., 8500"
                style={formInputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Purchase Date</label>
              <input 
                type="date" 
                value={formData.purchaseDate} 
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                style={formInputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Status *</label>
            <select 
              value={formData.status} 
              onChange={(e) => handleInputChange('status', e.target.value)}
              style={formInputStyle}
            >
              <option value="In Stock">In Stock</option>
              <option value="Allocated">Allocated</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>
        </div>
      </ActionModal>
    </div>
  );
};

const formInputStyle = {
  width: '100%', 
  padding: '10px 12px', 
  borderRadius: '8px', 
  border: '1px solid var(--border-color)', 
  background: '#fff', 
  color: 'var(--text-main)', 
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box'
};

export default Inventory;
