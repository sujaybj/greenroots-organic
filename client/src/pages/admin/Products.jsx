import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Globe, Check, X, Plus, Search,
  Loader2, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Package,
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

const inputStyle = { width: '100%', padding: '8px 10px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '0.83rem', fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box' };

// ── Reusable area builder ─────────────────────────────────────
const AreaBuilder = ({ areas, setAreas, nationwide, setNationwide, note, setNote }) => {
  const [adding,  setAdding]  = useState(false);
  const [newArea, setNewArea] = useState({ state: '', cities: '', pincodes: '', note: '' });

  const addArea = () => {
    if (!newArea.state) { toast.error('Select a state'); return; }
    setAreas(prev => [...prev, {
      state:    newArea.state,
      cities:   newArea.cities.split(',').map(c => c.trim()).filter(Boolean),
      pincodes: newArea.pincodes.split(',').map(p => p.trim()).filter(Boolean),
      note:     newArea.note,
      isActive: true,
    }]);
    setNewArea({ state: '', cities: '', pincodes: '', note: '' });
    setAdding(false);
  };

  return (
    <div>
      {/* Nationwide toggle */}
      <button onClick={() => setNationwide(n => !n)}
        style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginBottom: '10px' }}>
        {nationwide ? <ToggleRight size={26} color="#2D6A4F"/> : <ToggleLeft size={26} color="#D1D5DB"/>}
        <span style={{ fontSize: '0.83rem', color: '#374151', fontFamily: 'Inter,sans-serif', fontWeight: nationwide ? 700 : 400 }}>
          {nationwide ? 'Nationwide — delivering everywhere' : 'Specific states/cities only'}
        </span>
      </button>

      {!nationwide && (
        <>
          {/* Area chips */}
          {areas.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {areas.map((area, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: area.isActive ? '#F0FDF4' : '#F9FAFB', border: `1px solid ${area.isActive ? '#D1FAE5' : '#E5E7EB'}`, borderRadius: '7px' }}>
                  <MapPin size={12} color={area.isActive ? '#2D6A4F' : '#9CA3AF'}/>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.82rem', color: '#1B1B1B' }}>
                    {area.state}{area.cities.length > 0 && <span style={{ fontWeight: 400, color: '#6B7280' }}> · {area.cities.join(', ')}</span>}
                  </span>
                  <button onClick={() => setAreas(a => a.map((x,i) => i===idx ? {...x,isActive:!x.isActive} : x))}
                    style={{ fontSize: '0.68rem', fontWeight: 700, color: area.isActive ? '#D97706' : '#2D6A4F', background: area.isActive ? '#FEF3C7' : '#D1FAE5', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}>
                    {area.isActive ? 'Off' : 'On'}
                  </button>
                  <button onClick={() => setAreas(a => a.filter((_,i)=>i!==idx))}
                    style={{ background: '#FFF1F2', border: 'none', borderRadius: '4px', padding: '3px', cursor: 'pointer', color: '#E11D48', display: 'flex' }}>
                    <X size={11}/>
                  </button>
                </div>
              ))}
            </div>
          )}

          {adding ? (
            <div style={{ background: '#F8FFF4', border: '1px solid #D1FAE5', borderRadius: '9px', padding: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '3px' }}>State *</label>
                  <select style={inputStyle} value={newArea.state} onChange={e => setNewArea(a=>({...a,state:e.target.value}))}>
                    <option value="">Select</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '3px' }}>Cities</label>
                  <input style={inputStyle} placeholder="Bangalore, Mysore" value={newArea.cities} onChange={e => setNewArea(a=>({...a,cities:e.target.value}))}/>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '3px' }}>Pincodes</label>
                  <input style={inputStyle} placeholder="560001, 560034" value={newArea.pincodes} onChange={e => setNewArea(a=>({...a,pincodes:e.target.value}))}/>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '3px' }}>Note</label>
                  <input style={inputStyle} placeholder="3-5 days" value={newArea.note} onChange={e => setNewArea(a=>({...a,note:e.target.value}))}/>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '7px' }}>
                <button onClick={addArea} style={{ flex:1, padding:'7px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'6px', fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px' }}>
                  <Check size={12}/> Add
                </button>
                <button onClick={() => setAdding(false)} style={{ padding:'7px 12px', background:'none', border:'1.5px solid #E5E7EB', borderRadius:'6px', cursor:'pointer', color:'#6B7280', fontFamily:'Inter,sans-serif', fontSize:'0.8rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', background:'none', border:'1.5px dashed #2D6A4F', borderRadius:'7px', color:'#2D6A4F', fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', marginBottom:'8px' }}>
              <Plus size={12}/> Add State / Area
            </button>
          )}
        </>
      )}

      <div style={{ marginTop: '8px' }}>
        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '3px' }}>Customer-visible note</label>
        <input style={inputStyle} placeholder="e.g. Delivery in 3-5 days" value={note} onChange={e => setNote(e.target.value)}/>
      </div>
    </div>
  );
};

