import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock, 
  Building2,
  Globe,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE_URL } from '../api';

interface LoginPageProps {
  onLogin: (orgName: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [orgStep, setOrgStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    orgName: 'VA CA firm application',
    firmType: 'Partnership Firm'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgStep && !isLogin) {
      setOrgStep(true);
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.email, 
          password: formData.password 
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        onLogin(formData.orgName);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Auth error', err);
      setError('Connection failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradientBG 15s ease infinite',
      fontFamily: 'var(--font-ui)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.4)'
            }}
          >
            <Sparkles size={32} color="white" />
          </motion.div>
          
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #1e293b, #475569)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px', 
            letterSpacing: '-0.03em' 
          }}>
            {orgStep ? 'Setup Workspace' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '500' }}>
            {orgStep ? 'Initialize your Turia Practice instance' : 'Enter your credentials to access the OS'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AnimatePresence mode="wait">
            {!orgStep ? (
              <motion.div 
                key="auth-step"
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                  <div className="group" style={{ position: 'relative' }}>
                    <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', transition: 'color 0.2s' }} />
                    <input 
                      type="email" required placeholder="name@firm.com" 
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      style={{ 
                        width: '100%', padding: '16px 16px 16px 48px', 
                        background: 'rgba(255, 255, 255, 0.9)', 
                        border: '2px solid transparent', 
                        borderRadius: '16px',
                        fontSize: '16px', color: '#0f172a', transition: 'all 0.3s',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)'
                      }} 
                      onFocus={(e) => { 
                        e.target.style.background = '#ffffff';
                        e.target.style.borderColor = '#8b5cf6'; 
                        e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.15)'; 
                      }}
                      onBlur={(e) => { 
                        e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.target.style.borderColor = 'transparent'; 
                        e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; 
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                    {isLogin && <span style={{ fontSize: '13px', color: '#8b5cf6', cursor: 'pointer', fontWeight: '700', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'} onMouseLeave={e => e.currentTarget.style.color = '#8b5cf6'}>Recovery?</span>}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="password" required placeholder="••••••••" 
                      value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                      style={{ 
                        width: '100%', padding: '16px 16px 16px 48px', 
                        background: 'rgba(255, 255, 255, 0.9)', 
                        border: '2px solid transparent', 
                        borderRadius: '16px',
                        fontSize: '16px', color: '#0f172a', transition: 'all 0.3s',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)'
                      }} 
                      onFocus={(e) => { 
                        e.target.style.background = '#ffffff';
                        e.target.style.borderColor = '#8b5cf6'; 
                        e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.15)'; 
                      }}
                      onBlur={(e) => { 
                        e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.target.style.borderColor = 'transparent'; 
                        e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; 
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="org-step"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal Firm Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="text" required placeholder="e.g. Acme Associates" 
                      value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})}
                      style={{ 
                        width: '100%', padding: '16px 16px 16px 48px', 
                        background: 'rgba(255, 255, 255, 0.9)', 
                        border: '2px solid transparent', 
                        borderRadius: '16px',
                        fontSize: '16px', color: '#0f172a', transition: 'all 0.3s',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                      }} 
                      onFocus={(e) => { e.target.style.borderColor = '#ec4899'; e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entity Type</label>
                  <select 
                    value={formData.firmType} onChange={e => setFormData({...formData, firmType: e.target.value})}
                    style={{ 
                      width: '100%', padding: '16px', 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      border: '2px solid transparent', 
                      borderRadius: '16px',
                      fontSize: '16px', color: '#0f172a', transition: 'all 0.3s', cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      appearance: 'none'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#ec4899'; e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
                  >
                    <option>Partnership Firm</option>
                    <option>Proprietorship</option>
                    <option>LLP</option>
                    <option>Private Ltd</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ 
                background: '#fee2e2', 
                color: '#b91c1c', 
                padding: '12px', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '600',
                textAlign: 'center',
                border: '1px solid #fecaca'
              }}
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.02, y: -2 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            style={{ 
              marginTop: '12px', padding: '18px', 
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #9333ea, #db2777)', 
              color: 'white', 
              fontWeight: '800', fontSize: '16px', letterSpacing: '0.02em', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(147, 51, 234, 0.5)'
            }}
          >
            {loading ? 'Authenticating...' : (orgStep ? 'Launch Workspace' : (isLogin ? 'Authenticate' : 'Create Account'))}
            {!loading && (orgStep ? <ArrowRight size={20} /> : <Fingerprint size={20} />)}
          </motion.button>
        </form>

        {!orgStep && (
          <div style={{ marginTop: '36px', textAlign: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>
              {isLogin ? "New to Turia? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                background: 'none', border: 'none', color: '#4f46e5', 
                fontSize: '15px', fontWeight: '800', cursor: 'pointer', padding: '4px 8px',
                transition: 'all 0.2s', borderRadius: '6px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        )}

        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '32px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
            <ShieldCheck size={18} color="#10b981" /> 256-bit Encryption
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
            <Globe size={18} color="#3b82f6" /> Enterprise Cloud
          </div>
        </div>
      </motion.div>
      
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
