import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Trash2, 
  Eye, 
  Plus,
  Zap,
  User,
  ShieldCheck,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  FolderOpen,
  Camera,
  X,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
  id: number;
  name: string;
  client_name: string;
  type: string;
  size: string;
  date: string;
  category: 'GST' | 'ITR' | 'Audit' | 'KYC';
}

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientDetails, setClientDetails] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5005/api/documents');
      const data = await response.json();
      setDocs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const clients = ['Reliance Industries', 'Tata Consultancy Services', 'Vidyasagar Dhage', 'Rahul Sharma', 'California Burrito'];

  const handleStartScan = () => {
    if (!selectedClient) {
        alert('Please select a client to associate the scanned document.');
        return;
    }
    setIsScanning(true);
    // Simulation
    setTimeout(async () => {
        const docData = {
            name: `Statutory_Doc_${new Date().getTime()}.pdf`,
            client_name: selectedClient,
            type: 'PDF',
            size: '1.8 MB',
            category: 'KYC'
        };

        try {
            await fetch('http://127.0.0.1:5005/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(docData)
            });
            setIsScanning(false);
            setShowScanModal(false);
            setSelectedClient('');
            fetchDocs();
        } catch (error) {
            console.error('Error saving document:', error);
            setIsScanning(false);
        }
    }, 3000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const docData = {
        name: file.name,
        client_name: 'General / Unassigned',
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        category: 'KYC'
    };

    try {
        await fetch('http://127.0.0.1:5005/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(docData)
        });
        fetchDocs();
    } catch (error) {
        console.error('Error uploading document:', error);
    }
  };

  const showClientInfo = async (clientName: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5005/api/clients');
      const clients = await response.json();
      const client = clients.find((c: any) => c.name === clientName);
      if (client) {
        setClientDetails(client);
        setShowClientModal(true);
      } else {
        alert('Client details not found in database.');
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText size={20} color="#EF4444" />;
      case 'PNG':
      case 'JPG': return <ImageIcon size={20} color="#3B82F6" />;
      case 'ZIP': return <FileArchive size={20} color="#F59E0B" />;
      default: return <FileCode size={20} color="var(--primary)" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Firm Document Command</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Centralized statutory repository with AI-powered document scanning.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setShowScanModal(true)}
            style={{ background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border-strong)' }}
          >
            <Camera size={18} strokeWidth={3} /> Scan Document
          </button>
          <button 
            onClick={handleUploadClick}
            className="premium-btn"
          >
            <Upload size={18} strokeWidth={3} /> Upload File
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
            { label: 'Total Files', value: '1,452', icon: FileText, color: 'var(--primary)' },
            { label: 'Recent Scans', value: '28', icon: Camera, color: 'var(--success)' },
            { label: 'Storage Used', value: '4.2 GB', icon: ShieldCheck, color: 'var(--info)' },
            { label: 'Pending Audit', value: '12', icon: FileArchive, color: 'var(--warning)' }
        ].map((stat, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '24px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: stat.color + '10' }}>
                    <stat.icon size={22} color={stat.color} />
                </div>
                <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{stat.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: '800' }}>{stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--background)' }}>
          <div></div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border)', fontSize: '12px' }}>
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div style={{ overflow: 'auto', maxHeight: '600px' }} className="custom-scrollbar">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--background)' }}>
                <th style={{ padding: '16px 24px' }}>Document Name</th>
                <th style={{ padding: '16px 24px' }}>Associated Client</th>
                <th style={{ padding: '16px 24px' }}>Category</th>
                <th style={{ padding: '16px 24px' }}>File Size</th>
                <th style={{ padding: '16px 24px' }}>Uploaded Date</th>
                <th style={{ padding: '16px 24px' }}></th>
              </tr>
            </thead>
            <tbody>
              {docs.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.client_name.toLowerCase().includes(searchTerm.toLowerCase())).map((doc) => (
                <tr key={doc.id} className="row-hover">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {getFileIcon(doc.type)}
                      <span style={{ fontWeight: '700', fontSize: '14px' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div 
                        onClick={() => showClientInfo(doc.client_name)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--brand-blue)' }}
                    >
                      <User size={14} />
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{doc.client_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span 
                        onClick={() => showClientInfo(doc.client_name)}
                        style={{ 
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                            background: 'rgba(37,99,235,0.05)', color: 'var(--primary)', border: '1px solid rgba(37,99,235,0.1)',
                            cursor: 'pointer'
                        }}
                    >
                        {doc.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{doc.size}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{doc.date}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ background: 'transparent', padding: 4, color: 'var(--text-secondary)' }} className="hover-icon"><Eye size={18} /></button>
                        <button style={{ background: 'transparent', padding: 4, color: 'var(--text-secondary)' }} className="hover-icon"><Download size={18} /></button>
                        <button style={{ background: 'transparent', padding: 4, color: 'var(--text-secondary)' }} className="hover-icon"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scan Document Modal */}
      <AnimatePresence>
        {showScanModal && (
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
              className="card" style={{ width: '500px', padding: 0, margin: 'auto' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '800' }}>AI Assistant Scan</h3>
                <button onClick={() => setShowScanModal(false)} style={{ background: 'transparent', padding: 4 }}><X size={20} /></button>
              </div>

              <div style={{ padding: '32px' }}>
                <div style={{ 
                    height: '240px', background: 'var(--background)', borderRadius: '16px', border: '2px dashed var(--border)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
                    position: 'relative', overflow: 'hidden'
                }}>
                    {isScanning ? (
                        <>
                            <motion.div 
                                animate={{ y: [0, 240, 0] }} transition={{ duration: 2, repeat: Infinity }}
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)', zIndex: 2 }} 
                            />
                            <RefreshCw size={48} color="var(--primary)" className="spin" />
                            <p style={{ fontWeight: '700', color: 'var(--primary)' }}>Analyzing Document Texture...</p>
                        </>
                    ) : (
                        <>
                            <Camera size={48} color="var(--text-secondary)" />
                            <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Position document in front of camera</p>
                        </>
                    )}
                </div>

                <div style={{ marginTop: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Assign to Client</label>
                    <select 
                        style={{ width: '100%', marginBottom: '24px' }}
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                    >
                        <option value="">Select a Client...</option>
                        {clients.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <button 
                        onClick={handleStartScan}
                        disabled={isScanning}
                        style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', fontWeight: '700', borderRadius: '12px' }}
                    >
                        {isScanning ? 'Processing Statutory Scan...' : 'Start Scan & Capture'}
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Client Details Modal */}
      <AnimatePresence>
        {showClientModal && clientDetails && (
          <div style={{ 
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1100, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="card" style={{ width: '600px', padding: 0 }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '800' }}>Client Statutory Profile</h3>
                <button onClick={() => setShowClientModal(false)} style={{ background: 'transparent', padding: 4 }}><X size={20} /></button>
              </div>
              <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: '900' }}>
                        {clientDetails.name[0]}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '900' }}>{clientDetails.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{clientDetails.entity_type} • {clientDetails.location}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {[
                        { label: 'GSTIN', value: clientDetails.gstin },
                        { label: 'PAN', value: clientDetails.pan },
                        { label: 'TAN', value: clientDetails.tan },
                        { label: 'CIN / LLPIN', value: clientDetails.cin_llp },
                        { label: 'Phone', value: clientDetails.phone },
                        { label: 'Email', value: clientDetails.email }
                    ].map((item, idx) => (
                        <div key={idx} style={{ padding: '16px', background: 'var(--background)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</p>
                            <p style={{ fontWeight: '700' }}>{item.value || 'N/A'}</p>
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .row-hover:hover { background: rgba(37,99,235,0.02) !important; cursor: pointer; transition: 0.2s; }
        .hover-icon:hover { color: var(--primary) !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
        th {
          position: sticky;
          top: 0;
          background: var(--background);
          z-index: 10;
          text-align: left;
          font-weight: 800;
          font-size: 13px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default Documents;
