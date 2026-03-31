import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Store, LogOut, Menu, X, Leaf, TrendingUp,
  AlertTriangle, RefreshCw, Truck, Phone, Car,
  UserCheck, Plus, Edit2, Trash2, Save, Loader2,
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import API from '../../utils/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const NAV = [
  { path:'/admin',          Icon:LayoutDashboard, label:'Dashboard'  },
  { path:'/admin/products', Icon:Package,         label:'Products'   },
  { path:'/admin/orders',   Icon:ShoppingCart,    label:'Orders'     },
  { path:'/admin/users',    Icon:Users,           label:'Users'      },
  { path:'/',               Icon:Store,           label:'View Store' },
];

const STATUS_COLORS = {
  placed:'#F59E0B', confirmed:'#3B82F6', packed:'#8B5CF6',
  shipped:'#06B6D4', outForDelivery:'#F97316', delivered:'#22C55E', cancelled:'#EF4444',
};

// ── Shared Sidebar (exported for use in other admin pages) ─────
export const AdminSidebar = ({ mobile, onClose }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const handleLogout = () => { dispatch(logoutUser()); navigate('/'); };

  return (
    <div style={{ width: mobile?'100%':'220px', background:'#1B4332', color:'white', display:'flex', flexDirection:'column', flexShrink:0, ...(mobile?{}:{ position:'sticky', top:0, height:'100vh', overflowY:'auto' }) }}>
      <div style={{ padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ background:'rgba(116,198,157,0.2)', borderRadius:'8px', padding:'5px' }}><Leaf size={15} color="#74C69D"/></div>
          <div>
            <p style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:'0.92rem', margin:0 }}>GreenRoots</p>
            <p style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', margin:0 }}>Admin Panel</p>
          </div>
        </div>
        {mobile && <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.6)' }}><X size={17}/></button>}
      </div>
      <nav style={{ flex:1, padding:'10px 0' }}>
        {NAV.map(({ path,Icon,label }) => {
          const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          return (
            <Link key={label} to={path} onClick={onClose}
              style={{ display:'flex', alignItems:'center', gap:'10px', padding:'11px 20px', color: active?'#74C69D':'rgba(255,255,255,0.7)', textDecoration:'none', fontSize:'0.86rem', fontWeight: active?700:400, background: active?'rgba(116,198,157,0.1)':'transparent', borderLeft: active?'3px solid #74C69D':'3px solid transparent', transition:'all 0.15s' }}>
              <Icon size={15}/> {label}
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout}
        style={{ display:'flex', alignItems:'center', gap:'10px', padding:'14px 20px', color:'rgba(255,120,120,0.85)', background:'none', border:'none', cursor:'pointer', fontSize:'0.86rem', borderTop:'1px solid rgba(255,255,255,0.08)', width:'100%' }}>
        <LogOut size={14}/> Logout
      </button>
    </div>
  );
};

// ── Delivery Agents ───────────────────────────────────────────
const emptyAgent = { name:'', phone:'', vehicleNo:'', zone:'', isActive:true };

const DeliveryAgents = () => {
  const [agents, setAgents]    = useState([]);
  const [showForm, setShowForm]= useState(false);
  const [editing,  setEditing] = useState(null);
  const [form,     setForm]    = useState(emptyAgent);
  const [saving,   setSaving]  = useState(false);

  useEffect(() => {
    try { setAgents(JSON.parse(localStorage.getItem('gr_agents')||'[]')); } catch {}
  }, []);

  const persist = (a) => { localStorage.setItem('gr_agents', JSON.stringify(a)); setAgents(a); };

  const handleSave = () => {
    if (!form.name.trim())         { toast.error('Name required'); return; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit phone required'); return; }
    setSaving(true);
    setTimeout(() => {
      if (editing !== null) { const u = agents.map((a,i)=>i===editing?{...form}:a); persist(u); toast.success('Agent updated!'); }
      else { persist([...agents,{...form,id:Date.now()}]); toast.success('Agent added!'); }
      setShowForm(false); setEditing(null); setForm(emptyAgent); setSaving(false);
    }, 400);
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, margin:0, fontSize:'0.95rem', display:'flex', alignItems:'center', gap:'7px' }}>
          <Truck size={15} color="#2D6A4F"/> Delivery Agents ({agents.length})
        </h3>
        <button onClick={() => { setEditing(null); setForm(emptyAgent); setShowForm(true); }}
          style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'8px', fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.82rem' }}>
          <Plus size={13}/> Add Agent
        </button>
      </div>

      {showForm && (
        <div style={{ background:'#F8FFF4', border:'1px solid #D1FAE5', borderRadius:'12px', padding:'16px', marginBottom:'16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'10px', marginBottom:'12px' }}>
            {[['name','Full Name *','text','Agent name'],['phone','Phone *','tel','10-digit'],['vehicleNo','Vehicle No.','text','KA01AB1234'],['zone','Zone','text','Bangalore South']].map(([k,l,t,p]) => (
              <div key={k}>
                <label style={{ fontSize:'0.7rem', fontWeight:700, color:'#374151', display:'block', marginBottom:'3px' }}>{l}</label>
                <input type={t} placeholder={p} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                  style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #E5E7EB', borderRadius:'7px', fontSize:'0.83rem', fontFamily:'Inter,sans-serif', boxSizing:'border-box', outline:'none', cursor:'text' }}/>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={handleSave} disabled={saving}
              style={{ display:'flex', alignItems:'center', gap:'5px', padding:'8px 16px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'7px', fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.82rem' }}>
              {saving ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving...</> : <><Save size={13}/> Save</>}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyAgent); }}
              style={{ padding:'8px 12px', background:'none', border:'1.5px solid #E5E7EB', borderRadius:'7px', cursor:'pointer', color:'#6B7280', fontFamily:'Inter,sans-serif', fontSize:'0.82rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {agents.length === 0 ? (
        <div style={{ textAlign:'center', padding:'32px', color:'#9CA3AF', background:'white', borderRadius:'12px', border:'2px dashed #E5E7EB' }}>
          <Truck size={32} style={{ margin:'0 auto 10px', opacity:0.3 }}/>
          <p style={{ fontSize:'0.85rem' }}>No agents added yet</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:'10px' }}>
          {agents.map((a,idx) => (
            <div key={idx} style={{ background:'white', borderRadius:'12px', padding:'14px', border:`1px solid ${a.isActive?'#D1FAE5':'#F3F4F6'}`, opacity:a.isActive?1:0.65 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{ background:a.isActive?'#D1FAE5':'#F3F4F6', borderRadius:'50%', width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <UserCheck size={15} color={a.isActive?'#2D6A4F':'#9CA3AF'}/>
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:'0.86rem', margin:0 }}>{a.name}</p>
                    <p style={{ fontSize:'0.72rem', color:'#9CA3AF', margin:'1px 0 0' }}>{a.zone||'No zone'}</p>
                  </div>
                </div>
                <span style={{ background:a.isActive?'#D1FAE5':'#F3F4F6', color:a.isActive?'#065F46':'#9CA3AF', fontSize:'0.6rem', fontWeight:700, padding:'2px 6px', borderRadius:'100px' }}>
                  {a.isActive?'ACTIVE':'INACTIVE'}
                </span>
              </div>
              <div style={{ fontSize:'0.76rem', color:'#6B7280', marginBottom:'10px' }}>
                <p style={{ display:'flex', alignItems:'center', gap:'4px', margin:'2px 0' }}><Phone size={10}/> {a.phone}</p>
                {a.vehicleNo && <p style={{ display:'flex', alignItems:'center', gap:'4px', margin:'2px 0' }}><Car size={10}/> {a.vehicleNo}</p>}
              </div>
              <div style={{ display:'flex', gap:'5px' }}>
                <button onClick={() => { const u=agents.map((x,i)=>i===idx?{...x,isActive:!x.isActive}:x); persist(u); }}
                  style={{ flex:1, padding:'5px', background:a.isActive?'#FEF3C7':'#D1FAE5', color:a.isActive?'#D97706':'#2D6A4F', border:'none', borderRadius:'6px', fontWeight:600, fontSize:'0.68rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  {a.isActive?'Deactivate':'Activate'}
                </button>
                <button onClick={() => { setEditing(idx); setForm({...a}); setShowForm(true); }}
                  style={{ padding:'5px 8px', background:'#EFF6FF', color:'#2563EB', border:'none', borderRadius:'6px', cursor:'pointer', display:'flex' }}><Edit2 size={11}/></button>
                <button onClick={() => { if(window.confirm('Remove agent?')) persist(agents.filter((_,i)=>i!==idx)); }}
                  style={{ padding:'5px 8px', background:'#FFF1F2', color:'#E11D48', border:'none', borderRadius:'6px', cursor:'pointer', display:'flex' }}><Trash2 size={11}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats,       setStats]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab,   setActiveTab]   = useState('overview');

  const loadStats = useCallback(async (silent=false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try { const { data } = await API.get('/admin/dashboard'); setStats(data); }
    catch {} finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(() => loadStats(true), 60000);
    return () => clearInterval(interval);
  }, [loadStats]);

  return (
    <>
      <Helmet><title>Admin Dashboard — GreenRoots</title></Helmet>
      <div style={{ minHeight:'100vh', background:'#F6FAF6', display:'flex' }}>
        <div className="admin-sidebar-desktop"><AdminSidebar mobile={false} onClose={() => {}}/></div>

        {sidebarOpen && (
          <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex' }}>
            <div style={{ width:'260px', flexShrink:0 }}><AdminSidebar mobile={true} onClose={() => setSidebarOpen(false)}/></div>
            <div onClick={() => setSidebarOpen(false)} style={{ flex:1, background:'rgba(0,0,0,0.4)' }}/>
          </div>
        )}

        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
          <div className="admin-topbar-mobile" style={{ background:'#1B4332', padding:'13px 18px', display:'flex', alignItems:'center', gap:'12px' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'white', display:'flex' }}><Menu size={20}/></button>
            <span style={{ fontFamily:'Playfair Display,serif', color:'white', fontWeight:700, fontSize:'0.95rem' }}>GreenRoots Admin</span>
          </div>

          <div style={{ flex:1, padding:'clamp(16px,3vw,28px)', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
              <div>
                <h1 style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)', margin:0 }}>Dashboard</h1>
                <p style={{ color:'#9CA3AF', fontSize:'0.78rem', marginTop:'3px' }}>Welcome back, Admin</p>
              </div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                <Link to="/admin/products"
                  style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'9px', fontWeight:700, fontFamily:'Inter,sans-serif', fontSize:'0.83rem', textDecoration:'none' }}>
                  <Plus size={14}/> Add Product
                </Link>
                <button onClick={() => loadStats(true)} disabled={refreshing}
                  style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 14px', background:'white', color:'#374151', border:'1.5px solid #E5E7EB', borderRadius:'9px', fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.83rem' }}>
                  <RefreshCw size={13} style={{ animation: refreshing?'spin 1s linear infinite':undefined }}/> Refresh
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:'4px', background:'white', borderRadius:'10px', padding:'4px', marginBottom:'20px', border:'1px solid #F3F4F6', width:'fit-content' }}>
              {[['overview','Overview'],['agents','Delivery Agents']].map(([id,label]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  style={{ padding:'8px 16px', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600, fontSize:'0.82rem', background: activeTab===id?'#2D6A4F':'transparent', color: activeTab===id?'white':'#6B7280', transition:'all 0.15s', fontFamily:'Inter,sans-serif' }}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              loading ? <Loader/> : stats && (
                <>
                  {/* ── Stat cards — fixed alignment ── */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px', marginBottom:'24px' }}>
                    {[
                      { Icon:TrendingUp,   label:'Revenue',   value:`₹${Number(stats.stats.totalRevenue||0).toLocaleString('en-IN')}`, color:'#22C55E' },
                      { Icon:ShoppingCart, label:'Orders',    value:stats.stats.totalOrders||0,   color:'#3B82F6' },
                      { Icon:Users,        label:'Users',     value:stats.stats.totalUsers||0,    color:'#8B5CF6' },
                      { Icon:Package,      label:'Products',  value:stats.stats.totalProducts||0, color:'#F59E0B' },
                    ].map(({ Icon,label,value,color }) => (
                      <div key={label} style={{ background:'white', borderRadius:'14px', padding:'20px', border:'1px solid #F3F4F6', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', overflow:'hidden' }}>
                        {/* Icon row */}
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                          <p style={{ color:'#9CA3AF', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', margin:0 }}>{label}</p>
                          <div style={{ background:`${color}18`, borderRadius:'9px', padding:'8px', flexShrink:0 }}>
                            <Icon size={17} color={color} strokeWidth={2}/>
                          </div>
                        </div>
                        {/* Value */}
                        <p style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800, color:'#1B1B1B', fontFamily:'Inter,sans-serif', margin:0, lineHeight:1 }}>
                          {value}
                        </p>
                        {/* Color accent bar */}
                        <div style={{ height:'3px', background:`${color}30`, borderRadius:'2px', marginTop:'14px' }}>
                          <div style={{ height:'100%', width:'60%', background:color, borderRadius:'2px' }}/>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent orders */}
                  <div style={{ background:'white', borderRadius:'14px', padding:'clamp(14px,3vw,22px)', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', marginBottom:'16px', border:'1px solid #F3F4F6', overflowX:'auto' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px', flexWrap:'wrap', gap:'8px' }}>
                      <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:'0.92rem', margin:0 }}>Recent Orders</h3>
                      <Link to="/admin/orders" style={{ color:'#2D6A4F', fontSize:'0.8rem', fontWeight:700, textDecoration:'none' }}>View All →</Link>
                    </div>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.82rem', minWidth:'360px' }}>
                      <thead>
                        <tr style={{ borderBottom:'2px solid #F3F4F6' }}>
                          {['Order ID','Customer','Amount','Status'].map(h => (
                            <th key={h} style={{ textAlign:'left', padding:'8px 10px', color:'#9CA3AF', fontWeight:700, fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders?.map(order => (
                          <tr key={order._id} style={{ borderBottom:'1px solid #F9FAFB' }}>
                            <td style={{ padding:'9px 10px' }}>
                              <span style={{ fontFamily:'monospace', fontWeight:700, color:'#2D6A4F', fontSize:'0.8rem' }}>#{order._id.slice(-8).toUpperCase()}</span>
                            </td>
                            <td style={{ padding:'9px 10px', color:'#374151' }}>{order.user?.name}</td>
                            <td style={{ padding:'9px 10px', fontWeight:700, color:'#1B1B1B' }}>₹{order.totalAmount}</td>
                            <td style={{ padding:'9px 10px' }}>
                              <span style={{ background:`${STATUS_COLORS[order.orderStatus]||'#9CA3AF'}18`, color:STATUS_COLORS[order.orderStatus]||'#9CA3AF', padding:'3px 9px', borderRadius:'100px', fontSize:'0.7rem', fontWeight:700, textTransform:'capitalize', whiteSpace:'nowrap' }}>
                                {order.orderStatus==='outForDelivery'?'Out for Delivery':order.orderStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Low stock */}
                  {stats.lowStockProducts?.length > 0 && (
                    <div style={{ background:'#FFFBEB', border:'1px solid #FCD34D', borderRadius:'12px', padding:'clamp(14px,3vw,20px)' }}>
                      <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, color:'#92400E', marginBottom:'10px', fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'6px' }}>
                        <AlertTriangle size={14} color="#D97706"/> Low Stock Alert
                      </h3>
                      {stats.lowStockProducts.map(p => (
                        <div key={p._id} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #FDE68A', fontSize:'0.82rem' }}>
                          <span style={{ color:'#374151' }}>{p.name}</span>
                          <span style={{ fontWeight:700, color:p.stock===0?'#DC2626':p.stock<=5?'#EF4444':'#F59E0B' }}>
                            {p.stock===0?'OUT OF STOCK':`${p.stock} left`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )
            )}
            {activeTab === 'agents' && <DeliveryAgents/>}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default AdminDashboard;
