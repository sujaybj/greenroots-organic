import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, ShieldCheck, UserCircle2, BadgeCheck, Clock3, Trash2, Users } from 'lucide-react';
import AdminLayout from './AdminLayout';
import API from '../../utils/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/admin/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filtered = search
    ? users.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <AdminLayout>
      <Helmet><title>Manage Users - Admin</title></Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Users</h1>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '2px' }}>{users.length} registered users</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px', maxWidth: '380px', position: 'relative' }}>
        <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
        />
      </div>

      {loading ? <Loader /> : (
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['User', 'Phone', 'Role', 'Verified', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: '#6B7280', fontWeight: 600, borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr
                    key={user._id}
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#FAFAFA'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'white'; }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: user.role === 'admin' ? '#2D6A4F' : '#8B5CF6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, overflow: 'hidden' }}>
                          {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600 }}>{user.name}</p>
                          <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '1px' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6B7280' }}>{user.phone || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: user.role === 'admin' ? '#D1FAE5' : '#EFF6FF', color: user.role === 'admin' ? '#065F46' : '#1D4ED8', padding: '3px 10px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {user.role === 'admin' ? <ShieldCheck size={13} /> : <UserCircle2 size={13} />}
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: user.isVerified ? '#D1FAE5' : '#FEF3C7', color: user.isVerified ? '#065F46' : '#92400E', padding: '3px 10px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {user.isVerified ? <BadgeCheck size={13} /> : <Clock3 size={13} />}
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
              <Users size={46} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>No users found</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
