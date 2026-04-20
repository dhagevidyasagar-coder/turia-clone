import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Briefcase,
  RefreshCw,
  Globe,
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeaadlineRecord {
  id: number;
  title: string;
  category: string;
  deadline: string;
  status: string;
  client_name: string;
  ack_no?: string;
  last_sync?: string;
}

const Compliance: React.FC = () => {
  const [records, setRecords] = useState<DeaadlineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    fetchCompliance();
  }, []);

  const fetchCompliance = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/compliance');
      const data = await response.json();
      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching compliance:', error);
      setLoading(false);
    }
  };

  const handleLiveSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Connecting to GSTN & Income Tax Portals...');
    
    setTimeout(async () => {
      setSyncStatus('Fetching GSTR-1 & 3B Status...');
      setTimeout(async () => {
        setSyncStatus('Verifying Tax Payments...');
        try {
          const response = await fetch('http://127.0.0.1:5000/api/compliance/sync', { method: 'POST' });
          if (response.ok) {
            await fetchCompliance();
            setSyncStatus('Sync Complete!');
            setTimeout(() => {
              setIsSyncing(false);
              setSyncStatus('');
            }, 1500);
          }
        } catch (error) {
          console.error('Sync failed:', error);
          setIsSyncing(false);
        }
      }, 1000);
    }, 1000);
  };

  const categories = ['All', 'GST', 'TDS', 'Income Tax', 'ROC', 'Labor Laws'];

  const filteredRecords = records.filter(r => 
    activeCategory === 'All' || r.category === activeCategory
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Compliance Ecosystem</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Automated tracking with real-time Government portal synchronization.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleLiveSync}
            disabled={isSyncing}
            style={{ 
              background: isSyncing ? 'var(--background)' : 'var(--primary)', 
              color: isSyncing ? 'var(--text-secondary)' : 'white'
            }}
          >
            <RefreshCw size={18} className={isSyncing ? 'spin' : ''} />
            {isSyncing ? 'Synchronizing...' : 'Sync Live Status'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSyncing && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="card"
            style={{ 
              background: 'rgba(37, 99, 235, 0.05)', 
              border: '1px solid var(--primary)', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <RefreshCw size={20} color="var(--primary)" className="spin" />
              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{syncStatus}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Checking GSTN, ITD, and MCA Endpoints...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }} className="hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  background: activeCategory === cat ? 'var(--primary)' : 'white',
                  color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                  border: '1px solid ' + (activeCategory === cat ? 'var(--primary)' : 'var(--border)'),
                  transition: '0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Records Table */}
          <div className="card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Statutory Timeline</h3>
              {records.length > 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Clock size={14} /> Last Sync: <span style={{color: 'var(--text-primary)'}}>{records[0].last_sync || 'Never'}</span>
                </div>
              )}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th>Compliance & Category</th>
                  <th>Client Association</th>
                  <th>Deadline</th>
                  <th>Portal Status</th>
                  <th>Acknowledgement</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading ecosystem data...</td></tr>
                ) : filteredRecords.map((record) => (
                  <tr key={record.id} className="row-hover">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '10px',
                          background: record.category === 'GST' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(37, 99, 235, 0.05)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: record.category === 'GST' ? 'var(--success)' : 'var(--primary)'
                        }}>
                          {record.category === 'GST' ? <Globe size={20} /> : <ShieldCheck size={20} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '15px' }}>{record.title}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Filing: {record.category}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>{record.client_name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: CL-{202400 + record.id}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        <Clock size={16} color={record.status === 'Overdue' ? 'var(--danger)' : 'var(--text-secondary)'} />
                        <span style={{ color: record.status === 'Overdue' ? 'var(--danger)' : 'var(--text-primary)', fontWeight: '700' }}>
                          {record.deadline}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800',
                        background: record.status === 'Filed' ? 'rgba(34, 197, 94, 0.1)' : record.status === 'Overdue' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: record.status === 'Filed' ? 'var(--success)' : record.status === 'Overdue' ? 'var(--danger)' : 'var(--warning)',
                        display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content'
                      }}>
                        {record.status === 'Filed' ? <CheckCircle2 size={12} /> : record.status === 'Overdue' ? <AlertCircle size={12} /> : <Clock size={12} />}
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {record.ack_no ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--success)', fontWeight: '800' }}>
                          <FileText size={14} />
                          {record.ack_no}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Pending Sync</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '28px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Portal Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                  <Globe size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>GST Portal</p>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: 'var(--success)' }}>CONNECTED</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Income Tax Portal</p>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>CONNECTED</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>MCA V3 Portal</p>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: 'var(--warning)' }}>SYNCHRONIZING...</p>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>Critical Countdown</h4>
              <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', borderLeft: '4px solid var(--danger)' }}>
                <p style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px', color: 'var(--text-primary)' }}>GST R-3B Monthly</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600' }}>
                  <span style={{color: 'var(--text-secondary)'}}>20th Apr 2024</span>
                  <span style={{ color: 'var(--danger)', fontWeight: '800' }}>6 Hours Left</span>
                </div>
              </div>
            </div>
          </div>
          
          <button style={{ 
            width: '100%', padding: '16px', background: 'white', color: 'var(--text-primary)', 
            borderRadius: '16px', border: '1px solid var(--border)', fontSize: '14px', 
            fontWeight: '700'
          }}>
            Download Status Report
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .row-hover:hover { background: rgba(37, 99, 235, 0.02) !important; cursor: pointer; transition: 0.2s; }
      `}</style>
    </div>
  );
};

export default Compliance;
