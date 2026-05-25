import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, CheckCircle, Truck, MapPin, Home,
  Clock, ChevronLeft, Phone, XCircle, RefreshCw,
  AlertTriangle, X, ArrowLeft, RotateCcw, Banknote,
} from 'lucide-react';
import API from '../utils/api';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  placed:         { Icon: Package,     color: '#F59E0B', bg: '#FEF3C7', label: 'Order Placed',    location: 'GreenRoots Warehouse, Bangalore' },
  confirmed:      { Icon: CheckCircle, color: '#3B82F6', bg: '#DBEAFE', label: 'Confirmed',        location: 'GreenRoots Processing Centre' },
  packed:         { Icon: Package,     color: '#8B5CF6', bg: '#EDE9FE', label: 'Packed',           location: 'GreenRoots Dispatch Hub, Bangalore' },
  shipped:        { Icon: Truck,       color: '#06B6D4', bg: '#CFFAFE', label: 'Shipped',          location: 'In Transit' },
  outForDelivery: { Icon: MapPin,      color: '#F97316', bg: '#FFEDD5', label: 'Out for Delivery', location: 'Local Delivery Partner' },
  delivered:      { Icon: Home,        color: '#22C55E', bg: '#DCFCE7', label: 'Delivered',        location: 'Delivered to your address' },
  cancelled:      { Icon: XCircle,     color: '#EF4444', bg: '#FEE2E2', label: 'Cancelled',        location: '' },
  returned:       { Icon: RefreshCw,   color: '#6B7280', bg: '#F3F4F6', label: 'Return Requested', location: '' },
};
const STATUS_STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'outForDelivery', 'delivered'];

const CANCEL_REASONS  = ['Changed my mind', 'Ordered by mistake', 'Found a better price', 'Delivery taking too long', 'Product no longer needed', 'Other'];
const RETURN_REASONS  = ['Damaged / defective product', 'Wrong item delivered', 'Product not as described', 'Quality not satisfactory', 'Expired product', 'Other'];

const fmt = ts => {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
};

