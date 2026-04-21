import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  CreditCard, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2,
  FileText,
  X,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Invoice {
  id: number;
  invoice_no: string;
  client: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, invoice_no: 'INV-24-001', client: 'Reliance Industries', amount: 15000, date: '2024-04-01', status: 'Paid' },
    { id: 2, invoice_no: 'INV-24-002', client: 'Tata Consultancy Services', amount: 25000, date: '2024-04-05', status: 'Unpaid' },
    { id: 3, invoice_no: 'INV-24-003', client: 'Zomato Ltd', amount: 8000, date: '2024-03-20', status: 'Overdue' },
  ]);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  return (
    <div className="animate-fade-in" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Billing & Invoices</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage practice revenue, client retainers, and GST-compliant invoicing.</p>
        </div>
        <button onClick={() => setShowInvoiceModal(true)} className="premium-btn" style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600'
        }}>
          <Plus size={20} />
          Create New Invoice
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Receivables</p>
            <h3 style={{ fontSize: '28px', fontWeight: '800' }}>₹2,48,500</h3>
            <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px' }}>₹42,000 Overdue</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Collected (MTD)</p>
            <h3 style={{ fontSize: '28px', fontWeight: '800' }}>₹1,12,000</h3>
            <p style={{ fontSize: '12px', color: 'var(--success)', marginTop: '8px' }}>↑ 14% vs last month</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Pending Invoices</p>
            <h3 style={{ fontSize: '28px', fontWeight: '800' }}>14</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>Avg. payment time: 8 days</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontWeight: '800' }}>Recent Transactions</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ background: 'var(--background)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '8px 16px' }}>
                    <Download size={16} /> Export
                </button>
            </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Invoice No</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(inv => (
                        <tr key={inv.id} className="row-hover">
                            <td><span style={{ fontWeight: '700' }}>{inv.invoice_no}</span></td>
                            <td>{inv.client}</td>
                            <td>₹{inv.amount.toLocaleString()}</td>
                            <td>{inv.date}</td>
                            <td>
                                <span style={{ 
                                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                    background: inv.status === 'Paid' ? 'rgba(34, 197, 94, 0.1)' : inv.status === 'Overdue' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: inv.status === 'Paid' ? 'var(--success)' : inv.status === 'Overdue' ? 'var(--danger)' : 'var(--warning)'
                                }}>
                                    {inv.status}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{ padding: '6px', background: 'transparent', color: 'var(--text-secondary)' }}><Printer size={16} /></button>
                                    <button style={{ padding: '6px', background: 'transparent', color: 'var(--text-secondary)' }}><Download size={16} /></button>
                                    <button style={{ padding: '6px', background: 'transparent', color: 'var(--text-secondary)' }}><MoreVertical size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <AnimatePresence>
        {showInvoiceModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '600px', padding: 0 }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontWeight: '800' }}>Generate GST Invoice</h3>
                        <button onClick={() => setShowInvoiceModal(false)}><X size={20} /></button>
                    </div>
                    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Select Client</label>
                            <select style={{ width: '100%', background: 'var(--background)' }}>
                                <option>Reliance Industries</option>
                                <option>Tata Consultancy Services</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Service Type</label>
                                <select style={{ width: '100%', background: 'var(--background)' }}>
                                    <option>Audit Fees</option>
                                    <option>GST Filing</option>
                                    <option>IT Consultation</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Professional Fees</label>
                                <input type="number" placeholder="₹ 0.00" style={{ width: '100%', background: 'var(--background)' }} />
                            </div>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                <span>CGST (9%)</span>
                                <span style={{ fontWeight: '700' }}>₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                                <span>SGST (9%)</span>
                                <span style={{ fontWeight: '700' }}>₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '15px', fontWeight: '800' }}>
                                <span>Total Amount</span>
                                <span style={{ color: 'var(--primary)' }}>₹ 0.00</span>
                            </div>
                        </div>
                        <button style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', fontWeight: '700' }}>Generate & Send to Client</button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Billing;
