import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import API from '../utils/api';
import Loader from '../components/common/Loader';

export const OrderSuccess = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(clearCart());
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data.order);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, dispatch]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Loader /></div>;

  return (
    <>
      <Helmet><title>Order Confirmed! - GreenRoots</title></Helmet>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: 'white', borderRadius: '20px', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
            <div style={{ width: '80px', height: '80px', background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={42} color="#059669" />
            </div>
          </motion.div>
          <h1 style={{ fontSize: '1.8rem', color: '#1B1B1B', marginBottom: '8px' }}>Order Confirmed!</h1>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>Your organic order is on its way.</p>
          {order && (
            <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Order ID</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'monospace' }}>#{id.slice(-8).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Total Amount</span>
                <span style={{ fontWeight: 700, color: '#2D6A4F' }}>₹{order.totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Estimated Delivery</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>3-5 Business Days</span>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/orders/${id}`} className="btn btn-primary">Track Order</Link>
            <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderSuccess;
