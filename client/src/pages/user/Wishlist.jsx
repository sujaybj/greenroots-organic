import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, HeartOff, Trash2 } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import { updateWishlist } from '../../redux/slices/authSlice';
import API from '../../utils/api';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlist = user?.wishlist || [];

  const removeFromWishlist = async (productId) => {
    const { data } = await API.post(`/user/wishlist/${productId}`);
    dispatch(updateWishlist(data.wishlist));
  };

  return (
    <>
      <Helmet><title>My Wishlist - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}><Heart size={28} color="#DC2626" /> My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F9FAFB', display: 'grid', placeItems: 'center' }}>
                <HeartOff size={30} color="#9CA3AF" />
              </div>
            </div>
            <h3 style={{ color: '#374151' }}>Your wishlist is empty</h3>
            <p style={{ color: '#9CA3AF', marginTop: '8px' }}>Save products you love for later</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Explore Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {wishlist.map((product) => {
              const prod = product._id ? product : { _id: product };
              return (
                <div key={prod._id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <Link to={`/products/${prod._id}`}>
                    {prod.images && <img src={prod.images[0]?.url} alt={prod.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
                  </Link>
                  <div style={{ padding: '14px' }}>
                    {prod.name && (
                      <>
                        <h3 style={{ fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, marginBottom: '8px' }}>{prod.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontWeight: 700, color: '#2D6A4F' }}>₹{prod.discountPrice || prod.price}</span>
                          {prod.price > (prod.discountPrice || prod.price) && <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '0.85rem' }}>₹{prod.price}</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => dispatch(addToCart({ product: prod, quantity: 1 }))} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Add to Cart</button>
                          <button onClick={() => removeFromWishlist(prod._id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: '6px', padding: '8px 10px', cursor: 'pointer', color: '#EF4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
