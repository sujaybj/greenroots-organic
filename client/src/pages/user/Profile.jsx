import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, MapPin, Plus, Edit2, Trash2,
  Star, Check, Phone, Home, Building, Map,
  Eye, EyeOff, Loader2, ShieldCheck,
} from 'lucide-react';
import { updateProfile } from '../../redux/slices/authSlice';
import API from '../../utils/api';
import toast from 'react-hot-toast';

// ── Empty address form ────────────────────────────────────────
const emptyAddr = { fullName: '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false };

// ── Indian states list ────────────────────────────────────────
const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

// ── Address Form Modal ────────────────────────────────────────
const AddressForm = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState(initial || emptyAddr);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.fullName.trim()) { toast.error('Full name is required'); return false; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit phone required'); return false; }
    if (!form.street.trim()) { toast.error('Street address is required'); return false; }
    if (!form.city.trim()) { toast.error('City is required'); return false; }
    if (!form.state) { toast.error('State is required'); return false; }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error('Valid 6-digit pincode required'); return false; }
    return true;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#2D6A4F"/> {initial ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Full Name */}
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
              <input className="form-input" placeholder="Receiver's full name" value={form.fullName}
                style={{ paddingLeft: '34px' }}
                onChange={e => set('fullName', e.target.value)}/>
            </div>
          </div>

          {/* Phone */}
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Phone Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
              <input className="form-input" placeholder="10-digit mobile number" value={form.phone}
                style={{ paddingLeft: '34px' }}
                onChange={e => set('phone', e.target.value.replace(/\D/g,'').slice(0,10))}/>
            </div>
          </div>

          {/* Street */}
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Street / Village / Area *</label>
            <div style={{ position: 'relative' }}>
              <Home size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '14px', pointerEvents: 'none' }}/>
              <textarea className="form-input" placeholder="House no., street name, village, landmark..." value={form.street}
                style={{ paddingLeft: '34px', minHeight: '72px', resize: 'vertical' }}
                onChange={e => set('street', e.target.value)}/>
            </div>
          </div>

          {/* City */}
          <div className="form-group">
            <label className="form-label">City / Town / Village *</label>
            <div style={{ position: 'relative' }}>
              <Building size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
              <input className="form-input" placeholder="City or village name" value={form.city}
                style={{ paddingLeft: '34px' }}
                onChange={e => set('city', e.target.value)}/>
            </div>
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label className="form-label">Pincode *</label>
            <div style={{ position: 'relative' }}>
              <Map size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
              <input className="form-input" placeholder="6-digit pincode" value={form.pincode}
                style={{ paddingLeft: '34px' }}
                onChange={e => set('pincode', e.target.value.replace(/\D/g,'').slice(0,6))}/>
            </div>
          </div>

          {/* State */}
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">State *</label>
            <select className="form-input" value={form.state} onChange={e => set('state', e.target.value)}>
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Set as default */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0 20px' }}>
          <input type="checkbox" id="isDefault" checked={form.isDefault}
            onChange={e => set('isDefault', e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#2D6A4F' }}/>
          <label htmlFor="isDefault" style={{ fontSize: '0.88rem', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={13} color="#F59E0B"/> Set as default delivery address
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '10px', color: '#6B7280', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
            Cancel
          </button>
          <button onClick={() => validate() && onSave(form)}
            disabled={saving}
            style={{ flex: 2, padding: '12px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: saving ? 0.7 : 1 }}>
            {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }}/> Saving...</> : <><Check size={15}/> Save Address</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Address Card ──────────────────────────────────────────────
const AddressCard = ({ addr, onEdit, onDelete, onSetDefault, actionLoading }) => (
  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    style={{ background: 'white', borderRadius: '14px', padding: '20px', border: `2px solid ${addr.isDefault ? '#2D6A4F' : '#F3F4F6'}`, position: 'relative', transition: 'border-color 0.2s' }}>
    {addr.isDefault && (
      <span style={{ position: 'absolute', top: '14px', right: '14px', background: '#D1FAE5', color: '#065F46', fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Star size={10} fill="#065F46"/> DEFAULT
      </span>
    )}
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ background: addr.isDefault ? '#D1FAE5' : '#F3F4F6', borderRadius: '10px', padding: '10px', flexShrink: 0 }}>
        <MapPin size={18} color={addr.isDefault ? '#2D6A4F' : '#6B7280'}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1B1B1B', marginBottom: '2px' }}>{addr.fullName}</p>
        <p style={{ fontSize: '0.84rem', color: '#6B7280', lineHeight: 1.6 }}>
          {addr.street}<br/>
          {addr.city}, {addr.state} — {addr.pincode}<br/>
          {addr.country}
        </p>
        <p style={{ fontSize: '0.82rem', color: '#374151', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Phone size={11} color="#6B7280"/> {addr.phone}
        </p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid #F3F4F6', paddingTop: '14px' }}>
      {!addr.isDefault && (
        <button onClick={() => onSetDefault(addr._id)} disabled={actionLoading}
          style={{ flex: 1, padding: '8px', background: '#F0FDF4', color: '#2D6A4F', border: '1px solid #D1FAE5', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <Star size={12}/> Set Default
        </button>
      )}
      <button onClick={() => onEdit(addr)}
        style={{ flex: 1, padding: '8px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
        <Edit2 size={12}/> Edit
      </button>
      <button onClick={() => onDelete(addr._id)} disabled={actionLoading}
        style={{ flex: 1, padding: '8px', background: '#FFF1F2', color: '#E11D48', border: '1px solid #FFE4E6', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
        <Trash2 size={12}/> Delete
      </button>
    </div>
  </motion.div>
);

// ── Main Profile Component ────────────────────────────────────
const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(s => s.auth);
  const [tab, setTab]     = useState('profile');
  const [form, setForm]   = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw]       = useState({ current: false, new: false });
  const [pwLoading, setPwLoading] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showModal, setShowModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrSaving, setAddrSaving]   = useState(false);
  const [addrLoading, setAddrLoading] = useState(false);

  const tabs = [
    { id: 'profile',   Icon: User,    label: 'Profile'   },
    { id: 'addresses', Icon: MapPin,  label: 'Addresses' },
    { id: 'security',  Icon: ShieldCheck, label: 'Security'  },
  ];

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
    if (passwords.newPassword.length < 8) { toast.error('At least 8 characters required'); return; }
    setPwLoading(true);
    try {
      await API.put('/user/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {} finally { setPwLoading(false); }
  };

  const handleSaveAddress = async (formData) => {
    setAddrSaving(true);
    try {
      if (editingAddr) {
        const { data } = await API.put(`/user/address/${editingAddr._id}`, formData);
        setAddresses(data.addresses);
        toast.success('Address updated!');
      } else {
        const { data } = await API.post('/user/address', formData);
        setAddresses(data.addresses);
        toast.success('Address added!');
      }
      setShowModal(false);
      setEditingAddr(null);
    } catch {} finally { setAddrSaving(false); }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    setAddrLoading(true);
    try {
      const { data } = await API.delete(`/user/address/${id}`);
      setAddresses(data.addresses);
      toast.success('Address removed');
    } catch {} finally { setAddrLoading(false); }
  };

  const handleSetDefault = async (id) => {
    setAddrLoading(true);
    try {
      const addr = addresses.find(a => a._id === id);
      const { data } = await API.put(`/user/address/${id}`, { ...addr, isDefault: true });
      setAddresses(data.addresses);
      toast.success('Default address updated!');
    } catch {} finally { setAddrLoading(false); }
  };

  return (
    <>
      <Helmet><title>My Profile — GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '56px', maxWidth: '780px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '28px', fontFamily: 'Playfair Display,serif' }}>My Account</h1>

        {/* Profile header card */}
        <div style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)', borderRadius: '16px', padding: '24px 28px', display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '1.6rem', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)' }}>
            {user?.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ color: 'white', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display,serif', margin: 0 }}>{user?.name}</h2>
            <p style={{ opacity: 0.8, fontSize: '0.85rem', margin: '3px 0 8px' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>{user?.role}</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600 }}>
                {addresses.length} {addresses.length === 1 ? 'Address' : 'Addresses'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#F3F4F6', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
          {tabs.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, padding: '10px 8px', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', background: tab === id ? 'white' : 'transparent', color: tab === id ? '#2D6A4F' : '#6B7280', boxShadow: tab === id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Inter,sans-serif' }}>
              <Icon size={14} strokeWidth={2}/> {label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#2D6A4F"/> Personal Information
            </h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email} disabled style={{ background: '#F9FAFB', cursor: 'not-allowed', color: '#9CA3AF' }}/>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>Email cannot be changed</p>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="10-digit mobile number" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}/>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px' }}>Used for SMS delivery updates</p>
              </div>
              <button type="submit" disabled={loading}
                style={{ padding: '12px 28px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }}/> Saving...</> : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* ── Addresses Tab ── */}
        {tab === 'addresses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, margin: 0 }}>Delivery Addresses</h3>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', marginTop: '3px' }}>We deliver to villages and remote areas too!</p>
              </div>
              <button onClick={() => { setEditingAddr(null); setShowModal(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.88rem' }}>
                <Plus size={15}/> Add Address
              </button>
            </div>

            {/* Remote delivery banner */}
            <div style={{ background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(116,198,157,0.25)', borderRadius: '10px', padding: '10px', flexShrink: 0 }}>
                <MapPin size={20} color="#74C69D"/>
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>We deliver to remote areas!</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', margin: '3px 0 0', lineHeight: 1.5 }}>
                  Villages, hills, forests — if India Post reaches you, we reach you. Add your full address with pincode.
                </p>
              </div>
            </div>

            {addresses.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '48px 20px', textAlign: 'center', border: '2px dashed #E5E7EB' }}>
                <div style={{ background: '#F3F4F6', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <MapPin size={28} color="#9CA3AF"/>
                </div>
                <h4 style={{ color: '#374151', marginBottom: '8px', fontFamily: 'Inter,sans-serif' }}>No addresses saved</h4>
                <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '20px' }}>Add your delivery address to speed up checkout</p>
                <button onClick={() => { setEditingAddr(null); setShowModal(true); }}
                  style={{ padding: '10px 24px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                  <Plus size={15}/> Add Your First Address
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '14px' }}>
                <AnimatePresence>
                  {addresses.map(addr => (
                    <AddressCard key={addr._id} addr={addr}
                      onEdit={(a) => { setEditingAddr(a); setShowModal(true); }}
                      onDelete={handleDeleteAddress}
                      onSetDefault={handleSetDefault}
                      actionLoading={addrLoading}/>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* ── Security Tab ── */}
        {tab === 'security' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#2D6A4F"/> Change Password
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: '24px' }}>Leave blank if you signed in with Google</p>
            <form onSubmit={handlePasswordChange}>
              {[
                { key: 'currentPassword', label: 'Current Password',  pwKey: 'current' },
                { key: 'newPassword',     label: 'New Password',      pwKey: 'new'     },
                { key: 'confirmPassword', label: 'Confirm New Password', pwKey: 'new'  },
              ].map(({ key, label, pwKey }) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                    <input type={showPw[pwKey] ? 'text' : 'password'} className="form-input"
                      placeholder="••••••••" value={passwords[key]}
                      style={{ paddingLeft: '34px', paddingRight: '44px' }}
                      onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}/>
                    <button type="button" onClick={() => setShowPw(s => ({ ...s, [pwKey]: !s[pwKey] }))}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                      {showPw[pwKey] ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" disabled={pwLoading}
                style={{ padding: '12px 28px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {pwLoading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }}/> Updating...</> : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {showModal && (
          <AddressForm
            initial={editingAddr}
            onSave={handleSaveAddress}
            onClose={() => { setShowModal(false); setEditingAddr(null); }}
            saving={addrSaving}/>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Profile;
