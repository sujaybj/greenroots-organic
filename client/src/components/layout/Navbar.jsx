import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, ShoppingCart, User, LogOut, Package,
  Heart, Settings, Menu, X, Search, Mic, MicOff, Bell,
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import { selectCartCount } from '../../redux/slices/cartSlice';
import styles from './Navbar.module.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartCount = useSelector(selectCartCount);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceSupport, setVoiceSupport] = useState(false);

  const searchRef = useRef(null);
  const recognitionRef = useRef(null);

  const unreadNotifications = useMemo(
    () => (user?.notifications || []).filter((notification) => !notification.readAt).length,
    [user?.notifications]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupport(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (e) => {
        const transcript = Array.from(e.results).map((result) => result[0].transcript).join('');
        setSearchQuery(transcript);

        if (e.results[0].isFinal) {
          setListening(false);
          navigate(`/products?search=${encodeURIComponent(transcript)}`);
          setSearchOpen(false);
          setSearchQuery('');
        }
      };

      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, [navigate]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const handleVoiceSearch = () => {
    if (!voiceSupport || !recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setSearchOpen(true);
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <Leaf size={18} color="#2D6A4F" strokeWidth={2} />
          <span className={styles.logoText}>GreenRoots</span>
        </Link>

        <div className={styles.navLinks}>
          <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Products</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>Contact</NavLink>
        </div>

        <div className={styles.actions}>
          <button onClick={() => setSearchOpen((open) => !open)} className={styles.iconBtn} aria-label="Search" title="Search">
            <Search size={18} strokeWidth={2} />
          </button>

          <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
            <ShoppingCart size={19} strokeWidth={2} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.avatarBtn} onClick={() => setUserMenuOpen((open) => !open)}>
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className={styles.avatar} />
                  : <div className={styles.avatarFallback}>{user?.name?.[0]?.toUpperCase()}</div>}
                {unreadNotifications > 0 && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', minWidth: '18px', height: '18px', borderRadius: '999px', background: '#DC2626', color: 'white', fontSize: '0.68rem', fontWeight: 700, display: 'grid', placeItems: 'center', padding: '0 4px' }}>
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div className={styles.dropdown}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user?.name}</p>
                      <p className={styles.dropdownEmail}>{user?.email}</p>
                    </div>
                    {unreadNotifications > 0 && (
                      <Link to="/wishlist" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                        <Bell size={14} strokeWidth={2} /> {unreadNotifications} restock update{unreadNotifications > 1 ? 's' : ''}
                      </Link>
                    )}
                    {[
                      { to: '/profile', Icon: User, label: 'My Profile' },
                      { to: '/orders', Icon: Package, label: 'My Orders' },
                      { to: '/wishlist', Icon: Heart, label: 'Wishlist' },
                    ].map(({ to, Icon, label }) => (
                      <Link key={to} to={to} className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                        <Icon size={14} strokeWidth={2} /> {label}
                      </Link>
                    ))}
                    {user?.role === 'admin' && (
                      <Link to="/admin" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                        <Settings size={14} strokeWidth={2} /> Admin Panel
                      </Link>
                    )}
                    <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                      <LogOut size={14} strokeWidth={2} /> Logout
                    </button>
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

          <button className={styles.hamburger} onClick={() => setMobileOpen((open) => !open)} aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: 'white', borderTop: '1px solid #E5E7EB', padding: '16px 12px', overflow: 'hidden' }}>
            <form onSubmit={handleSearch} style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
              <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={listening ? 'Listening...' : 'Search products...'}
                style={{ width: '100%', padding: '14px 54px 14px 50px', border: `1.5px solid ${listening ? '#E11D48' : '#E5E7EB'}`, borderRadius: '16px', fontSize: '1rem', outline: 'none', fontFamily: 'Manrope,sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s', background: listening ? '#FFF5F5' : 'white' }}
              />
              {voiceSupport && (
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  aria-label="Voice Search"
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'white', border: '1.5px solid #D1D5DB', width: '34px', height: '34px', borderRadius: '10px', cursor: 'pointer', color: listening ? '#E11D48' : '#6B7280', display: 'grid', placeItems: 'center' }}
                >
                  {listening ? <MicOff size={17} /> : <Mic size={17} />}
                </button>
              )}
            </form>
            {listening && (
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#E11D48', marginTop: '8px' }}>
                Listening... speak your product name
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className={styles.mobileMenu}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <NavLink to="/" end onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Home</NavLink>
            <NavLink to="/products" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Products</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>About</NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Contact</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>My Profile</NavLink>
                <NavLink to="/orders" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>My Orders</NavLink>
                <NavLink to="/wishlist" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Wishlist</NavLink>
                {user?.role === 'admin' && <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Admin Panel</NavLink>}
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
