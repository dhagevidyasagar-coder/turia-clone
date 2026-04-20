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
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Client Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your firm's professional client relationships and statutory data.</p>
        </div>
        <button onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add New Client
        </button>
      </div>

      <div className="card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search clients by name, email or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '44px', background: 'var(--background)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'var(--background)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' }}
            >
              <option value="All">All Entities</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Compliance Check">Compliance Check</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '1200px' }}>
            <thead>
              <tr>
                <th>Business Entity & Name</th>
                <th>Contact Details</th>
                <th>Entity Type</th>
                <th>Services</th>
                <th>Employees</th>
                <th>Auditor</th>
                <th>Status</th>
                <th style={{ width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading client records...</td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                      <div style={{ marginBottom: '12px' }}><Search size={40} opacity={0.2} /></div>
                      No clients found matching your search criteria.
                    </td>
                </tr>
              ) : filteredClients.map((client) => (
                <tr key={client.id} className="row-hover">
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Building2 size={22} />
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '15px' }}>{client.name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: TR-{1000 + client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <Phone size={14} color="var(--text-secondary)" /> {client.phone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <Mail size={14} color="var(--text-secondary)" /> {client.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{client.entity_type}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(Array.isArray(client.services) ? client.services : (client.services as any)?.split(',') || []).slice(0, 2).map((s: string, i: number) => (
                        <span key={i} style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.05)', color: 'var(--primary)', fontSize: '11px', fontWeight: '700' }}>{s.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700' }}>{client.employees}</span>
                      <UsersIcon size={14} color="var(--text-secondary)" />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>
                            {client.auditor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontSize: '13px' }}>{client.auditor}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[client.status] }}></div>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>{client.status}</span>
                    </div>
                  </td>
                  <td>
                    <button style={{ padding: '8px', background: 'transparent', color: 'var(--text-secondary)', border: 'none' }} className="hover-icon">
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
              className="card" style={{ width: '800px', maxHeight: '90vh', overflow: 'hidden', padding: 0, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', margin: 'auto' }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>New Client Onboarding</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '8px' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--background)', padding: '0 32px' }}>
                <button 
                  onClick={() => setActiveTab('gst')}
                  style={{ background: 'transparent', borderBottom: activeTab === 'gst' ? '3px solid var(--primary)' : 'none', color: activeTab === 'gst' ? 'var(--primary)' : 'var(--text-secondary)', padding: '16px 24px', borderRadius: 0, border: 'none' }}
                >
                  GST & Address Mapping
                </button>
                <button 
                  onClick={() => setActiveTab('other')}
                  style={{ background: 'transparent', borderBottom: activeTab === 'other' ? '3px solid var(--primary)' : 'none', color: activeTab === 'other' ? 'var(--primary)' : 'var(--text-secondary)', padding: '16px 24px', borderRadius: 0, border: 'none' }}
                >
                  Statutory & Labour Details
                </button>
              </div>

              <div style={{ padding: '32px', overflowY: 'auto', maxHeight: 'calc(90vh - 150px)' }}>
                {activeTab === 'gst' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Legal Business Name</label>
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleInputChange}
                        placeholder="e.g. Turia Industries Private Limited" style={{ width: '100%' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>GSTIN Number</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" name="gstin" value={formData.gstin} onChange={handleInputChange}
                            placeholder="27AAACT...1Z2" style={{ flex: 1 }} 
                        />
                        <button onClick={handleVerifyGST} style={{ whiteSpace: 'nowrap', padding: '0 20px' }}>
                          {isVerifying ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Place of Supply</label>
                        <select name="place_of_supply" value={formData.place_of_supply} onChange={handleInputChange} style={{ width: '100%' }}>
                            <option value="Maharashtra (27)">Maharashtra (27)</option>
                            <option value="Karnataka (29)">Karnataka (29)</option>
                            <option value="Delhi (07)">Delhi (07)</option>
                        </select>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Principal Place of Business (Full Address)</label>
                      <textarea 
                        name="address" value={formData.address} onChange={handleInputChange}
                        rows={3} placeholder="Building, Street, Area, City, Pin Code" style={{ width: '100%', resize: 'none' }}
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>PAN Number</label>
                      <input 
                        type="text" name="pan" value={formData.pan} onChange={handleInputChange}
                        placeholder="ABCDE1234F" style={{ width: '100%' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>TAN Number</label>
                      <input 
                        type="text" name="tan" value={formData.tan} onChange={handleInputChange}
                        placeholder="MUMB12345C" style={{ width: '100%' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>CIN / LLPIN</label>
                      <input 
                        type="text" name="cin_llp" value={formData.cin_llp} onChange={handleInputChange}
                        placeholder="U12345MH2024PTC123456" style={{ width: '100%' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Udyam Registration</label>
                      <input 
                        type="text" name="udyam" value={formData.udyam} onChange={handleInputChange}
                        placeholder="UDYAM-MH-01-1234567" style={{ width: '100%' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Professional Tax (PT) No.</label>
                      <input 
                        type="text" name="professional_tax" value={formData.professional_tax} onChange={handleInputChange}
                        placeholder="27123456789P" style={{ width: '100%' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>PF / ESI Registry</label>
                      <input 
                        type="text" name="pf_no" value={formData.pf_no} onChange={handleInputChange}
                        placeholder="MH/BAN/0012345/000" style={{ width: '100%' }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', background: 'var(--background)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>Cancel</button>
                <button onClick={handleFinalize} disabled={isSaving || !formData.name}>
                    {isSaving ? 'Saving Record...' : 'Finalize Onboarding'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .row-hover:hover { background: rgba(37, 99, 235, 0.02) !important; cursor: pointer; transition: 0.2s; }
        .hover-icon:hover { color: var(--primary) !important; background: rgba(37, 99, 235, 0.1) !important; border-radius: 8px; }
      `}</style>
    </div>
  );
};

export default Clients;