// ── Cancel Modal ──────────────────────────────────────────────
const CancelModal = ({ order, onConfirm, onClose, loading }) => {
  const isCOD       = order.paymentMethod === 'cod';
  const afterPacked = !['placed','confirmed'].includes(order.orderStatus);
  const needsReason = afterPacked;
  const feeMap      = { packed:5, shipped:10, outForDelivery:15 };
  const feePercent  = feeMap[order.orderStatus] || 0;
  const [reason, setReason]         = useState('');
  const [customReason, setCustom]   = useState('');

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.92, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'white', borderRadius:'18px', padding:'26px', width:'100%', maxWidth:'400px', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'14px' }}>
          <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:'1rem', margin:0, display:'flex', alignItems:'center', gap:'8px' }}>
            <XCircle size={16} color="#DC2626"/> Cancel Order
          </h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}><X size={16}/></button>
        </div>

        {afterPacked && (
          <div style={{ background:'#FFF8E1', border:'1px solid #FDE68A', borderRadius:'9px', padding:'11px 14px', marginBottom:'16px', display:'flex', gap:'9px' }}>
            <AlertTriangle size={14} color="#D97706" style={{ flexShrink:0, marginTop:'1px' }}/>
            <p style={{ fontSize:'0.8rem', color:'#92400E', margin:0, lineHeight:1.6 }}>
              Order is already <strong>{STATUS_CONFIG[order.orderStatus]?.label}</strong>.
              {feePercent > 0 && ` A ${feePercent}% cancellation fee applies.`}
              {isCOD && ' COD orders cannot be cancelled at this stage.'}
            </p>
          </div>
        )}

        {isCOD && afterPacked ? (
          <p style={{ color:'#6B7280', fontSize:'0.88rem', marginBottom:'18px', lineHeight:1.7 }}>
            COD orders can only be cancelled before packing. Please contact support for assistance.
          </p>
        ) : (
          <>
            <p style={{ fontWeight:600, fontSize:'0.83rem', color:'#374151', marginBottom:'9px' }}>Select reason *</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'12px' }}>
              {CANCEL_REASONS.map(r => (
                <label key={r} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 12px', border:`1.5px solid ${reason===r?'#DC2626':'#E5E7EB'}`, borderRadius:'8px', cursor:'pointer', background:reason===r?'#FFF5F5':'white', fontSize:'0.84rem' }}>
                  <input type="radio" checked={reason===r} onChange={() => setReason(r)} style={{ accentColor:'#DC2626' }}/>
                  {r}
                </label>
              ))}
            </div>
            {reason === 'Other' && (
              <textarea placeholder="Describe your reason..." value={customReason} onChange={e => setCustom(e.target.value)}
                style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E5E7EB', borderRadius:'8px', fontSize:'0.84rem', fontFamily:'Inter,sans-serif', outline:'none', resize:'vertical', minHeight:'60px', marginBottom:'12px', boxSizing:'border-box' }}/>
            )}
          </>
        )}

        <div style={{ display:'flex', gap:'9px' }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', background:'none', border:'1.5px solid #E5E7EB', borderRadius:'9px', fontWeight:600, cursor:'pointer', color:'#6B7280', fontFamily:'Inter,sans-serif', fontSize:'0.85rem' }}>
            Keep Order
          </button>
          {!(isCOD && afterPacked) && (
            <button onClick={() => onConfirm(reason==='Other' ? customReason : reason)}
              disabled={loading || !reason || (reason==='Other' && !customReason.trim())}
              style={{ flex:1, padding:'10px', background:'#DC2626', color:'white', border:'none', borderRadius:'9px', fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.85rem', opacity: (!reason || loading) ? 0.6 : 1 }}>
              {loading ? 'Cancelling...' : 'Confirm Cancel'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Return/Refund/Exchange Modal ──────────────────────────────
const ReturnModal = ({ order, onSubmit, onClose, loading }) => {
  const [type,   setType]   = useState('refund');
  const [reason, setReason] = useState('');
  const [custom, setCustom] = useState('');
  const [bank,   setBank]   = useState({ accountName:'', accountNo:'', ifsc:'', bankName:'' });

  const isRefund = type === 'refund' || type === 'return';

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px', overflowY:'auto' }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.92, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'white', borderRadius:'18px', padding:'26px', width:'100%', maxWidth:'460px', marginTop:'40px', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>

        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
          <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:'1rem', margin:0, display:'flex', alignItems:'center', gap:'8px' }}>
            <RotateCcw size={16} color="#2D6A4F"/> Return / Refund / Exchange
          </h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}><X size={16}/></button>
        </div>

        <div style={{ background:'#F0FDF4', border:'1px solid #D1FAE5', borderRadius:'9px', padding:'10px 14px', marginBottom:'16px' }}>
          <p style={{ fontSize:'0.8rem', color:'#065F46', margin:0, lineHeight:1.6 }}>
            Returns accepted within <strong>7 days</strong> of delivery. Order total: <strong>₹{order.totalAmount}</strong>
          </p>
        </div>

        {/* Type selection */}
        <p style={{ fontWeight:700, fontSize:'0.82rem', color:'#374151', marginBottom:'9px' }}>Request Type *</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'16px' }}>
          {[
            { v:'refund',   label:'Refund',   Icon:Banknote  },
            { v:'return',   label:'Return',   Icon:RotateCcw },
            { v:'exchange', label:'Exchange', Icon:RefreshCw },
          ].map(({ v,label,Icon }) => (
            <button key={v} onClick={() => setType(v)}
              style={{ padding:'10px 6px', border:`2px solid ${type===v?'#2D6A4F':'#E5E7EB'}`, borderRadius:'9px', background:type===v?'#F0FDF4':'white', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'5px', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', fontWeight:type===v?700:500, color:type===v?'#2D6A4F':'#6B7280' }}>
              <Icon size={16} strokeWidth={1.8} color={type===v?'#2D6A4F':'#9CA3AF'}/>
              {label}
            </button>
          ))}
        </div>

        {/* Reason */}
        <p style={{ fontWeight:700, fontSize:'0.82rem', color:'#374151', marginBottom:'9px' }}>Reason *</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'12px' }}>
          {RETURN_REASONS.map(r => (
            <label key={r} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', border:`1.5px solid ${reason===r?'#2D6A4F':'#E5E7EB'}`, borderRadius:'8px', cursor:'pointer', background:reason===r?'#F0FDF4':'white', fontSize:'0.83rem' }}>
              <input type="radio" checked={reason===r} onChange={() => setReason(r)} style={{ accentColor:'#2D6A4F' }}/>
              {r}
            </label>
          ))}
        </div>
        {reason === 'Other' && (
          <textarea placeholder="Describe your issue..." value={custom} onChange={e => setCustom(e.target.value)}
            style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #E5E7EB', borderRadius:'8px', fontSize:'0.83rem', fontFamily:'Inter,sans-serif', outline:'none', resize:'vertical', minHeight:'60px', marginBottom:'12px', boxSizing:'border-box' }}/>
        )}

        {/* Bank details for refund */}
        {isRefund && (
          <div style={{ background:'#F9FAFB', borderRadius:'10px', padding:'14px', marginBottom:'12px' }}>
            <p style={{ fontWeight:700, fontSize:'0.8rem', color:'#374151', marginBottom:'10px', display:'flex', alignItems:'center', gap:'5px' }}>
              <Banknote size={13} color="#2D6A4F"/> Refund Bank Details
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
              {[['accountName','Account Name','Sujay Acharya'],['accountNo','Account Number','XXXXXXXXXX'],['ifsc','IFSC Code','SBIN0001234'],['bankName','Bank Name','State Bank']].map(([key,label,ph]) => (
                <div key={key}>
                  <label style={{ fontSize:'0.68rem', fontWeight:700, color:'#6B7280', display:'block', marginBottom:'3px' }}>{label}</label>
                  <input placeholder={ph} value={bank[key]} onChange={e => setBank(b => ({...b,[key]:e.target.value}))}
                    style={{ width:'100%', padding:'7px 10px', border:'1.5px solid #E5E7EB', borderRadius:'6px', fontSize:'0.82rem', fontFamily:'Inter,sans-serif', outline:'none', boxSizing:'border-box' }}/>
                </div>
              ))}
            </div>
            <p style={{ fontSize:'0.72rem', color:'#9CA3AF', marginTop:'7px' }}>Refund will be credited within 5-7 business days.</p>
          </div>
        )}

        <div style={{ display:'flex', gap:'9px' }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', background:'none', border:'1.5px solid #E5E7EB', borderRadius:'9px', fontWeight:600, cursor:'pointer', color:'#6B7280', fontFamily:'Inter,sans-serif', fontSize:'0.85rem' }}>Cancel</button>
          <button onClick={() => onSubmit(type, reason==='Other'?custom:reason, isRefund?bank:null)}
            disabled={loading || !reason || (reason==='Other' && !custom.trim()) || (isRefund && (!bank.accountNo||!bank.ifsc))}
            style={{ flex:2, padding:'10px', background:'#2D6A4F', color:'white', border:'none', borderRadius:'9px', fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.85rem', opacity: (!reason||loading)?0.6:1 }}>
            {loading ? 'Submitting...' : `Submit ${type.charAt(0).toUpperCase()+type.slice(1)} Request`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────────
const OrderDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [order,       setOrder]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [showCancel,  setShowCancel]  = useState(false);
  const [showReturn,  setShowReturn]  = useState(false);
  const [cancelling,  setCancelling]  = useState(false);
  const [returning,   setReturning]   = useState(false);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async (reason) => {
    setCancelling(true);
    try {
      const { data } = await API.put(`/orders/${id}/cancel`, { reason });
      setOrder(data.order); setShowCancel(false);
      toast.success('Order cancelled.');
    } catch (err) { toast.error(err.response?.data?.message || 'Could not cancel.'); }
    finally { setCancelling(false); }
  };

  const handleReturn = async (type, reason, bankAccount) => {
    setReturning(true);
    try {
      const { data } = await API.post(`/orders/${id}/return`, { type, reason, bankAccount });
      setOrder(data.order); setShowReturn(false);
      toast.success(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Request failed.'); }
    finally { setReturning(false); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px' }}><Loader/></div>;
  if (!order)  return <div style={{ textAlign:'center', padding:'80px', color:'#9CA3AF' }}>Order not found</div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';
  const isReturned  = order.orderStatus === 'returned';
  const isDelivered = order.orderStatus === 'delivered';
  const isCOD       = order.paymentMethod === 'cod';
  const currentCfg  = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
  const historyMap  = {};
  order.statusHistory?.forEach(h => { historyMap[h.status] = h; });

  // Cancel button: COD only before packed; online up to outForDelivery
  const canCancel = !isCancelled && !isDelivered && !isReturned &&
    (isCOD ? ['placed','confirmed'].includes(order.orderStatus) : ['placed','confirmed','packed','shipped','outForDelivery'].includes(order.orderStatus));

  return (
    <>
      <Helmet><title>Order #{id.slice(-8).toUpperCase()} — GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop:'20px', paddingBottom:'56px', maxWidth:'820px' }}>

        {/* ── Back navigation ── */}
        <button onClick={() => navigate(-1)} className="btn-back" style={{ marginBottom:'16px' }}>
          <ArrowLeft size={14}/> Back
        </button>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px', marginBottom:'22px' }}>
          <div>
            <h1 style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)', margin:0 }}>Order #{id.slice(-8).toUpperCase()}</h1>
            <p style={{ color:'#9CA3AF', fontSize:'0.78rem', marginTop:'3px' }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </p>
          </div>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ background:currentCfg.bg, color:currentCfg.color, padding:'5px 12px', borderRadius:'100px', fontSize:'0.78rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:'5px' }}>
              <currentCfg.Icon size={12}/> {currentCfg.label}
            </span>
            {canCancel && (
              <button onClick={() => setShowCancel(true)}
                style={{ padding:'7px 13px', background:'#FEE2E2', color:'#DC2626', border:'1px solid #FCA5A5', borderRadius:'8px', fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', display:'flex', alignItems:'center', gap:'5px' }}>
                <XCircle size={12}/> Cancel
              </button>
            )}
            {isDelivered && !order.returnRequest && (
              <button onClick={() => setShowReturn(true)}
                style={{ padding:'7px 13px', background:'#F0FDF4', color:'#2D6A4F', border:'1px solid #D1FAE5', borderRadius:'8px', fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', display:'flex', alignItems:'center', gap:'5px' }}>
                <RotateCcw size={12}/> Return / Refund
              </button>
            )}
          </div>
        </div>

        {/* Return request status */}
        {order.returnRequest && (
          <div style={{ background:'#F0FDF4', border:'1px solid #D1FAE5', borderRadius:'12px', padding:'14px 18px', marginBottom:'18px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
            <RotateCcw size={17} color="#2D6A4F" style={{ flexShrink:0, marginTop:'1px' }}/>
            <div>
              <p style={{ fontWeight:700, color:'#065F46', margin:0, fontSize:'0.9rem' }}>
                {order.returnRequest.type?.toUpperCase()} Request Submitted
              </p>
              <p style={{ color:'#6B7280', fontSize:'0.82rem', margin:'3px 0 0' }}>
                Reason: {order.returnRequest.reason} · Status: <strong style={{ color:'#2D6A4F' }}>{order.returnRequest.status}</strong>
              </p>
              <p style={{ color:'#9CA3AF', fontSize:'0.76rem', margin:'2px 0 0' }}>Refund: ₹{order.returnRequest.refundAmount} · Processed in 5-7 days</p>
            </div>
          </div>
        )}

        {/* Tracking */}
        {!isCancelled && !isReturned && (
          <div style={{ background:'white', borderRadius:'16px', padding:'clamp(14px,4vw,24px)', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', marginBottom:'16px', border:'1px solid #F3F4F6' }}>
            <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, margin:'0 0 18px', fontSize:'0.92rem', display:'flex', alignItems:'center', gap:'7px' }}>
              <Truck size={15} color="#2D6A4F"/> Live Tracking
              {order.trackingId && <span style={{ background:'#F0FDF4', color:'#2D6A4F', padding:'2px 8px', borderRadius:'5px', fontSize:'0.72rem', fontFamily:'monospace', fontWeight:700 }}>{order.trackingId}</span>}
            </h3>
            <div style={{ display:'flex', alignItems:'center', marginBottom:'24px', overflowX:'auto', paddingBottom:'4px' }}>
              {STATUS_STEPS.map((step, i) => {
                const cfg    = STATUS_CONFIG[step];
                const done   = i < currentStep;
                const active = i === currentStep;
                return (
                  <React.Fragment key={step}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:'52px', flexShrink:0 }}>
                      <div style={{ width:'34px', height:'34px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:done||active?cfg.color:'#E5E7EB', boxShadow:active?`0 0 0 4px ${cfg.bg}`:'none' }}>
                        {done ? <CheckCircle size={16} color="white" strokeWidth={2.5}/> : <cfg.Icon size={14} color={active?'white':'#9CA3AF'} strokeWidth={2}/>}
                      </div>
                      <p style={{ fontSize:'0.58rem', color:done||active?cfg.color:'#9CA3AF', marginTop:'5px', textAlign:'center', fontWeight:active?800:done?600:400, whiteSpace:'nowrap' }}>{cfg.label}</p>
                      {historyMap[step] && <p style={{ fontSize:'0.54rem', color:'#9CA3AF', margin:'1px 0 0', whiteSpace:'nowrap' }}>{fmt(historyMap[step].timestamp).time}</p>}
                    </div>
                    {i < STATUS_STEPS.length-1 && <div style={{ flex:1, height:'2px', background:i<currentStep?'#2D6A4F':'#E5E7EB', minWidth:'12px' }}/>}
                  </React.Fragment>
                );
              })}
            </div>

            {/* History */}
            <h4 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:'0.82rem', color:'#374151', marginBottom:'12px', display:'flex', alignItems:'center', gap:'5px' }}>
              <Clock size={12} color="#6B7280"/> Status History
            </h4>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', left:'13px', top:'8px', bottom:'8px', width:'2px', background:'#F3F4F6' }}/>
              {[...order.statusHistory].reverse().map((h, i) => {
                const cfg = STATUS_CONFIG[h.status] || STATUS_CONFIG.placed;
                const { date, time } = fmt(h.timestamp);
                return (
                  <div key={i} style={{ display:'flex', gap:'13px', marginBottom:'12px', position:'relative' }}>
                    <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:cfg.bg, border:`2px solid ${cfg.color}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, zIndex:1 }}>
                      <cfg.Icon size={11} color={cfg.color}/>
                    </div>
                    <div style={{ flex:1, paddingTop:'3px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'4px' }}>
                        <div>
                          <p style={{ fontWeight:700, fontSize:'0.83rem', color:'#1B1B1B', margin:0 }}>{cfg.label}</p>
                          {cfg.location && <p style={{ fontSize:'0.73rem', color:'#6B7280', margin:'2px 0 0', display:'flex', alignItems:'center', gap:'3px' }}><MapPin size={9} color="#9CA3AF"/> {cfg.location}</p>}
                          {h.note && h.note !== `Order ${h.status}` && <p style={{ fontSize:'0.72rem', color:'#2D6A4F', margin:'2px 0 0', fontStyle:'italic' }}>{h.note}</p>}
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <p style={{ fontSize:'0.74rem', fontWeight:600, color:'#374151', margin:0 }}>{time}</p>
                          <p style={{ fontSize:'0.68rem', color:'#9CA3AF', margin:'1px 0 0' }}>{date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled / Returned banner */}
        {(isCancelled || isReturned) && (
          <div style={{ background: isCancelled?'#FEF2F2':'#F0FDF4', border:`1px solid ${isCancelled?'#FCA5A5':'#D1FAE5'}`, borderRadius:'12px', padding:'14px 18px', marginBottom:'16px', display:'flex', gap:'10px' }}>
            <XCircle size={17} color={isCancelled?'#DC2626':'#2D6A4F'} style={{ flexShrink:0, marginTop:'1px' }}/>
            <div>
              <p style={{ fontWeight:700, color:isCancelled?'#DC2626':'#065F46', margin:0, fontSize:'0.88rem' }}>{isCancelled ? 'Order Cancelled' : 'Return Requested'}</p>
              {order.cancelReason && <p style={{ color:'#6B7280', fontSize:'0.82rem', margin:'3px 0 0' }}>{order.cancelReason}</p>}
              {order.cancelFee > 0 && <p style={{ fontSize:'0.78rem', color:'#6B7280', margin:'3px 0 0' }}>Cancellation fee: ₹{order.cancelFee} · Refund: ₹{order.refundAmount}</p>}
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ background:'white', borderRadius:'14px', padding:'clamp(14px,3vw,22px)', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', marginBottom:'14px', border:'1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, marginBottom:'14px', fontSize:'0.9rem' }}>Order Items</h3>
          {order.items.map(item => (
            <div key={item._id} style={{ display:'flex', gap:'11px', padding:'10px 0', borderBottom:'1px solid #F3F4F6', alignItems:'center' }}>
              <img src={item.image} alt={item.name} style={{ width:'48px', height:'48px', objectFit:'cover', borderRadius:'7px', flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:'0.87rem', margin:0 }}>{item.name}</p>
                <p style={{ color:'#9CA3AF', fontSize:'0.78rem', margin:'2px 0 0' }}>Qty: {item.quantity} {item.unit}</p>
              </div>
              <span style={{ fontWeight:700, color:'#2D6A4F', fontSize:'0.87rem' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ marginTop:'12px', paddingTop:'12px', borderTop:'1px solid #E5E7EB' }}>
            {[['Subtotal (GST incl.)',`₹${order.itemsPrice}`],['Delivery',order.shippingPrice===0?'FREE':`₹${order.shippingPrice}`],...(order.discountAmount>0?[['Discount',`-₹${order.discountAmount}`]]:[])].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px', fontSize:'0.84rem', color:'#374151' }}>
                <span>{l}</span><span style={{ color:v==='FREE'||v.startsWith('-')?'#22C55E':'inherit', fontWeight:500 }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:'0.98rem', borderTop:'1.5px solid #E5E7EB', paddingTop:'9px', marginTop:'4px' }}>
              <span>Total</span><span style={{ color:'#2D6A4F' }}>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div style={{ background:'white', borderRadius:'14px', padding:'clamp(14px,3vw,22px)', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', border:'1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily:'Inter,sans-serif', fontWeight:700, marginBottom:'10px', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'6px' }}>
            <MapPin size={14} color="#2D6A4F"/> Delivery Address
          </h3>
          <p style={{ fontWeight:700, color:'#1B1B1B', margin:0 }}>{order.shippingAddress.fullName}</p>
          <p style={{ color:'#6B7280', fontSize:'0.85rem', lineHeight:1.7, margin:'4px 0' }}>
            {order.shippingAddress.street}<br/>
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
          <p style={{ fontSize:'0.82rem', color:'#374151', display:'flex', alignItems:'center', gap:'5px', margin:'6px 0 0' }}>
            <Phone size={11} color="#9CA3AF"/> {order.shippingAddress.phone}
          </p>
          <div style={{ display:'flex', gap:'12px', marginTop:'10px', paddingTop:'10px', borderTop:'1px solid #F3F4F6', fontSize:'0.79rem', color:'#6B7280', flexWrap:'wrap' }}>
            <span>Payment: <strong style={{ color:'#374151' }}>{order.paymentMethod==='cod'?'Cash on Delivery':'Online'}</strong></span>
            <span style={{ color:order.paymentStatus==='paid'?'#16A34A':'#D97706', fontWeight:700 }}>
              {order.paymentStatus==='paid'?'✓ Paid':'⏳ '+order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCancel && <CancelModal order={order} loading={cancelling} onConfirm={handleCancel} onClose={() => setShowCancel(false)}/>}
        {showReturn && <ReturnModal order={order} loading={returning} onSubmit={handleReturn} onClose={() => setShowReturn(false)}/>}
      </AnimatePresence>
    </>
  );
};

export default OrderDetail;
