import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Zap, 
  ShieldCheck, 
  MessageCircle, 
  BookOpen, 
  FileQuestion,
  ArrowRight,
  Headphones,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PractitionerSupport: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const supportCategories = [
    { title: 'Statutory Updates', icon: Zap, color: '#f59e0b', desc: 'Real-time alerts on GST and Income Tax law changes.' },
    { title: 'Technical Support', icon: Headphones, color: '#3b82f6', desc: 'Assistance with portal connectivity and software issues.' },
    { title: 'Knowledge Base', icon: BookOpen, color: '#8b5cf6', desc: 'Comprehensive library of statutory case studies.' },
    { title: 'AI Assistant', icon: Cpu, color: '#10b981', desc: 'AI-powered document analysis and query resolution.' }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="display-serif" style={{ fontSize: '42px', marginBottom: '8px' }}>Practitioner Support</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: '600' }}>AI-Powered Assistance for Modern Accounting Firms.</p>
        </div>
        <button className="premium-btn">
           <MessageCircle size={20} strokeWidth={3} /> Start Live Chat
        </button>
      </div>

      <div className="card" style={{ padding: '48px', textAlign: 'center', marginBottom: '48px', background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent), white' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '16px' }}>How can we assist your practice today?</h2>
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
            <Search size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
                type="text" 
                placeholder="Search for statutory circulars, portal help, or technical issues..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%', padding: '20px 20px 20px 60px', fontSize: '16px', borderRadius: '20px', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-sm)' }}
            />
            <button 
                onClick={() => { setIsSearching(true); setTimeout(() => setIsSearching(false), 2000); }}
                style={{ position: 'absolute', right: '10px', top: '10px', bottom: '10px', padding: '0 24px', background: 'var(--primary)', color: 'white', borderRadius: '12px' }}
            >
                {isSearching ? 'Analyzing...' : 'Search'}
            </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
        {supportCategories.map((cat, i) => (
            <motion.div 
                whileHover={{ y: -5 }}
                key={i} className="card" style={{ padding: '32px' }}
            >
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <cat.icon size={24} color={cat.color} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500', lineHeight: '1.6' }}>{cat.desc}</p>
                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-blue)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                    Explore <ArrowRight size={16} />
                </div>
            </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Trending Statutory Queries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                    'Applicability of Clause 44 in Tax Audit Report for FY 2023-24',
                    'Revised threshold limits for MSME payments under Sec 43B(h)',
                    'Common errors in GSTR-9/9C reconciliation for small taxpayers',
                    'Update on DSC token compatibility with new Income Tax portal'
                ].map((q, i) => (
                    <div key={i} style={{ padding: '20px', background: 'var(--background)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <FileQuestion size={18} color="var(--text-secondary)" />
                            <span style={{ fontWeight: '600', fontSize: '15px' }}>{q}</span>
                        </div>
                        <ArrowRight size={18} color="var(--text-secondary)" />
                    </div>
                ))}
            </div>
        </div>

        <div className="card" style={{ padding: '32px', background: 'var(--primary)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <ShieldCheck size={32} />
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '800' }}>Pro Practitioner Plan</h3>
            </div>
            <p style={{ fontSize: '15px', lineHeight: '1.7', opacity: 0.9, marginBottom: '24px' }}>
                Your firm is currently on the **Pro Plan**. You have priority access to our statutory research team and 24/7 technical assistance.
            </p>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Support Response Time</span>
                    <span style={{ fontSize: '13px', fontWeight: '800' }}>&lt; 15 mins</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                    <div style={{ width: '90%', height: '100%', background: 'white', borderRadius: '3px' }}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerSupport;
