import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Communication from './pages/Communication';
import Billing from './pages/Billing';
import Compliance from './pages/Compliance';
import CalendarView from './pages/CalendarView';
import MailBox from './pages/MailBox';
import Documents from './pages/Documents';
import DSCManager from './pages/DSCManager';
import ClientPortal from './pages/ClientPortal';
import { 
  Bell, 
  Search, 
  User, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Settings,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const dashboardStats = [
  { label: 'Total Clients', value: '1,280', change: '+12%', icon: User, color: 'var(--primary)' },
  { label: 'Active Tasks', value: '452', change: '+5%', icon: Clock, color: 'var(--warning)' },
  { label: 'Completed (MTD)', value: '89', change: '+18%', icon: CheckCircle2, color: 'var(--success)' },
  { label: 'Pending Compliance', value: '24', change: '-2%', icon: AlertCircle, color: 'var(--danger)' },
];

const chartData = [
  { name: 'Jan', revenue: 4000, tasks: 240 },
  { name: 'Feb', revenue: 3000, tasks: 198 },
  { name: 'Mar', revenue: 2000, tasks: 980 },
  { name: 'Apr', revenue: 2780, tasks: 390 },
  { name: 'May', revenue: 1890, tasks: 480 },
  { name: 'Jun', revenue: 2390, tasks: 380 },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [complianceSummary, setComplianceSummary] = useState({ filed: 12, pending: 8, overdue: 4 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  React.useEffect(() => {
    // Fetch Compliance
    fetch('http://127.0.0.1:5000/api/compliance')
      .then(res => res.json())
      .then(data => {
        const filed = data.filter((r: any) => r.status === 'Filed').length;
        const pending = data.filter((r: any) => r.status === 'Pending').length;
        const overdue = data.filter((r: any) => r.status === 'Overdue').length;
        setComplianceSummary({ filed, pending, overdue });
      });

    // Fetch Notifications
    fetch('http://127.0.0.1:5000/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data.length > 0 ? data : [
        { id: 1, title: 'Overdue Task Escalated', message: 'GST filing for Turia Ind. is 2 days overdue.', type: 'Overdue', timestamp: '09:30', is_read: false },
        { id: 2, title: 'Notice Hearing Nudge', message: 'ITD Hearing starts in 2 hours.', type: 'Reminder', timestamp: '10:15', is_read: false }
      ]));
  }, []);

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', padding: '20px' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ 
        marginLeft: 'calc(var(--sidebar-width) + 40px)', 
        flex: 1,
        padding: '20px 40px'
      }}>
        {/* Header */}
        <header className="card" style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          marginBottom: '32px',
          borderRadius: '20px',
          background: 'var(--surface)'
        }}>
          <div style={{ visibility: 'hidden' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); }}
                style={{ background: 'var(--background)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '10px', borderRadius: '12px', position: 'relative' }}
              >
                <Bell size={20} />
                {notifications.some(n => !n.is_read) && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }} />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="card" 
                    style={{ position: 'absolute', top: '100%', right: 0, width: '380px', marginTop: '12px', zIndex: 1000, padding: '24px' }}
                  >
                    <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>Practice Alerts</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {notifications.map(n => (
                        <div key={n.id} style={{ display: 'flex', gap: '12px', padding: '14px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <div style={{ width: '8px', height: '8px', marginTop: '6px', borderRadius: '50%', background: n.type === 'Overdue' ? 'var(--danger)' : 'var(--warning)' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: '700' }}>{n.title}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</p>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>{n.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '6px 12px',
              background: 'var(--background)',
              borderRadius: '14px',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: 'white',
                fontSize: '14px'
              }}>V</div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '13px', fontWeight: '700' }}>Vidyasagar Dhage</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Senior Partner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
          {activeTab === 'dashboard' && (
            <>
              <div style={{ marginBottom: '40px' }}>
                <h1 style={{ marginBottom: '12px' }}>Firm Overview</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Welcome back! Track your practice success and statutory deadlines.</p>
              </div>

              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '24px',
                marginBottom: '40px' 
              }}>
                {dashboardStats.map((stat, i) => (
                  <div key={i} className="card" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ 
                        width: '52px', 
                        height: '52px', 
                        borderRadius: '16px', 
                        background: `rgba(${stat.color === 'var(--primary)' ? '37, 99, 235' : stat.color === 'var(--warning)' ? '245, 158, 11' : stat.color === 'var(--success)' ? '34, 197, 94' : '239, 68, 68'}, 0.1)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <stat.icon size={26} color={stat.color} />
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        color: stat.change.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                        fontSize: '14px',
                        fontWeight: '700'
                      }}>
                        <TrendingUp size={18} />
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{stat.label}</p>
                      <h2 style={{ fontSize: '32px', fontWeight: '800' }}>{stat.value}</h2>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="card" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Growth & Performance</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ padding: '8px 16px', background: 'var(--background)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '12px' }}>Weekly</button>
                      <button style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', borderRadius: '10px', fontSize: '12px' }}>Monthly</button>
                    </div>
                  </div>
                  <div style={{ height: '320px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Compliance Health</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '14px', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
                      <span style={{ fontSize: '14px', color: 'var(--success)', fontWeight: '700' }}>✓ Filed on Time</span>
                      <span style={{ fontWeight: '800' }}>{complianceSummary.filed}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                      <span style={{ fontSize: '14px', color: 'var(--warning)', fontWeight: '700' }}>⏳ Pending Filing</span>
                      <span style={{ fontWeight: '800' }}>{complianceSummary.pending}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                      <span style={{ fontSize: '14px', color: 'var(--danger)', fontWeight: '700' }}>⚠ Overdue Status</span>
                      <span style={{ fontWeight: '800' }}>{complianceSummary.overdue}</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('compliance')}
                      style={{ marginTop: '12px', padding: '14px', background: 'var(--background)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700', fontSize: '13px' }}
                    >
                      View Full Ecosystem
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'clients' && <Clients />}
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'billing' && <Billing />}
          {activeTab === 'compliance' && <Compliance />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'inbox' && <MailBox />}
          {activeTab === 'whatsapp' && <Communication />}
          {activeTab === 'documents' && <Documents />}
          {activeTab === 'dsc' && <DSCManager />}
          {activeTab === 'portal' && <ClientPortal />}

          {[''].includes(activeTab) && (
            <div className="card" style={{ textAlign: 'center', padding: '120px 0', borderStyle: 'dashed' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                background: 'var(--background)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Settings size={48} color="var(--text-secondary)" className="spin-slow" />
              </div>
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Module Under Construction</h2>
              <p style={{ color: 'var(--text-secondary)' }}>We're building the high-fidelity {activeTab} module. Stay tuned!</p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
