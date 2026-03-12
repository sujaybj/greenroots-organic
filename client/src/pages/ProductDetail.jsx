import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const StarRating = ({ rating, interactive=false, onRate }) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {[1,2,3,4,5].map(star => (
      <span key={star} onClick={() => interactive && onRate?.(star)}
        style={{ fontSize: interactive?'1.4rem':'1rem', color: star<=rating?'#F59E0B':'#D1D5DB', cursor: interactive?'pointer':'default' }}>★</span>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading } = useSelector(s => s.product);
  const { isAuthenticated } = useSelector(s => s.auth);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('desc');
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' });

  useEffect(() => { dispatch(fetchProduct(id)); window.scrollTo(0,0); }, [id, dispatch]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Loader /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '80px' }}>Product not found <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>Back to Shop</Link></div>;

  const discountPercent = product.price > (product.discountPrice||product.price)
    ? Math.round(((product.price - product.discountPrice)/product.price)*100) : 0;

  return (
    <>
      <Helmet><title>{product.name} - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '56px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '20px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#9CA3AF' }}>Home</Link> /
          <Link to="/products" style={{ color: '#9CA3AF' }}>Products</Link> /
          <span style={{ color: '#374151' }}>{product.name}</span>
        </div>

        {/* Main Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(20px,5vw,48px)', marginBottom: '48px' }}>

          {/* Images */}
          <div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '10px', background: '#F9FAFB', aspectRatio: '1', position: 'relative' }}>
              <img src={product.images?.[activeImg]?.url} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {discountPercent > 0 && (
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#EF4444', color: 'white', borderRadius: '6px', padding: '4px 10px', fontSize: '0.82rem', fontWeight: 700 }}>
                  -{discountPercent}% OFF
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.images.map((img,i) => (
                  <img key={i} src={img.url} alt="" onClick={() => setActiveImg(i)}
                    style={{ width: 'clamp(56px,12vw,72px)', height: 'clamp(56px,12vw,72px)', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: i===activeImg?'2px solid #2D6A4F':'2px solid transparent', opacity: i===activeImg?1:0.7, transition: 'all 0.2s' }} />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Certs */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {product.certifications?.map(cert => (
                <span key={cert} style={{ background: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{cert}</span>
              ))}
            </div>

            <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', marginBottom: '10px', lineHeight: 1.2 }}>{product.name}</h1>

            {/* Rating & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <StarRating rating={Math.round(product.rating)} />
              <span style={{ color: '#6B7280', fontSize: '0.88rem' }}>({product.numReviews} reviews)</span>
              <span style={{ color: product.stock>0?'#22C55E':'#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
                {product.stock>0?`✓ In Stock (${product.stock})`:'✕ Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'clamp(1.6rem,4vw,2rem)', fontWeight: 700, color: '#2D6A4F' }}>₹{product.discountPrice||product.price}</span>
              {discountPercent > 0 && <span style={{ fontSize: '1.05rem', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{product.price}</span>}
              <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>/{product.unit}</span>
            </div>

            <p style={{ color: '#4B5563', lineHeight: 1.8, marginBottom: '22px', fontSize: 'clamp(0.88rem,2vw,0.95rem)' }}>
              {product.shortDescription || product.description?.substring(0,180)}
            </p>

            {/* Qty + Buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQty(Math.max(1,qty-1))} style={{ width: '40px', height: '48px', border: 'none', background: '#F9FAFB', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ padding: '0 20px', fontWeight: 700, fontSize: '1rem' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock,qty+1))} style={{ width: '40px', height: '48px', border: 'none', background: '#F9FAFB', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={() => { dispatch(addToCart({product,quantity:qty})); toast.success('Added to cart!'); }}
                disabled={product.stock===0} className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: '140px' }}>🛒 Add to Cart</button>
              <button onClick={() => { dispatch(addToCart({product,quantity:qty})); navigate('/checkout'); }}
                disabled={product.stock===0} className="btn btn-outline btn-lg" style={{ flex: 1, minWidth: '120px' }}>Buy Now</button>
            </div>

            {/* Delivery info */}
            <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '12px 16px', fontSize: '0.85rem', color: '#065F46', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>🚚 Free delivery above ₹500</span>
              <span>↩️ 7-day returns</span>
              <span>🔒 Secure payment</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          {/* Tab buttons - scrollable on mobile */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #E5E7EB', marginBottom: '24px', overflowX: 'auto' }}>
            {[['desc','Description'],['ingredients','Ingredients'],['reviews',`Reviews (${product.numReviews})`]].map(([t,label]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab===t?700:500, color: tab===t?'#2D6A4F':'#6B7280', borderBottom: tab===t?'2px solid #2D6A4F':'2px solid transparent', marginBottom: '-2px', fontSize: 'clamp(0.85rem,2vw,0.95rem)', whiteSpace: 'nowrap' }}>
                {label}
              </button>
            ))}
          </div>

          {tab==='desc' && <p style={{ color: '#4B5563', lineHeight: 1.9, maxWidth: '720px', fontSize: 'clamp(0.88rem,2vw,0.95rem)' }}>{product.description}</p>}

          {tab==='ingredients' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.ingredients?.map(ing => (
                <span key={ing} style={{ background: '#F0FDF4', border: '1px solid #D1FAE5', color: '#065F46', padding: '6px 14px', borderRadius: '100px', fontSize: '0.88rem' }}>{ing}</span>
              ))}
            </div>
          )}

          {tab==='reviews' && (
            <div style={{ maxWidth: '720px' }}>
              {product.reviews?.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</p>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
              {product.reviews?.map(r => (
                <div key={r._id} style={{ background: 'white', borderRadius: '12px', padding: 'clamp(14px,3vw,20px)', marginBottom: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2D6A4F', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{r.name[0]}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>{r.name}</p>
                      <StarRating rating={r.rating} />
                    </div>
                    <span style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: '0.78rem' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  {r.title && <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{r.title}</p>}
                  <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.7 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ProductDetail;
