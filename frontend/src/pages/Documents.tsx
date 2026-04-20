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
  const [isScanning, setIsScanning] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [docs, setDocs] = useState<Document[]>([
    { id: 1, name: 'GSTR-3B_April_Reliance.pdf', client_name: 'Reliance Industries', type: 'PDF', size: '2.4 MB', date: '20th Apr 2024', category: 'GST' },
    { id: 2, name: 'PAN_Card_Vidyasagar.png', client_name: 'Vidyasagar Dhage', type: 'PNG', size: '1.1 MB', date: '18th Apr 2024', category: 'KYC' },
    { id: 3, name: 'Audit_Report_TCS_FINAL.pdf', client_name: 'Tata Consultancy Services', type: 'PDF', size: '15.8 MB', date: '15th Apr 2024', category: 'Audit' },
    { id: 4, name: 'Form_16_Rahul_Sharma.pdf', client_name: 'Rahul Sharma', type: 'PDF', size: '840 KB', date: '10th Apr 2024', category: 'ITR' }
  ]);

  const clients = ['Reliance Industries', 'Tata Consultancy Services', 'Vidyasagar Dhage', 'Rahul Sharma', 'California Burrito'];

  const handleStartScan = () => {
    if (!selectedClient) {
        alert('Please select a client to associate the scanned document.');
        return;
    }
    setIsScanning(true);
    // Simulation
    setTimeout(() => {
        setIsScanning(false);
        const newDoc: Document = {
            id: Date.now(),
            name: `Scanned_Doc_${new Date().getTime()}.pdf`,
            client_name: selectedClient,
            type: 'PDF',
            size: '1.5 MB',
            date: 'Just now',
            category: 'KYC'
        };
        setDocs([newDoc, ...docs]);
        setShowScanModal(false);
        setSelectedClient('');
    }, 3000);
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
            style={{ background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            <Camera size={18} /> Scan Document
          </button>
          <button>
            <Upload size={18} /> Upload File
          </button>
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

        <div style={{ overflowX: 'auto' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={14} color="var(--primary)" />
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{doc.client_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                        background: 'rgba(37,99,235,0.05)', color: 'var(--primary)', border: '1px solid rgba(37,99,235,0.1)'
                    }}>
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

      <style>{`
        .row-hover:hover { background: rgba(37,99,235,0.02) !important; cursor: pointer; transition: 0.2s; }
        .hover-icon:hover { color: var(--primary) !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Documents;
