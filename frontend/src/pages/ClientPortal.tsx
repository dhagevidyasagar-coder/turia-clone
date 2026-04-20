import React, { useState } from 'react';
import { 
  Globe, 
  Upload, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClientPortal: React.FC = () => {
  const [activeClient, setActiveClient] = useState('Reliance Industries');
  const [isUploading, setIsUploading] = useState(false);

  const mockDocs = [
    { name: 'Bank Statement - April.pdf', date: '20th Apr', status: 'Verified' },
    { name: 'Purchase Bill #245.jpg', date: '19th Apr', status: 'Pending Review' }
  ];

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
        setIsUploading(false);
        alert('Statutory documents uploaded successfully to the Practitioner Dashboard!');
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Statutory Client Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>A professional touchpoint for your clients to manage their compliance lifecycle.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <span style={{ padding: '8px 16px', background: 'var(--success)', color: 'white', borderRadius: '10px', fontSize: '13px', fontWeight: '800' }}>PORTAL ACTIVE</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Welcome Card */}
          <div className="card" style={{ padding: '40px', background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Welcome back, {activeClient}!</h2>
                <p style={{ fontSize: '15px', maxWidth: '450px', opacity: 0.9 }}>Your GST and TDS filings for April 2024 are currently in preparation. Please upload any pending documents below.</p>
            </div>
            <TrendingUp size={160} style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.1, color: 'white' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Status Tracking */}
            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Filing Transparency</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>GSTR-1 (April)</span>
                        <span style={{ padding: '4px 10px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', fontSize: '11px', fontWeight: '800', borderRadius: '12px' }}>FILED</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>GSTR-3B (April)</span>
                        <span style={{ padding: '4px 10px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', fontSize: '11px', fontWeight: '800', borderRadius: '12px' }}>PREPARING</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>TDS Return (Q1)</span>
                        <span style={{ padding: '4px 10px', background: 'var(--background)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '800', borderRadius: '12px' }}>PENDING DATA</span>
                    </div>
                </div>
            </div>

            {/* Invoicing Section */}
            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Open Invoices</h3>
                <div style={{ padding: '20px', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Last Invoice: 15th Apr</p>
                    <p style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0' }}>₹15,000.00</p>
                    <button style={{ width: '100%', marginTop: '12px', padding: '10px', fontSize: '13px' }}>Pay Now</button>
                </div>
            </div>
          </div>

          {/* Document Upload Simulation */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Direct Document Vault</h3>
            <div 
                onClick={handleSimulateUpload}
                style={{ 
                    border: '2px dashed var(--border)', borderRadius: '20px', padding: '40px', 
                    textAlign: 'center', cursor: 'pointer', background: isUploading ? 'rgba(37, 99, 235, 0.03)' : 'transparent',
                    transition: '0.3s'
                }}
            >
                {isUploading ? (
                    <div className="spin" style={{ display: 'inline-block' }}><ShieldCheck size={48} color="var(--primary)" /></div>
                ) : (
                    <Upload size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
                )}
                <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{isUploading ? 'Securing your statutory data...' : 'Drop bank statements or bills here'}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Supported: PDF, JPG, PNG (Max 20MB)</p>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockDocs.map((doc, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--background)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FileText size={18} color="var(--primary)" />
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: '700' }}>{doc.name}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Uploaded on {doc.date}</p>
                            </div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: doc.status === 'Verified' ? 'var(--success)' : 'var(--warning)' }}>{doc.status.toUpperCase()}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px' }}>Practitioner Support</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgb(37, 99, 235)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>V</div>
                <div>
                    <p style={{ fontSize: '14px', fontWeight: '800' }}>Vidyasagar Dhage</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Senior Practicing CA</p>
                </div>
            </div>
            <button style={{ width: '100%', background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                <MessageSquare size={16} /> Chat with Auditor
            </button>
          </div>

          <div className="card" style={{ padding: '24px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid var(--success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <ShieldCheck size={20} color="var(--success)" />
                <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--success)' }}>Compliance Score: 98%</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Your firm is one of the top compliance performers in our practice.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default ClientPortal;
