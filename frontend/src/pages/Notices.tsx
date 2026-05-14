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
  Send,
  Building,
  AlertTriangle,
  FileSearch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notice {
  id: number;
  title: string;
  clientName: string;
  authority: 'GST' | 'Income Tax' | 'MCA' | 'TDS';
  type: string;
  deadline: string;
  status: 'Unread' | 'Drafting Response' | 'Under Review' | 'Submitted';
  severity: 'High' | 'Medium' | 'Low';
  ack_no?: string;
}

const Notices: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notices, setNotices] = useState<Notice[]>([
    { id: 1, title: 'Scrutiny Notice u/s 143(2)', clientName: 'Acme Corp', authority: 'Income Tax', type: 'Assessment', deadline: '2024-04-30', status: 'Unread', severity: 'High' },
    { id: 2, title: 'GSTR-3B Mismatch (ASMT-10)', clientName: 'TechFlow Pvt Ltd', authority: 'GST', type: 'Compliance', deadline: '2024-05-15', status: 'Drafting Response', severity: 'Medium' },
    { id: 3, title: 'TDS Default Nudge (SEC 201)', clientName: 'Global Traders', authority: 'TDS', type: 'Default', deadline: '2024-04-20', status: 'Submitted', severity: 'Low', ack_no: 'ACK-992211' },
    { id: 4, title: 'Defective Return Notice u/s 139(9)', clientName: 'Stark Industries', authority: 'Income Tax', type: 'Defect', deadline: '2024-05-02', status: 'Under Review', severity: 'High' },
  ]);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'High': return { background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'Medium': return { background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' };
      default: return { background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: '1px solid rgba(59, 130, 246, 0.2)' };
    }
  };

  const filteredNotices = notices.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Action Required') return n.status !== 'Submitted';
    if (activeFilter === 'High Priority') return n.severity === 'High';
    if (activeFilter === 'Resolved') return n.status === 'Submitted';
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', padding: '0 8px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '8px' }}>Notice Management Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Track, assign, and respond to regulatory notices across all clients.</p>
        </div>
        <button className="premium-btn">
          <Plus size={20} strokeWidth={3} /> Log New Notice
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Active Notices', value: '12', icon: <FileSearch size={24} />, color: 'var(--primary)' },
          { label: 'Critical Deadlines', value: '3', icon: <AlertTriangle size={24} />, color: 'var(--danger)' },
          { label: 'Pending Review', value: '5', icon: <Clock size={24} />, color: 'var(--warning)' },
          { label: 'Resolved (30d)', value: '28', icon: <CheckCircle2 size={24} />, color: 'var(--success)' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px' }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `rgba(${stat.color === 'var(--danger)' ? '239, 68, 68' : stat.color === 'var(--warning)' ? '245, 158, 11' : stat.color === 'var(--success)' ? '16, 185, 129' : '99, 102, 241'}, 0.1)`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        {/* Toolbar & Filters */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['All', 'Action Required', 'High Priority', 'Resolved'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{ 
                  padding: '10px 18px', 
                  borderRadius: '12px', 
                  border: '1px solid',
                  borderColor: activeFilter === filter ? 'var(--primary)' : 'var(--border)',
                  background: activeFilter === filter ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: activeFilter === filter ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeFilter === filter ? '700' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Search by client or DIN..." style={{ width: '100%', padding: '12px 14px 12px 48px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '14px' }} />
          </div>
        </div>
        
        {/* Table with Scroller */}
        <div style={{ overflow: 'auto', maxHeight: '600px' }} className="custom-scrollbar">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', minWidth: '1100px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>Notice Title & ID</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>Client</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>Authority</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>Severity</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>Deadline</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>Status</th>
                <th style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.map(notice => (
                <tr key={notice.id} className="row-hover" style={{ transition: '0.2s' }}>
                  <td style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <p style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>{notice.title}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>ID: NT-2024-{notice.id} • {notice.type}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building size={16} color="var(--text-secondary)" />
                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{notice.clientName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>{notice.authority}</span>
                  </td>
                  <td style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ ...getSeverityStyle(notice.severity), fontSize: '11px', padding: '4px 10px', borderRadius: '6px', fontWeight: '800' }}>{notice.severity.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '700', color: notice.severity === 'High' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        <Clock size={16} /> {notice.deadline}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {notice.status === 'Submitted' && <CheckCircle2 size={16} color="var(--success)" />}
                      {notice.status === 'Drafting Response' && <FileText size={16} color="var(--warning)" />}
                      {notice.status === 'Unread' && <AlertCircle size={16} color="var(--danger)" />}
                      <span style={{ fontSize: '13px', fontWeight: '700', color: notice.status === 'Submitted' ? 'var(--success)' : 'var(--primary)' }}>{notice.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ padding: '8px', background: 'transparent', color: 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer' }} className="hover-action">
                            <Download size={18} />
                        </button>
                        <button style={{ padding: '8px', background: 'transparent', color: 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer' }} className="hover-action">
                            <Share2 size={18} />
                        </button>
                        <button style={{ padding: '8px', background: 'transparent', color: 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer' }} className="hover-action">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
      `}</style>
    </div>
  );
};

export default Notices;
