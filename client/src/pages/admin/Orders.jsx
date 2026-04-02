import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hourglass, CheckCircle2, IndianRupee, ShoppingCart, Search } from 'lucide-react';
import AdminLayout from './AdminLayout';
import API from '../../utils/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['placed', 'confirmed', 'packed', 'shipped', 'outForDelivery', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  placed: { bg: '#FEF3C7', text: '#92400E' },
  confirmed: { bg: '#DBEAFE', text: '#1E40AF' },
  packed: { bg: '#EDE9FE', text: '#6D28D9' },
  shipped: { bg: '#CFFAFE', text: '#164E63' },
  outForDelivery: { bg: '#FED7AA', text: '#92400E' },
  delivered: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/admin/orders')
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, orderStatus: status } : o)));
      toast.success(`Order marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  let filtered = orders;
  if (filter) filtered = filtered.filter(o => o.orderStatus === filter);
  if (search) {
    const text = search.toLowerCase();
    filtered = filtered.filter(o =>
      o._id.toLowerCase().includes(text) ||
      o.user?.name?.toLowerCase().includes(text) ||
      o.user?.email?.toLowerCase().includes(text)
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => ['placed', 'confirmed', 'packed'].includes(o.orderStatus)).length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };

  return (
    <AdminLayout>
      <Helmet><title>Manage Orders - Admin</title></Helmet>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Orders', value: stats.total, Icon: ShoppingCart, color: '#3B82F6' },
          { label: 'Active Orders', value: stats.pending, Icon: Hourglass, color: '#F59E0B' },
          { label: 'Delivered', value: stats.delivered, Icon: CheckCircle2, color: '#22C55E' },
          { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, Icon: IndianRupee, color: '#2D6A4F' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', borderLeft: `3px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#6B7280', fontSize: '0.78rem', marginBottom: '4px' }}>{stat.label}</p>
                <p style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1B1B1B' }}>{stat.value}</p>
              </div>
              <div style={{ background: `${stat.color}1A`, borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.Icon size={20} color={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search order ID or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '9px 14px 9px 34px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.88rem', outline: 'none', minWidth: '240px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('')} style={{ padding: '7px 14px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', background: !filter ? '#2D6A4F' : '#F3F4F6', color: !filter ? 'white' : '#374151' }}>All</button>
          {STATUS_OPTIONS.map(s => {
            const c = STATUS_COLORS[s] || { bg: '#F3F4F6', text: '#374151' };
            return (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 14px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', background: filter === s ? c.bg : '#F3F4F6', color: filter === s ? c.text : '#374151', textTransform: 'capitalize' }}>
                {s === 'outForDelivery' ? 'Out for Delivery' : s}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? <Loader /> : (
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Order Status', 'Update Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: '#6B7280', fontWeight: 600, borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const sc = STATUS_COLORS[order.orderStatus] || { bg: '#F3F4F6', text: '#374151' };
                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid #F3F4F6' }} onMouseOver={e => { e.currentTarget.style.background = '#FAFAFA'; }} onMouseOut={e => { e.currentTarget.style.background = 'white'; }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#2D6A4F', whiteSpace: 'nowrap' }}>#{order._id.slice(-8).toUpperCase()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{order.user?.name || 'Unknown'}</div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '2px' }}>{order.user?.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#374151' }}>
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {order.items?.slice(0, 3).map((item, i) => (
                            <img key={i} src={item.image} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#2D6A4F', whiteSpace: 'nowrap' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: order.paymentStatus === 'paid' ? '#D1FAE5' : '#FEF3C7', color: order.paymentStatus === 'paid' ? '#065F46' : '#92400E', padding: '4px 10px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: sc.bg, color: sc.text, padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {order.orderStatus === 'outForDelivery' ? 'Out for Delivery' : order.orderStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={order.orderStatus}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id || order.orderStatus === 'delivered' || order.orderStatus === 'cancelled'}
                          style={{ padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #E5E7EB', fontSize: '0.85rem', cursor: 'pointer', background: 'white', outline: 'none', minWidth: '140px' }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>
                              {s === 'outForDelivery' ? 'Out for Delivery' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
              <ShoppingCart size={46} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>No orders found</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
