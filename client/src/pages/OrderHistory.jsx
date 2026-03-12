// ═══════════════════════════════════════════
// OrderHistory.jsx - Save to pages/OrderHistory.jsx
// ═══════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import API from '../utils/api';
import Loader from '../components/common/Loader';

const STATUS_COLORS = {
  placed: '#F59E0B', confirmed: '#3B82F6', packed: '#8B5CF6',
  shipped: '#06B6D4', outForDelivery: '#F97316', delivered: '#22C55E',
  cancelled: '#EF4444', returned: '#6B7280',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    API.get('/orders/my-orders').then(({data}) => setOrders(data.orders)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const filtered = filter ? orders.filter(o => o.orderStatus===filter) : orders;

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px'}}><Loader /></div>;

  return (
    <>
      <Helmet><title>My Orders - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', marginBottom: '20px' }}>My Orders</h1>

        {/* Filter tabs — scrollable on mobile */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
          {['','placed','confirmed','shipped','delivered','cancelled'].map(status => (
            <button key={status} onClick={() => setFilter(status)}
              style={{ padding: '7px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', flexShrink: 0, transition: 'all 0.2s',
                background: filter===status?'#2D6A4F':'#F3F4F6',
                color: filter===status?'white':'#374151' }}>
              {status ? status.charAt(0).toUpperCase()+status.slice(1) : 'All'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>📦</div>
            <h3>No orders found</h3>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: 'clamp(14px,3vw,20px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)'}
                  onMouseOut={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)'}>

                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</p>
                      <p style={{ color: '#6B7280', fontSize: '0.82rem', marginTop: '3px' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ background: `${STATUS_COLORS[order.orderStatus]}20`, color: STATUS_COLORS[order.orderStatus], padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                        {order.orderStatus}
                      </span>
                      <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '1rem' }}>₹{order.totalAmount}</span>
                      <span style={{ color: '#9CA3AF' }}>→</span>
                    </div>
                  </div>

                  {/* Item previews */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
                    {order.items.slice(0,4).map((item,i) => (
                      <img key={i} src={item.image} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                    ))}
                    {order.items.length > 4 && (
                      <div style={{ width: '44px', height: '44px', background: '#F3F4F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>
                        +{order.items.length-4}
                      </div>
                    )}
                    <span style={{ marginLeft: '4px', color: '#6B7280', fontSize: '0.82rem' }}>{order.items.length} item(s)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
