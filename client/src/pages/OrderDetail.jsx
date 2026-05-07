import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, CheckCircle, Truck, MapPin, Home,
  Clock, ChevronLeft, Phone, XCircle, RefreshCw, AlertTriangle, X, RotateCcw,
} from 'lucide-react';
import API from '../utils/api';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  placed:         { Icon: Package,     color: '#F59E0B', bg: '#FEF3C7', label: 'Order Placed', location: 'GreenRoots Warehouse, Bangalore' },
  confirmed:      { Icon: CheckCircle, color: '#3B82F6', bg: '#DBEAFE', label: 'Confirmed', location: 'GreenRoots Processing Centre, Bangalore' },
  packed:         { Icon: Package,     color: '#8B5CF6', bg: '#EDE9FE', label: 'Packed', location: 'GreenRoots Dispatch Hub, Bangalore' },
  shipped:        { Icon: Truck,       color: '#06B6D4', bg: '#CFFAFE', label: 'Shipped', location: 'In Transit' },
  outForDelivery: { Icon: MapPin,      color: '#F97316', bg: '#FFEDD5', label: 'Out for Delivery', location: 'Local Delivery Partner' },
  delivered:      { Icon: Home,        color: '#22C55E', bg: '#DCFCE7', label: 'Delivered', location: 'Delivered to your address' },
  cancelled:      { Icon: XCircle,     color: '#EF4444', bg: '#FEE2E2', label: 'Cancelled', location: '' },
  returned:       { Icon: RefreshCw,   color: '#6B7280', bg: '#F3F4F6', label: 'Return/Refund Requested', location: '' },
};

const STATUS_STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'outForDelivery', 'delivered'];
const REQUIRES_REASON = ['packed', 'shipped', 'outForDelivery'];
const CANCEL_REASONS = ['Changed my mind', 'Ordered by mistake', 'Found a better price', 'Delivery taking too long', 'Product no longer needed', 'Other'];
const RETURN_TYPES = [
  { value: 'return', label: 'Return', note: 'Approved returns automatically trigger a refund to your original payment account.' },
  { value: 'replacement', label: 'Replacement', note: 'Receive another item if the issue is approved.' },
];
const RETURN_CONDITIONS = [
  'Received damaged product',
  'Received defective product',
  'Received wrong product',
  'Did not like the product',
];
const REPLACEMENT_REASONS = new Set([
  'Received damaged product',
  'Received defective product',
  'Received wrong product',
]);
const RETURN_STEPS = [
  {
    title: 'Select issue',
    detail: 'Choose return or replacement and select the issue from your order details page.',
  },
  {
    title: 'Get approval',
    detail: 'Our team reviews the request and confirms whether the request is eligible.',
  },
  {
    title: 'Product pickup and check',
    detail: 'Keep the product in original condition with tags, accessories, and packaging for pickup.',
  },
  {
    title: 'Resolution',
    detail: 'Approved returns trigger refund processing automatically. Approved replacements are completed after dispatch.',
  },
];

const fmt = (ts) => {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
};

