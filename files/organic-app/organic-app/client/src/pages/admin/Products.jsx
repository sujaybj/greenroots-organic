import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, MapPin, Package, Search,
  Loader2, ChevronDown, ChevronUp, Globe, Check, X,
  Image, Save, AlertTriangle, ToggleLeft, ToggleRight,
  ArrowLeft, RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Vegetables','Fruits','Dairy','Grains','Pulses','Spices','Oils','Beverages','Skincare','Electronics','Household','Other'];
const UNITS       = ['kg','g','litre','ml','piece','pack','dozen'];
const STATES      = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'];

const inp = { width:'100%', padding:'9px 12px', border:'1.5px solid #E5E7EB', borderRadius:'8px', fontSize:'0.85rem', fontFamily:'Inter,sans-serif', outline:'none', boxSizing:'border-box' };

const emptyProduct = { name:'', description:'', shortDescription:'', price:'', discountPrice:'', category:'Vegetables', unit:'kg', stock:'', tags:'', isFeatured:false, isNationwide:true, deliveryNote:'' };

// ── Add / Edit Product Modal ──────────────────────────────────
const ProductForm = ({ initial, onSave, onClose }) => {
  const [form,    setForm]    = useState(initial || emptyProduct);
  const [images,  setImages]  = useState([]);
  const [previews,setPreviews]= useState(initial?.images?.map(i=>i.url) || []);
  const [saving,  setSaving]  = useState(false);
  const fileRef = useRef();

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const validate = () => {
    if (!form.name.trim())    { toast.error('Product name required'); return false; }
    if (!form.price)          { toast.error('Price required'); return false; }
    if (!form.stock)          { toast.error('Stock required'); return false; }
    if (!form.description.trim()) { toast.error('Description required'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => {
        if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
      });
      images.forEach(img => fd.append('images', img));

      let data;
      if (initial?._id) {
        const res = await API.put(`/products/${initial._id}`, fd, { headers:{'Content-Type':'multipart/form-data'} });
        data = res.data;
        toast.success('Product updated!');
      } else {
        const res = await API.post('/products', fd, { headers:{'Content-Type':'multipart/form-data'} });
        data = res.data;
        toast.success('Product added!');
      }
      onSave(data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px', overflowY:'auto' }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.92, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'white', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'640px', marginTop:'20px', marginBottom:'20px', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
          <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:'1.05rem', margin:0, display:'flex', alignItems:'center', gap:'8px' }}>
            <Package size={17} color="#2D6A4F"/> {initial ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}><X size={18}/></button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
          {/* Name */}
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Product Name *</label>
            <input style={inp} placeholder="e.g. Organic Basmati Rice" value={form.name} onChange={e => set('name', e.target.value)}/>
          </div>

          {/* Category + Unit */}
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Category *</label>
            <select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Unit *</label>
            <select style={inp} value={form.unit} onChange={e => set('unit', e.target.value)}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Price + Discount */}
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Price (₹) *</label>
            <input style={inp} type="number" placeholder="0" value={form.price} onChange={e => set('price', e.target.value)}/>
          </div>
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Discount Price (₹)</label>
            <input style={inp} type="number" placeholder="Optional" value={form.discountPrice} onChange={e => set('discountPrice', e.target.value)}/>
          </div>

          {/* Stock */}
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Stock Quantity *</label>
            <input style={inp} type="number" placeholder="0" value={form.stock} onChange={e => set('stock', e.target.value)}/>
          </div>
          {/* Tags */}
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Tags (comma separated)</label>
            <input style={inp} placeholder="organic, fresh, local" value={form.tags} onChange={e => set('tags', e.target.value)}/>
          </div>

          {/* Short description */}
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Short Description</label>
            <input style={inp} placeholder="One line summary" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)}/>
          </div>

          {/* Description */}
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Full Description *</label>
            <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }} placeholder="Detailed product description..." value={form.description} onChange={e => set('description', e.target.value)}/>
          </div>

          {/* Images */}
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'6px' }}>Product Images (max 5)</label>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'8px' }}>
              {previews.map((src,i) => (
                <div key={i} style={{ position:'relative' }}>
                  <img src={src} alt="" style={{ width:'70px', height:'70px', objectFit:'cover', borderRadius:'8px', border:'1px solid #E5E7EB' }}/>
                  <button onClick={() => { setImages(p=>p.filter((_,j)=>j!==i)); setPreviews(p=>p.filter((_,j)=>j!==i)); }}
                    style={{ position:'absolute', top:'-6px', right:'-6px', background:'#EF4444', border:'none', borderRadius:'50%', width:'18px', height:'18px', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <X size={10}/>
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ width:'70px', height:'70px', background:'#F9FAFB', border:'2px dashed #D1D5DB', borderRadius:'8px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px', color:'#9CA3AF', fontSize:'0.65rem' }}>
                  <Image size={18}/> Add
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" style={{ display:'none' }} onChange={handleImages}/>
          </div>

          {/* Toggles */}
          <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'7px', cursor:'pointer', fontSize:'0.85rem', color:'#374151' }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} style={{ accentColor:'#2D6A4F', width:'15px', height:'15px' }}/>
              Mark as Featured
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:'7px', cursor:'pointer', fontSize:'0.85rem', color:'#374151' }}>
              <input type="checkbox" checked={form.isNationwide} onChange={e => set('isNationwide', e.target.checked)} style={{ accentColor:'#2D6A4F', width:'15px', height:'15px' }}/>
              Nationwide Delivery
            </label>
          </div>

          {/* Delivery note */}
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'4px' }}>Delivery Note</label>
            <input style={inp} placeholder="e.g. Delivered in 3-5 business days" value={form.deliveryNote} onChange={e => set('deliveryNote', e.target.value)}/>
          </div>
        </div>

        <div style={{ display:'flex', gap:'10px', marginTop:'20px', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', background:'none', border:'1.5px solid #E5E7EB', borderRadius:'9px', cursor:'pointer', fontWeight:600, color:'#6B7280', fontFamily:'Inter,sans-serif' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            style={{ padding:'10px 24px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'9px', fontWeight:700, cursor:saving?'not-allowed':'pointer', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', gap:'7px', opacity:saving?0.75:1 }}>
            {saving ? <><Loader2 size={14} style={{ animation:'spin 1s linear infinite' }}/> Saving...</> : <><Save size={14}/> {initial ? 'Update' : 'Add Product'}</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Stock Manager inline ──────────────────────────────────────
const StockManager = ({ product, onUpdate }) => {
  const [qty,     setQty]     = useState('');
  const [saving,  setSaving]  = useState(false);

  const addStock = async () => {
    const add = parseInt(qty);
    if (!add || add < 1) { toast.error('Enter a valid quantity'); return; }
    setSaving(true);
    try {
      const { data } = await API.put(`/products/${product._id}`, { stock: product.stock + add });
      toast.success(`Added ${add} units to stock!`);
      onUpdate({ ...product, stock: product.stock + add });
      setQty('');
    } catch { toast.error('Failed to update stock'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding:'12px 16px', background:'#FFF8E1', borderTop:'1px solid #FDE68A' }}>
      <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#92400E', marginBottom:'8px', display:'flex', alignItems:'center', gap:'5px' }}>
        <AlertTriangle size={12} color="#D97706"/> Current stock: <strong>{product.stock}</strong> units
      </p>
      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
        <input type="number" min="1" placeholder="Qty to add" value={qty} onChange={e => setQty(e.target.value)}
          style={{ ...inp, width:'130px' }}/>
        <button onClick={addStock} disabled={saving}
          style={{ display:'flex', alignItems:'center', gap:'5px', padding:'8px 14px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'7px', fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.82rem', whiteSpace:'nowrap' }}>
          {saving ? <Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/> : <Plus size={12}/>} Add Stock
        </button>
      </div>
    </div>
  );
};

// ── Main Admin Products ───────────────────────────────────────
const AdminProducts = () => {
  const navigate = useNavigate();
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [editProd,   setEditProd]   = useState(null);
  const [expandId,   setExpandId]   = useState(null);
  const [stockId,    setStockId]    = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products?limit=200');
      setProducts(data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (saved) => {
    setProducts(ps => {
      const idx = ps.findIndex(p => p._id === saved._id);
      if (idx > -1) { const u=[...ps]; u[idx]=saved; return u; }
      return [saved, ...ps];
    });
    setShowForm(false); setEditProd(null);
  };

  const handleToggleActive = async (p) => {
    try {
      await API.put(`/products/${p._id}`, { isActive: !p.isActive });
      setProducts(ps => ps.map(x => x._id===p._id ? {...x,isActive:!p.isActive} : x));
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(ps => ps.filter(p => p._id!==id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'300px' }}>
      <Loader2 size={32} color="#2D6A4F" style={{ animation:'spin 1s linear infinite' }}/>
    </div>
  );

  return (
    <div style={{ padding:'clamp(14px,3vw,28px)' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.2rem,3vw,1.6rem)', margin:0 }}>Manage Products</h1>
          <p style={{ color:'#9CA3AF', fontSize:'0.78rem', margin:'3px 0 0' }}>{products.length} total · {products.filter(p=>p.stock===0).length} out of stock</p>
        </div>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'7px', background:'white', border:'1.5px solid #E5E7EB', borderRadius:'8px', padding:'7px 11px' }}>
            <Search size={13} color="#9CA3AF"/>
            <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ border:'none', outline:'none', fontFamily:'Inter,sans-serif', fontSize:'0.83rem', background:'none', width:'130px' }}/>
          </div>
          <button onClick={() => { setEditProd(null); setShowForm(true); }}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'8px', fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.85rem' }}>
            <Plus size={14}/> Add Product
          </button>
          <button onClick={load} style={{ padding:'9px 12px', background:'white', border:'1.5px solid #E5E7EB', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center' }}>
            <RefreshCw size={14} color="#6B7280"/>
          </button>
        </div>
      </div>

      {/* Out of stock alert */}
      {products.filter(p=>p.stock===0 && p.isActive).length > 0 && (
        <div style={{ background:'#FFF8E1', border:'1px solid #FDE68A', borderRadius:'10px', padding:'10px 16px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
          <AlertTriangle size={15} color="#D97706"/>
          <p style={{ fontSize:'0.82rem', color:'#92400E', margin:0 }}>
            <strong>{products.filter(p=>p.stock===0 && p.isActive).length}</strong> product(s) are out of stock. Click "Stock" to restock them.
          </p>
        </div>
      )}

      {/* Product rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
        {filtered.map(product => (
          <div key={product._id} style={{ background:'white', borderRadius:'12px', border:`1px solid ${product.stock===0 ? '#FDE68A' : '#F3F4F6'}`, boxShadow:'0 1px 4px rgba(0,0,0,0.04)', overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'11px 14px', flexWrap:'wrap' }}>
              <img src={product.images?.[0]?.url||'/placeholder.jpg'} alt={product.name}
                style={{ width:'48px', height:'48px', objectFit:'cover', borderRadius:'7px', background:'#F9FAFB', flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:'120px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                  <p style={{ fontWeight:700, fontSize:'0.88rem', margin:0, color:'#1B1B1B' }}>{product.name}</p>
                  <span style={{ background:'#F3F4F6', color:'#6B7280', fontSize:'0.63rem', fontWeight:600, padding:'1px 6px', borderRadius:'100px' }}>{product.category}</span>
                  {!product.isActive && <span style={{ background:'#FFF1F2', color:'#E11D48', fontSize:'0.63rem', fontWeight:700, padding:'1px 6px', borderRadius:'100px' }}>INACTIVE</span>}
                  {product.stock === 0 && <span style={{ background:'#FEF3C7', color:'#D97706', fontSize:'0.63rem', fontWeight:700, padding:'1px 6px', borderRadius:'100px' }}>OUT OF STOCK</span>}
                </div>
                <p style={{ fontSize:'0.74rem', color:'#9CA3AF', margin:'2px 0 0' }}>
                  ₹{product.discountPrice||product.price} · Stock: <strong style={{ color: product.stock===0?'#EF4444': product.stock<=10?'#D97706':'#374151' }}>{product.stock}</strong>
                </p>
              </div>
              <div style={{ display:'flex', gap:'5px', flexShrink:0, flexWrap:'wrap' }}>
                <button onClick={() => setStockId(stockId===product._id ? null : product._id)}
                  style={{ display:'flex', alignItems:'center', gap:'3px', padding:'5px 9px', background: product.stock===0?'#FEF3C7':'#F3F4F6', color: product.stock===0?'#D97706':'#6B7280', border:'none', borderRadius:'6px', fontWeight:600, fontSize:'0.71rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  + Stock
                </button>
                <button onClick={() => { setEditProd(product); setShowForm(true); }}
                  style={{ padding:'5px 9px', background:'#EFF6FF', color:'#2563EB', border:'none', borderRadius:'6px', cursor:'pointer', display:'flex', alignItems:'center', gap:'3px', fontSize:'0.71rem', fontWeight:600, fontFamily:'Inter,sans-serif' }}>
                  <Edit2 size={10}/> Edit
                </button>
                <button onClick={() => handleToggleActive(product)}
                  style={{ padding:'5px 9px', background: product.isActive?'#FFF1F2':'#F0FDF4', color: product.isActive?'#E11D48':'#2D6A4F', border:'none', borderRadius:'6px', fontWeight:600, fontSize:'0.71rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(product._id)}
                  style={{ padding:'5px 8px', background:'#FFF1F2', color:'#E11D48', border:'none', borderRadius:'6px', cursor:'pointer', display:'flex' }}>
                  <Trash2 size={12}/>
                </button>
              </div>
            </div>

            {/* Inline stock manager */}
            <AnimatePresence>
              {stockId===product._id && (
                <motion.div initial={{ height:0,opacity:0 }} animate={{ height:'auto',opacity:1 }} exit={{ height:0,opacity:0 }} style={{ overflow:'hidden' }}>
                  <StockManager product={product} onUpdate={(updated) => {
                    setProducts(ps => ps.map(p => p._id===updated._id ? updated : p));
                    setStockId(null);
                  }}/>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Product form modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            initial={editProd}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditProd(null); }}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminProducts;
