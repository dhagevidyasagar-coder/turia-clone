import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CreditCard, 
  Download, 
  Upload, 
  ChevronRight,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  Building2,
  ChevronDown,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientPortalData {
  id: number;
  name: string;
  complianceScore: number;
  openInvoices: number;
  pendingDocs: number;
  filings: { task: string; period: string; status: 'Filed' | 'Preparing' | 'Pending Data' | 'Overdue' }[];
}

const ClientPortal: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<number>(1);
  const [showClientSelector, setShowClientSelector] = useState(false);

  const mockClients: ClientPortalData[] = [
    { 
      id: 1, 
      name: 'Reliance Industries', 
      complianceScore: 98, 
      openInvoices: 45000, 
      pendingDocs: 2,
      filings: [
        { task: 'GSTR-1', period: 'April 2024', status: 'Filed' },
        { task: 'GSTR-3B', period: 'April 2024', status: 'Preparing' },
        { task: 'TDS Return', period: 'Q1 2024', status: 'Pending Data' },
      ]
    },
    { 
      id: 2, 
      name: 'Tata Consultancy Services', 
      complianceScore: 94, 
      openInvoices: 125000, 
      pendingDocs: 5,
      filings: [
        { task: 'GSTR-1', period: 'April 2024', status: 'Filed' },
        { task: 'ITR-6', period: 'AY 2024-25', status: 'Overdue' },
        { task: 'ESI Monthly', period: 'March 2024', status: 'Filed' },
      ]
    },
    { 
      id: 3, 
      name: 'Zomato Ltd', 
      complianceScore: 88, 
      openInvoices: 0, 
      pendingDocs: 0,
      filings: [
        { task: 'GSTR-1', period: 'April 2024', status: 'Preparing' },
        { task: 'GSTR-3B', period: 'March 2024', status: 'Filed' },
      ]
    }
  ];

  const currentClient = mockClients.find(c => c.id === selectedClient) || mockClients[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Filed': return 'var(--success)';
      case 'Preparing': return 'var(--warning)';
      case 'Overdue': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      {/* Practitioner Toolbar - Only visible to firm members */}
      <div className="card" style={{ 
        marginBottom: '40px', 
        padding: '16px 32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.05), transparent)',
        borderColor: 'rgba(99, 102, 241, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px' }}>
                <ShieldCheck size={20} color="var(--primary)" />
            </div>
            <div>
                <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Practitioner View</p>
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Viewing portal as {currentClient.name}</h3>
            </div>
        </div>
        <div style={{ position: 'relative' }}>
            <button 
                onClick={() => setShowClientSelector(!showClientSelector)}
                style={{ 
                    background: 'var(--background)', 
                    border: '1px solid var(--border)', 
                    padding: '10px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                }}
            >
                Change Client View <ChevronDown size={18} />
            </button>
            
            <AnimatePresence>
                {showClientSelector && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        style={{ 
                            position: 'absolute', top: '100%', right: 0, width: '300px', 
                            background: 'white', borderRadius: '16px', marginTop: '12px', zIndex: 100,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '12px', border: '1px solid var(--border)'
                        }}
                    >
                        {mockClients.map(client => (
                            <button 
                                key={client.id}
                                onClick={() => { setSelectedClient(client.id); setShowClientSelector(false); }}
                                style={{ 
                                    width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '10px',
                                    background: selectedClient === client.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                    color: selectedClient === client.id ? 'var(--primary)' : 'var(--text-primary)',
                                    fontWeight: selectedClient === client.id ? '700' : '500',
                                    border: 'none', display: 'flex', alignItems: 'center', gap: '10px'
                                }}
                            >
                                <Building2 size={16} /> {client.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '32px' }}>
        {/* Main Content */}
        <div>
            {/* Hero Welcome */}
            <div className="card" style={{ 
                padding: '48px', 
                marginBottom: '32px', 
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Welcome back, {currentClient.name.split(' ')[0]}!</h1>
                    <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: '1.6', maxWidth: '500px' }}>
                        Your GST and TDS filings for April 2024 are currently in preparation. 
                        {currentClient.pendingDocs > 0 ? ` Please upload ${currentClient.pendingDocs} pending documents to avoid late filing.` : ' All your documents are up to date!'}
                    </p>
                </div>
                <TrendingUp size={120} style={{ position: 'absolute', bottom: '-20px', right: '20px', opacity: 0.1, color: 'white' }} />
            </div>

            {/* Content Tabs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Filing Timeline */}
                <div className="card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Filing Transparency</h3>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }} />
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--warning)' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {currentClient.filings.map((filing, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{filing.task}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{filing.period}</p>
                                </div>
                                <div style={{ 
                                    padding: '4px 12px', background: `${getStatusColor(filing.status)}15`, 
                                    color: getStatusColor(filing.status), borderRadius: '20px', fontSize: '11px', fontWeight: '800'
                                }}>
                                    {filing.status.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Financial Overview */}
                <div className="card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Outstanding Invoices</h3>
                    {currentClient.openInvoices > 0 ? (
                        <>
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Outstanding</p>
                                <h2 style={{ fontSize: '32px', fontWeight: '800' }}>₹{currentClient.openInvoices.toLocaleString()}</h2>
                            </div>
                            <button style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <CreditCard size={18} /> Pay & Clear Dues
                            </button>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '12px' }} />
                            <p style={{ fontWeight: '700' }}>No pending invoices!</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>You're all cleared for this month.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Vault Section */}
            <div className="card" style={{ marginTop: '32px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Direct Document Vault</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Secured access to your statutory archives</p>
                    </div>
                    <button style={{ background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Upload size={18} /> Upload New Data
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {['Income Tax Returns', 'GST Archive', 'KYC Documents'].map((folder, i) => (
                        <div key={i} style={{ padding: '20px', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <FileText size={24} color="var(--primary)" />
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{folder}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>12 Files • Last updated 2d ago</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Support */}
        <div>
            <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '24px' }}>Practitioner Support</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', border: '4px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: 'white' }}>VD</div>
                    <div>
                        <p style={{ fontWeight: '800', fontSize: '16px' }}>Vidyasagar Dhage</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Senior Practicing CA</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                        onClick={() => alert('Starting a secure chat session with your Practice Partner...')}
                        style={{ width: '100%', padding: '12px', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px', fontWeight: '700' }}
                    >
                        <MessageSquare size={16} /> Chat with Partner
                    </button>
                    <a 
                        href={`mailto:v.dhage@turiapractice.com?subject=Assistance Required for ${currentClient.name}&body=Hello Vidyasagar,%0D%0A%0D%0AI need assistance with our current compliance filings.`}
                        style={{ textDecoration: 'none', width: '100%', padding: '12px', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', borderRadius: '12px' }}
                    >
                        <Mail /> Email Assistance
                    </a>
                </div>
            </div>

            <div className="card" style={{ padding: '32px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <CheckCircle2 size={24} color="var(--success)" />
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--success)' }}>Compliance Score: {currentClient.complianceScore}%</h4>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Your firm is one of the top compliance performers in our practice. This significantly reduces your audit risk profile.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

const Mail = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

export default ClientPortal;
