import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Phone
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') setIsLogin(false);
    else if (mode === 'login') setIsLogin(true);
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const leftPanelRef = useRef(null);
  const formPanelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftPanelRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }
      );

      gsap.fromTo(formPanelRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passRegex.test(password)) {
      setError('Password must contain both letters and numbers');
      return false;
    }

    // Phone validation for signup
    if (!isLogin) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        setError('Please enter a valid 10-digit mobile number');
        return false;
      }
      if (!name.trim()) {
        setError('Please enter your full name');
        return false;
      }
    }

    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const userData = await login(email, password);
        const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        const userData = await register({ name, email, password, phone, role: 'student' });
        const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-transparent overflow-hidden">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">


        <div ref={leftPanelRef} className="hidden lg:block space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--neutral-900)] leading-[1.1]">
              Elevate your <br />
              <span className="mindvista-text">Professional</span> <br />
              frequency.
            </h1>
            <p className="text-xl text-[var(--neutral-600)] font-bold max-w-md leading-relaxed">
              Step into the future of resume intelligence. One node away from peak career optimization.
            </p>
          </div>

        </div>


        <div ref={formPanelRef} className="clay-card !p-6 md:!p-12 relative max-w-md mx-auto w-full lg:max-w-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-200)] blur-[120px] rounded-full opacity-40 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-[#1e293b]">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-slate-600 font-bold text-sm">
                {isLogin ? 'Welcome back. Please enter your details.' : 'Join MindVista to optimize your career.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center shrink-0">!</div>
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="input-clay !pl-14 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input-clay !pl-14 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter mobile number"
                      maxLength={10}
                      className="input-clay !pl-14 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Password</label>
                  {/* {isLogin && (
                    <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                      Forgot Password?
                    </button>
                  )} */}
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-clay !pl-14 !pr-14 !bg-slate-50 !border-slate-200 focus:!bg-white transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-mindvista w-full !py-4 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <span className={cn("transition-all duration-300", loading ? "opacity-0 scale-90" : "opacity-100 scale-100")}>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </span>
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}

                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center pt-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-600 hover:text-indigo-700 transition-colors hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

