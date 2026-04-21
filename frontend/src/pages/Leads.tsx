import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowRight,
  User,
  Mail,
  Phone,
  Clock,
  Target,
  FileText,
  DollarSign,
  TrendingUp,
  LayoutGrid,
  List,
  Download,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Proposal' | 'Won' | 'Lost';
  value: number;
  source: 'Website' | 'LinkedIn' | 'Reference' | 'Manual';
  service: string;
  priority: 'High' | 'Medium' | 'Low';
  last_activity: string;
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, name: 'Aditya Birla Group', email: 'v.birla@abg.com', phone: '+91 98765 43210', status: 'New', value: 1200000, source: 'Website', service: 'Statutory Audit', priority: 'High', last_activity: '2h ago' },
    { id: 2, name: 'Mahindra & Mahindra', email: 'anand.m@mahindra.com', phone: '+91 91234 56789', status: 'Contacted', value: 850000, source: 'Reference', service: 'GST Consulting', priority: 'Medium', last_activity: '1d ago' },
    { id: 3, name: 'Infosys Ltd', email: 'sharma.p@infosys.com', phone: '+91 99887 76655', status: 'Proposal', value: 2500000, source: 'LinkedIn', service: 'Transfer Pricing', priority: 'High', last_activity: '5h ago' },
    { id: 4, name: 'Zomato Operations', email: 'finance@zomato.com', phone: '+91 90000 11111', status: 'New', value: 450000, source: 'Manual', service: 'ROC Filing', priority: 'Low', last_activity: '3h ago' },
  ]);

  const columns: Lead['status'][] = ['New', 'Contacted', 'Proposal', 'Won', 'Lost'];

  const moveLead = (id: number, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'LinkedIn': return <Target size={14} />;
      case 'Website': return <Globe size={14} />;
      case 'Reference': return <User size={14} />;
      default: return <Plus size={14} />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High': return { color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' };
      case 'Medium': return { color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' };
      default: return { color: 'var(--success)', background: 'rgba(34, 197, 94, 0.1)' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', padding: '0 8px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '8px' }}>Lead Pipeline</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: '500' }}>Convert prospective business into active practitioner relationships.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="glass-card" style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Download size={18} /> Export
          </button>
          <button className="premium-btn" onClick={() => {}}>
            <Plus size={20} strokeWidth={3} /> Capture New Lead
          </button>
        </div>
      </div>

      {/* Pipeline Toolbar */}
      <div className="card" style={{ 
          padding: '16px 24px', 
          marginBottom: '32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'var(--surface)',
          borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={20} color="var(--primary)" />
                <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Total Pipeline Value</p>
                    <p style={{ fontSize: '15px', fontWeight: '800' }}>₹58.2 Lakhs</p>
                </div>
            </div>
            <div style={{ padding: '0 24px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} color="var(--warning)" />
                <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Avg. Closing Time</p>
                    <p style={{ fontSize: '15px', fontWeight: '800' }}>14 Days</p>
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="text" placeholder="Search leads..." style={{ paddingLeft: '40px', background: 'var(--background)', width: '200px', fontSize: '13px' }} />
            </div>
            <button className="glass-card" style={{ padding: '8px 12px' }}><Filter size={18} /></button>
            <div style={{ display: 'flex', background: 'var(--background)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <button style={{ padding: '6px', background: 'var(--surface)', borderRadius: '6px', color: 'var(--primary)' }}><LayoutGrid size={16} /></button>
                <button style={{ padding: '6px', background: 'transparent', color: 'var(--text-secondary)' }}><List size={16} /></button>
            </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '32px' }} className="hide-scrollbar">
        {columns.map(column => (
          <div key={column} style={{ minWidth: '340px', width: '340px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px',
              padding: '0 8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: column === 'Won' ? 'var(--success)' : column === 'Lost' ? 'var(--danger)' : 'var(--primary)' }}></div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{column}</h3>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                {leads.filter(l => l.status === column).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {leads.filter(l => l.status === column).map(lead => (
                <motion.div 
                    layoutId={lead.id.toString()}
                    key={lead.id} 
                    className="card lead-card" 
                    style={{ padding: '20px', cursor: 'grab', position: 'relative' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '10px', 
                        fontWeight: '800',
                        ...getPriorityStyle(lead.priority)
                    }}>
                        {lead.priority} PRIORITY
                    </div>
                    <button style={{ background: 'transparent', color: 'var(--text-secondary)', padding: 0 }}><MoreVertical size={16} /></button>
                  </div>

                  <h4 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>{lead.name}</h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <span style={{ padding: '4px 10px', background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                          {lead.service}
                      </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                          <DollarSign size={13} />
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>₹{(lead.value / 100000).toFixed(1)}L</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                          <Clock size={13} />
                          <span style={{ fontWeight: '600' }}>{lead.last_activity}</span>
                      </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: '50%', 
                            background: 'var(--background)', 
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: '800'
                        }}>VD</div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Lead Owner</span>
                    </div>
                    <button 
                        onClick={() => {
                            const nextIdx = columns.indexOf(column) + 1;
                            if (nextIdx < columns.length) moveLead(lead.id, columns[nextIdx]);
                        }}
                        style={{ 
                            background: 'rgba(99, 102, 241, 0.1)', 
                            color: 'var(--primary)', 
                            padding: '8px', 
                            borderRadius: '10px',
                            border: '1px solid rgba(99, 102, 241, 0.2)' 
                        }}
                    >
                        <ArrowRight size={16} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              <button style={{ 
                width: '100%', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px dashed var(--border)', 
                color: 'var(--text-secondary)',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                transition: '0.2s'
              }} className="add-btn">
                + Add Opportunity
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .lead-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            border-color: rgba(99, 102, 241, 0.3) !important;
        }
        .add-btn:hover {
            background: rgba(255,255,255,0.05) !important;
            border-color: var(--primary) !important;
            color: var(--primary) !important;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const Globe = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

export default Leads;
