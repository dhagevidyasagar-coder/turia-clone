import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock, 
  Building2,
  Users,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginPageProps {
  onLogin: (orgName: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [orgStep, setOrgStep] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    orgName: 'Turia Practice Solutions',
    firmType: 'Proprietorship',
    partnerName: 'Vidyasagar Dhage'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgStep && !isLogin) {
      setOrgStep(true);
    } else {
      // Simulate Auth
      onLogin(formData.orgName);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.15), transparent), #0a0b10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card" 
        style={{ width: '100%', maxWidth: '480px', padding: '48px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
          }}>
            <Zap size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>
            {orgStep ? 'Set up your Firm' : (isLogin ? 'Welcome Back' : 'Create Practitioner Account')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            {orgStep ? 'Configure your organization profile to start' : 'Turia Practice OS: High-Fidelity Firm Management'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!orgStep ? (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="email" required placeholder="name@firm.com" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', paddingLeft: '44px', background: 'var(--background)' }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Secure Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="password" required placeholder="••••••••" 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    style={{ width: '100%', paddingLeft: '44px', background: 'var(--background)' }} 
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Legal Firm Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" required placeholder="e.g. Acme Associates" 
                    value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})}
                    style={{ width: '100%', paddingLeft: '44px', background: 'var(--background)' }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Entity Type</label>
                <select 
                  value={formData.firmType} onChange={e => setFormData({...formData, firmType: e.target.value})}
                  style={{ width: '100%', background: 'var(--background)' }}
                >
                  <option>Partnership Firm</option>
                  <option>Proprietorship</option>
                  <option>LLP</option>
                  <option>Private Ltd</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" style={{ 
            marginTop: '12px', padding: '16px', background: 'var(--primary)', color: 'white', fontWeight: '700', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
          }}>
            {orgStep ? 'Launch Firm OS' : (isLogin ? 'Sign In' : 'Continue')} <ArrowRight size={18} />
          </button>
        </form>

        {!orgStep && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'transparent', color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        )}

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={14} /> ISO 27001 Certified
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Globe size={14} /> Multi-region Support
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
