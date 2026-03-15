import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaRegStar } from 'react-icons/fa';
import { addToCart } from '../../redux/slices/cartSlice';
import API from '../../utils/api';
import { updateWishlist } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
    {[1, 2, 3, 4, 5].map(star => (
      star <= rating
        ? <FaStar  key={star} style={{ fontSize: '0.7rem', color: '#F59E0B' }} />
        : <FaRegStar key={star} style={{ fontSize: '0.7rem', color: '#D1D5DB' }} />
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
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to save to wishlist'); return; }
    try {
      const { data } = await API.post(`/user/wishlist/${product._id}`);
      dispatch(updateWishlist(data.wishlist));
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch {}
  };

  const discountPercent = product.price > (product.discountPrice || product.price)
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', border: '1px solid #F3F4F6' }}>

      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '75%', background: '#F9FAFB', overflow: 'hidden' }}>
          <img
            src={product.images?.[0]?.url || '/placeholder.jpg'}
            alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            loading="lazy"
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          />
          {discountPercent > 0 && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#EF4444', color: 'white', borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700 }}>
              -{discountPercent}%
            </div>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: '6px' }}>Out of Stock</span>
            </div>
          )}
          {/* Wishlist */}
          <button onClick={handleWishlist}
            style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            {isWishlisted
              ? <FaHeart    style={{ fontSize: '0.95rem', color: '#EF4444' }} />
              : <FaRegHeart style={{ fontSize: '0.95rem', color: '#9CA3AF' }} />
            }
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {product.certifications?.length > 0 && (
            <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', fontWeight: 600, alignSelf: 'flex-start' }}>
              {product.certifications[0]}
            </span>
          )}
          <h3 style={{ fontSize: '0.92rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <StarRating rating={Math.round(product.rating)} />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({product.numReviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2D6A4F' }}>₹{product.discountPrice || product.price}</span>
            {discountPercent > 0 && <span style={{ fontSize: '0.82rem', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{product.price}</span>}
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF', marginLeft: 'auto' }}>/{product.unit}</span>
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div style={{ padding: '0 14px 14px' }}>
        <button onClick={handleAddToCart} disabled={product.stock === 0}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '8px', border: 'none', background: product.stock === 0 ? '#F3F4F6' : '#2D6A4F', color: product.stock === 0 ? '#9CA3AF' : 'white', fontWeight: 600, fontSize: '0.88rem', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', transition: 'background 0.2s', fontFamily: 'Inter, sans-serif' }}
          onMouseOver={e => { if (product.stock > 0) e.currentTarget.style.background = '#1B4332'; }}
          onMouseOut={e => { if (product.stock > 0) e.currentTarget.style.background = '#2D6A4F'; }}>
          <FaShoppingCart style={{ fontSize: '0.9rem' }} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
