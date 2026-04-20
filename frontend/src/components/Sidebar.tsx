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
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'tasks', label: 'Tasks & Workflow', icon: CheckSquare },
    { id: 'compliance', label: 'Compliance Hub', icon: ShieldCheck },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'whatsapp', label: 'WhatsApp Automation', icon: MessageSquare },
    { id: 'inbox', label: 'Unified Inbox', icon: Inbox },
    { id: 'documents', label: 'Files', icon: FileText },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
  ];

  return (
    <div className="sidebar glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: 'calc(100vh - 40px)',
      position: 'fixed',
      left: '20px',
      top: '20px',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      zIndex: 100
    }}>
      <div className="logo-section" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
        padding: '0 8px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
        }}>
          <Zap size={24} color="white" />
        </div>
        <span style={{
          fontSize: '22px',
          fontWeight: '700',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.5px'
        }}>Turia <span style={{ color: 'var(--primary)' }}>Practice</span></span>
      </div>

      <nav style={{ flex: 1 }}>
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
                  color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                  background: activeTab === item.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: activeTab === item.id ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  fontSize: '14px',
                  fontWeight: activeTab === item.id ? '600' : '400',
                  textAlign: 'left'
                }}
              >
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bottom-section" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
        <button style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          color: 'var(--text-secondary)',
          background: 'transparent',
          fontSize: '14px'
        }}>
          <Settings size={20} />
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
