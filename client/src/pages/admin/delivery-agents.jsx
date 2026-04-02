// AdminDeliveryAgents.jsx
// Drop this section inside your existing Admin panel, visible only when user.role === 'admin'
import AdminDeliveryAgents from './AdminDeliveryAgents';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Bike, Plus, Edit2, Trash2, Phone, MapPin,
  CheckCircle, XCircle, Clock, Search, X,
  Loader2, Check, User, Star, Package
} from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  active:   { label: 'Active',      color: '#065F46', bg: '#D1FAE5', Icon: CheckCircle },
  inactive: { label: 'Inactive',    color: '#92400E', bg: '#FEF3C7', Icon: Clock       },
  banned:   { label: 'Banned',      color: '#991B1B', bg: '#FEE2E2', Icon: XCircle     },
};

const EMPTY_AGENT = {
  name: '', phone: '', email: '', vehicleType: 'bike',
  vehicleNumber: '', zone: '', status: 'active', notes: '',
};

// ── Agent Form Modal ─────────────────────────────────────────
const AgentModal = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState(initial || EMPTY_AGENT);
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.name.trim())          { toast.error('Name is required'); return false; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit phone required'); return false; }
    if (!form.vehicleNumber.trim()) { toast.error('Vehicle number required'); return false; }
    if (!form.zone.trim())          { toast.error('Delivery zone required'); return false; }
    return true;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '18px', padding: 'clamp(20px,4vw,28px)', width: '100%', maxWidth: '500px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bike size={16} color="#2D6A4F"/> {initial?._id ? 'Edit Agent' : 'Add Delivery Agent'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={18}/></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="Agent's full name" value={form.name}
              onChange={e => s('name', e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-input" placeholder="10-digit mobile" value={form.phone}
              onChange={e => s('phone', e.target.value.replace(/\D/g,'').slice(0,10))}/>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="agent@email.com" value={form.email}
              onChange={e => s('email', e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <select className="form-input" value={form.vehicleType} onChange={e => s('vehicleType', e.target.value)}>
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="cycle">Cycle</option>
              <option value="van">Mini Van</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Vehicle Number *</label>
            <input className="form-input" placeholder="KA-01-AB-1234" value={form.vehicleNumber}
              onChange={e => s('vehicleNumber', e.target.value.toUpperCase())}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Delivery Zone *</label>
            <input className="form-input" placeholder="e.g. Indiranagar, Koramangala" value={form.zone}
              onChange={e => s('zone', e.target.value)}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={e => s('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Admin Notes</label>
            <textarea className="form-input" placeholder="Internal notes about this agent..."
              value={form.notes} style={{ minHeight: '60px', resize: 'vertical' }}
              onChange={e => s('notes', e.target.value)}/>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '11px', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '9px', color: '#6B7280', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={() => validate() && onSave(form)} disabled={saving}
            style={{ flex: 2, padding: '11px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', opacity: saving ? 0.7 : 1 }}>
            {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> Saving...</> : <><Check size={14}/> Save Agent</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Agent Card ───────────────────────────────────────────────
const AgentCard = ({ agent, onEdit, onDelete, busy }) => {
  const cfg = STATUS_CONFIG[agent.status] || STATUS_CONFIG.inactive;
  const { Icon: StatusIcon } = cfg;
  return (
    <div style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #F3F4F6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ background: '#F0FDF4', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, color: '#2D6A4F', fontSize: '1rem' }}>
          {agent.name?.[0]?.toUpperCase() || <User size={18}/>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{agent.name}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: cfg.bg, color: cfg.color, fontSize: '0.63rem', fontWeight: 700, padding: '2px 7px', borderRadius: '100px' }}>
              <StatusIcon size={9}/> {cfg.label}
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Phone size={11}/> {agent.phone}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: 'Vehicle',      value: `${agent.vehicleType} · ${agent.vehicleNumber}` },
          { label: 'Zone',         value: agent.zone },
          { label: 'Orders Today', value: agent.ordersToday ?? '—' },
          { label: 'Rating',       value: agent.rating ? `${agent.rating} ★` : '—' },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#F9FAFB', borderRadius: '8px', padding: '8px 10px' }}>
            <p style={{ fontSize: '0.65rem', color: '#9CA3AF', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {agent.notes && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '8px', padding: '8px 10px', marginBottom: '12px' }}>
          <p style={{ fontSize: '0.72rem', color: '#92400E', margin: 0, lineHeight: 1.5 }}>Notes: {agent.notes}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '7px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
        <button onClick={() => onEdit(agent)}
          style={{ flex: 1, padding: '7px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', borderRadius: '7px', fontWeight: 600, fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Edit2 size={11}/> Edit
        </button>
        <button onClick={() => onDelete(agent._id)} disabled={busy}
          style={{ flex: 1, padding: '7px', background: '#FFF1F2', color: '#E11D48', border: '1px solid #FFE4E6', borderRadius: '7px', fontWeight: 600, fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Trash2 size={11}/> Remove
        </button>
      </div>
    </div>
  );
};

// ── Main Section ─────────────────────────────────────────────
// Usage: <AdminDeliveryAgents /> — renders only for admin role
const AdminDeliveryAgents = () => {
  const { user } = useSelector(s => s.auth);
  const [agents,      setAgents]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [editingAgent,setEditingAgent]= useState(null);
  const [saving,      setSaving]      = useState(false);
  const [busy,        setBusy]        = useState(false);
  const [search,      setSearch]      = useState('');
  const [statusFilter,setStatusFilter]= useState('all');

  // Guard: only admin can access this component
  if (user?.role !== 'admin') return null;

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/delivery-agents');
      setAgents(data.agents || []);
    } catch {
      toast.error('Failed to load delivery agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingAgent?._id) {
        const { data } = await API.put(`/admin/delivery-agents/${editingAgent._id}`, formData);
        setAgents(prev => prev.map(a => a._id === editingAgent._id ? data.agent : a));
        toast.success('Agent updated!');
      } else {
        const { data } = await API.post('/admin/delivery-agents', formData);
        setAgents(prev => [...prev, data.agent]);
        toast.success('Agent added!');
      }
      setShowModal(false);
      setEditingAgent(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save agent');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this delivery agent?')) return;
    setBusy(true);
    try {
      await API.delete(`/admin/delivery-agents/${id}`);
      setAgents(prev => prev.filter(a => a._id !== id));
      toast.success('Agent removed');
    } catch {
      toast.error('Failed to remove agent');
    } finally {
      setBusy(false);
    }
  };

  const filtered = agents.filter(a => {
    const matchSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.phone?.includes(search) || a.zone?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:    agents.length,
    active:   agents.filter(a => a.status === 'active').length,
    inactive: agents.filter(a => a.status === 'inactive').length,
    banned:   agents.filter(a => a.status === 'banned').length,
  };

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bike size={18} color="#2D6A4F"/> Delivery Agents
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: '3px 0 0' }}>Admin-only · Manage your delivery fleet</p>
        </div>
        <button onClick={() => { setEditingAgent(null); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
          <Plus size={14}/> Add Agent
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Total',    value: stats.total,    color: '#374151', bg: '#F9FAFB' },
          { label: 'Active',   value: stats.active,   color: '#065F46', bg: '#D1FAE5' },
          { label: 'Inactive', value: stats.inactive, color: '#92400E', bg: '#FEF3C7' },
          { label: 'Banned',   value: stats.banned,   color: '#991B1B', bg: '#FEE2E2' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: bg, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: '0.7rem', color, opacity: 0.8, marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}/>
          <input className="form-input" placeholder="Search by name, phone, zone..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '34px' }}/>
        </div>
        <select className="form-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '130px' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Agents grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 size={24} color="#2D6A4F" style={{ animation: 'spin 1s linear infinite' }}/>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '14px', padding: '48px 20px', textAlign: 'center', border: '2px dashed #E5E7EB' }}>
          <div style={{ background: '#F3F4F6', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Bike size={26} color="#9CA3AF"/>
          </div>
          <h4 style={{ color: '#374151', margin: '0 0 6px' }}>No agents found</h4>
          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '18px' }}>
            {search || statusFilter !== 'all' ? 'Try changing your filters' : 'Add your first delivery agent'}
          </p>
          {!search && statusFilter === 'all' && (
            <button onClick={() => { setEditingAgent(null); setShowModal(true); }}
              style={{ padding: '10px 22px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
              <Plus size={14}/> Add First Agent
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {filtered.map(agent => (
            <AgentCard key={agent._id} agent={agent}
              onEdit={a => { setEditingAgent(a); setShowModal(true); }}
              onDelete={handleDelete}
              busy={busy}/>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AgentModal
          initial={editingAgent}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingAgent(null); }}
          saving={saving}/>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
<AdminDeliveryAgents />

export default AdminDeliveryAgents;


