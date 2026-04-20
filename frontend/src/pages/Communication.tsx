import React from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  CheckCheck
} from 'lucide-react';

const chats = [
  { id: 1, name: 'Anil Agarwal', company: 'Reliance', lastMessage: 'Please share the GST filed acknowledgment.', time: '10:30 AM', unread: 2, avatar: 'A' },
  { id: 2, name: 'Sanjay Gupta', company: 'Tata Projects', lastMessage: 'DSC is expiring next week.', time: '09:45 AM', unread: 0, avatar: 'S' },
  { id: 3, name: 'Priya Sharma', company: 'Zomato', lastMessage: 'Payment link sent for Q4 audit fee.', time: 'Yesterday', unread: 0, avatar: 'P' },
  { id: 4, name: 'Karan Mehra', company: 'HDFC', lastMessage: 'Documents uploaded to portal.', time: 'Yesterday', unread: 0, avatar: 'K' },
];

const messages = [
  { id: 1, sender: 'Priya', text: 'Hello, need help with the TDS notice we received today.', time: '11:15 AM', type: 'received' },
  { id: 2, sender: 'System', text: 'Automated Response: Hi Priya, we have received the notice. Our team will review it shortly.', time: '11:16 AM', type: 'system' },
  { id: 3, sender: 'Vidyasagar', text: 'Hi Priya, I am looking into it. Please share the scanned copy of the notice.', time: '11:20 AM', type: 'sent' },
];

const Communication: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - var(--header-height) - 100px)', display: 'flex', gap: '24px' }}>
      {/* Chat List */}
      <div className="glass-panel" style={{ width: '380px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Shared Team Inbox</h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            background: 'rgba(255,255,255,0.05)', 
            padding: '10px 16px', 
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input type="text" placeholder="Search chats..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map((chat) => (
            <div key={chat.id} style={{ 
              padding: '20px 24px', 
              display: 'flex', 
              gap: '12px', 
              cursor: 'pointer',
              background: chat.id === 1 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              borderBottom: '1px solid rgba(255,255,255,0.02)'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {chat.avatar}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{chat.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{chat.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '4px' }}>{chat.company}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span style={{ 
                      background: 'var(--primary)', 
                      color: 'white', 
                      fontSize: '10px', 
                      fontWeight: 'bold', 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>A</div>
            <div>
              <h3 style={{ fontSize: '17px' }}>Anil Agarwal</h3>
              <p style={{ fontSize: '12px', color: 'var(--success)' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginRight: '6px' }}></span>
                WhatsApp Business API Active
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="glass-card" style={{ padding: '10px' }}><Phone size={18} /></button>
            <button className="glass-card" style={{ padding: '10px' }}><Video size={18} /></button>
            <button className="glass-card" style={{ padding: '10px' }}><MoreVertical size={18} /></button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ 
              alignSelf: msg.type === 'sent' ? 'flex-end' : 'flex-start',
              maxWidth: '70%'
            }}>
              <div style={{ 
                padding: '12px 16px', 
                borderRadius: msg.type === 'sent' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.type === 'sent' ? 'var(--primary)' : msg.type === 'system' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                border: msg.type === 'system' ? '1px dashed rgba(255,255,255,0.2)' : 'none',
                color: 'white',
              }}>
                <p style={{ fontSize: '14px' }}>{msg.text}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>{msg.time}</span>
                  {msg.type === 'sent' && <CheckCheck size={14} opacity={0.7} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button style={{ color: 'var(--text-secondary)' }}><Paperclip size={20} /></button>
          <div style={{ 
            flex: 1, 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '12px 20px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input 
              type="text" 
              placeholder="Type your message or use templates (Shift + /)..." 
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '14px' }} 
            />
            <button style={{ color: 'var(--text-secondary)' }}><Smile size={20} /></button>
          </div>
          <button style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Communication;
