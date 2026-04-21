import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Inbox, 
  FileText, 
  Settings,
  ShieldCheck,
  Zap,
  CreditCard,
  AlertCircle,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users, subItems: ['All Clients', 'Leads', 'Client Portal', 'DSC Manager'] },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, subItems: ['My Tasks', 'Team Tasks', 'Templates'] },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck, subItems: ['Deadlines', 'Calendar'] },
    { id: 'notices', label: 'Notices', icon: AlertCircle },
    { id: 'communications', label: 'Inbox', icon: MessageSquare, subItems: ['Mailbox', 'WhatsApp'] },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: Briefcase },
  ];

  const isActive = (id: string) => activeTab === id || activeTab.startsWith(`${id}:`);

  return (
    <div className="sidebar" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 20px',
      background: 'var(--sidebar-bg)',
      zIndex: 100,
      boxShadow: '4px 0 20px rgba(0,0,0,0.2)'
    }}>
      <div className="logo-section" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '48px',
        padding: '0 12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'var(--brand-blue)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(44, 127, 255, 0.5)'
        }}>
          <Zap size={20} color="white" strokeWidth={3} />
        </div>
        <span style={{
          fontSize: '20px',
          fontWeight: '900',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-1px',
          color: 'white'
        }}>Turia <span style={{ color: 'var(--brand-blue)' }}>Practice</span></span>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: isActive(item.id) ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                  background: isActive(item.id) ? 'rgba(44, 127, 255, 0.1)' : 'transparent',
                  border: isActive(item.id) ? '1px solid rgba(44, 127, 255, 0.2)' : '1px solid transparent',
                  fontSize: '14px',
                  fontWeight: isActive(item.id) ? '700' : '600',
                  textAlign: 'left',
                  transition: '0.2s'
                }}
                className="sidebar-btn"
              >
                <item.icon size={18} strokeWidth={isActive(item.id) ? 2.5 : 2} color={isActive(item.id) ? 'var(--brand-blue)' : 'var(--sidebar-text)'} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
              
              <AnimatePresence>
                {item.subItems && isActive(item.id) && (
                  <ul style={{ listStyle: 'none', paddingLeft: '44px', marginTop: '4px', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {item.subItems.map(sub => {
                        const subId = `${item.id}:${sub.toLowerCase().replace(' ', '_')}`;
                        const isSubActive = activeTab === subId;
                        return (
                            <li key={sub}>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveTab(subId); }}
                                    style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '6px 0',
                                    fontSize: '13px',
                                    color: isSubActive ? 'white' : 'var(--sidebar-text)',
                                    background: 'transparent',
                                    border: 'none',
                                    fontWeight: isSubActive ? '800' : '500',
                                    opacity: isSubActive ? 1 : 0.7,
                                    transition: '0.2s'
                                    }}
                                >
                                    {sub}
                                </button>
                            </li>
                        );
                    })}
                  </ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bottom-section" style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          color: 'var(--sidebar-text)',
          background: 'transparent',
          fontSize: '14px',
          fontWeight: '700'
        }} className="sidebar-btn">
          <Settings size={18} />
          Settings
        </button>
      </div>

      <style>{`
        .sidebar-btn:hover {
            color: white !important;
            background: rgba(255, 255, 255, 0.05) !important;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const AnimatePresence: React.FC<{children: React.ReactNode}> = ({children}) => <>{children}</>;

export default Sidebar;
