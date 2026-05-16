import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  CheckCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../api';

interface Chat {
  id: number;
  name: string;
  company: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  status: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  type: 'sent' | 'received' | 'system';
}

const Communication: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
    
    const eventSource = new EventSource(`${API_BASE_URL}/messages/stream`);

    eventSource.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);
        // Only append if it belongs to the selected chat and is NOT from me (to avoid duplicates since I fetch after sending)
        // Or better yet, just re-fetch messages to ensure order and state
        if (selectedChat?.id === newMessage.client_id) {
          fetchMessages();
        }
      } catch (err) {
        console.error('SSE Error parsing data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [selectedChat?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchInitialData = async () => {
    try {
      const clientRes = await fetch(`${API_BASE_URL}/clients`);
      const clients = await clientRes.json();
      
      const formattedChats: Chat[] = clients.map((c: any) => ({
        id: c.id,
        name: c.auditor || 'Client Contact',
        company: c.name,
        lastMessage: 'Tap to start conversation',
        time: 'Now',
        unread: 0,
        avatar: c.name[0],
        status: c.status
      }));

      setChats(formattedChats);
      if (formattedChats.length > 0 && !selectedChat) {
        setSelectedChat(formattedChats[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const response = await fetch(`${API_BASE_URL}/messages?client_id=${selectedChat.id}`);
      const data = await response.json();
      
      const formattedMsgs: Message[] = data.map((m: any) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        time: m.timestamp,
        type: m.type as any
      }));

      // Add a system welcome message if no messages exist
      if (formattedMsgs.length === 0) {
        formattedMsgs.push({
          id: 0,
          sender: 'System',
          text: `WhatsApp Business API active for ${selectedChat.company}. All communications are encrypted.`,
          time: 'System',
          type: 'system'
        });
      }

      setMessages(formattedMsgs);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const msgData = {
      client_id: selectedChat.id,
      text: newMessage,
      sender: 'Vidyasagar',
      type: 'sent'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 200px)', display: 'flex', gap: '24px' }}>
      {/* Chat List */}
      <div className="card" style={{ width: '400px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>WhatsApp Inbox</h2>
            <div style={{ padding: '4px 12px', background: 'var(--success)15', color: 'var(--success)', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>ONLINE</div>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              style={{ width: '100%', padding: '12px 12px 12px 48px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }} 
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Decrypting messages...</div>
          ) : chats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat)}
              style={{ 
                padding: '20px 24px', 
                display: 'flex', 
                gap: '16px', 
                cursor: 'pointer',
                background: selectedChat?.id === chat.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                borderLeft: `4px solid ${selectedChat?.id === chat.id ? 'var(--primary)' : 'transparent'}`,
                transition: '0.2s',
                borderBottom: '1px solid var(--border)'
              }}
              className="chat-row-hover"
            >
              <div style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '18px',
                color: 'white',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}>
                {chat.avatar}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{chat.company}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>{chat.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '4px', fontWeight: '700' }}>{chat.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {selectedChat ? (
          <>
            <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '14px', 
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: 'white'
                }}>{selectedChat.avatar}</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{selectedChat.company}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                    <p style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>
                      WhatsApp Business API Active
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ padding: '10px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}><Phone size={20} /></button>
                <button style={{ padding: '10px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}><Video size={20} /></button>
                <button style={{ padding: '10px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}><MoreVertical size={20} /></button>
              </div>
            </div>

            <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }} className="hide-scrollbar">
              {messages.map((msg, index) => (
                <div key={index} style={{ 
                  alignSelf: msg.type === 'sent' ? 'flex-end' : (msg.type === 'system' ? 'center' : 'flex-start'),
                  maxWidth: msg.type === 'system' ? '100%' : '70%'
                }}>
                  {msg.type === 'system' ? (
                    <div style={{ padding: '8px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--border)', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', textAlign: 'center' }}>
                      <Zap size={14} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                      {msg.text}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      style={{ 
                        padding: '16px 20px', 
                        borderRadius: msg.type === 'sent' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        background: msg.type === 'sent' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                        boxShadow: msg.type === 'sent' ? '0 10px 20px rgba(99, 102, 241, 0.2)' : 'none',
                        color: 'white',
                        border: msg.type === 'sent' ? 'none' : '1px solid var(--border)'
                      }}>
                      <p style={{ fontSize: '15px', lineHeight: '1.5', fontWeight: '500' }}>{msg.text}</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <span style={{ fontSize: '10px', opacity: 0.7, fontWeight: '700' }}>{msg.time}</span>
                        {msg.type === 'sent' && <CheckCheck size={14} opacity={0.7} />}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '32px', borderTop: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.01)' }}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button type="button" style={{ color: 'var(--text-secondary)', background: 'transparent' }}><Paperclip size={22} /></button>
                <div style={{ 
                  flex: 1, 
                  background: 'var(--background)', 
                  borderRadius: '16px', 
                  padding: '4px 8px 4px 20px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message to client..." 
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', padding: '12px 0', fontSize: '15px', fontWeight: '500' }} 
                  />
                  <button type="button" style={{ color: 'var(--text-secondary)', background: 'transparent' }}><Smile size={22} /></button>
                </div>
                <button type="submit" style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '16px', 
                  background: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
                  transition: '0.2s'
                }} className="send-btn">
                  <Send size={22} color="white" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <MessageSquare size={64} opacity={0.1} style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Select a client conversation</h3>
            <p style={{ fontSize: '14px' }}>Unified firm communication via WhatsApp API</p>
          </div>
        )}
      </div>

      <style>{`
        .chat-row-hover:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .send-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Communication;
