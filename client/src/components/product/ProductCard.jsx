import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import API from '../../utils/api';
import { updateWishlist } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={11} strokeWidth={1.5}
        fill={s <= rating ? '#F59E0B' : 'none'}
        color={s <= rating ? '#F59E0B' : '#D1D5DB'}/>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const isWishlisted = user?.wishlist?.some?.(id => (id._id || id) === product._id);
  const outOfStock   = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) { toast.error('This product is out of stock'); return; }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success('Added to cart!');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
    try {
      const { data } = await API.post(`/user/wishlist/${product._id}`);
      dispatch(updateWishlist(data.wishlist));
    } catch {}
  };

  const discountPercent = product.price > (product.discountPrice || product.price)
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', border: '1px solid #F3F4F6' }}>

      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '75%', background: '#F9FAFB', overflow: 'hidden' }}>
          <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"/>

          {/* Discount badge */}
          {discountPercent > 0 && !outOfStock && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#EF4444', color: 'white', borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700 }}>
              -{discountPercent}%
            </div>
          )}

          {/* Out of Stock overlay — clear & prominent */}
          {outOfStock && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '0.85rem', background: 'rgba(220,38,38,0.92)', padding: '6px 16px', borderRadius: '8px', letterSpacing: '0.06em' }}>
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Wishlist */}
          <button onClick={handleWishlist}
            style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 1 }}>
            <Heart size={15} strokeWidth={2}
              fill={isWishlisted ? '#E11D48' : 'none'}
              color={isWishlisted ? '#E11D48' : '#9CA3AF'}/>
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '13px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
          <h3 style={{ fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', fontWeight: 600, lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <StarRating rating={Math.round(product.rating)}/>
            <span style={{ fontSize: '0.73rem', color: '#9CA3AF' }}>({product.numReviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2D6A4F' }}>₹{product.discountPrice || product.price}</span>
            {discountPercent > 0 && <span style={{ fontSize: '0.82rem', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{product.price}</span>}
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: 'auto' }}>/{product.unit}</span>
          </div>
          {/* Low stock warning */}
          {!outOfStock && product.stock > 0 && product.stock <= 10 && (
            <p style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700, margin: 0 }}>
              Only {product.stock} left!
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart button */}
      <div style={{ padding: '0 14px 14px' }}>
        <button onClick={handleAddToCart} disabled={outOfStock}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', background: outOfStock ? '#F3F4F6' : '#2D6A4F', color: outOfStock ? '#9CA3AF' : 'white', border: 'none', borderRadius: '9px', fontWeight: 700, fontSize: '0.86rem', cursor: outOfStock ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', transition: 'background 0.2s' }}
          onMouseOver={e => { if (!outOfStock) e.currentTarget.style.background='#1B4332'; }}
          onMouseOut={e => { if (!outOfStock) e.currentTarget.style.background='#2D6A4F'; }}>
          {outOfStock
            ? 'Out of Stock'
            : <><ShoppingCart size={14} strokeWidth={2}/> Add to Cart</>
          }
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