// ── Bulk apply panel ──────────────────────────────────────────
const BulkPanel = ({ products, onClose }) => {
  const [areas,      setAreas]      = useState([]);
  const [nationwide, setNationwide] = useState(true);
  const [note,       setNote]       = useState('');
  const [selected,   setSelected]   = useState(new Set(products.map(p => p._id)));
  const [applying,   setApplying]   = useState(false);

  const toggle = id => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const apply = async () => {
    if (selected.size === 0) { toast.error('Select at least one product'); return; }
    setApplying(true);
    let ok = 0, fail = 0;
    for (const id of selected) {
      try {
        await API.put(`/products/${id}/delivery-areas`, { deliverableAreas: areas, isNationwide: nationwide, deliveryNote: note });
        ok++;
      } catch { fail++; }
    }
    setApplying(false);
    fail === 0 ? toast.success(`Updated ${ok} products!`) : toast.error(`${ok} done, ${fail} failed`);
    onClose(true);
  };

  return (
    <div style={{ background: 'white', borderRadius: '14px', border: '2px solid #2D6A4F', padding: 'clamp(14px,3vw,22px)', marginBottom: '18px', boxShadow: '0 4px 20px rgba(45,106,79,0.12)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, margin:0, fontSize:'1rem', color:'#1B4332', display:'flex', alignItems:'center', gap:'8px' }}>
            <Globe size={16} color="#2D6A4F"/> Set Delivery for Multiple Products
          </h3>
          <p style={{ color:'#6B7280', fontSize:'0.78rem', margin:'3px 0 0' }}>Configure once, apply to any number of products</p>
        </div>
        <button onClick={() => onClose(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}><X size={16}/></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px' }}>
        {/* Config */}
        <div>
          <p style={{ fontWeight:700, fontSize:'0.75rem', color:'#374151', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Delivery Settings</p>
          <AreaBuilder areas={areas} setAreas={setAreas} nationwide={nationwide} setNationwide={setNationwide} note={note} setNote={setNote}/>
        </div>

        {/* Product checkboxes */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, fontSize:'0.75rem', color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>
              Products ({selected.size}/{products.length} selected)
            </p>
            <div style={{ display:'flex', gap:'5px' }}>
              <button onClick={() => setSelected(new Set(products.map(p=>p._id)))} style={{ fontSize:'0.7rem', fontWeight:600, color:'#2D6A4F', background:'#D1FAE5', border:'none', borderRadius:'4px', padding:'2px 7px', cursor:'pointer' }}>All</button>
              <button onClick={() => setSelected(new Set())} style={{ fontSize:'0.7rem', fontWeight:600, color:'#6B7280', background:'#F3F4F6', border:'none', borderRadius:'4px', padding:'2px 7px', cursor:'pointer' }}>None</button>
            </div>
          </div>
          <div style={{ maxHeight:'210px', overflowY:'auto', border:'1px solid #F3F4F6', borderRadius:'8px' }}>
            {products.map(p => (
              <label key={p._id} style={{ display:'flex', alignItems:'center', gap:'9px', padding:'8px 12px', borderBottom:'1px solid #F9FAFB', cursor:'pointer', background: selected.has(p._id) ? '#F0FDF4' : 'white' }}>
                <input type="checkbox" checked={selected.has(p._id)} onChange={() => toggle(p._id)} style={{ accentColor:'#2D6A4F', width:'14px', height:'14px', flexShrink:0 }}/>
                <img src={p.images?.[0]?.url||'/placeholder.jpg'} alt={p.name} style={{ width:'28px', height:'28px', objectFit:'cover', borderRadius:'4px', background:'#F3F4F6', flexShrink:0 }}/>
                <span style={{ fontSize:'0.82rem', fontWeight:500, color:'#1B1B1B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{p.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop:'16px', display:'flex', gap:'10px', justifyContent:'flex-end', flexWrap:'wrap' }}>
        <button onClick={() => onClose(false)} style={{ padding:'9px 18px', background:'none', border:'1.5px solid #E5E7EB', borderRadius:'8px', fontWeight:600, cursor:'pointer', color:'#6B7280', fontFamily:'Inter,sans-serif', fontSize:'0.85rem' }}>Cancel</button>
        <button onClick={apply} disabled={applying}
          style={{ padding:'9px 22px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'8px', fontWeight:700, cursor: applying?'not-allowed':'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'7px', opacity: applying?0.75:1 }}>
          {applying ? <><Loader2 size={13} style={{animation:'spin 1s linear infinite'}}/> Applying...</> : <><Check size={13}/> Apply to {selected.size} Products</>}
        </button>
      </div>
    </div>
  );
};

// ── Per-product inline delivery ───────────────────────────────
const ProductDelivery = ({ product, onSave }) => {
  const [areas,      setAreas]      = useState(product.deliverableAreas || []);
  const [nationwide, setNationwide] = useState(product.isNationwide || false);
  const [note,       setNote]       = useState(product.deliveryNote   || '');
  const [saving,     setSaving]     = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await API.put(`/products/${product._id}/delivery-areas`, { deliverableAreas: areas, isNationwide: nationwide, deliveryNote: note });
      toast.success('Saved!');
      onSave({ deliverableAreas: areas, isNationwide: nationwide, deliveryNote: note });
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding:'14px 16px', borderTop:'1px solid #F3F4F6', background:'#FAFFFE' }}>
      <AreaBuilder areas={areas} setAreas={setAreas} nationwide={nationwide} setNationwide={setNationwide} note={note} setNote={setNote}/>
      <button onClick={save} disabled={saving}
        style={{ marginTop:'12px', padding:'8px 18px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'8px', fontWeight:700, cursor: saving?'not-allowed':'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.83rem', display:'flex', alignItems:'center', gap:'6px', opacity: saving?0.7:1 }}>
        {saving ? <><Loader2 size={12} style={{animation:'spin 1s linear infinite'}}/> Saving...</> : <><Check size={12}/> Save</>}
      </button>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────
const AdminProducts = () => {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showBulk,   setShowBulk]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products?limit=200');
      setProducts(data.products || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = async (p) => {
    try {
      await API.put(`/products/${p._id}`, { isActive: !p.isActive });
      setProducts(ps => ps.map(x => x._id === p._id ? { ...x, isActive: !p.isActive } : x));
    } catch {}
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
          <p style={{ color:'#9CA3AF', fontSize:'0.78rem', margin:'3px 0 0' }}>{products.length} products</p>
        </div>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'7px', background:'white', border:'1.5px solid #E5E7EB', borderRadius:'8px', padding:'7px 11px' }}>
            <Search size={13} color="#9CA3AF"/>
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ border:'none', outline:'none', fontFamily:'Inter,sans-serif', fontSize:'0.83rem', background:'none', width:'130px' }}/>
          </div>
          <button onClick={() => setShowBulk(b => !b)}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background: showBulk?'#1B4332':'#2D6A4F', color:'white', border:'none', borderRadius:'8px', fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.83rem' }}>
            <Globe size={13}/> {showBulk ? 'Close' : 'Set All Delivery'}
          </button>
        </div>
      </div>

      {/* Bulk panel */}
      <AnimatePresence>
        {showBulk && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}>
            <BulkPanel products={products} onClose={(reload) => { setShowBulk(false); if (reload) load(); }}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
        {filtered.map(product => (
          <div key={product._id} style={{ background:'white', borderRadius:'11px', border:'1px solid #F3F4F6', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'11px 14px', flexWrap:'wrap' }}>
              <img src={product.images?.[0]?.url||'/placeholder.jpg'} alt={product.name}
                style={{ width:'46px', height:'46px', objectFit:'cover', borderRadius:'7px', background:'#F9FAFB', flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:'120px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                  <p style={{ fontWeight:700, fontSize:'0.88rem', margin:0, color:'#1B1B1B' }}>{product.name}</p>
                  <span style={{ background:'#F3F4F6', color:'#6B7280', fontSize:'0.63rem', fontWeight:600, padding:'1px 6px', borderRadius:'100px' }}>{product.category}</span>
                  {!product.isActive && <span style={{ background:'#FFF1F2', color:'#E11D48', fontSize:'0.63rem', fontWeight:700, padding:'1px 6px', borderRadius:'100px' }}>INACTIVE</span>}
                </div>
                <p style={{ fontSize:'0.74rem', color:'#9CA3AF', margin:'2px 0 0' }}>
                  ₹{product.discountPrice||product.price} · Stock: {product.stock} ·{' '}
                  {product.isNationwide ? <span style={{ color:'#2D6A4F', fontWeight:600 }}>Nationwide</span>
                    : product.deliverableAreas?.length > 0 ? <span style={{ color:'#2D6A4F', fontWeight:600 }}>{product.deliverableAreas.length} states</span>
                    : <span style={{ color:'#F59E0B', fontWeight:600 }}>No delivery set</span>}
                </p>
              </div>
              <div style={{ display:'flex', gap:'5px', flexShrink:0 }}>
                <button onClick={() => toggleActive(product)}
                  style={{ padding:'5px 9px', background: product.isActive?'#FFF1F2':'#F0FDF4', color: product.isActive?'#E11D48':'#2D6A4F', border:'none', borderRadius:'6px', fontWeight:600, fontSize:'0.71rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => setExpandedId(expandedId===product._id ? null : product._id)}
                  style={{ display:'flex', alignItems:'center', gap:'3px', padding:'5px 9px', background: expandedId===product._id?'#D1FAE5':'#F3F4F6', color: expandedId===product._id?'#2D6A4F':'#6B7280', border:'none', borderRadius:'6px', fontWeight:600, fontSize:'0.71rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  <MapPin size={10}/> Delivery {expandedId===product._id ? <ChevronUp size={10}/> : <ChevronDown size={10}/>}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedId===product._id && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
                  <ProductDelivery
                    product={product}
                    onSave={(updated) => {
                      setProducts(ps => ps.map(p => p._id===product._id ? {...p,...updated} : p));
                      setExpandedId(null);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminProducts;
