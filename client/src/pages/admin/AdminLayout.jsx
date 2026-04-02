import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart3, Box, ShoppingCart, Users, Store, LogOut, Leaf, PanelLeft, PanelRight, Activity,
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const navItems = [
    { path: '/admin', Icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/products', Icon: Box, label: 'Products' },
    { path: '/admin/orders', Icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/users', Icon: Users, label: 'Users' },
    { path: '/', Icon: Store, label: 'View Store' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const activeItem = navItems.find(n => isActive(n.path));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0FDF4' }}>
      <div style={{
        width: collapsed ? '64px' : '220px',
        background: 'linear-gradient(180deg, #1B4332 0%, #2D6A4F 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        transition: 'width 0.25s',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Leaf size={24} color="#74C69D" style={{ flexShrink: 0 }} />
          {!collapsed && (
            <div>
              <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>GreenRoots</p>
              <p style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '2px' }}>Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '6px', width: '26px', height: '26px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {collapsed ? <PanelRight size={14} /> : <PanelLeft size={14} />}
          </button>
        </div>

        {!collapsed && (
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#74C69D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin'}</p>
              <p style={{ fontSize: '0.7rem', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '12px' : '11px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive(item.path) ? '#1B4332' : 'rgba(255,255,255,0.8)',
                background: isActive(item.path) ? '#74C69D' : 'transparent',
                fontWeight: isActive(item.path) ? 700 : 400,
                fontSize: '0.88rem',
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              onMouseOver={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseOut={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
              title={collapsed ? item.label : ''}
            >
              <item.Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: collapsed ? '11px' : '11px 14px', background: 'none', border: 'none', color: 'rgba(255,160,160,0.9)', cursor: 'pointer', borderRadius: '10px', fontSize: '0.88rem', justifyContent: collapsed ? 'center' : 'flex-start' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.15)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; }}
          >
            <LogOut size={17} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div style={{ marginLeft: collapsed ? '64px' : '220px', flex: 1, transition: 'margin-left 0.25s', minWidth: 0 }}>
        <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeItem?.Icon && <activeItem.Icon size={18} />}
            {activeItem?.label || 'Admin'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={12} />
              Live
            </span>
            <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        <div style={{ padding: '28px', overflowX: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
