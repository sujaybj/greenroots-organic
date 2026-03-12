import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { updateProfile } from '../../redux/slices/authSlice';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: user?.name||'', phone: user?.phone||'' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [tab, setTab] = useState('profile');
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('phone', form.phone);
    dispatch(updateProfile(fd));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setPwLoading(true);
    try {
      await API.put('/user/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch {} finally { setPwLoading(false); }
  };

  return (
    <>
      <Helmet><title>My Profile - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '24px', paddingBottom: '48px', maxWidth: '680px' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', marginBottom: '24px' }}>My Account</h1>

        {/* Profile Card */}
        <div style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)', borderRadius: '16px', padding: 'clamp(18px,4vw,28px)', display: 'flex', gap: 'clamp(14px,3vw,20px)', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: 'clamp(58px,12vw,72px)', height: 'clamp(58px,12vw,72px)', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700, color: 'white', overflow: 'hidden', flexShrink: 0 }}>
            {user?.avatar ? <img src={user.avatar} alt={user.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ color: 'white', minWidth: 0 }}>
            <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.3rem)', fontFamily: 'Playfair Display, serif', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</h2>
            <p style={{ opacity: 0.85, fontSize: 'clamp(0.78rem,2vw,0.9rem)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, marginTop: '6px', display: 'inline-block', textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '4px', background: '#F3F4F6', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
          {[{id:'profile',label:'👤 Profile'},{id:'security',label:'🔒 Security'}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: 'clamp(8px,2vw,10px)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: 'clamp(0.82rem,2vw,0.9rem)', transition: 'all 0.2s', background: tab===t.id?'white':'transparent', color: tab===t.id?'#2D6A4F':'#6B7280', boxShadow: tab===t.id?'0 2px 8px rgba(0,0,0,0.08)':'none' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(18px,4vw,28px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px' }}>Personal Information</h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="+91 9876543210" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email||''} disabled style={{ background: '#F9FAFB', cursor: 'not-allowed', color: '#9CA3AF' }} />
                <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '4px' }}>Email cannot be changed</p>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary mobile-full">
                {loading ? '⏳ Saving...' : '✓ Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(18px,4vw,28px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px' }}>Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              {[['currentPassword','Current Password','Your current password'],['newPassword','New Password','At least 8 characters'],['confirmPassword','Confirm New Password','Re-enter new password']].map(([key,label,ph]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input type="password" className="form-input" placeholder={ph} value={passwords[key]} onChange={e => setPasswords({...passwords,[key]:e.target.value})} />
                </div>
              ))}
              <button type="submit" disabled={pwLoading} className="btn btn-primary mobile-full">
                {pwLoading ? '⏳ Changing...' : '🔒 Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
export default Profile;
