import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout, Mail, Lock, Eye, EyeOff, User, ArrowRight, BarChart2 } from 'lucide-react';

/* ── tiny Google SVG ── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ── tiny GitHub SVG ── */
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

/* ────────────────────────────────
   INPUT FIELD
──────────────────────────────── */
const InputField = ({ label, type = 'text', placeholder, icon: Icon, value, onChange }) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold tracking-[0.12em] text-gray-500 uppercase">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={isPassword && showPw ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-[#0D1117] border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00D2FF]/50 focus:ring-1 focus:ring-[#00D2FF]/20 transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-400 transition-colors"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ────────────────────────────────
   SIGN IN FORM
──────────────────────────────── */
const SignInForm = ({ onSwitch }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    if (userId === 'admin' && password === '000000') {
      navigate('/admin');
    } else if (userId === 'user' && password === '000000') {
      navigate('/dashboard');
    } else if (userId && password) {
      // For any other credentials, go to dashboard to simulate login
      navigate('/dashboard');
    } else {
      setError('Please enter your credentials');
    }
  };

  return (
    <motion.div
      key="signin"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <form onSubmit={handleSignIn} className="space-y-5">
        <InputField 
          label="Email or Username" 
          type="text" 
          placeholder="admin" 
          icon={Mail} 
          value={userId} 
          onChange={e => setUserId(e.target.value)} 
        />
        <InputField 
          label="Password" 
          type="password" 
          placeholder="000000" 
          icon={Lock} 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />

        {error && <p className="text-[10px] text-red-500 text-center">{error}</p>}

        <button 
          type="submit"
          className="w-full py-3 bg-[#00D2FF] text-black font-bold text-sm rounded-xl hover:bg-[#00D2FF]/90 hover:shadow-[0_0_24px_rgba(0,210,255,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      <Divider />
      <OAuthButtons />

      <div className="text-center">
        <button className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          Forgot Password?
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-700 leading-relaxed">
        By signing in, you agree to AuraResume AI's{' '}
        <a href="#" className="text-[#00D2FF]/70 hover:text-[#00D2FF] transition-colors">Terms of Service</a>{' '}
        and{' '}
        <a href="#" className="text-[#00D2FF]/70 hover:text-[#00D2FF] transition-colors">Privacy Policy</a>
      </p>
    </motion.div>
  );
};

/* ────────────────────────────────
   CREATE ACCOUNT FORM
──────────────────────────────── */
const CreateForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (name && email && password) {
      navigate('/dashboard');
    }
  };

  return (
    <motion.div
      key="create"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <form onSubmit={handleSignUp} className="space-y-5">
        <InputField label="Full Name" type="text" placeholder="Alex Johnson" icon={User} value={name} onChange={e => setName(e.target.value)} />
        <InputField label="Email Address" type="email" placeholder="alex@company.com" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} />
        <InputField label="Password" type="password" placeholder="Create a strong password" icon={Lock} value={password} onChange={e => setPassword(e.target.value)} />

        <button 
          type="submit"
          className="w-full py-3 bg-[#00D2FF] text-black font-bold text-sm rounded-xl hover:bg-[#00D2FF]/90 hover:shadow-[0_0_24px_rgba(0,210,255,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Create Account <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <Divider />
      <OAuthButtons />

      <p className="text-center text-[10px] text-gray-700 leading-relaxed">
        By creating an account, you agree to AuraResume AI's{' '}
        <a href="#" className="text-[#00D2FF]/70 hover:text-[#00D2FF] transition-colors">Terms of Service</a>{' '}
        and{' '}
        <a href="#" className="text-[#00D2FF]/70 hover:text-[#00D2FF] transition-colors">Privacy Policy</a>
      </p>
    </motion.div>
  );
};

/* ── Shared: divider ── */
const Divider = () => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-white/[0.06]" />
    <span className="text-[10px] tracking-[0.12em] font-medium text-gray-700 uppercase">or continue with</span>
    <div className="flex-1 h-px bg-white/[0.06]" />
  </div>
);

