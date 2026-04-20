import React from 'react';
import { FileText, Download } from 'lucide-react';

const invoices = [
  { id: 'INV-2024-001', client: 'Reliance Industries', amount: '₹1,25,000', date: '15 Apr 2024', status: 'Paid' },
  { id: 'INV-2024-002', client: 'HDFC Bank', amount: '₹85,000', date: '18 Apr 2024', status: 'Pending' },
  { id: 'INV-2024-003', client: 'Tata Consultancy', amount: '₹45,000', date: '20 Apr 2024', status: 'Overdue' },
];

const Billing: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Billing & Invoicing</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Automate your professional fees and track payments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', borderLeft: '4px solid var(--success)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Total Collected (MTD)</p>
          <h2 style={{ fontSize: '28px', color: 'var(--success)' }}>₹12.5L</h2>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', borderLeft: '4px solid var(--warning)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Pending Invoices</p>
          <h2 style={{ fontSize: '28px', color: 'var(--warning)' }}>₹4.2L</h2>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', borderLeft: '4px solid var(--danger)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Overdue Payments</p>
          <h2 style={{ fontSize: '28px', color: 'var(--danger)' }}>₹1.8L</h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px' }}>Recent Invoices</h3>
          <button style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '14px' }}>View All Invoices</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {invoices.map((inv) => (
            <div key={inv.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '16px 20px', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '16px',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '15px' }}>{inv.id}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{inv.client} • {inv.date}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <span style={{ fontWeight: '700', fontSize: '16px' }}>{inv.amount}</span>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  background: inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: inv.status === 'Paid' ? 'var(--success)' : 'var(--warning)',
                  border: `1px solid ${inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                }}>{inv.status}</span>
                <button style={{ color: 'var(--text-secondary)' }}><Download size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Billing;
