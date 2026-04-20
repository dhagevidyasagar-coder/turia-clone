import React from 'react';
import { Search, Filter, Plus, User, Mail, Phone, MapPin, MoreVertical } from 'lucide-react';

const clientsData = [
  { id: 1, name: 'Reliance Industries', category: 'Platinum', email: 'contact@reliance.com', phone: '+91 98273 12345', location: 'Mumbai', status: 'Active' },
  { id: 2, name: 'Tata Consultancy Services', category: 'Gold', email: 'support@tcs.com', phone: '+91 91234 56789', location: 'Pune', status: 'Active' },
  { id: 3, name: 'HDFC Bank', category: 'Platinum', email: 'info@hdfc.com', phone: '+91 99887 76655', location: 'Mumbai', status: 'Review' },
  { id: 4, name: 'Zomato Ltd', category: 'Silver', email: 'tax@zomato.com', phone: '+91 88776 65544', location: 'Gurugram', status: 'Active' },
  { id: 5, name: 'Byjus', category: 'Gold', email: 'accounts@byjus.com', phone: '+91 77665 54433', location: 'Bengaluru', status: 'Overdue' },
];

const Clients: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Client Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your client relationships and compliance documents.</p>
        </div>
        <button style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}>
          <Plus size={20} />
          Add New Client
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            background: 'rgba(255,255,255,0.05)', 
            padding: '10px 20px', 
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
          }}>
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" placeholder="Search by name, PAN, or GSTIN..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
          </div>
          <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', fontSize: '14px', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px' }}>Client Name</th>
                <th style={{ padding: '16px' }}>Category</th>
                <th style={{ padding: '16px' }}>Contact Info</th>
                <th style={{ padding: '16px' }}>Location</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}></th>
              </tr>
            </thead>
            <tbody>
              {clientsData.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="hover-row">
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '10px', 
                        background: 'rgba(255,255,255,0.05)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: '600'
                      }}>
                        {client.name[0]}
                      </div>
                      <span style={{ fontWeight: '500' }}>{client.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      background: `rgba(${client.category === 'Platinum' ? '139, 92, 246' : client.category === 'Gold' ? '245, 158, 11' : '148, 163, 184'}, 0.15)`,
                      color: client.category === 'Platinum' ? '#c084fc' : client.category === 'Gold' ? '#fbbf24' : '#94a3b8',
                      border: `1px solid rgba(${client.category === 'Platinum' ? '139, 92, 246' : client.category === 'Gold' ? '245, 158, 11' : '148, 163, 184'}, 0.3)`
                    }}>
                      {client.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <Mail size={14} /> {client.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <Phone size={14} /> {client.phone}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <MapPin size={14} color="var(--text-secondary)" /> {client.location}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '13px',
                      color: client.status === 'Active' ? 'var(--success)' : client.status === 'Review' ? 'var(--warning)' : 'var(--danger)'
                    }}>
                      <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: client.status === 'Active' ? 'var(--success)' : client.status === 'Review' ? 'var(--warning)' : 'var(--danger)' 
                      }} />
                      {client.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{ color: 'var(--text-secondary)' }}><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .hover-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
};

export default Clients;
