import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from './AdminLayout';
import API from '../../utils/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Oils', 'Spices', 'Pulses', 'Beverages', 'Skincare', 'Other'];
const CERTS = ['India Organic', 'FSSAI', 'Non-GMO', 'Vegan', 'Gluten-Free'];
const EMPTY = { name: '', description: '', shortDescription: '', price: '', discountPrice: '', category: 'Vegetables', unit: 'kg', stock: '', ingredients: '', certifications: [], isFeatured: false, isActive: true };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await API.get('/products?limit=100');
      setProducts(data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY);
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      category: product.category || 'Vegetables',
      unit: product.unit || 'kg',
      stock: product.stock || '',
      ingredients: (product.ingredients || []).join(', '),
      certifications: product.certifications || [],
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,
    });
    setImageFiles([]);
    setImagePreviews(product.images?.map(img => img.url) || []);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 4) { toast.error('Maximum 4 images allowed'); return; }
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    // Only remove from imageFiles if it's a new file
    const existingCount = editProduct?.images?.length || 0;
    if (index >= existingCount) {
      setImageFiles(prev => prev.filter((_, i) => i !== (index - existingCount)));
    }
  };

  const toggleCert = (cert) => {
    setForm(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Name, price and stock are required'); return; }

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'certifications') {
          val.forEach(c => formData.append('certifications[]', c));
        } else if (key === 'ingredients') {
          val.split(',').map(s => s.trim()).filter(Boolean).forEach(i => formData.append('ingredients[]', i));
        } else {
          formData.append(key, val);
        }
      });
      imageFiles.forEach(file => formData.append('images', file));

      if (editProduct) {
        const { data } = await API.put(`/products/${editProduct._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setProducts(prev => prev.map(p => p._id === editProduct._id ? data.product : p));
        toast.success('Product updated! ✅');
      } else {
        const { data } = await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setProducts(prev => [data.product, ...prev]);
        toast.success('Product added! 🌿');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleteId(id);
    try {
      await API.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleteId(null); }
  };

  const filtered = search ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())) : products;

  return (
    <AdminLayout>
      <Helmet><title>Manage Products - Admin</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Products</h1>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '2px' }}>{products.length} total products</p>
        </div>
        <button onClick={openAdd} style={{ background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', padding: '11px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ＋ Add New Product
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px', maxWidth: '380px' }}>
        <input placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }} />
      </div>

      {/* Products Table */}
      {loading ? <Loader /> : (
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Image', 'Product', 'Category', 'Price', 'Stock', 'Featured', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: '#6B7280', fontWeight: 600, borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={product.images?.[0]?.url || 'https://via.placeholder.com/50'} alt={product.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: '200px' }}>
                      <p style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                      <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '2px' }}>₹{product.discountPrice || product.price}/{product.unit}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '3px 10px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600 }}>{product.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontWeight: 700, color: '#2D6A4F' }}>₹{product.discountPrice || product.price}</p>
                      {product.discountPrice && product.price > product.discountPrice && (
                        <p style={{ color: '#9CA3AF', textDecoration: 'line-through', fontSize: '0.78rem' }}>₹{product.price}</p>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: product.stock <= 10 ? '#EF4444' : product.stock <= 30 ? '#F59E0B' : '#22C55E', fontWeight: 700 }}>{product.stock}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{product.isFeatured ? '⭐' : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: product.isActive ? '#D1FAE5' : '#FEF2F2', color: product.isActive ? '#065F46' : '#EF4444', padding: '3px 10px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600 }}>
                        {product.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(product)} style={{ background: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>✏️ Edit</button>
                        <button onClick={() => handleDelete(product._id)} disabled={deleteId === product._id} style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
              <p style={{ fontWeight: 600 }}>No products found</p>
              <button onClick={openAdd} style={{ marginTop: '16px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Add First Product</button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '680px', padding: '32px', position: 'relative', marginTop: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Images */}
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>Product Images (max 4)</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {imagePreviews.map((src, i) => (
                    <div key={i} style={{ position: 'relative', width: '90px', height: '90px' }}>
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '2px solid #E5E7EB' }} />
                      <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  ))}
                  {imagePreviews.length < 4 && (
                    <button onClick={() => fileRef.current.click()} style={{ width: '90px', height: '90px', border: '2px dashed #D1D5DB', borderRadius: '10px', background: '#F9FAFB', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#6B7280', fontSize: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>📷</span> Add Image
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '6px' }}>Supported: JPG, PNG, WebP. Recommended: 600×600px</p>
              </div>

              {/* Name */}
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Product Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Organic Basmati Rice"
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Short Description */}
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Short Description</label>
                <input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="One-line product summary (shown on product card)"
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Full Description */}
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Full Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed product description..."
                  rows={4} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>

              {/* Price Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                {[['price', 'MRP Price (₹) *', '299'], ['discountPrice', 'Sale Price (₹)', '249'], ['stock', 'Stock Qty *', '100'], ['unit', 'Unit', 'kg']].map(([key, label, placeholder]) => (
                  <div key={key}>
                    <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '6px', color: '#374151' }}>{label}</label>
                    {key === 'unit' ? (
                      <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                        style={{ width: '100%', padding: '10px 10px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.88rem', background: 'white', outline: 'none' }}>
                        {['g', 'kg', 'ml', 'litre', 'piece', 'dozen', 'pack', 'box'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    ) : (
                      <input type={key === 'stock' || key === 'price' || key === 'discountPrice' ? 'number' : 'text'}
                        value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                        style={{ width: '100%', padding: '10px 10px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Category */}
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', background: 'white', outline: 'none' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Ingredients */}
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Ingredients <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(comma separated)</span></label>
                <input value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} placeholder="e.g. Organic Basmati Rice, Water"
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Certifications */}
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>Certifications</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {CERTS.map(cert => (
                    <button key={cert} type="button" onClick={() => toggleCert(cert)}
                      style={{ padding: '6px 14px', borderRadius: '100px', border: '1.5px solid', borderColor: form.certifications.includes(cert) ? '#2D6A4F' : '#E5E7EB', background: form.certifications.includes(cert) ? '#D1FAE5' : 'white', color: form.certifications.includes(cert) ? '#065F46' : '#6B7280', cursor: 'pointer', fontSize: '0.82rem', fontWeight: form.certifications.includes(cert) ? 700 : 400 }}>
                      {form.certifications.includes(cert) ? '✓ ' : ''}{cert}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '24px' }}>
                {[['isFeatured', '⭐ Featured on Homepage'], ['isActive', '✅ Active (visible to customers)']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#2D6A4F', cursor: 'pointer' }} />
                    {label}
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', border: '1.5px solid #E5E7EB', borderRadius: '10px', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#374151' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '12px', background: saving ? '#9CA3AF' : '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>
                  {saving ? '⏳ Saving...' : editProduct ? '✅ Save Changes' : '🌿 Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
