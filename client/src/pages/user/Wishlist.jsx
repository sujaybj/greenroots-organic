import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, HeartOff, ShoppingCart, Trash2, AlertCircle, Bell } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import { updateWishlist, setCredentials } from '../../redux/slices/authSlice';
import API from '../../utils/api';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const wishlist = user?.wishlist || [];
  const notifications = user?.notifications || [];

  const wishlistItems = useMemo(
    () => wishlist.map((product) => {
      const isObject = product && typeof product === 'object';

      return {
        _id: isObject ? product._id : product,
        name: isObject ? product.name : '',
        images: isObject ? product.images || [] : [],
        price: isObject ? product.price : null,
        discountPrice: isObject ? product.discountPrice : null,
        rating: isObject ? product.rating : null,
        stock: isObject ? product.stock : 0,
        isResolved: Boolean(isObject && product._id && product.name),
      };
    }).filter((product) => product._id),
    [wishlist]
  );

  const unreadRestockNotifications = useMemo(
    () => notifications.filter((notification) => notification.type === 'restock' && !notification.readAt),
    [notifications]
  );

  const removeFromWishlist = async (productId) => {
    const { data } = await API.post(`/user/wishlist/${productId}`);
    dispatch(updateWishlist(data.wishlist));
  };

  const dismissNotification = async (notificationId) => {
    await API.patch(`/user/notifications/${notificationId}/read`);
    const refreshed = await API.get('/auth/me');
    dispatch(setCredentials({ user: refreshed.data.user, token: accessToken }));
  };

  return (
    <>
      <Helmet><title>My Wishlist - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#FFF1F2', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Heart size={28} color="#DC2626" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, lineHeight: 1.1 }}>My Wishlist</h1>
              <p style={{ color: '#6B7280', margin: '6px 0 0', fontSize: '0.92rem' }}>
                {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          {wishlistItems.length > 0 && (
            <Link to="/products" className="btn btn-outline">
              Continue Shopping
            </Link>
          )}
        </div>

        {unreadRestockNotifications.length > 0 && (
          <div style={{ display: 'grid', gap: '10px', marginBottom: '24px' }}>
            {unreadRestockNotifications.map((notification) => (
              <div key={notification._id} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#DCFCE7', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Bell size={18} color="#15803D" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#14532D', fontSize: '0.92rem' }}>{notification.title}</p>
                    <p style={{ margin: '4px 0 0', color: '#166534', fontSize: '0.83rem', lineHeight: 1.6 }}>
                      {notification.message}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => dismissNotification(notification._id)} className="btn btn-outline btn-sm">
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}

        {wishlistItems.length === 0 ? (
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: '20px' }}>
            {wishlistItems.map((product) => {
              const finalPrice = product.discountPrice || product.price;
              const hasDiscount = typeof product.price === 'number' && typeof finalPrice === 'number' && product.price > finalPrice;
              const imageUrl = product.images?.[0]?.url;
              const outOfStock = product.isResolved && product.stock === 0;

              return (
                <div key={product._id} style={{ background: 'white', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.08)', border: '1px solid #EEF2F7', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', background: '#F8FAFC' }}>
                    <Link to={`/products/${product._id}`} style={{ display: 'block' }}>
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '210px', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ height: '210px', display: 'grid', placeItems: 'center', color: '#94A3B8', background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)' }}>
                          <HeartOff size={34} />
                        </div>
                      )}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product._id)}
                      aria-label="Remove from wishlist"
                      style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.94)', border: '1px solid #FECACA', borderRadius: '999px', width: '38px', height: '38px', color: '#DC2626', display: 'grid', placeItems: 'center', boxShadow: '0 8px 18px rgba(220, 38, 38, 0.12)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    {outOfStock && (
                      <div style={{ position: 'absolute', left: '12px', bottom: '12px', background: 'rgba(220, 38, 38, 0.92)', color: 'white', borderRadius: '999px', padding: '6px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                        Out of stock
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {product.isResolved ? (
                      <>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontFamily: 'Manrope, sans-serif', fontWeight: 700, margin: 0, color: '#0F172A', lineHeight: 1.45 }}>
                            {product.name}
                          </h3>
                          {typeof product.rating === 'number' && (
                            <p style={{ margin: '6px 0 0', color: '#6B7280', fontSize: '0.82rem' }}>
                              Rated {product.rating.toFixed(1)} / 5
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                          {typeof finalPrice === 'number' && (
                            <span style={{ fontWeight: 800, color: '#166534', fontSize: '1.1rem' }}>₹{finalPrice}</span>
                          )}
                          {hasDiscount && (
                            <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '0.88rem' }}>₹{product.price}</span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                          <button
                            type="button"
                            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1 }}
                            disabled={outOfStock}
                          >
                            <ShoppingCart size={15} />
                            {outOfStock ? 'Notify me' : 'Add to Cart'}
                          </button>
                          <Link to={`/products/${product._id}`} className="btn btn-outline btn-sm">
                            View
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '12px', padding: '12px' }}>
                          <AlertCircle size={18} color="#EA580C" style={{ flexShrink: 0, marginTop: '1px' }} />
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: '#9A3412', fontSize: '0.9rem' }}>Product details are refreshing</p>
                            <p style={{ margin: '4px 0 0', color: '#C2410C', fontSize: '0.8rem', lineHeight: 1.6 }}>
                              This saved item is still linked to your account, but its full details have not loaded yet.
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                          <Link to={`/products/${product._id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                            Open Product
                          </Link>
                          <button type="button" onClick={() => removeFromWishlist(product._id)} className="btn btn-danger btn-sm">
                            Remove
                          </button>
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
