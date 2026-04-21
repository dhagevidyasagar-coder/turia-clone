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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeadlineRecord {
  id: number;
  date: string;
  client: string;
  gst: 'Filed' | 'Pending' | 'Overdue' | 'N/A';
  it: 'Filed' | 'Pending' | 'Overdue' | 'N/A';
  roc: 'Filed' | 'Pending' | 'Overdue' | 'N/A';
  tds: 'Filed' | 'Pending' | 'Overdue' | 'N/A';
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
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, client: 'Reliance Industries', message: 'GSTR-3B Documents Pending', date: '2h ago' },
    { id: 2, client: 'Zomato Operations', message: 'TDS Payment Reminder', date: '5h ago' },
  ]);

  const [records] = useState<DeadlineRecord[]>([
    { id: 1, date: '20th Apr 2024', client: 'Reliance Industries', gst: 'Pending', it: 'Filed', roc: 'Filed', tds: 'Pending' },
    { id: 2, date: '11th Apr 2024', client: 'Zomato Operations', gst: 'Filed', it: 'N/A', roc: 'N/A', tds: 'Filed' },
    { id: 3, date: '30th Sep 2024', client: 'Tata Consultancy', gst: 'Pending', it: 'Overdue', roc: 'Pending', tds: 'N/A' },
    { id: 4, date: '15th Jul 2024', client: 'Infosys Ltd', gst: 'Filed', it: 'Filed', roc: 'Filed', tds: 'Filed' },
  ]);

  const categories = ['All', 'GST', 'IT', 'ROC', 'TDS'];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Filed': return { color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' };
      case 'Pending': return { color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' };
      case 'Overdue': return { color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' };
      default: return { color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.05)' };
    }
  };

  const handleAddReminder = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRem = {
        id: Date.now(),
        client: formData.get('client') as string,
        message: formData.get('message') as string,
        date: 'Just now'
    };
    setReminders([newRem, ...reminders]);
    setShowReminderForm(false);
    alert(`Reminder deployed to ${newRem.client} successfully!`);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', padding: '0 8px' }}>
        <div>
          <h1 className="display-serif" style={{ fontSize: '42px', marginBottom: '8px' }}>Statutory Deadlines</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: '600' }}>Precision tracking of client filing status across all statutory pillars.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => setShowReminderForm(true)} className="premium-btn">
            <Bell size={20} strokeWidth={3} /> Add Customer Reminder
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', height: 'calc(100vh - 250px)' }}>
        {/* Main List Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Toggles */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: '800',
                  background: activeCategory === cat ? 'var(--primary)' : 'white',
                  color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                  border: activeCategory === cat ? 'none' : '1px solid var(--border-strong)',
                  transition: '0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Data Grid */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="data-table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                  <th style={{ padding: '20px 24px' }}>Deadline Date</th>
                  <th style={{ padding: '20px 24px' }}>Client Entity</th>
                  <th style={{ padding: '20px 24px' }}>GST</th>
                  <th style={{ padding: '20px 24px' }}>IT</th>
                  <th style={{ padding: '20px 24px' }}>ROC</th>
                  <th style={{ padding: '20px 24px' }}>TDS</th>
                  <th style={{ padding: '20px 24px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map(rec => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="row-hover">
                    <td style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '14px' }}>
                            <CalendarIcon size={16} color="var(--text-secondary)" /> {rec.date}
                        </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Building2 size={18} color="var(--text-secondary)" />
                            <span style={{ fontWeight: '800', fontSize: '14px' }}>{rec.client}</span>
                        </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', ...getStatusStyle(rec.gst) }}>{rec.gst}</span>
                    </td>
                    <td style={{ padding: '24px' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', ...getStatusStyle(rec.it) }}>{rec.it}</span>
                    </td>
                    <td style={{ padding: '24px' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', ...getStatusStyle(rec.roc) }}>{rec.roc}</span>
                    </td>
                    <td style={{ padding: '24px' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', ...getStatusStyle(rec.tds) }}>{rec.tds}</span>
                    </td>
                    <td style={{ padding: '24px' }}>
                        <button style={{ background: 'transparent', color: 'var(--text-secondary)' }}><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reminders Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="ui-heading" style={{ fontSize: '18px' }}>Active Reminders</h3>
                    <div style={{ padding: '4px 10px', background: 'var(--brand-subtle)', borderRadius: '20px', fontSize: '11px', fontWeight: '800', color: 'var(--brand-blue)' }}>{reminders.length} ACTIVE</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reminders.map(rem => (
                        <div key={rem.id} style={{ padding: '20px', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--border-strong)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{rem.client}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>{rem.date}</p>
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>{rem.message}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '12px', fontWeight: '700' }}>
                                <CheckCircle2 size={14} /> Sent via WhatsApp
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {showReminderForm && (
                        <motion.form 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: 20 }}
                            onSubmit={handleAddReminder}
                            style={{ 
                                marginTop: '24px', padding: '24px', background: 'white', borderRadius: '20px', 
                                border: '1px solid var(--brand-blue)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h4 style={{ fontWeight: '800', fontSize: '15px' }}>New Reminder</h4>
                                <button type="button" onClick={() => setShowReminderForm(false)} style={{ background: 'transparent', padding: 0 }}><X size={16} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-secondary)' }}>CLIENT</label>
                                    <select name="client" style={{ width: '100%', background: 'var(--background)' }}>
                                        <option>Reliance Industries</option>
                                        <option>Infosys Ltd</option>
                                        <option>Tata Consultancy</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-secondary)' }}>MESSAGE</label>
                                    <textarea name="message" placeholder="e.g. Please share GSTR-1 files..." style={{ width: '100%', background: 'var(--background)', minHeight: '80px' }} />
                                </div>
                                <button className="premium-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Send size={18} /> Deploy Reminder
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

            <div className="card" style={{ padding: '24px', background: 'var(--brand-blue)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Zap size={20} />
                    <h4 style={{ fontWeight: '800', fontSize: '15px' }}>Workflow Auto-Agent</h4>
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.6', fontWeight: '500', opacity: 0.9 }}>
                    Automated reminders are scheduled for all 'Pending' GST filings tomorrow morning at 09:00 AM.
                </p>
            </div>
        </div>
      </div>

      <style>{`
        .row-hover:hover { background: rgba(44, 127, 255, 0.02) !important; cursor: pointer; }
        .data-table th { background: var(--background); color: var(--text-secondary); text-transform: uppercase; font-size: 11px; font-weight: 900; letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

export default Compliance;
