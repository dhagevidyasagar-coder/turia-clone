import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  MoreVertical, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Key,
  Lock,
  Calendar,
  User,
  Zap,
  ExternalLink,
  ShieldAlert,
  X,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DSC {
  id: number;
  client_name: string;
  expiry_date: string;
  provider: string;
  status: string;
  pin_hint?: string;
}

const DSCManager: React.FC = () => {
  const [dscs, setDscs] = useState<DSC[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    fetchDSC();
  }, []);

  const fetchDSC = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/dsc');
      const data = await response.json();
      setDscs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching DSC records:', error);
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Simulation
    setTimeout(() => {
        const newDsc: DSC = {
            id: Date.now(),
            client_name: formData.get('client_name') as string,
            expiry_date: formData.get('expiry_date') as string,
            provider: formData.get('provider') as string,
            status: 'Active',
            pin_hint: formData.get('pin_hint') as string
        };
        setDscs([newDsc, ...dscs]);
        setIsRegistering(false);
        setShowAddModal(false);
    }, 1500);
  };

  const statusColors: { [key: string]: string } = {
    'Active': 'var(--success)',
    'Expiring Soon': 'var(--warning)',
    'Expired': 'var(--danger)'
  };

  const clients = ['Reliance Industries', 'Tata Consultancy Services', 'Vidyasagar Dhage', 'Rahul Sharma', 'California Burrito'];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>DSC Management Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Lifecycle tracking and secure vault for Digital Signature Certificates.</p>
        </div>
        <button onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Register New DSC
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
            { label: 'Total DSCs', value: dscs.length.toString(), icon: ShieldCheck, color: 'var(--primary)' },
            { label: 'Expiring Soon', value: dscs.filter(d => d.status === 'Expiring Soon').length.toString(), icon: ShieldAlert, color: 'var(--warning)' },
            { label: 'Expired', value: dscs.filter(d => d.status === 'Expired').length.toString(), icon: AlertCircle, color: 'var(--danger)' },
            { label: 'Renewals MTD', value: '5', icon: Zap, color: 'var(--success)' }
        ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: stat.color + '08' }}>
                    <stat.icon size={22} color={stat.color} />
                </div>
                <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: '800' }}>{stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Active Certificate Repository</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--background)' }}>
              <th style={{ padding: '16px 24px' }}>Certificate Owner</th>
              <th style={{ padding: '16px 24px' }}>Provider & Type</th>
              <th style={{ padding: '16px 24px' }}>Expiry Timeline</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Syncing certificate vault...</td></tr>
            ) : dscs.map((dsc) => (
              <tr key={dsc.id} className="row-hover">
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '15px' }}>{dsc.client_name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: DSC-{1000 + dsc.id}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={14} color="var(--text-secondary)" />
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: '600' }}>{dsc.provider}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Class 3 (Signing)</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--text-secondary)" />
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{dsc.expiry_date}</span>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span style={{ 
                    padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                    background: statusColors[dsc.status] + '10',
                    color: statusColors[dsc.status],
                    border: `1px solid ${statusColors[dsc.status]}20`
                  }}>
                    {dsc.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button 
                        onClick={() => alert(`Secure PIN Hint for ${dsc.client_name}: ${dsc.pin_hint || 'No hint stored.'}`)}
                        style={{ background: 'transparent', padding: 8, color: 'var(--primary)' }} title="View Pin Vault"
                    >
                        <Key size={18} />
                    </button>
                    <button style={{ background: 'transparent', padding: 8, color: 'var(--text-secondary)' }}><ExternalLink size={18} /></button>
                    <button style={{ background: 'transparent', padding: 8, color: 'var(--text-secondary)' }}><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register New DSC Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.4)', 
            backdropFilter: 'blur(4px)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="card" style={{ width: '550px', padding: 0, margin: 'auto' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '800' }}>Secure DSC Registration</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', padding: 4 }}><X size={20} /></button>
              </div>

              <form onSubmit={handleRegister} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Certificate Owner (Client)</label>
                        <select name="client_name" required style={{ width: '100%', background: 'var(--background)' }}>
                            <option value="">Select a Client...</option>
                            {clients.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Expiry Date</label>
                        <input name="expiry_date" required type="date" style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Provider</label>
                        <select name="provider" required style={{ width: '100%', background: 'var(--background)' }}>
                            <option value="eMudhra">eMudhra</option>
                            <option value="Vsign">Vsign</option>
                            <option value="Sify">Sify</option>
                            <option value="Pantagon">Pantagon</option>
                        </select>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Secret PIN Hint (Statutory Vault)</label>
                        <input name="pin_hint" type="password" placeholder="e.g. First 4 digits of PAN" style={{ width: '100%', background: 'var(--background)' }} />
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>This hint is stored in your firm's local statutory vault.</p>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isRegistering}
                    style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', fontWeight: '700', borderRadius: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                    {isRegistering ? (
                        <>
                            <Database size={18} className="spin" /> Finalizing Encryption...
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={18} /> Register Statutory Certificate
                        </>
                    )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="card" style={{ marginTop: '32px', padding: '28px', background: 'rgba(245, 158, 11, 0.03)', border: '1px solid var(--warning)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '16px', background: 'white', border: '1px solid var(--warning)' }}>
                <ShieldAlert size={32} color="var(--warning)" />
            </div>
            <div>
                <h4 style={{ fontWeight: '800', marginBottom: '4px' }}>Automated Statutory Nudges</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>The system will automatically notify **Vidyasagar Dhage** & **Mehul S.** regarding expiring certificates for client audit readiness.</p>
            </div>
        </div>
      </div>

      <style>{`
        .row-hover:hover { background: rgba(37, 99, 235, 0.02) !important; cursor: pointer; transition: 0.2s; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default DSCManager;
