import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from './AdminLayout';
import API from '../../utils/api';
import Loader from '../../components/common/Loader';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{ background: 'white', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#6B7280', fontSize: '0.82rem', marginBottom: '8px' }}>{label}</p>
        <p style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1B1B1B', lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: '0.75rem', color: '#22C55E', marginTop: '6px' }}>{sub}</p>}
      </div>
      <span style={{ fontSize: '2rem' }}>{icon}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <Helmet><title>Admin Dashboard - GreenRoots</title></Helmet>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Dashboard Overview</h1>
        <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '0.9rem' }}>Welcome back! Here's what's happening with your store.</p>
      </div>

      {loading ? <Loader /> : stats ? (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <StatCard icon="💰" label="Total Revenue" value={`₹${(stats.stats?.totalRevenue || 0).toLocaleString('en-IN')}`} color="#22C55E" />
            <StatCard icon="🛒" label="Total Orders" value={stats.stats?.totalOrders || 0} color="#3B82F6" />
            <StatCard icon="👥" label="Total Users" value={stats.stats?.totalUsers || 0} color="#8B5CF6" />
            <StatCard icon="📦" label="Products" value={stats.stats?.totalProducts || 0} color="#F59E0B" />
          </div>

          {/* Recent Orders */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Orders</h3>
                <Link to="/admin/orders" style={{ color: '#2D6A4F', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
              </div>
              {stats.recentOrders?.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr>
                        {['Order', 'Customer', 'Amount', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#9CA3AF', fontWeight: 600, borderBottom: '1px solid #F3F4F6', fontSize: '0.78rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map(order => (
                        <tr key={order._id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                          <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#2D6A4F', fontSize: '0.82rem' }}>#{order._id.slice(-8).toUpperCase()}</td>
                          <td style={{ padding: '12px', fontWeight: 500 }}>{order.user?.name}</td>
                          <td style={{ padding: '12px', fontWeight: 700 }}>₹{order.totalAmount}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{order.orderStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
                  <p>No orders yet</p>
                  <Link to="/products" style={{ color: '#2D6A4F', marginTop: '8px', display: 'inline-block', fontWeight: 600 }}>View Store →</Link>
                </div>
              )}
            </div>

            {/* Low Stock & Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Quick Actions */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '14px' }}>Quick Actions</h3>
                {[
                  { to: '/admin/products', icon: '➕', label: 'Add New Product', color: '#2D6A4F' },
                  { to: '/admin/orders', icon: '🛒', label: 'View All Orders', color: '#3B82F6' },
                  { to: '/admin/users', icon: '👥', label: 'Manage Users', color: '#8B5CF6' },
                ].map(action => (
                  <Link key={action.to} to={action.to} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500, fontSize: '0.9rem', marginBottom: '6px', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ width: '32px', height: '32px', background: `${action.color}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>

              {/* Low Stock Alert */}
              {stats.lowStockProducts?.length > 0 && (
                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '16px', padding: '20px' }}>
                  <h3 style={{ fontWeight: 700, color: '#92400E', marginBottom: '12px', fontSize: '0.95rem' }}>⚠️ Low Stock</h3>
                  {stats.lowStockProducts.map(p => (
                    <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #FDE68A', fontSize: '0.85rem' }}>
                      <span style={{ color: '#374151' }}>{p.name}</span>
                      <span style={{ fontWeight: 700, color: p.stock <= 5 ? '#EF4444' : '#F59E0B' }}>{p.stock} left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
          <p>Could not load dashboard data. Is the server running?</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