const CancelModal = ({ order, onConfirm, onClose, loading }) => {
  const needsReason = REQUIRES_REASON.includes(order.orderStatus);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const finalReason = reason === 'Other' ? customReason : reason;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#FEE2E2', borderRadius: '10px', padding: '8px' }}>
              <AlertTriangle size={18} color="#DC2626"/>
            </div>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '1rem', margin: 0 }}>Cancel Order</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={18}/></button>
        </div>

        {needsReason ? (
          <>
            <div style={{ background: '#FFF8E1', border: '1px solid #FDE68A', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', display: 'flex', gap: '10px' }}>
              <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }}/>
              <p style={{ fontSize: '0.82rem', color: '#92400E', margin: 0, lineHeight: 1.6 }}>
                Your order is already <strong>{STATUS_CONFIG[order.orderStatus]?.label}</strong>. A cancellation fee may apply based on stage and state.
              </p>
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: '10px' }}>Please select a reason *</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
              {CANCEL_REASONS.map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 12px', border: `1.5px solid ${reason===r ? '#DC2626' : '#E5E7EB'}`, borderRadius: '9px', cursor: 'pointer', background: reason===r ? '#FFF5F5' : 'white' }}>
                  <input type="radio" name="reason" value={r} checked={reason===r} onChange={() => setReason(r)} style={{ accentColor: '#DC2626', width: '15px', height: '15px', flexShrink: 0 }}/>
                  <span style={{ fontSize: '0.86rem', color: '#374151' }}>{r}</span>
                </label>
              ))}
            </div>
            {reason === 'Other' && (
              <textarea placeholder="Please describe your reason..." value={customReason} onChange={e => setCustomReason(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '9px', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'vertical', minHeight: '72px', marginBottom: '14px', boxSizing: 'border-box' }}/>
            )}
          </>
        ) : (
          <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
            Are you sure you want to cancel order <strong>#{order._id.slice(-8).toUpperCase()}</strong>?
          </p>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '9px', fontWeight: 600, cursor: 'pointer', color: '#6B7280', fontFamily: 'Inter,sans-serif' }}>
            Keep Order
          </button>
          <button onClick={() => onConfirm(finalReason || 'Cancelled by user')}
            disabled={loading || (needsReason && !reason) || (reason === 'Other' && !customReason.trim())}
            style={{ flex: 1, padding: '11px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', opacity: (loading || (needsReason && !reason)) ? 0.6 : 1 }}>
            {loading ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReturnModal = ({ onClose, onSubmit, loading }) => {
  const [type, setType] = useState('return');
  const [reason, setReason] = useState(RETURN_CONDITIONS[0]);
  const [description, setDescription] = useState('');
  const replacementAllowed = REPLACEMENT_REASONS.has(reason);

  useEffect(() => {
    if (!replacementAllowed && type === 'replacement') {
      setType('return');
    }
  }, [replacementAllowed, type]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '22px', padding: '24px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={17} color="#2D6A4F"/> Request Return or Replacement
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={18}/></button>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>Choose what you need</p>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.8rem', lineHeight: 1.6 }}>
            Select return or replacement. If a return request is approved after verification, the refund is automatically initiated to your original payment account.
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>Request Type *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            {RETURN_TYPES.map((requestType) => {
              const active = type === requestType.value;
              const disabled = requestType.value === 'replacement' && !replacementAllowed;
              return (
                <button
                  key={requestType.value}
                  type="button"
                  onClick={() => !disabled && setType(requestType.value)}
                  disabled={disabled}
                  style={{
                    textAlign: 'left',
                    borderRadius: '14px',
                    border: `1.5px solid ${active ? '#2D6A4F' : disabled ? '#E5E7EB' : '#E5E7EB'}`,
                    background: active ? '#F0FDF4' : disabled ? '#F8FAFC' : 'white',
                    padding: '14px 12px',
                    color: active ? '#14532D' : disabled ? '#94A3B8' : '#374151',
                    boxShadow: active ? '0 8px 18px rgba(34, 197, 94, 0.08)' : 'none',
                    opacity: disabled ? 0.75 : 1,
                  }}
                >
                  <span style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px' }}>{requestType.label}</span>
                  <span style={{ display: 'block', fontSize: '0.76rem', lineHeight: 1.55, color: active ? '#166534' : disabled ? '#94A3B8' : '#6B7280' }}>
                    {disabled ? 'Available only for damaged, defective, or wrong product issues.' : requestType.note}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>Select Issue *</label>
          <div style={{ display: 'grid', gap: '8px' }}>
            {RETURN_CONDITIONS.map((item) => {
              const active = reason === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setReason(item)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: `1.5px solid ${active ? '#2D6A4F' : '#E5E7EB'}`,
                    background: active ? '#F0FDF4' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: active ? '#14532D' : '#374151',
                  }}
                >
                  <CheckCircle size={18} color={active ? '#16A34A' : '#9CA3AF'} />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Additional details</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Share any useful details for quick approval" style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif', outline: 'none', minHeight: '88px', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>Before you submit</p>
          <div style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
            {RETURN_STEPS.slice(1).map((step) => (
              <div key={step.title} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <p style={{ margin: 0, color: '#0F172A', fontWeight: 600, fontSize: '0.8rem' }}>{step.title}</p>
                  <p style={{ margin: '2px 0 0', color: '#64748B', fontSize: '0.76rem', lineHeight: 1.55 }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '9px', fontWeight: 600, cursor: 'pointer', color: '#6B7280', fontFamily: 'Inter,sans-serif' }}>Cancel</button>
          <button onClick={() => onSubmit({ type, reason, description })} disabled={loading || !reason.trim()} style={{ flex: 1, padding: '11px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', opacity: (loading || !reason.trim()) ? 0.6 : 1 }}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OrderDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!order) return;
    if (searchParams.get('action') === 'return' && order.orderStatus === 'delivered' && !order.returnRequest?.status) {
      setShowReturn(true);
    }
  }, [order, searchParams]);

  const handleCancel = async (reason) => {
    setCancelling(true);
    try {
      const { data } = await API.put(`/orders/${id}/cancel`, { reason });
      setOrder(data.order);
      setShowCancel(false);
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel. Contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReturnRequest = async (payload) => {
    setRequesting(true);
    try {
      const { data } = await API.post(`/orders/${id}/return`, payload);
      setOrder(data.order);
      setShowReturn(false);
      toast.success(data.message || 'Request submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit request');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Loader/></div>;
  if (!order) return <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>Order not found</div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';
  const currentCfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
  const historyMap = {};
  order.statusHistory?.forEach(h => { historyMap[h.status] = h; });

  const midDelivery = ['packed', 'shipped', 'outForDelivery'].includes(order.orderStatus);
  const codCancelBlocked = order.paymentMethod === 'cod' && midDelivery;
  const canCancel = ['placed', 'confirmed', 'packed', 'shipped', 'outForDelivery'].includes(order.orderStatus) && !codCancelBlocked;

  const hasReturnRequest = Boolean(order.returnRequest?.status);
  const hasPendingReturn = order.returnRequest?.status === 'pending';
  const canRequestReturn = order.orderStatus === 'delivered' && !hasReturnRequest;
  const deliverySavings = order.shippingPrice === 0 ? 50 : 0;
  const savingsItems = [
    ['Discount on MRP', order.discountAmount],
    ['FREE delivery savings', deliverySavings],
  ].filter(([, value]) => value > 0);
  const totalSavings = savingsItems.reduce((sum, [, value]) => sum + value, 0);

  return (
    <>
      <Helmet><title>Order #{id.slice(-8).toUpperCase()} - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '28px', paddingBottom: '56px', maxWidth: '820px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div>
            <Link to="/orders" style={{ color: '#6B7280', fontSize: '0.83rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '6px', textDecoration: 'none' }}>
              <ChevronLeft size={14}/> My Orders
            </Link>
            <h1 style={{ fontSize: 'clamp(1.2rem,3vw,1.6rem)', margin: 0 }}>Order #{id.slice(-8).toUpperCase()}</h1>
            <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '3px' }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ background: currentCfg.bg, color: currentCfg.color, padding: '5px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <currentCfg.Icon size={12}/> {currentCfg.label}
            </span>
            {canCancel && (
              <button onClick={() => setShowCancel(true)}
                style={{ padding: '7px 14px', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <XCircle size={13}/> Cancel Order
              </button>
            )}
            {order.orderStatus === 'delivered' && hasReturnRequest && (
              <button disabled
                style={{ padding: '7px 14px', background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, cursor: 'not-allowed', fontFamily: 'Inter,sans-serif', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <RotateCcw size={13}/> {hasPendingReturn ? 'Request Pending' : 'Request Submitted'}
              </button>
            )}
          </div>
        </div>

        {codCancelBlocked && (
          <div style={{ background: '#FFF8E1', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', color: '#92400E', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={14} color="#D97706"/>
            COD orders cannot be cancelled after packed stage. Please request a return once delivered.
          </div>
        )}

        {order.orderStatus === 'delivered' && (
          <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', borderRadius: '18px', padding: '18px 20px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#166534' }}>Delivered</p>
              <p style={{ margin: '8px 0 0', color: '#134E4A', fontSize: '0.94rem', lineHeight: 1.5 }}>If you did not receive this order, contact our support team immediately for help with delivery partner coordination.</p>
            </div>
            <Link to="/contact" style={{ padding: '10px 18px', background: '#16A34A', color: 'white', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              Get Help
            </Link>
          </div>
        )}

        {order.returnRequest?.status && (
          <div style={{ background: '#F8FAFC', border: '1px solid #DCE7F3', borderRadius: '16px', padding: '14px 16px', marginBottom: '14px' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
              {order.returnRequest.type === 'replacement' ? 'Replacement request' : 'Return request'}
            </p>
            <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '0.82rem' }}>
              Status: <strong style={{ textTransform: 'capitalize' }}>{order.returnRequest.status}</strong>
              {order.returnRequest.type !== 'replacement' && order.returnRequest.status === 'completed' ? ' - refund initiated automatically' : ''}
            </p>
          </div>
        )}

        {!isCancelled && (
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px,4vw,26px)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '18px', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.95rem' }}>
                <Truck size={16} color="#2D6A4F"/> Live Tracking
              </h3>
              {order.trackingId && (
                <span style={{ background: '#F0FDF4', color: '#2D6A4F', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>{order.trackingId}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
              {STATUS_STEPS.map((step, i) => {
                const cfg = STATUS_CONFIG[step];
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <React.Fragment key={step}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '52px', flexShrink: 0 }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done || active ? cfg.color : '#E5E7EB', boxShadow: active ? `0 0 0 4px ${cfg.bg}` : 'none' }}>
                        {done ? <CheckCircle size={16} color="white" strokeWidth={2.5}/> : <cfg.Icon size={14} color={active ? 'white' : '#9CA3AF'} strokeWidth={2}/>}
                      </div>
                      <p style={{ fontSize: '0.6rem', color: done || active ? cfg.color : '#9CA3AF', marginTop: '5px', textAlign: 'center', fontWeight: active ? 800 : done ? 600 : 400, whiteSpace: 'nowrap', lineHeight: 1.3 }}>{cfg.label}</p>
                      {historyMap[step] && <p style={{ fontSize: '0.56rem', color: '#9CA3AF', textAlign: 'center', margin: '2px 0 0', whiteSpace: 'nowrap' }}>{fmt(historyMap[step].timestamp).time}</p>}
                    </div>
                    {i < STATUS_STEPS.length - 1 && <div style={{ flex: 1, height: '2px', background: i < currentStep ? '#2D6A4F' : '#E5E7EB', minWidth: '12px' }}/>} 
                  </React.Fragment>
                );
              })}
            </div>

            <h4 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} color="#6B7280"/> Status History
            </h4>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '8px', bottom: '8px', width: '2px', background: '#F3F4F6', borderRadius: '1px' }}/>
              {[...order.statusHistory].reverse().map((h, i) => {
                const cfg = STATUS_CONFIG[h.status] || STATUS_CONFIG.placed;
                const { date, time } = fmt(h.timestamp);
                return (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px', position: 'relative' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: cfg.bg, border: `2px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                      <cfg.Icon size={12} color={cfg.color}/>
                    </div>
                    <div style={{ flex: 1, paddingTop: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1B1B1B', margin: 0 }}>{cfg.label}</p>
                          {cfg.location && <p style={{ fontSize: '0.76rem', color: '#6B7280', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={10} color="#9CA3AF"/> {cfg.location}</p>}
                          {h.note && h.note !== `Order ${h.status}` && <p style={{ fontSize: '0.74rem', color: '#2D6A4F', margin: '2px 0 0', fontStyle: 'italic' }}>{h.note}</p>}
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: '0.76rem', fontWeight: 600, color: '#374151', margin: 0 }}>{time}</p>
                          <p style={{ fontSize: '0.7rem', color: '#9CA3AF', margin: '1px 0 0' }}>{date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px 18px', marginBottom: '18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <XCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }}/>
            <div>
              <p style={{ fontWeight: 700, color: '#DC2626', margin: 0, fontSize: '0.9rem' }}>Order Cancelled</p>
              {order.cancelReason && <p style={{ color: '#6B7280', fontSize: '0.83rem', margin: '3px 0 0' }}>Reason: {order.cancelReason}</p>}
              {order.cancelFee > 0 && <p style={{ color: '#6B7280', fontSize: '0.83rem', margin: '2px 0 0' }}>Cancellation fee: ₹{order.cancelFee} | Refund: ₹{order.refundAmount}</p>}
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '14px', padding: 'clamp(14px,3vw,22px)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '14px', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '14px', fontSize: '0.92rem' }}>Order Items</h3>
          {order.items.map(item => (
            <div key={item._id} style={{ display: 'flex', gap: '11px', padding: '10px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '7px', flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0 }}>{item.name}</p>
                <p style={{ color: '#6B7280', fontSize: '0.78rem', margin: '4px 0 0' }}>{item.quantity} × {item.unit}</p>
              </div>
              <span style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '0.95rem' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: 'clamp(14px,3vw,22px)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '14px', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>Bill Summary</h3>
              <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#6B7280' }}>A clear view of your savings and final bill.</p>
            </div>
          </div>
          {[
            ['Items Total', `₹${order.itemsPrice}`],
            ['Delivery Fee', order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`],
            ['Handling Fee', 'FREE'],
            ...(order.discountAmount > 0 ? [['Coupon Discount', `-₹${order.discountAmount}`]] : []),
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem', color: '#374151' }}>
              <span>{l}</span>
              <span style={{ color: v === 'FREE' || String(v).startsWith('-') ? '#16A34A' : 'inherit', fontWeight: v === 'FREE' || String(v).startsWith('-') ? 700 : 500 }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', color: '#0F766E' }}>
            <span>Total Bill</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '18px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)', border: '1px solid #D1FAE5', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#115E59' }}>Savings on this order</p>
              <p style={{ margin: '6px 0 0', color: '#164E63', fontSize: '0.82rem' }}>Discounts and free shipping saved you more.</p>
            </div>
            <span style={{ background: '#D1FAE5', color: '#0F766E', borderRadius: '999px', padding: '8px 12px', fontWeight: 700, fontSize: '0.95rem' }}>₹{totalSavings}</span>
          </div>
          {savingsItems.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem', color: '#164E63' }}>
              <span>{label}</span>
              <span style={{ fontWeight: 700 }}>₹{value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: 'clamp(14px,3vw,22px)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '10px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#2D6A4F"/> Delivery Address
          </h3>
          <p style={{ fontWeight: 700, color: '#1B1B1B', margin: 0 }}>{order.shippingAddress.fullName}</p>
          <p style={{ color: '#6B7280', fontSize: '0.86rem', lineHeight: 1.7, margin: '4px 0' }}>
            {order.shippingAddress.street}<br/>
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
          <p style={{ fontSize: '0.83rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px', margin: '6px 0 0' }}>
            <Phone size={11} color="#9CA3AF"/> {order.shippingAddress.phone}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap', fontSize: '0.8rem', color: '#6B7280' }}>
            <span>Payment: <strong style={{ color: '#374151' }}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</strong></span>
            <span style={{ color: order.paymentStatus==='paid' ? '#16A34A' : '#D97706', fontWeight: 700 }}>
              {order.paymentStatus==='paid' ? 'Paid' : `Payment ${order.paymentStatus}`}
            </span>
          </div>
        </div>

        {canRequestReturn && (
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowReturn(true)}
              style={{ padding: '10px 18px', background: '#E6F8EC', color: '#166534', border: '1px solid #A7F3D0', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RotateCcw size={14}/> Return
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCancel && <CancelModal order={order} loading={cancelling} onConfirm={handleCancel} onClose={() => setShowCancel(false)}/>}
      </AnimatePresence>

      <AnimatePresence>
        {showReturn && <ReturnModal loading={requesting} onSubmit={handleReturnRequest} onClose={() => setShowReturn(false)} />}
      </AnimatePresence>
    </>
  );
};

export default OrderDetail;
