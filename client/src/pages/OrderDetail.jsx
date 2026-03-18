import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Package, CheckCircle, Truck, MapPin, Home,
  Clock, ChevronLeft, Phone, XCircle, RefreshCw,
} from 'lucide-react';
import API from '../utils/api';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

// ── Status config with icons + location descriptions ─────────
const STATUS_CONFIG = {
  placed:         { Icon: Package,      color: '#F59E0B', bg: '#FEF3C7', label: 'Order Placed',       location: 'GreenRoots Warehouse, Bangalore' },
  confirmed:      { Icon: CheckCircle,  color: '#3B82F6', bg: '#DBEAFE', label: 'Confirmed',           location: 'GreenRoots Processing Centre, Bangalore' },
  packed:         { Icon: Package,      color: '#8B5CF6', bg: '#EDE9FE', label: 'Packed',              location: 'GreenRoots Dispatch Hub, Bangalore' },
  shipped:        { Icon: Truck,        color: '#06B6D4', bg: '#CFFAFE', label: 'Shipped',             location: 'In Transit' },
  outForDelivery: { Icon: MapPin,       color: '#F97316', bg: '#FFEDD5', label: 'Out for Delivery',    location: 'Local Delivery Partner' },
  delivered:      { Icon: Home,         color: '#22C55E', bg: '#DCFCE7', label: 'Delivered',           location: 'Delivered to your address' },
  cancelled:      { Icon: XCircle,      color: '#EF4444', bg: '#FEE2E2', label: 'Cancelled',           location: '' },
  returned:       { Icon: RefreshCw,    color: '#6B7280', bg: '#F3F4F6', label: 'Returned',            location: '' },
};

const STATUS_STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'outForDelivery', 'delivered'];

