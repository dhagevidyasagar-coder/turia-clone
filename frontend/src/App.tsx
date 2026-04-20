import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Communication from './pages/Communication';
import Billing from './pages/Billing';
import { 
  Bell, 
  Search, 
  User, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Settings
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

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', padding: '20px' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ 
        marginLeft: 'calc(var(--sidebar-width) + 20px)', 
        flex: 1,
        padding: '0 20px'
      }}>
        {/* Header */}
        <header className="glass-panel" style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          marginBottom: '32px',
          borderRadius: '20px'
        }}>
          <div className="search-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px 20px',
            borderRadius: '12px',
            width: '400px',
            border: '1px solid var(--glass-border)'
          }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search clients, tasks, or documents..." 
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                outline: 'none',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button className="glass-card" style={{ padding: '10px', borderRadius: '12px' }}>
              <Bell size={20} />
            </button>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '14px',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>V</div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '13px', fontWeight: '600' }}>Vidyasagar Dhage</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Senior Partner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
          {activeTab === 'dashboard' && (
            <>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Firm Overview</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening in your practice today.</p>
              </div>

              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '24px',
                marginBottom: '32px' 
              }}>
                {dashboardStats.map((stat, i) => (
                  <div key={i} className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '16px', 
                        background: `rgba(${stat.color === 'var(--primary)' ? '99, 102, 241' : stat.color === 'var(--warning)' ? '245, 158, 11' : stat.color === 'var(--success)' ? '16, 185, 129' : '239, 68, 68'}, 0.15)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <stat.icon size={24} color={stat.color} />
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: stat.change.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        <TrendingUp size={16} />
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>{stat.label}</p>
                      <h2 style={{ fontSize: '28px' }}>{stat.value}</h2>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '20px' }}>Task Distribution & Efficiency</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}>Weekly</button>
                      <button style={{ padding: '6px 12px', background: 'var(--primary)', borderRadius: '8px', fontSize: '12px' }}>Monthly</button>
                    </div>
                  </div>
                  <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ color: 'white' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Upcoming Deadlines</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                      { title: 'GST Filing - Q3', date: '25th Apr', client: 'Reliance Ind.', status: 'Priority' },
                      { title: 'TDS Payment', date: '7th May', client: 'Various', status: 'Regular' },
                      { title: 'ITR Audit', date: '15th May', client: 'HDFC Bank', status: 'Priority' }
                    ].map((item, i) => (
                      <div key={i} style={{ 
                        padding: '16px', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '16px',
                        borderLeft: `4px solid ${item.status === 'Priority' ? 'var(--danger)' : 'var(--primary)'}`
                      }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{item.title}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.client}</span>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'clients' && <Clients />}
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'billing' && <Billing />}
          {(activeTab === 'whatsapp' || activeTab === 'inbox') && <Communication />}

          {['compliance', 'calendar', 'documents'].includes(activeTab) && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                background: 'rgba(255,255,255,0.03)', 
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
