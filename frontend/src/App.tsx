import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Communication from './pages/Communication';
import Billing from './pages/Billing';
import MailBox from './pages/MailBox';
import Documents from './pages/Documents';
import DSCManager from './pages/DSCManager';
import Notices from './pages/Notices';
import Team from './pages/Team';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { 
  Bell, 
  Settings,
  Building2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE_URL } from './api';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orgName, setOrgName] = useState(localStorage.getItem('orgName') || 'Turia Practice Solutions');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      const data = await response.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogin = (name: string) => {
    setOrgName(name);
    localStorage.setItem('orgName', name);
    setIsAuthenticated(true);
  };

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <LoginPage onLogin={handleLogin} />
      </ErrorBoundary>
    );
  }



  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'clients':
      case 'clients:all_clients': return <Clients />;
      case 'clients:dsc_manager': return <DSCManager />;
      case 'tasks':
      case 'tasks:team_tasks': return <Tasks />;
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
    <ErrorBoundary>
      <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--app-bg)' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main style={{ 
          marginLeft: 'var(--sidebar-width)', 
          flex: 1, 
          padding: '40px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '1400px' }}>
          {/* Top Navigation Bar */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ padding: '12px', background: 'var(--surface)', borderRadius: '16px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <Building2 size={24} color="var(--primary)" />
               </div>
               <div>
                  <h1 className="display-serif" style={{ fontSize: '24px', fontWeight: '800', margin: 0, lineHeight: 1.2 }}>{orgName}</h1>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrator Console</p>
               </div>
            </div>
  
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ background: 'var(--surface)', border: 'none', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', position: 'relative' }}
                >
                  <Bell size={20} color="var(--primary)" />
                  <div style={{ position: 'absolute', top: '12px', right: '14px', width: '6px', height: '6px', background: 'var(--danger)', borderRadius: '50%' }} />
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
  
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 24px', background: 'var(--surface)', borderRadius: '24px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)', marginBottom: '2px' }}>Vidyasagar Dhage</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>Managing Partner</p>
                </div>
              </div>
            </div>
          </header>
  
          {/* Dynamic Content View */}
          <div style={{ minHeight: 'calc(100vh - 200px)' }}>
            {renderContent()}
          </div>
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
    </ErrorBoundary>
  );
}

export default App;
