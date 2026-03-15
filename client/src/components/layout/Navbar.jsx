import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaShoppingCart, FaUser, FaBox, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { logoutUser } from '../../redux/slices/authSlice';
import { selectCartCount } from '../../redux/slices/cartSlice';
import styles from './Navbar.module.css';

const Navbar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartCount = useSelector(selectCartCount);
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => { if (!e.target.closest(`.${styles.userMenu}`)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>

        {/* ── Logo ── */}
        <Link to="/" className={styles.logo}>
          <FaLeaf style={{ color: '#2D6A4F', fontSize: '1.3rem' }} />
          <span className={styles.logoText}>GreenRoots</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className={styles.navLinks}>
          {[['/', 'Home', true], ['/products', 'Products', false], ['/about', 'About', false], ['/contact', 'Contact', false]].map(([path, label, end]) => (
            <NavLink key={path} to={path} end={end}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* ── Right Actions ── */}
        <div className={styles.actions}>

          {/* Cart */}
          <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
            <FaShoppingCart style={{ fontSize: '1.2rem' }} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.avatarBtn} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className={styles.avatar} />
                  : <div className={styles.avatarFallback}>{user?.name?.[0]?.toUpperCase()}</div>
                }
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div className={styles.dropdown}
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user?.name}</p>
                      <p className={styles.dropdownEmail}>{user?.email}</p>
                    </div>
                    <Link to="/profile"  className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}><FaUser style={{ fontSize: '0.85rem' }} /> My Profile</Link>
                    <Link to="/orders"   className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}><FaBox style={{ fontSize: '0.85rem' }} /> My Orders</Link>
                    <Link to="/wishlist" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}><FaHeart style={{ fontSize: '0.85rem' }} /> Wishlist</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}><FaCog style={{ fontSize: '0.85rem' }} /> Admin Panel</Link>
                    )}
                    <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                      <FaSignOutAlt style={{ fontSize: '0.85rem' }} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm hide-mobile">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen
              ? <HiX style={{ fontSize: '1.4rem', color: '#374151' }} />
              : <HiMenu style={{ fontSize: '1.4rem', color: '#374151' }} />
            }
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className={styles.mobileMenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {[['/', 'Home'], ['/products', 'Products'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
              <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className={styles.mobileLink}>{label}</NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/profile"  onClick={() => setMobileOpen(false)} className={styles.mobileLink}>My Profile</NavLink>
                <NavLink to="/orders"   onClick={() => setMobileOpen(false)} className={styles.mobileLink}>My Orders</NavLink>
                <NavLink to="/wishlist" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Wishlist</NavLink>
                <button onClick={handleLogout} className={`${styles.mobileLink} ${styles.mobileLogout}`}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login"    onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Login</NavLink>
                <NavLink to="/register" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Sign Up</NavLink>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
