import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, ShieldCheck, Plus, Edit2, Trash2, Star, Check, Phone, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { updateProfile } from '../../redux/slices/authSlice';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

const emptyAddr = { fullName: '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false };

// ── Address Form Modal ────────────────────────────────────────
const AddressModal = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState(initial || emptyAddr);
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.fullName.trim()) { toast.error('Name is required'); return false; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit phone required'); return false; }
    if (!form.street.trim()) { toast.error('Street address required'); return false; }
    if (!form.city.trim())   { toast.error('City required'); return false; }
    if (!form.state)         { toast.error('Select a state'); return false; }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error('Valid 6-digit pincode required'); return false; }
    return true;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '18px', padding: 'clamp(20px,4vw,28px)', width: '100%', maxWidth: '480px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="#2D6A4F"/> {initial ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={18}/></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="Receiver's name" value={form.fullName} onChange={e => s('fullName', e.target.value)}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Phone Number *</label>
            <input className="form-input" placeholder="10-digit mobile" value={form.phone}
              onChange={e => s('phone', e.target.value.replace(/\D/g,'').slice(0,10))}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Street / Area *</label>
            <textarea className="form-input" placeholder="House no., street, area, landmark..." value={form.street}
              style={{ minHeight: '64px', resize: 'vertical' }} onChange={e => s('street', e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">City *</label>
            <input className="form-input" placeholder="City or town" value={form.city} onChange={e => s('city', e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Pincode *</label>
            <input className="form-input" placeholder="6-digit" value={form.pincode}
              onChange={e => s('pincode', e.target.value.replace(/\D/g,'').slice(0,6))}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">State *</label>
            <select className="form-input" value={form.state} onChange={e => s('state', e.target.value)}>
              <option value="">Select state</option>
              {STATES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 18px' }}>
          <input type="checkbox" id="isDefault" checked={form.isDefault}
            onChange={e => s('isDefault', e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#2D6A4F' }}/>
          <label htmlFor="isDefault" style={{ fontSize: '0.85rem', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Star size={12} color="#F59E0B"/> Set as default address
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '9px', color: '#6B7280', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
            Cancel
          </button>
          <button onClick={() => validate() && onSave(form)} disabled={saving}
            style={{ flex: 2, padding: '11px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', opacity: saving ? 0.7 : 1 }}>
            {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> Saving...</> : <><Check size={14}/> Save Address</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Address Card ──────────────────────────────────────────────
const AddressCard = ({ addr, onEdit, onDelete, onSetDefault, busy }) => (
  <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    style={{ background: 'white', borderRadius: '12px', padding: '16px', border: `2px solid ${addr.isDefault ? '#2D6A4F' : '#F3F4F6'}`, transition: 'border-color 0.2s', position: 'relative' }}>
    {addr.isDefault && (
      <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#D1FAE5', color: '#065F46', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '3px' }}>
        <Star size={9} fill="#065F46"/> DEFAULT
      </span>
    )}
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <div style={{ background: addr.isDefault ? '#D1FAE5' : '#F3F4F6', borderRadius: '8px', padding: '8px', flexShrink: 0 }}>
        <MapPin size={16} color={addr.isDefault ? '#2D6A4F' : '#9CA3AF'}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{addr.fullName}</p>
        <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.6, margin: '4px 0' }}>
          {addr.street}<br/>
          {addr.city}, {addr.state} — {addr.pincode}
        </p>
        <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Phone size={11}/> {addr.phone}
        </p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '7px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
      {!addr.isDefault && (
        <button onClick={() => onSetDefault(addr._id)} disabled={busy}
          style={{ flex: 1, padding: '7px', background: '#F0FDF4', color: '#2D6A4F', border: '1px solid #D1FAE5', borderRadius: '7px', fontWeight: 600, fontSize: '0.76rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Star size={11}/> Set Default
        </button>
      )}
      <button onClick={() => onEdit(addr)}
        style={{ flex: 1, padding: '7px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', borderRadius: '7px', fontWeight: 600, fontSize: '0.76rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <Edit2 size={11}/> Edit
      </button>
      <button onClick={() => onDelete(addr._id)} disabled={busy}
        style={{ flex: 1, padding: '7px', background: '#FFF1F2', color: '#E11D48', border: '1px solid #FFE4E6', borderRadius: '7px', fontWeight: 600, fontSize: '0.76rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <Trash2 size={11}/> Delete
      </button>
    </div>
  </motion.div>
);

// ── Main Profile ──────────────────────────────────────────────
const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(s => s.auth);
  const [tab,  setTab]  = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false });
  const [pwLoading, setPwLoading] = useState(false);

  const [addresses,    setAddresses]    = useState(user?.addresses || []);
  const [showModal,    setShowModal]    = useState(false);
  const [editingAddr,  setEditingAddr]  = useState(null);
  const [addrSaving,   setAddrSaving]   = useState(false);
  const [addrBusy,     setAddrBusy]     = useState(false);

  const TABS = [
    { id: 'profile',   Icon: User,        label: 'Profile'   },
    { id: 'addresses', Icon: MapPin,      label: 'Addresses' },
    { id: 'security',  Icon: ShieldCheck, label: 'Security'  },
  ];

  const handleProfileUpdate = e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('phone', form.phone);
    dispatch(updateProfile(fd));
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 8) { toast.error('At least 8 characters'); return; }
    setPwLoading(true);
    try {
      await API.put('/user/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
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
      setShowModal(false); setEditingAddr(null);
    } catch {} finally { setAddrSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this address?')) return;
    setAddrBusy(true);
    try {
      const { data } = await API.delete(`/user/address/${id}`);
      setAddresses(data.addresses);
      toast.success('Address removed');
    } catch {} finally { setAddrBusy(false); }
  };

  const handleSetDefault = async id => {
    setAddrBusy(true);
    try {
      const addr = addresses.find(a => a._id === id);
      const { data } = await API.put(`/user/address/${id}`, { ...addr, isDefault: true });
      setAddresses(data.addresses);
      toast.success('Default address set!');
    } catch {} finally { setAddrBusy(false); }
  };

  return (
    <>
      <Helmet><title>My Profile — GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '28px', paddingBottom: '56px', maxWidth: '740px' }}>

        {/* Profile header */}
        <div style={{ background: 'linear-gradient(135deg,#2D6A4F,#40916C)', borderRadius: '16px', padding: 'clamp(18px,4vw,26px)', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '1.5rem', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)' }}>
            {user?.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ color: 'white', flex: 1 }}>
            <h2 style={{ fontSize: '1.1rem', fontFamily: 'Playfair Display,serif', margin: 0 }}>{user?.name}</h2>
            <p style={{ opacity: 0.8, fontSize: '0.82rem', margin: '3px 0 8px' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 9px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize' }}>{user?.role}</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 9px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600 }}>{addresses.length} address{addresses.length !== 1 ? 'es' : ''}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#F3F4F6', borderRadius: '11px', padding: '4px', marginBottom: '22px' }}>
          {TABS.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, padding: '9px 6px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.83rem', transition: 'all 0.18s', background: tab===id ? 'white' : 'transparent', color: tab===id ? '#2D6A4F' : '#6B7280', boxShadow: tab===id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontFamily: 'Inter,sans-serif' }}>
              <Icon size={13}/> {label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: 'clamp(18px,4vw,26px)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '18px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <User size={15} color="#2D6A4F"/> Personal Information
            </h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email} disabled style={{ background: '#F9FAFB', color: '#9CA3AF', cursor: 'not-allowed' }}/>
                <p style={{ fontSize: '0.73rem', color: '#9CA3AF', marginTop: '3px' }}>Email cannot be changed</p>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="10-digit mobile" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}/>
              </div>
              <button type="submit" disabled={loading}
                style={{ padding: '11px 24px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '7px' }}>
                {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> Saving...</> : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* ── Addresses Tab ── */}
        {tab === 'addresses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>Delivery Addresses</h3>
              <button onClick={() => { setEditingAddr(null); setShowModal(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem' }}>
                <Plus size={14}/> Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '14px', padding: '48px 20px', textAlign: 'center', border: '2px dashed #E5E7EB' }}>
                <div style={{ background: '#F3F4F6', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <MapPin size={26} color="#9CA3AF"/>
                </div>
                <h4 style={{ color: '#374151', margin: '0 0 6px', fontFamily: 'Inter,sans-serif' }}>No addresses saved</h4>
                <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '18px' }}>Add your delivery address to speed up checkout</p>
                <button onClick={() => { setEditingAddr(null); setShowModal(true); }}
                  style={{ padding: '10px 22px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <Plus size={14}/> Add Your First Address
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
                <AnimatePresence>
                  {addresses.map(addr => (
                    <AddressCard key={addr._id} addr={addr}
                      onEdit={a => { setEditingAddr(a); setShowModal(true); }}
                      onDelete={handleDelete}
                      onSetDefault={handleSetDefault}
                      busy={addrBusy}/>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* ── Security Tab ── */}
        {tab === 'security' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: 'clamp(18px,4vw,26px)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <h3 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: '6px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <ShieldCheck size={15} color="#2D6A4F"/> Change Password
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.8rem', marginBottom: '20px' }}>Not applicable for Google sign-in accounts</p>
            <form onSubmit={handlePasswordChange}>
              {[
                { key: 'currentPassword', label: 'Current Password', pk: 'current' },
                { key: 'newPassword',     label: 'New Password',     pk: 'new'     },
                { key: 'confirmPassword', label: 'Confirm Password', pk: 'new'     },
              ].map(({ key, label, pk }) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw[pk] ? 'text' : 'password'} className="form-input"
                      placeholder="••••••••" value={passwords[key]} style={{ paddingRight: '44px' }}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}/>
                    <button type="button" onClick={() => setShowPw(s => ({ ...s, [pk]: !s[pk] }))}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                      {showPw[pk] ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" disabled={pwLoading}
                style={{ padding: '11px 24px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: '7px' }}>
                {pwLoading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> Updating...</> : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Address modal */}
      <AnimatePresence>
        {showModal && (
          <AddressModal initial={editingAddr} onSave={handleSaveAddress}
            onClose={() => { setShowModal(false); setEditingAddr(null); }} saving={addrSaving}/>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Profile;
