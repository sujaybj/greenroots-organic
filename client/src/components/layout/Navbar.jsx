import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '../../redux/slices/authSlice';
import { selectCartCount } from '../../redux/slices/cartSlice';
import styles from './Navbar.module.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartCount = useSelector(selectCartCount);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌿</span>
          <span className={styles.logoText}>GreenRoots</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Products</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Contact</NavLink>
        </div>

        {/* Right Actions */}
        <div className={styles.actions}>
          {/* Cart */}
          <Link to="/cart" className={styles.cartBtn}>
            <span>🛒</span>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.avatarBtn} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarFallback}>{user?.name?.[0]?.toUpperCase()}</div>
                )}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className={styles.dropdown}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user?.name}</p>
                      <p className={styles.dropdownEmail}>{user?.email}</p>
                    </div>
                    <Link to="/profile" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>👤 My Profile</Link>
                    <Link to="/orders" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>📦 My Orders</Link>
                    <Link to="/wishlist" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>❤️ Wishlist</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>⚙️ Admin Panel</Link>
                    )}
                    <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>🚪 Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm hide-mobile">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>
            <span className={`${styles.bar} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.open : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <NavLink to="/" end onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Home</NavLink>
            <NavLink to="/products" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Products</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>About</NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Contact</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>My Profile</NavLink>
                <NavLink to="/orders" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>My Orders</NavLink>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className={`${styles.mobileLink} ${styles.mobileLogout}`}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Login</NavLink>
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