const fmt = (ts) => {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order,      setOrder]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await API.put(`/orders/${id}/cancel`);
      setOrder(data.order);
      toast.success('Order cancelled');
    } catch {} finally { setCancelling(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Loader/></div>;
  if (!order)  return <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>Order not found</div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';
  const currentCfg  = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;

  // Build a map of status → timestamp from statusHistory
  const historyMap = {};
  order.statusHistory?.forEach(h => { historyMap[h.status] = h; });

  return (
    <>
      <Helmet><title>Order #{id.slice(-8).toUpperCase()} — GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '28px', paddingBottom: '56px', maxWidth: '820px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
          <div>
            <Link to="/orders" style={{ color: '#6B7280', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '6px', textDecoration: 'none' }}>
              <ChevronLeft size={14}/> My Orders
            </Link>
            <h1 style={{ fontSize: 'clamp(1.2rem,3vw,1.6rem)', margin: 0 }}>Order #{id.slice(-8).toUpperCase()}</h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginTop: '3px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Current status badge */}
            <span style={{ background: currentCfg.bg, color: currentCfg.color, padding: '6px 14px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <currentCfg.Icon size={13}/> {currentCfg.label}
            </span>
            {['placed', 'confirmed'].includes(order.orderStatus) && (
              <button onClick={handleCancel} disabled={cancelling}
                style={{ padding: '7px 14px', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.82rem' }}>
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* ── LIVE TRACKING TIMELINE ── */}
        {!isCancelled && (
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px,4vw,28px)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={17} color="#2D6A4F"/> Live Tracking
              </h3>
              {order.trackingId && (
                <span style={{ background: '#F0FDF4', color: '#2D6A4F', padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace' }}>
                  Tracking: {order.trackingId}
                </span>
              )}
            </div>

            {/* Step progress bar — horizontal on desktop, hidden labels on mobile */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
              {STATUS_STEPS.map((step, i) => {
                const cfg      = STATUS_CONFIG[step];
                const done     = i < currentStep;
                const active   = i === currentStep;
                const upcoming = i > currentStep;
                return (
                  <React.Fragment key={step}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '56px', flexShrink: 0 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done || active ? cfg.color : '#E5E7EB', transition: 'all 0.3s', boxShadow: active ? `0 0 0 4px ${cfg.bg}` : 'none' }}>
                        {done
                          ? <CheckCircle size={18} color="white" strokeWidth={2.5}/>
                          : <cfg.Icon size={16} color={upcoming ? '#9CA3AF' : 'white'} strokeWidth={2}/>
                        }
                      </div>
                      <p style={{ fontSize: '0.62rem', color: done || active ? cfg.color : '#9CA3AF', marginTop: '6px', textAlign: 'center', fontWeight: active ? 800 : done ? 600 : 400, whiteSpace: 'nowrap' }}>
                        {cfg.label}
                      </p>
                      {/* Timestamp under step */}
                      {historyMap[step] && (
                        <p style={{ fontSize: '0.58rem', color: '#9CA3AF', textAlign: 'center', marginTop: '2px', whiteSpace: 'nowrap' }}>
                          {fmt(historyMap[step].timestamp).time}
                        </p>
                      )}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div style={{ flex: 1, height: '2px', background: i < currentStep ? '#2D6A4F' : '#E5E7EB', minWidth: '16px', transition: 'background 0.4s' }}/>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* ── Detailed timeline with timestamps ── */}
            <div>
              <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#374151', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#6B7280"/> Status History
              </h4>
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ position: 'absolute', left: '15px', top: '8px', bottom: '8px', width: '2px', background: '#E5E7EB', borderRadius: '1px' }}/>

                {/* Show completed steps with timestamps */}
                {[...order.statusHistory].reverse().map((h, i) => {
                  const cfg = STATUS_CONFIG[h.status] || STATUS_CONFIG.placed;
                  const { date, time } = fmt(h.timestamp);
                  return (
                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px', position: 'relative' }}>
                      {/* Dot */}
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: cfg.bg, border: `2px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                        <cfg.Icon size={13} color={cfg.color}/>
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, paddingTop: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1B1B1B', margin: 0 }}>{cfg.label}</p>
                            {cfg.location && (
                              <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={10} color="#9CA3AF"/> {cfg.location}
                              </p>
                            )}
                            {h.note && h.note !== `Order ${h.status}` && (
                              <p style={{ fontSize: '0.76rem', color: '#2D6A4F', margin: '3px 0 0', fontStyle: 'italic' }}>{h.note}</p>
                            )}
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', margin: 0 }}>{time}</p>
                            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: '2px 0 0' }}>{date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Upcoming steps (greyed out) */}
                {STATUS_STEPS.slice(currentStep + 1).map((step, i) => {
                  const cfg = STATUS_CONFIG[step];
                  return (
                    <div key={step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '14px', opacity: 0.35 }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F3F4F6', border: '2px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                        <cfg.Icon size={13} color="#9CA3AF"/>
                      </div>
                      <div style={{ flex: 1, paddingTop: '4px' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>{cfg.label}</p>
                        <p style={{ fontSize: '0.76rem', color: '#C4C4C4', margin: '2px 0 0' }}>Pending</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Cancelled banner */}
        {isCancelled && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <XCircle size={20} color="#DC2626"/>
            <div>
              <p style={{ fontWeight: 700, color: '#DC2626', margin: 0 }}>Order Cancelled</p>
              {order.cancelReason && <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: '3px 0 0' }}>{order.cancelReason}</p>}
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px,4vw,24px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem' }}>Order Items</h3>
          {order.items.map(item => (
            <div key={item._id} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '8px', background: '#F9FAFB', flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <p style={{ color: '#9CA3AF', fontSize: '0.8rem', margin: '3px 0 0' }}>Qty: {item.quantity} {item.unit}</p>
              </div>
              <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.9rem', flexShrink: 0 }}>₹{item.price * item.quantity}</span>
            </div>
          ))}

          {/* Price breakdown */}
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #E5E7EB' }}>
            {[
              ['Items Total', `₹${order.itemsPrice}`],
              ['Delivery',    order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`],
              ['Tax',         `₹${order.taxPrice}`],
              ...(order.discountAmount > 0 ? [['Discount', `-₹${order.discountAmount}`]] : []),
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px', fontSize: '0.87rem', color: '#374151' }}>
                <span>{label}</span>
                <span style={{ color: value === 'FREE' || value.startsWith('-') ? '#22C55E' : 'inherit', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', borderTop: '1.5px solid #E5E7EB', paddingTop: '10px', marginTop: '4px' }}>
              <span>Total</span><span style={{ color: '#2D6A4F' }}>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Address + Payment */}
        <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px,4vw,24px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="#2D6A4F"/> Delivery Address
          </h3>
          <p style={{ fontWeight: 700, color: '#1B1B1B', margin: 0 }}>{order.shippingAddress.fullName}</p>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.8, margin: '5px 0' }}>
            {order.shippingAddress.street}<br/>
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px', margin: '8px 0 0' }}>
            <Phone size={12} color="#6B7280"/> {order.shippingAddress.phone}
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
              Payment: <strong style={{ color: '#374151', textTransform: 'capitalize' }}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: order.paymentStatus === 'paid' ? '#16A34A' : '#D97706', fontWeight: 700, textTransform: 'capitalize' }}>
              {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ ' + order.paymentStatus}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
