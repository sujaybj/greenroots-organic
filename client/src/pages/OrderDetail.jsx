// OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import API from '../utils/api';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'outForDelivery', 'delivered'];
const STATUS_COLORS = { placed: '#F59E0B', confirmed: '#3B82F6', packed: '#8B5CF6', shipped: '#06B6D4', outForDelivery: '#F97316', delivered: '#22C55E', cancelled: '#EF4444' };

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await API.put(`/orders/${id}/cancel`);
      setOrder(data.order);
      toast.success('Order cancelled successfully');
    } catch { } finally { setCancelling(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Loader /></div>;
  if (!order) return <div style={{ textAlign: 'center', padding: '80px' }}>Order not found</div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <>
      <Helmet><title>Order #{id.slice(-8).toUpperCase()} - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          <div>
            <Link to="/orders" style={{ color: '#6B7280', fontSize: '0.9rem' }}>← My Orders</Link>
            <h1 style={{ fontSize: '1.5rem', marginTop: '4px' }}>Order #{id.slice(-8).toUpperCase()}</h1>
            <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          {['placed', 'confirmed'].includes(order.orderStatus) && (
            <button onClick={handleCancel} disabled={cancelling} className="btn btn-danger btn-sm">
              {cancelling ? '⏳ Cancelling...' : '✕ Cancel Order'}
            </button>
          )}
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '20px' }}>Order Tracking</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, background: i <= currentStep ? '#2D6A4F' : '#E5E7EB', color: i <= currentStep ? 'white' : '#9CA3AF' }}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <p style={{ fontSize: '0.68rem', color: i <= currentStep ? '#2D6A4F' : '#9CA3AF', marginTop: '6px', textAlign: 'center', fontWeight: i === currentStep ? 700 : 400, textTransform: 'capitalize' }}>{step === 'outForDelivery' ? 'Out for Delivery' : step}</p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: '2px', background: i < currentStep ? '#2D6A4F' : '#E5E7EB', minWidth: '20px' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {isCancelled && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
            <span style={{ color: '#EF4444', fontWeight: 600 }}>✕ Order Cancelled</span>
            {order.cancelReason && <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '4px' }}>{order.cancelReason}</p>}
          </div>
        )}

        {/* Items */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '16px' }}>Order Items</h3>
          {order.items.map(item => (
            <div key={item._id} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</p>
                <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>Qty: {item.quantity} {item.unit}</p>
              </div>
              <span style={{ fontWeight: 700, color: '#2D6A4F' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}

          {/* Price Breakdown */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
            {[['Items Total', `₹${order.itemsPrice}`], ['Shipping', order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`], ['Tax', `₹${order.taxPrice}`], ...(order.discountAmount > 0 ? [['Discount', `-₹${order.discountAmount}`]] : [])].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#374151' }}>
                <span>{label}</span><span style={{ color: value.includes('-') ? '#22C55E' : 'inherit' }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', borderTop: '1.5px solid #E5E7EB', paddingTop: '10px', marginTop: '4px' }}>
              <span>Total</span><span style={{ color: '#2D6A4F' }}>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '12px' }}>Delivery Address</h3>
          <p style={{ fontWeight: 600 }}>{order.shippingAddress.fullName}</p>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.8, marginTop: '4px' }}>
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
            📞 {order.shippingAddress.phone}
          </p>
          <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#6B7280' }}>Payment: <strong style={{ color: '#374151', textTransform: 'capitalize' }}>{order.paymentMethod}</strong> • <span style={{ color: order.paymentStatus === 'paid' ? '#22C55E' : '#F59E0B', fontWeight: 600, textTransform: 'capitalize' }}>{order.paymentStatus}</span></p>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
