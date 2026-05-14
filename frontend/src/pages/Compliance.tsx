import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Briefcase,
  FileText,
  ShieldCheck,
  Zap,
  Building2,
  Bell,
  Plus,
  Send,
  MoreVertical,
  X,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComplianceRecord {
  id: number;
  title: string;
  category: string;
  deadline: string;
  status: 'Pending' | 'Filed' | 'Overdue';
  client_name: string;
  ack_no?: string;
  last_sync?: string;
}

interface Reminder {
  id: number;
  client: string;
  message: string;
  date: string;
}

const Compliance: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, client: 'Reliance Industries', message: 'GSTR-3B Documents Pending', date: '2h ago' },
    { id: 2, client: 'Zomato Operations', message: 'TDS Payment Reminder', date: '5h ago' },
  ]);

  const categories = ['All', 'GST', 'TDS', 'Income Tax', 'MCA', 'Payroll'];

  useEffect(() => {
    fetchCompliance();
  }, []);

  const fetchCompliance = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5005/api/compliance');
      const data = await response.json();
      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching compliance:', error);
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('http://127.0.0.1:5005/api/compliance/sync', { method: 'POST' });
      await fetchCompliance();
    } catch (error) {
      console.error('Sync failed:', error);
    }
    setSyncing(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Filed': return { color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' };
      case 'Pending': return { color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' };
      case 'Overdue': return { color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' };
      default: return { color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.05)' };
    }
  };

  const filteredRecords = records.filter(r => 
    (activeCategory === 'All' || r.category === activeCategory) &&
    (r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', padding: '0 8px' }}>
        <div>
          <h1 className="display-serif" style={{ fontSize: '42px', marginBottom: '8px' }}>Statutory Command</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: '600' }}>Live tracking of statutory deliverables synced with government portals.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={handleSync} 
            disabled={syncing}
            className="card" 
            style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', cursor: syncing ? 'not-allowed' : 'pointer' }}
          >
            <RefreshCw size={18} className={syncing ? 'spin' : ''} /> {syncing ? 'Syncing...' : 'Sync with Portal'}
          </button>
          <button onClick={() => setShowReminderForm(true)} className="premium-btn">
            <Bell size={20} strokeWidth={3} /> Send Client Nudge
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        {/* Main Table Section */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
                    background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                    color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                    border: 'none', cursor: 'pointer', transition: '0.2s'
                  }}
                >{cat}</button>
              ))}
            </div>
            <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                    type="text" 
                    placeholder="Search records..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 44px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '14px' }} 
                />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--background)' }}>
                  <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Deliverable</th>
                  <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Client</th>
                  <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Deadline</th>
                  <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ack No.</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Retrieving statutory logs...</td></tr>
                ) : filteredRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row">
                    <td style={{ padding: '20px 24px', fontWeight: '800' }}>{record.title}</td>
                    <td style={{ padding: '20px 24px', color: 'var(--text-primary)', fontWeight: '700' }}>{record.client_name}</td>
                    <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '6px' }}>{record.category}</span>
                    </td>
                    <td style={{ padding: '20px 24px', fontWeight: '600', color: 'var(--text-secondary)' }}>{record.deadline}</td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ 
                        ...getStatusStyle(record.status),
                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px'
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusStyle(record.status).color }}></div>
                        {record.status}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        {record.ack_no || '---'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Nudge Analytics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reminders.map(rem => (
                <div key={rem.id} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bell size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>{rem.client}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{rem.message}</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '700' }}>{rem.date.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '32px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', border: 'none' }}>
            <Zap size={32} style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Auto-Sync Active</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', fontWeight: '500', opacity: 0.9 }}>
              The Turia Bot is currently syncing with the GSTN portal for Reliance Industries. Expected completion: 2 mins.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .table-row:hover { background: rgba(255, 255, 255, 0.02); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Compliance;
