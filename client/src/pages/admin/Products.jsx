import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, MapPin, Package,
  Check, X, ChevronDown, ChevronUp, Globe,
  Loader2, Search, ToggleLeft, ToggleRight,
} from 'lucide-react';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

// ── Delivery Area Manager Component ──────────────────────────
const DeliveryAreaManager = ({ productId, areas = [], isNationwide = false, deliveryNote = '', onSave }) => {
  const [areaList, setAreaList] = useState(areas);
  const [nationwide, setNationwide] = useState(isNationwide);
  const [note, setNote] = useState(deliveryNote);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newArea, setNewArea] = useState({ state: '', cities: '', pincodes: '', note: '', isActive: true });

  const handleAddArea = () => {
    if (!newArea.state) { toast.error('Select a state'); return; }
    const area = {
      state:    newArea.state,
      cities:   newArea.cities.split(',').map(c => c.trim()).filter(Boolean),
      pincodes: newArea.pincodes.split(',').map(p => p.trim()).filter(Boolean),
      note:     newArea.note,
      isActive: true,
    };
    setAreaList(p => [...p, area]);
    setNewArea({ state: '', cities: '', pincodes: '', note: '', isActive: true });
    setAdding(false);
  };

  const handleRemoveArea = (idx) => setAreaList(p => p.filter((_, i) => i !== idx));
  const handleToggleArea = (idx) => setAreaList(p => p.map((a, i) => i === idx ? { ...a, isActive: !a.isActive } : a));

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put(`/products/${productId}/delivery-areas`, {
        deliverableAreas: areaList,
        isNationwide: nationwide,
        deliveryNote: note,
      });
      toast.success('Delivery areas updated!');
      if (onSave) onSave({ deliverableAreas: areaList, isNationwide: nationwide, deliveryNote: note });
    } catch (e) {
      toast.error('Failed to save delivery areas');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ background: '#F8FFF4', border: '1px solid #D1FAE5', borderRadius: '12px', padding: '18px', marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '7px', margin: 0 }}>
          <MapPin size={15} color="#2D6A4F"/> Delivery Coverage
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Nationwide</span>
          <button onClick={() => setNationwide(n => !n)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: nationwide ? '#2D6A4F' : '#D1D5DB', display: 'flex' }}>
            {nationwide ? <ToggleRight size={28} color="#2D6A4F"/> : <ToggleLeft size={28} color="#D1D5DB"/>}
          </button>
        </div>
      </div>

      {nationwide ? (
        <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Globe size={16} color="#065F46"/>
          <span style={{ fontSize: '0.85rem', color: '#065F46', fontWeight: 600 }}>Delivered across all of India</span>
        </div>
      ) : (
        <>
          {areaList.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: '#9CA3AF', textAlign: 'center', padding: '12px 0' }}>
              No delivery areas set. Add states/cities below or enable Nationwide.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', maxHeight: '240px', overflowY: 'auto' }}>
              {areaList.map((area, idx) => (
                <div key={idx} style={{ background: area.isActive ? 'white' : '#F9FAFB', border: `1px solid ${area.isActive ? '#D1FAE5' : '#E5E7EB'}`, borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: '10px', opacity: area.isActive ? 1 : 0.6 }}>
                  <MapPin size={14} color={area.isActive ? '#2D6A4F' : '#9CA3AF'} style={{ marginTop: '2px', flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0, color: '#1B1B1B' }}>{area.state}</p>
                    {area.cities.length > 0 && <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '2px 0 0' }}>Cities: {area.cities.join(', ')}</p>}
                    {area.pincodes.length > 0 && <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '2px 0 0' }}>Pincodes: {area.pincodes.join(', ')}</p>}
                    {area.note && <p style={{ fontSize: '0.73rem', color: '#2D6A4F', margin: '2px 0 0', fontStyle: 'italic' }}>{area.note}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => handleToggleArea(idx)} title={area.isActive ? 'Disable' : 'Enable'}
                      style={{ padding: '4px 8px', background: area.isActive ? '#FEF3C7' : '#F0FDF4', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, color: area.isActive ? '#D97706' : '#2D6A4F' }}>
                      {area.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => handleRemoveArea(idx)}
                      style={{ padding: '4px', background: '#FFF1F2', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', color: '#E11D48' }}>
                      <X size={13}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add area form */}
          {adding ? (
            <div style={{ background: 'white', border: '1px solid #D1FAE5', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>State *</label>
                  <select style={{ width: '100%', padding: '8px', border: '1.5px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif' }}
                    value={newArea.state} onChange={e => setNewArea(a => ({ ...a, state: e.target.value }))}>
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Cities (comma separated)</label>
                  <input style={{ width: '100%', padding: '8px', border: '1.5px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif' }}
                    placeholder="Bangalore, Mysore" value={newArea.cities}
                    onChange={e => setNewArea(a => ({ ...a, cities: e.target.value }))}/>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Pincodes (comma separated)</label>
                  <input style={{ width: '100%', padding: '8px', border: '1.5px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif' }}
                    placeholder="560001, 560034" value={newArea.pincodes}
                    onChange={e => setNewArea(a => ({ ...a, pincodes: e.target.value }))}/>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Delivery note</label>
                  <input style={{ width: '100%', padding: '8px', border: '1.5px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif' }}
                    placeholder="e.g. 5-7 days for remote areas" value={newArea.note}
                    onChange={e => setNewArea(a => ({ ...a, note: e.target.value }))}/>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleAddArea} style={{ flex: 1, padding: '8px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '7px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.83rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <Check size={13}/> Add Area
                </button>
                <button onClick={() => setAdding(false)} style={{ padding: '8px 14px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '7px', cursor: 'pointer', color: '#6B7280', fontFamily: 'Inter,sans-serif', fontSize: '0.83rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'none', border: '1.5px dashed #2D6A4F', borderRadius: '8px', color: '#2D6A4F', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.82rem', marginBottom: '12px' }}>
              <Plus size={13}/> Add State/Area
            </button>
          )}
        </>
      )}

      {/* Global delivery note */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Global Delivery Note</label>
        <input style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif' }}
          placeholder="e.g. Remote village deliveries may take 5-7 extra days" value={note}
          onChange={e => setNote(e.target.value)}/>
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ width: '100%', padding: '10px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', opacity: saving ? 0.7 : 1 }}>
        {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> Saving...</> : <><Check size={14}/> Save Delivery Areas</>}
      </button>
    </div>
  );
};

// ── Main Admin Products Component ─────────────────────────────
const AdminProducts = () => {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [expandedId, setExpandedId]   = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get('/products?limit=100&admin=true');
        setProducts(data.products || []);
      } catch { toast.error('Failed to load products'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (product) => {
    try {
      const { data } = await API.put(`/admin/products/${product._id}`, { isActive: !product.isActive });
      setProducts(ps => ps.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p));
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update product'); }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await API.put(`/admin/products/${product._id}`, { isFeatured: !product.isFeatured });
      setProducts(ps => ps.map(p => p._id === product._id ? { ...p, isFeatured: !p.isFeatured } : p));
      toast.success(`Featured ${!product.isFeatured ? 'enabled' : 'disabled'}`);
    } catch {}
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Loader2 size={32} color="#2D6A4F" style={{ animation: 'spin 1s linear infinite' }}/></div>;

  return (
    <div style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.6rem', margin: 0 }}>Manage Products</h1>
          <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '4px' }}>{products.length} total products</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '8px 14px', minWidth: '220px' }}>
          <Search size={15} color="#9CA3AF"/>
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontFamily: 'Inter,sans-serif', fontSize: '0.88rem', background: 'none', flex: 1 }}/>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(product => (
          <motion.div key={product._id} layout
            style={{ background: 'white', borderRadius: '14px', border: '1px solid #F3F4F6', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

            {/* Product row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px' }}>
              <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name}
                style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', background: '#F9FAFB', flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0, color: '#1B1B1B' }}>{product.name}</p>
                  <span style={{ background: '#F3F4F6', color: '#6B7280', fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: '100px' }}>{product.category}</span>
                  {product.isFeatured && <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '100px' }}>FEATURED</span>}
                  {!product.isActive && <span style={{ background: '#FFF1F2', color: '#E11D48', fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '100px' }}>INACTIVE</span>}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '3px 0 0' }}>
                  ₹{product.discountPrice || product.price} · Stock: {product.stock} · {
                    product.isNationwide ? '🌍 Nationwide' :
                    product.deliverableAreas?.length > 0 ? `📍 ${product.deliverableAreas.length} states` : '⚠️ No delivery set'
                  }
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => handleToggleFeatured(product)} title="Toggle featured"
                  style={{ padding: '6px 10px', background: product.isFeatured ? '#FEF3C7' : '#F3F4F6', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: product.isFeatured ? '#D97706' : '#6B7280', fontFamily: 'Inter,sans-serif' }}>
                  {product.isFeatured ? '★ Featured' : '☆ Feature'}
                </button>
                <button onClick={() => handleToggleActive(product)}
                  style={{ padding: '6px 10px', background: product.isActive ? '#FFF1F2' : '#F0FDF4', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: product.isActive ? '#E11D48' : '#2D6A4F', fontFamily: 'Inter,sans-serif' }}>
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => setExpandedId(expandedId === product._id ? null : product._id)}
                  style={{ padding: '6px 10px', background: expandedId === product._id ? '#F0FDF4' : '#F3F4F6', border: 'none', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: expandedId === product._id ? '#2D6A4F' : '#6B7280', fontFamily: 'Inter,sans-serif' }}>
                  <MapPin size={12}/> Delivery {expandedId === product._id ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>
              </div>
            </div>

            {/* Delivery area manager */}
            <AnimatePresence>
              {expandedId === product._id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', borderTop: '1px solid #F3F4F6', padding: '0 18px 18px' }}>
                  <DeliveryAreaManager
                    productId={product._id}
                    areas={product.deliverableAreas || []}
                    isNationwide={product.isNationwide || false}
                    deliveryNote={product.deliveryNote || ''}
                    onSave={(updated) => setProducts(ps => ps.map(p => p._id === product._id ? { ...p, ...updated } : p))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminProducts;
