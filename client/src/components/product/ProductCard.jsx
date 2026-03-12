import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { addToCart } from '../../redux/slices/cartSlice';
import API from '../../utils/api';
import { updateWishlist } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(star => (
      <span key={star} style={{ fontSize: '0.75rem', color: star <= rating ? '#F59E0B' : '#D1D5DB' }}>★</span>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const isWishlisted = user?.wishlist?.some?.(id => (id._id || id) === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to save to wishlist'); return; }
    try {
      const { data } = await API.post(`/user/wishlist/${product._id}`);
      dispatch(updateWishlist(data.wishlist));
    } catch {}
  };

  const discountPercent = product.price > (product.discountPrice || product.price)
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}
    >
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '75%', background: '#F3F4F6', overflow: 'hidden' }}>
          <img
            src={product.images?.[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
          {discountPercent > 0 && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#EF4444', color: 'white', borderRadius: '6px', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
              -{discountPercent}%
            </div>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Out of Stock</span>
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '1rem' }}
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {product.certifications?.slice(0, 1).map(cert => (
              <span key={cert} style={{ background: '#D1FAE5', color: '#065F46', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{cert}</span>
            ))}
          </div>
          <h3 style={{ fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StarRating rating={Math.round(product.rating)} />
            <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>({product.numReviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2D6A4F' }}>₹{product.discountPrice || product.price}</span>
            {discountPercent > 0 && <span style={{ fontSize: '0.85rem', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{product.price}</span>}
            <span style={{ fontSize: '0.8rem', color: '#6B7280', marginLeft: 'auto' }}>/{product.unit}</span>
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div style={{ padding: '0 14px 14px' }}>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn btn-primary btn-full"
          style={{ borderRadius: '8px', padding: '10px', fontSize: '0.88rem' }}
        >
          {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
