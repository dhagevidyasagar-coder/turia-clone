import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Send, 
  Archive, 
  Trash2, 
  Star, 
  Plus, 
  X, 
  Paperclip,
  Reply,
  Forward
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../api';

interface Email {
  id: number;
  sender: string;
  subject: string;
  body: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isSent?: boolean;
  category: 'Statutory' | 'Client' | 'Priority' | 'System';
}

const MailBox: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ recipient: '', subject: '', message: '' });
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/emails`);
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const updateEmailStatus = async (id: number, updates: any) => {
    try {
      await fetch(`${API_BASE_URL}/emails/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      fetchEmails();
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const getFilteredEmails = () => {
    let filtered = [...emails];
    
    if (activeFolder === 'inbox') filtered = filtered.filter(e => !e.isArchived && !e.isDeleted && !e.isSent);
    else if (activeFolder === 'starred') filtered = filtered.filter(e => e.isStarred && !e.isDeleted);
    else if (activeFolder === 'sent') filtered = filtered.filter(e => e.isSent);
    else if (activeFolder === 'archive') filtered = filtered.filter(e => e.isArchived && !e.isDeleted);
    else if (activeFolder === 'trash') filtered = filtered.filter(e => e.isDeleted);

    if (searchTerm) {
        filtered = filtered.filter(e => 
            e.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
            e.sender.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return filtered;
  };

  const toggleStar = (id: number, current: boolean) => {
    updateEmailStatus(id, { is_starred: !current });
  };

  const moveToArchive = (id: number) => {
    updateEmailStatus(id, { is_archived: true, is_deleted: false });
    setSelectedEmail(null);
  };

  const moveToDelete = (id: number) => {
    updateEmailStatus(id, { is_deleted: true, is_archived: false });
    setSelectedEmail(null);
  };

  const handleReply = () => {
    if (!selectedEmail) return;
    setComposeData({
      recipient: selectedEmail.sender,
      subject: selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
      message: `\n\n\n--- Original Message ---\nFrom: ${selectedEmail.sender}\nDate: ${selectedEmail.time}\n\n${selectedEmail.body}`
    });
    setShowCompose(true);
  };

  const handleForward = () => {
    if (!selectedEmail) return;
    setComposeData({
      recipient: '',
      subject: selectedEmail.subject.startsWith('Fwd:') ? selectedEmail.subject : `Fwd: ${selectedEmail.subject}`,
      message: `\n\n\n--- Forwarded Message ---\nFrom: ${selectedEmail.sender}\nDate: ${selectedEmail.time}\n\n${selectedEmail.body}`
    });
    setShowCompose(true);
  };

  const openNewCompose = () => {
    setComposeData({ recipient: '', subject: '', message: '' });
    setShowCompose(true);
  };

  const handleCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch(`${API_BASE_URL}/emails`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setShowCompose(false);
        fetchEmails();
        setActiveFolder('sent');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      {/* Mailbox Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>VA CA firm application</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Account: <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>dhagevidyasagarr@gmail.com</span></p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={openNewCompose}
            className="premium-btn"
          >
            <Plus size={18} strokeWidth={3} /> Compose
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        {/* Navigation Sidebar */}
        <div className="card" style={{ padding: '16px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {folders.map(folder => {
            const count = emails.filter(e => {
                if (folder.id === 'inbox') return !e.isArchived && !e.isDeleted && !e.isSent && !e.isRead;
                if (folder.id === 'starred') return e.isStarred && !e.isDeleted;
                return false;
            }).length;
            
            return (
              <button
                key={folder.id}
                onClick={() => { setActiveFolder(folder.id); setSelectedEmail(null); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px',
                  background: activeFolder === folder.id ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  color: activeFolder === folder.id ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer', transition: '0.2s', fontWeight: '700'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <folder.icon size={18} color={activeFolder === folder.id ? 'var(--primary)' : 'var(--text-secondary)'} />
                  <span>{folder.label}</span>
                </div>
                {count > 0 && (
                  <span style={{ fontSize: '11px', background: activeFolder === folder.id ? 'var(--primary)' : 'var(--background)', color: activeFolder === folder.id ? 'white' : 'var(--text-secondary)', padding: '2px 8px', borderRadius: '10px' }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Email Content */}
        <div className="card" style={{ padding: 0, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedEmail ? (
            <>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--background)' }}>
                <div></div>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                {getFilteredEmails().length > 0 ? getFilteredEmails().map(email => (
                  <div 
                    key={email.id} onClick={() => setSelectedEmail(email)}
                    style={{ 
                      padding: '20px 24px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                      background: email.isRead ? 'transparent' : 'rgba(37, 99, 235, 0.03)',
                      display: 'grid', gridTemplateColumns: 'min-content 200px 1fr min-content', alignItems: 'center', gap: '24px'
                    }}
                    className="email-row"
                  >
                    <div onClick={(e) => { e.stopPropagation(); toggleStar(email.id, email.isStarred); }} style={{ color: email.isStarred ? 'var(--warning)' : 'var(--text-secondary)' }}>
                      <Star size={18} fill={email.isStarred ? 'var(--warning)' : 'none'} strokeWidth={email.isStarred ? 0 : 2} />
                    </div>
                    <span style={{ fontWeight: email.isRead ? '500' : '800', fontSize: '15px' }}>{email.sender}</span>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: email.isRead ? '600' : '800', fontSize: '15px', color: 'var(--text-primary)' }}>{email.subject}</span>
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '8px' }}> - {email.body}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{email.time}</span>
                  </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)', fontWeight: '600' }}>No messages found in {activeFolder}.</div>
                )}
              </div>
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--background)' }}>
                <button onClick={() => setSelectedEmail(null)} style={{ background: 'white', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', fontWeight: '700' }}>← Back to Inbox</button>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => moveToArchive(selectedEmail.id)} style={{background: 'transparent', padding: 4}} className="hover-icon"><Archive size={20} /></button>
                  <button onClick={() => moveToDelete(selectedEmail.id)} style={{background: 'transparent', padding: 4}} className="hover-icon"><Trash2 size={20} /></button>
                </div>
              </div>
              <div style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
                <h2 style={{ fontSize: '26px', marginBottom: '24px', fontWeight: '800' }}>{selectedEmail.subject}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px', padding: '20px', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>{selectedEmail.sender[0]}</div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '800', fontSize: '16px' }}>{selectedEmail.sender}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>to: dhagevidyasagarr@gmail.com</p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>{selectedEmail.time}</span>
                </div>
                <div style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
                    {selectedEmail.body}
                </div>
                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <button onClick={handleReply} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: '700', color: 'var(--text-primary)' }} className="hover-action">
                        <Reply size={18} /> Reply
                    </button>
                    <button onClick={handleForward} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: '700', color: 'var(--text-primary)' }} className="hover-action">
                        <Forward size={18} /> Forward
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '40px' }}>
            <motion.div 
                initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                className="card" 
                style={{ width: '550px', height: '650px', borderRadius: '24px', display: 'flex', flexDirection: 'column', padding: 0, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
                <div style={{ padding: '24px', background: 'var(--primary)', color: 'white', borderRadius: '24px 24px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>New Message</h4>
                    <button onClick={() => setShowCompose(false)} style={{ color: 'white', background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleCompose} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', gap: '20px' }}>
                    <input name="recipient" required type="text" placeholder="To: Client or Statutory Portal" defaultValue={composeData.recipient} style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)' }} />
                    <input name="subject" required type="text" placeholder="Subject Line" defaultValue={composeData.subject} style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)' }} />
                    <textarea name="body" required placeholder="Draft your professional communication..." defaultValue={composeData.message} style={{ flex: 1, background: 'var(--background)', border: '1px solid var(--border)', resize: 'none', padding: '16px', borderRadius: '12px' }}></textarea>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="file" name="attachments" multiple style={{ fontSize: '13px' }} />
                    </div>

                    <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', margin: 0 }}>
                            ✨ <strong>Pro-Tip:</strong> Your professional firm signature and statutory disclaimer will be automatically attached to this email.
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)' }}>
                            <button type="button" style={{background: 'transparent', color: 'var(--text-secondary)'}}><Paperclip size={20} /></button>
                        </div>
                        <button type="submit" style={{ padding: '12px 36px' }}>Send Communication</button>
                    </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .email-row:hover { background: rgba(37, 99, 235, 0.02) !important; transition: 0.2s; }
        .hover-icon:hover { color: var(--primary) !important; cursor: pointer; transition: 0.2s; }
      `}</style>
    </div>
  );
};

export default MailBox;
