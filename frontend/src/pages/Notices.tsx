import React, { useState } from 'react';

import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Inbox,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hash,
  Download,
  Share2,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notice {
  id: number;
  title: string;
  authority: 'GST' | 'Income Tax' | 'MCA' | 'TDS';
  type: string;
  deadline: string;
  status: 'Unread' | 'Drafting Response' | 'Under Review' | 'Submitted';
  severity: 'High' | 'Medium' | 'Low';
  ack_no?: string;
}

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([
    { id: 1, title: 'Scrutiny Notice u/s 143(2)', authority: 'Income Tax', type: 'Assessment', deadline: '2024-04-30', status: 'Unread', severity: 'High' },
    { id: 2, title: 'GSTR-3B Mismatch (ASMT-10)', authority: 'GST', type: 'Compliance', deadline: '2024-05-15', status: 'Drafting Response', severity: 'Medium' },
    { id: 3, title: 'TDS Default Nudge (SEC 201)', authority: 'TDS', type: 'Default', deadline: '2024-04-20', status: 'Submitted', severity: 'Low', ack_no: 'ACK-992211' },
  ]);

  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'High': return { background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'Medium': return { background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' };
      default: return { background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: '1px solid rgba(59, 130, 246, 0.2)' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Notice Management Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Automated tracking and response drafting for statutory notices.</p>
        </div>
        <button className="premium-btn" style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600'
        }}>
          <Plus size={20} />
          Upload New Notice
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '24px', height: 'calc(100vh - 250px)' }}>
        {/* Notice List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input type="text" placeholder="Search notices, DIN, or authority..." style={{ width: '100%', paddingLeft: '40px', background: 'var(--background)', fontSize: '13px' }} />
                </div>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
                {notices.map(notice => (
                    <div 
                        key={notice.id} 
                        onClick={() => setActiveNotice(notice)}
                        style={{ 
                            padding: '20px', 
                            borderBottom: '1px solid var(--border)', 
                            cursor: 'pointer',
                            background: activeNotice?.id === notice.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                            transition: '0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)' }}>{notice.authority}</span>
                            <span style={{ ...getSeverityStyle(notice.severity), fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>{notice.severity}</span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{notice.title}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <Clock size={13} /> Due: {notice.deadline}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: notice.status === 'Submitted' ? 'var(--success)' : 'var(--primary)' }}>{notice.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Notice Content / Workspace */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {activeNotice ? (
                <>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{activeNotice.title}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Classification: {activeNotice.type} Notice • ID: NT-2024-{activeNotice.id}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ background: 'var(--background)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '10px' }}><Download size={18} /></button>
                            <button style={{ background: 'var(--background)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '10px' }}><Share2 size={18} /></button>
                        </div>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                            <div style={{ padding: '20px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Current Status</p>
                                <p style={{ fontSize: '15px', fontWeight: '700' }}>{activeNotice.status}</p>
                            </div>
                            <div style={{ padding: '20px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Time Left</p>
                                <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--danger)' }}>9 Days Remaining</p>
                            </div>
                            <div style={{ padding: '20px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Assignee</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>M</div>
                                    <p style={{ fontSize: '14px', fontWeight: '600' }}>Mehul Sharma</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Response Drafting (AI Enabled)</h3>
                            <textarea 
                                placeholder="Start drafting your response or use a template..."
                                style={{ width: '100%', minHeight: '300px', padding: '20px', background: 'white', border: '1px solid var(--border)', borderRadius: '16px', fontSize: '14px', lineHeight: '1.6' }}
                                defaultValue={`Dear Officer,\n\nIn response to the notice under section 143(2) for the assessment year 2024-25, we are submitting herewith the following information and documents for your kind perusal...`}
                            />
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                            <button style={{ background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>Save as Draft</button>
                            <button style={{ background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Send size={18} /> Submit to Portal
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    <Inbox size={64} opacity={0.2} style={{ marginBottom: '16px' }} />
                    <p style={{ fontSize: '16px' }}>Select a notice from the inbox to start working.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Notices;
