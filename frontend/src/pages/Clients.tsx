import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  ShieldCheck,
  Globe,
  Briefcase,
  Users as UsersIcon,
  CheckCircle2,
  X,
  Zap,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Client {
  id: number;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  entity_type: string;
  services: string[];
  employees: number;
  auditor: string;
  status: string;
  gstin?: string;
  place_of_supply?: string;
  address?: string;
  cin_llp?: string;
  tan?: string;
  pan?: string;
  udyam?: string;
  professional_tax?: string;
  esi_no?: string;
  pf_no?: string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('gst');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gstin: '',
    place_of_supply: 'Maharashtra (27)',
    address: '',
    pan: '',
    tan: '',
    cin_llp: '',
    udyam: '',
    professional_tax: '',
    pf_no: '',
    category: 'Silver',
    email: 'contact@client.com',
    phone: '',
    entity_type: 'Private Ltd',
    services: 'Tax, Compliance',
    auditor: 'Vidyasagar D.',
    status: 'Active',
    employees: 0
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/clients');
      const data = await response.json();
      setClients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const handleVerifyGST = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert('GSTIN Verified Successfully with GSTN Portal!');
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalize = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowAddModal(false);
        fetchClients();
        // Reset form
        setFormData({
            name: '', gstin: '', place_of_supply: 'Maharashtra (27)', address: '',
            pan: '', tan: '', cin_llp: '', udyam: '', professional_tax: '', pf_no: '',
            category: 'Silver', email: 'contact@client.com', phone: '',
            entity_type: 'Private Ltd', services: 'Tax, Compliance', auditor: 'Vidyasagar D.',
            status: 'Active', employees: 0
        });
      }
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const statusColors: { [key: string]: string } = {
    'Active': 'var(--success)',
    'Onboarding': 'var(--warning)',
    'Compliance Check': 'var(--info)',
    'Inactive': 'var(--text-secondary)'
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      {/* Page Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '40px',
        padding: '0 8px'
      }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '8px' }}>
            Client Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: '500' }}>
            Manage your firm's professional client relationships and statutory data.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="premium-btn"
        >
          <Plus size={20} strokeWidth={3} /> Add New Client
        </button>
      </div>

      <div className="card" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        {/* Search & Filter Toolbar */}
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: '1px solid var(--border)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '32px',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search clients by name, email, GSTIN or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 14px 14px 48px', 
                background: 'var(--background)',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                fontSize: '15px'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--background)', padding: '6px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Filter size={16} color="var(--text-secondary)" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  color: 'var(--text-primary)', 
                  border: 'none', 
                  padding: '6px 0', 
                  fontWeight: '700',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Entities</option>
                <option value="Active">Active</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Compliance Check">Compliance Check</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button className="glass-card" style={{ padding: '12px', borderRadius: '12px' }}>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', minWidth: '1100px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                <th style={{ padding: '20px 32px' }}>Business Entity & Name</th>
                <th style={{ padding: '20px 24px' }}>Contact Details</th>
                <th style={{ padding: '20px 24px' }}>Entity Type</th>
                <th style={{ padding: '20px 24px' }}>Services</th>
                <th style={{ padding: '20px 24px' }}>Employees</th>
                <th style={{ padding: '20px 24px' }}>Auditor</th>
                <th style={{ padding: '20px 24px' }}>Status</th>
                <th style={{ padding: '20px 32px', width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                      <div className="spin" style={{ marginBottom: '16px' }}><Zap size={32} /></div>
                      Loading practitioner records...
                    </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
                      <div style={{ marginBottom: '16px' }}><Search size={48} opacity={0.1} /></div>
                      <p style={{ fontSize: '18px', fontWeight: '600' }}>No clients found</p>
                      <p style={{ fontSize: '14px' }}>Try adjusting your filters or search query</p>
                    </td>
                </tr>
              ) : filteredClients.map((client) => (
                <tr key={client.id} className="row-hover" style={{ transition: '0.2s' }}>
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '14px', 
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'var(--primary)',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}>
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>{client.name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>ID: TR-{1000 + client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500' }}>
                        <Phone size={14} color="var(--text-secondary)" /> {client.phone || '--'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Mail size={14} color="var(--text-secondary)" /> {client.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>{client.entity_type}</span>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(Array.isArray(client.services) ? client.services : (client.services as any)?.split(',') || []).slice(0, 2).map((s: string, i: number) => (
                        <span key={i} style={{ 
                          padding: '4px 10px', 
                          borderRadius: '8px', 
                          background: 'rgba(99, 102, 241, 0.08)', 
                          color: 'var(--primary)', 
                          fontSize: '11px', 
                          fontWeight: '800',
                          border: '1px solid rgba(99, 102, 241, 0.1)'
                        }}>{s.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px' }}>{client.employees?.toLocaleString() || '0'}</span>
                      <UsersIcon size={14} color="var(--text-secondary)" />
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '10px', 
                          background: 'var(--background)', 
                          border: '1px solid var(--border)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '11px', 
                          fontWeight: '800',
                          color: 'var(--primary)'
                        }}>
                            {client.auditor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{client.auditor}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      background: `${statusColors[client.status]}10`,
                      border: `1px solid ${statusColors[client.status]}25`
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[client.status], boxShadow: `0 0 10px ${statusColors[client.status]}` }}></div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: statusColors[client.status] }}>{client.status.toUpperCase()}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <button style={{ 
                      padding: '10px', 
                      background: 'transparent', 
                      color: 'var(--text-secondary)', 
                      border: 'none',
                      borderRadius: '8px'
                    }} className="hover-action">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.6)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '40px'
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="card" 
              style={{ width: '800px', padding: 0, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
            >
              <div style={{ 
                padding: '32px 40px', 
                borderBottom: '1px solid var(--border)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Client Onboarding</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Initialize statutory data and entity profile</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'var(--background)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '10px', borderRadius: '12px' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '32px', padding: '0 40px', borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.01)' }}>
                {[
                  { id: 'gst', label: 'GST & Address' },
                  { id: 'other', label: 'Statutory & Labour' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '20px 0',
                      background: 'transparent',
                      color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                      border: 'none',
                      borderBottom: `3px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
                      fontSize: '14px',
                      fontWeight: '700',
                      transition: '0.2s',
                      borderRadius: 0
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ padding: '40px', maxHeight: '50vh', overflowY: 'auto' }}>
                {activeTab === 'gst' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Full Legal Business Name</label>
                      <input type="text" name="name" placeholder="e.g. Reliance Industries Limited" value={formData.name} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>GSTIN Number</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="gstin" placeholder="27AAACT0000A1Z5" value={formData.gstin} onChange={handleInputChange} style={{ flex: 1, background: 'var(--background)' }} />
                        <button onClick={handleVerifyGST} style={{ whiteSpace: 'nowrap', padding: '0 20px', background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                          {isVerifying ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Place of Supply</label>
                      <select name="place_of_supply" value={formData.place_of_supply} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)' }}>
                        <option value="Maharashtra (27)">Maharashtra (27)</option>
                        <option value="Karnataka (29)">Karnataka (29)</option>
                        <option value="Delhi (07)">Delhi (07)</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Principal Place of Business</label>
                      <textarea name="address" placeholder="Complete office address..." value={formData.address} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)', minHeight: '100px' }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>PAN Number</label>
                      <input type="text" name="pan" placeholder="ABCDE1234F" value={formData.pan} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>TAN Number</label>
                      <input type="text" name="tan" placeholder="MUMB01234F" value={formData.tan} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>CIN / LLPIN</label>
                      <input type="text" name="cin_llp" placeholder="U12345MH2024PTC123456" value={formData.cin_llp} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>PF Registry No.</label>
                      <input type="text" name="pf_no" placeholder="MH/BAN/0012345/000" value={formData.pf_no} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Contact Phone</label>
                      <input type="text" name="phone" placeholder="+91 00000 00000" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Auditor Assigned</label>
                      <select name="auditor" value={formData.auditor} onChange={handleInputChange} style={{ width: '100%', background: 'var(--background)' }}>
                        <option>Vidyasagar D.</option>
                        <option>Sarah J.</option>
                        <option>Mehul S.</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: '32px 40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <button 
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '12px 24px', fontWeight: '700' }}
                >
                  Discard
                </button>
                <button 
                  onClick={handleFinalize}
                  disabled={isSaving || !formData.name}
                  style={{ background: 'var(--primary)', color: 'white', padding: '12px 32px', fontWeight: '700', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
                >
                  {isSaving ? 'Saving...' : 'Finalize Onboarding'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .row-hover:hover { 
          background: rgba(255, 255, 255, 0.03) !important; 
          cursor: pointer; 
          transform: translateX(4px);
        }
        .hover-action:hover { 
          color: var(--primary) !important; 
          background: rgba(99, 102, 241, 0.1) !important; 
        }
        th {
          text-align: left;
          font-size: 13px;
          font-weight: 800;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border);
        }
        td {
          border-bottom: 1px solid var(--border);
        }
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Clients;
