import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Communication from './pages/Communication';
import Billing from './pages/Billing';
import ComplianceCalendar from './pages/ComplianceCalendar';
import CalendarView from './pages/CalendarView';
import MailBox from './pages/MailBox';
import Documents from './pages/Documents';
import DSCManager from './pages/DSCManager';
import ClientPortal from './pages/ClientPortal';
import Leads from './pages/Leads';
import Notices from './pages/Notices';
import Team from './pages/Team';
import LoginPage from './pages/LoginPage';
import { 
  Bell, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Building2,
  TrendingUp,
  DollarSign,
  Briefcase
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

// Premium Analytics Data
const chartData = [
  { name: 'Jan', revenue: 4200, tasks: 140 },
  { name: 'Feb', revenue: 3800, tasks: 168 },
  { name: 'Mar', revenue: 5600, tasks: 220 },
  { name: 'Apr', revenue: 4800, tasks: 190 },
  { name: 'May', revenue: 6200, tasks: 250 },
  { name: 'Jun', revenue: 7400, tasks: 310 },
];

const dashboardStats = [
  { label: 'Total Revenue', value: '₹14.2L', change: '+12.5%', icon: DollarSign, color: 'var(--primary)' },
  { label: 'Active Tasks', value: '452', change: '+5.2%', icon: Briefcase, color: 'var(--warning)' },
  { label: 'Filed Today', value: '18', change: '+8%', icon: CheckCircle2, color: 'var(--success)' },
  { label: 'Compliance Index', value: '94.2%', change: '+1.2%', icon: TrendingUp, color: 'var(--accent)' },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orgName, setOrgName] = useState('Turia Practice Solutions');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Compliance Warning', message: 'GSTR-3B for Reliance is overdue.', type: 'Overdue', timestamp: '10:30 AM', is_read: false },
    { id: 2, title: 'New Lead Captured', message: 'Inquiry from Zomato Ops.', type: 'Nudge', timestamp: '11:15 AM', is_read: false }
  ]);

  const handleLogin = (name: string) => {
    setOrgName(name);
    setIsAuthenticated(true);
  };

  // Auth Guard
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderDashboard = () => (
    <div className="animate-fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
            {dashboardStats.map((stat, i) => (
                <div key={i} className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: `${stat.color}15`, borderRadius: '12px', color: stat.color }}>
                            <stat.icon size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: stat.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                            {stat.change}
                        </span>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>{stat.label}</p>
                    <h2 style={{ fontSize: '28px', fontWeight: '800' }}>{stat.value}</h2>
                </div>
            ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '32px' }}>Practice Revenue & Output</h3>
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                            <Tooltip 
                                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                                itemStyle={{ fontWeight: 800 }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Priority Deadlines</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { title: 'GSTR-1 Filing', client: 'Reliance Ind.', time: '2h remaining', urgent: true },
                        { title: 'TDS Reconciliation', client: 'TCS Ltd.', time: '5h remaining', urgent: false },
                        { title: 'ROC Form MGT-7', client: 'Zomato Ops', time: 'Tomorrow', urgent: false },
                    ].map((d, i) => (
                        <div key={i} style={{ padding: '16px', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: '800', marginBottom: '2px' }}>{d.title}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{d.client}</p>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: d.urgent ? 'var(--danger)' : 'var(--text-secondary)' }}>{d.time.toUpperCase()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'clients':
      case 'clients:all_clients': return <Clients />;
      case 'clients:leads': return <Leads />;
      case 'clients:client_portal': return <ClientPortal />;
      case 'clients:dsc_manager': return <DSCManager />;
      case 'tasks':
      case 'tasks:my_tasks':
      case 'tasks:team_tasks': return <Tasks />;
      case 'compliance':
      case 'compliance:deadlines': return <ComplianceCalendar />;
      case 'compliance:calendar': return <CalendarView />;
      case 'notices': return <Notices />;
      case 'documents': return <Documents />;
      case 'team': return <Team />;
      default:
        if (activeTab === 'communications:mailbox') return <MailBox />;
        if (activeTab.startsWith('communications')) return <Communication />;
        if (activeTab.startsWith('billing')) return <Billing />;
        return (
          <div className="card" style={{ textAlign: 'center', padding: '120px 0', borderStyle: 'dashed' }}>
            <div style={{ 
                width: '120px', height: '120px', background: 'var(--background)', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' 
            }}>
                <Settings size={48} color="var(--text-secondary)" className="spin-slow" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Module Under Construction</h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>The {activeTab} high-fidelity suite is being provisioned.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--app-bg)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: '40px 60px' }}>
        {/* Top Navigation Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ padding: '10px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Building2 size={24} color="var(--primary)" />
             </div>
             <div>
                <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>{orgName}</h1>
                <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Administrator Console</p>
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '12px', borderRadius: '14px', position: 'relative' }}
              >
                <Bell size={20} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--surface)' }} />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                    className="card" style={{ position: 'absolute', top: '100%', right: 0, width: '380px', marginTop: '16px', zIndex: 1000, padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                  >
                    <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '800' }}>Recent Firm Activity</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {notifications.map(n => (
                        <div key={n.id} style={{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                          <div style={{ width: '8px', height: '8px', marginTop: '6px', borderRadius: '50%', background: n.type === 'Overdue' ? 'var(--danger)' : 'var(--primary)' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: '800' }}>{n.title}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: '500' }}>{n.message}</p>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px', display: 'block', fontWeight: '700' }}>{n.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 16px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'white', fontSize: '14px' }}>V</div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '13px', fontWeight: '800' }}>Vidyasagar Dhage</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Managing Partner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content View */}
        <div style={{ minHeight: 'calc(100vh - 200px)' }}>
          {renderContent()}
        </div>
      </main>

      <style>{`
        .app-container { --sidebar-width: 280px; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-slow { animation: rotate 12s linear infinite; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default App;
