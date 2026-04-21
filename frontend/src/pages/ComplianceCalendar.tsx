import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  Tag,
  ArrowRight,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Deadline {
  day: number;
  dateStr: string;
  title: string;
  category: 'GST' | 'IT' | 'ROC' | 'TDS' | 'Audit';
  severity: 'Critical' | 'High' | 'Normal';
  clientCnt: number;
  completedCnt: number;
}

const statutoryDeadlines: Deadline[] = [
  { day: 7, dateStr: '07th Apr', title: 'TDS Deposit (Challan 281)', category: 'TDS', severity: 'High', clientCnt: 42, completedCnt: 38 },
  { day: 11, dateStr: '11th Apr', title: 'GSTR-1 Monthly Filing', category: 'GST', severity: 'Critical', clientCnt: 88, completedCnt: 45 },
  { day: 13, dateStr: '13th Apr', title: 'GSTR-1 IFF (QRMP Scheme)', category: 'GST', severity: 'High', clientCnt: 24, completedCnt: 20 },
  { day: 15, dateStr: '15th Apr', title: 'PF & ESI Monthly Payment', category: 'IT', severity: 'Normal', clientCnt: 110, completedCnt: 95 },
  { day: 20, dateStr: '20th Apr', title: 'GSTR-3B Monthly Filing', category: 'GST', severity: 'Critical', clientCnt: 92, completedCnt: 12 },
  { day: 25, dateStr: '25th Apr', title: 'GST ITC-04 (Job Work)', category: 'GST', severity: 'Normal', clientCnt: 15, completedCnt: 0 },
  { day: 30, dateStr: '30th Apr', title: 'TDS Quarterly Return (24Q/26Q)', category: 'TDS', severity: 'High', clientCnt: 75, completedCnt: 5 },
  // Adding duplicates to demonstrate the scroller
  { day: 31, dateStr: '31st Apr', title: 'Professional Tax Deposit', category: 'IT', severity: 'Normal', clientCnt: 45, completedCnt: 45 },
  { day: 31, dateStr: '31st Apr', title: 'ROC Form MGT-7 Filing', category: 'ROC', severity: 'High', clientCnt: 12, completedCnt: 2 },
];

const ComplianceCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('timeline');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 21)); // April 21, 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(21);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, currentDate.getMonth(), 1).getDay();

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'GST': return 'badge-green';
      case 'IT': return 'badge-blue';
      case 'TDS': return 'badge-pink';
      default: return 'badge-purple';
    }
  };

  const renderCalendar = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`pad-${i}`} style={{ height: '140px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.01)' }} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayDeadlines = statutoryDeadlines.filter(sd => sd.day === d);
      const isSelected = selectedDay === d;
      const isToday = d === 21;

      cells.push(
        <div 
          key={d} onClick={() => setSelectedDay(d)}
          style={{ 
            height: '140px', 
            border: '1px solid var(--border-subtle)', 
            padding: '16px',
            background: isSelected ? 'rgba(44, 127, 255, 0.03)' : 'white',
            cursor: 'pointer', transition: '0.2s', position: 'relative'
          }}
          className="calendar-day"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: '900', color: isToday ? 'var(--brand-blue)' : 'var(--text-primary)' }}>{d}</span>
            {dayDeadlines.length > 0 && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dayDeadlines.some(dl => dl.severity === 'Critical') ? 'var(--danger)' : 'var(--brand-blue)' }} />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dayDeadlines.map((dl, idx) => (
              <div key={idx} style={{ 
                  fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '6px',
                  background: dl.severity === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : 'var(--background)',
                  color: dl.severity === 'Critical' ? 'var(--danger)' : 'var(--text-secondary)',
                  border: dl.severity === 'Critical' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--border-subtle)'
              }}>{dl.category}</div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', padding: '0 8px' }}>
        <div>
          <h1 className="display-serif" style={{ fontSize: '42px', marginBottom: '8px' }}>Compliance Command</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: '600' }}>Master statutory timeline for India - FY 2026-27.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="card" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
            <Download size={18} /> Export MIS
          </button>
          <button className="premium-btn">
             <Plus size={20} strokeWidth={3} /> Add Custom Reminder
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', height: 'calc(100vh - 220px)' }}>
        {/* Main View Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
            <div className="card" style={{ padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h2 className="ui-heading" style={{ fontSize: '17px' }}>{monthName} {year}</h2>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button style={{ padding: '6px', background: 'var(--background)', border: '1px solid var(--border-strong)', borderRadius: '6px' }}><ChevronLeft size={16} /></button>
                        <button style={{ padding: '6px', background: 'var(--background)', border: '1px solid var(--border-strong)', borderRadius: '6px' }}><ChevronRight size={16} /></button>
                    </div>
                </div>
                <div style={{ display: 'flex', background: 'var(--background)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-strong)' }}>
                    <button 
                        onClick={() => setViewMode('grid')}
                        style={{ padding: '8px', background: viewMode === 'grid' ? 'white' : 'transparent', borderRadius: '6px', color: viewMode === 'grid' ? 'var(--brand-blue)' : 'var(--text-secondary)', boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none' }}
                    ><LayoutGrid size={18} /></button>
                    <button 
                        onClick={() => setViewMode('timeline')}
                        style={{ padding: '8px', background: viewMode === 'timeline' ? 'white' : 'transparent', borderRadius: '6px', color: viewMode === 'timeline' ? 'var(--brand-blue)' : 'var(--text-secondary)', boxShadow: viewMode === 'timeline' ? 'var(--shadow-sm)' : 'none' }}
                    ><List size={18} /></button>
                </div>
            </div>

            <div className="internal-scroller hide-scrollbar" style={{ flex: 1, overflowY: 'auto', borderRadius: '16px' }}>
                {viewMode === 'grid' ? (
                    <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', borderBottom: '1px solid var(--border-strong)', background: 'var(--background)' }}>
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                <div key={day} style={{ padding: '12px', fontSize: '11px', fontWeight: '900', color: 'var(--text-secondary)' }}>{day}</div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1 }}>
                            {renderCalendar()}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
                        {statutoryDeadlines.map((dl, idx) => (
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                key={idx} className="card" 
                                style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '32px' }}
                            >
                                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                                    <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{dl.dateStr.split(' ')[1]}</p>
                                    <p style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>{dl.dateStr.split(' ')[0].replace('th', '')}</p>
                                </div>
                                <div style={{ width: '2px', alignSelf: 'stretch', background: 'var(--border-subtle)' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                        <span className={`badge ${getCategoryBadge(dl.category)}`} style={{ fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '6px' }}>{dl.category}</span>
                                        {dl.severity === 'Critical' && <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--danger)', padding: '4px' }}>• CRITICAL DELIVERABLE</span>}
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{dl.title}</h3>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Filing Scale</p>
                                    <p style={{ fontSize: '14px', fontWeight: '800' }}>{dl.completedCnt} / {dl.clientCnt} <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Clients</span></p>
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ArrowRight size={20} color="var(--brand-blue)" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Sidebar Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--brand-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={24} color="var(--brand-blue)" />
                    </div>
                    <div>
                        <h3 className="ui-heading" style={{ fontSize: '18px' }}>Peak Insights</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Managing 9 Statutory Events</p>
                    </div>
                </div>
                <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', borderLeft: '4px solid var(--danger)', marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>Peak Surge: Apr 11</p>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Assign extra staff resources to GST team for 88 filings.</p>
                </div>
                <button style={{ width: '100%', padding: '16px', background: 'var(--background)', border: '1px solid var(--border-strong)', borderRadius: '12px', fontWeight: '700', fontSize: '14px' }}>View Resource Map</button>
            </div>
            
            <div className="card" style={{ padding: '24px', background: 'var(--primary)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <AlertCircle size={20} />
                  <h4 style={{ fontWeight: '800', fontSize: '15px' }}>Penalty Advisory</h4>
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', fontWeight: '500', opacity: 0.9 }}>
                  GSTR-3B monthly filings are entering the 5-day proximity zone. Automated client nudges will deploy tomorrow morning.
              </p>
            </div>
        </div>
      </div>

      <style>{`
        .calendar-day:hover { background: rgba(44, 127, 255, 0.05) !important; border-color: var(--brand-blue) !important; z-index: 10; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        /* Professional Internal Scroller Styling */
        .internal-scroller::-webkit-scrollbar { width: 4px; }
        .internal-scroller::-webkit-scrollbar-track { background: transparent; }
        .internal-scroller::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 20px; }
        .internal-scroller::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.1); }
      `}</style>
    </div>
  );
};

export default ComplianceCalendar;
