import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Store, LogOut, Menu, X, Leaf,
  TrendingUp, AlertTriangle,
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import API from '../../utils/api';
import Loader from '../../components/common/Loader';

const NAV_ITEMS = [
  { path: '/admin',          Icon: LayoutDashboard, label: 'Dashboard'  },
  { path: '/admin/products', Icon: Package,         label: 'Products'   },
  { path: '/admin/orders',   Icon: ShoppingCart,    label: 'Orders'     },
  { path: '/admin/users',    Icon: Users,           label: 'Users'      },
  { path: '/',               Icon: Store,           label: 'View Store' },
];

const STATUS_COLORS = {
  placed:         '#F59E0B',
  confirmed:      '#3B82F6',
  packed:         '#8B5CF6',
  shipped:        '#06B6D4',
  outForDelivery: '#F97316',
  delivered:      '#22C55E',
  cancelled:      '#EF4444',
};

const StatCard = ({ Icon, label, value, color, sub }) => (
  <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${color}`, border: `1px solid #F3F4F6`, borderLeftColor: color }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#9CA3AF', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
        <p style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 800, color: '#1B1B1B', fontFamily: 'Inter,sans-serif', margin: '6px 0 0' }}>{value}</p>
        {sub && <p style={{ fontSize: '0.75rem', color: '#22C55E', margin: '4px 0 0', fontWeight: 600 }}>{sub}</p>}
      </div>
      <div style={{ background: `${color}18`, borderRadius: '10px', padding: '10px' }}>
        <Icon size={20} color={color}/>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { dispatch(logoutUser()); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <div style={{
      width: mobile ? '100%' : '220px',
      background: '#1B4332',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      ...(mobile ? {} : { position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }),
    }}>
      {/* Brand */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '8px', padding: '6px' }}>
              <Leaf size={16} color="#74C69D"/>
            </div>
            <div>
              <p style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, fontSize: '1rem', margin: 0 }}>GreenRoots</p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Admin Panel</p>
            </div>
          </div>
          {mobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '4px' }}>
              <X size={18}/>
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV_ITEMS.map(({ path, Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link key={label} to={path} onClick={() => setSidebarOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 20px', color: active ? '#74C69D' : 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: active ? 700 : 400, background: active ? 'rgba(116,198,157,0.12)' : 'transparent', borderLeft: active ? '3px solid #74C69D' : '3px solid transparent', transition: 'all 0.15s' }}>
              <Icon size={15}/> {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', color: 'rgba(255,120,120,0.85)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
        <LogOut size={15}/> Logout
      </button>
    </div>
  );

  return (
    <>
      <Helmet><title>Admin Dashboard — GreenRoots</title></Helmet>
      <div style={{ minHeight: '100vh', background: '#F8FFF4', display: 'flex' }}>

        {/* Desktop sidebar */}
        <div className="admin-sidebar-desktop">
          <Sidebar/>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
            <div style={{ width: '260px', flexShrink: 0 }}>
              <Sidebar mobile/>
            </div>
            <div onClick={() => setSidebarOpen(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }}/>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Mobile topbar */}
          <div className="admin-topbar-mobile" style={{ background: '#1B4332', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', padding: '2px' }}>
              <Menu size={20}/>
            </button>
            <span style={{ fontFamily: 'Playfair Display,serif', color: 'white', fontWeight: 700, fontSize: '1rem' }}>GreenRoots Admin</span>
          </div>

          <div style={{ flex: 1, padding: 'clamp(16px,3vw,32px)', overflowY: 'auto' }}>
            <h1 style={{ fontSize: 'clamp(1.2rem,3vw,1.7rem)', marginBottom: '4px' }}>Dashboard</h1>
            <p style={{ color: '#9CA3AF', marginBottom: '24px', fontSize: '0.85rem' }}>Welcome back, Admin</p>

            {loading ? <Loader/> : stats && (
              <>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '14px', marginBottom: '24px' }}>
                  <StatCard Icon={TrendingUp} label="Revenue"  value={`₹${stats.stats.totalRevenue?.toLocaleString('en-IN')}`} color="#22C55E"/>
                  <StatCard Icon={ShoppingCart} label="Orders"  value={stats.stats.totalOrders}    color="#3B82F6"/>
                  <StatCard Icon={Users}        label="Users"   value={stats.stats.totalUsers}     color="#8B5CF6"/>
                  <StatCard Icon={Package}      label="Products" value={stats.stats.totalProducts}  color="#F59E0B"/>
                </div>

                {/* Recent orders */}
                <div style={{ background: 'white', borderRadius: '14px', padding: 'clamp(16px,3vw,24px)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '18px', border: '1px solid #F3F4F6', overflowX: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Recent Orders</h3>
                    <Link to="/admin/orders" style={{ color: '#2D6A4F', fontSize: '0.83rem', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '400px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                        {['Order ID', 'Customer', 'Amount', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#9CA3AF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders?.map(order => (
                        <tr key={order._id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                          <td style={{ padding: '10px' }}>
                            <Link to={`/admin/orders/${order._id}`} style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2D6A4F', textDecoration: 'none', fontSize: '0.83rem' }}>
                              #{order._id.slice(-8).toUpperCase()}
                            </Link>
                          </td>
                          <td style={{ padding: '10px', color: '#374151' }}>{order.user?.name}</td>
                          <td style={{ padding: '10px', fontWeight: 700, color: '#2D6A4F' }}>₹{order.totalAmount}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ background: `${STATUS_COLORS[order.orderStatus] || '#9CA3AF'}18`, color: STATUS_COLORS[order.orderStatus] || '#9CA3AF', padding: '3px 8px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                              {order.orderStatus === 'outForDelivery' ? 'Out for Delivery' : order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Low stock */}
                {stats.lowStockProducts?.length > 0 && (
                  <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '14px', padding: 'clamp(14px,3vw,20px)' }}>
                    <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, color: '#92400E', marginBottom: '12px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <AlertTriangle size={15} color="#D97706"/> Low Stock Alert
                    </h3>
                    {stats.lowStockProducts.map(p => (
                      <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #FDE68A', fontSize: '0.85rem' }}>
                        <span style={{ color: '#374151' }}>{p.name}</span>
                        <span style={{ fontWeight: 700, color: p.stock <= 5 ? '#DC2626' : '#F59E0B' }}>{p.stock} left</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .admin-sidebar-desktop { display: block; }
        .admin-topbar-mobile { display: none; }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-topbar-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;