/* ── Shared: OAuth buttons ── */
const OAuthButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Google', icon: <GoogleIcon /> },
        { label: 'GitHub', icon: <GitHubIcon /> },
      ].map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.08] hover:border-white/[0.14] transition-all duration-200"
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
};

/* ────────────────────────────────
   AUTH CARD
──────────────────────────────── */
const AuthCard = () => {
  const [tab, setTab] = useState('signin');

  return (
    <div className="bg-[#111827]/60 border border-white/[0.07] backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
      {/* Toggle */}
      <div className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-full p-1 mb-8">
        {[
          { id: 'signin', label: 'Sign In' },
          { id: 'create', label: 'Create Account' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 z-10 ${
              tab === id ? 'text-black' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab === id && (
              <motion.div
                layoutId="authTabBg"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      {/* Forms */}
      <AnimatePresence mode="wait">
        {tab === 'signin' ? <SignInForm key="signin" /> : <CreateForm key="create" />}
      </AnimatePresence>
    </div>
  );
};

/* ────────────────────────────────
   LEFT PANEL
──────────────────────────────── */
const LeftPanel = () => (
  <div className="flex flex-col justify-center max-w-md">
    {/* Logo */}
    <div className="flex items-center gap-2.5 mb-10">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D2FF] to-[#7C4DFF] flex items-center justify-center shadow-[0_0_16px_rgba(0,210,255,0.4)]">
        <Layout className="text-black w-4 h-4" strokeWidth={2.5} />
      </div>
      <span className="text-base font-semibold text-white tracking-tight">Aura AI</span>
    </div>

    {/* Heading */}
    <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mb-5">
      Empowering<br />
      your next{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D2FF] to-[#7C4DFF]">
        career
      </span>
      <br />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C4DFF] to-[#FF6B9D]">
        move
      </span>
      <span className="text-white">.</span>
    </h1>

    {/* Subtext */}
    <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xs">
      Harness the power of high-end AI to analyze, refine, and match your professional identity with the world's leading opportunities.
    </p>

    {/* AI Image card */}
    <div className="relative rounded-2xl overflow-hidden w-full max-w-xs">
      <img
        src="/auth-ai-face.png"
        alt="AI Analysis"
        className="w-full h-56 object-cover object-top"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />

      {/* Overlay badge */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-[#111827]/80 backdrop-blur-md rounded-xl p-3 border border-white/[0.08]">
        <div className="w-8 h-8 rounded-lg bg-[#00D2FF]/10 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-4 h-4 text-[#00D2FF]" />
        </div>
        <div>
          <div className="text-[9px] font-semibold tracking-[0.12em] text-gray-500 uppercase mb-0.5">
            Real-Time Analysis
          </div>
          <div className="text-xs font-semibold text-white">
            Optimizing Professional Score...
          </div>
        </div>
        {/* Pulsing dot */}
        <div className="ml-auto w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
      </div>
    </div>
  </div>
);

/* ────────────────────────────────
   PAGE
──────────────────────────────── */
const Auth = () => (
  <div className="min-h-screen bg-[#030712] text-white selection:bg-[#00D2FF]/20 overflow-hidden">
    {/* BG glows */}
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-[#7C4DFF]/8 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-[#00D2FF]/6 blur-[100px] rounded-full" />
    </div>

    {/* Main grid */}
    <div className="min-h-screen grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto px-8 py-12">
      <LeftPanel />
      <div className="flex justify-center md:justify-end">
        <AuthCard />
      </div>
    </div>

    {/* Footer */}
    <footer className="border-t border-white/[0.04] py-5 px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          {['Help Center', 'Pricing', 'Security'].map(l => (
            <a key={l} href="#" className="text-[10px] font-semibold tracking-[0.12em] text-gray-700 hover:text-gray-400 uppercase transition-colors">
              {l}
            </a>
          ))}
        </div>
        <p className="text-[10px] text-gray-700">© 2024 AuraResume AI. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default Auth;
