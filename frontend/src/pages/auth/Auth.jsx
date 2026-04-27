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
  Phone,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, verifyOTP, resendOTP, logout } = useAuth();

  const { maintenanceMode } = useConfig();
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
  const [step, setStep] = useState('auth'); // 'auth' or 'verify'
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(300); // 5 minutes in seconds
  const [successMsg, setSuccessMsg] = useState('');


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

        // Prevent student login during maintenance
        if (maintenanceMode && userData.role !== 'admin') {
          await logout('/?maintenance=true');
          return;
        }

        const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath, { replace: true });
      } else {

        // Prevent student registration during maintenance
        if (maintenanceMode) {
          setError('System is under maintenance. New registrations are temporarily disabled.');
          setLoading(false);
          return;
        }

        const data = await register({ name, email, password, phone, role: 'student' });
        setSuccessMsg(data.msg);
        setStep('verify');
        setExpiryTimer(300);
        setResendTimer(60); // Start 1-min cooldown immediately
      }



    } catch (err) {
      setError(err.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await verifyOTP(email, otp);
      const redirectPath = userData.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    // Optimistic UI update
    setResendTimer(60);
    setSuccessMsg("OTP resent successfully");
    setError('');

    try {
      await resendOTP(email);
      setExpiryTimer(300); // Reset countdown on resend
    } catch (err) {
      // Revert if failed
      setResendTimer(0);
      setSuccessMsg('');
      setError(err.error || 'Failed to resend OTP');
    }
  };

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    let timer;
    if (step === 'verify' && expiryTimer > 0) {
      timer = setInterval(() => setExpiryTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, expiryTimer]);


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
            {step === 'auth' && (
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-[#1e293b]">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-slate-600 font-bold text-sm">
                  {isLogin && 'Welcome back. Please enter your details.'}
                </p>

              </div>
            )}


            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center shrink-0">!</div>
                {error}
              </div>
            )}

            {successMsg && !error && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center shrink-0">✓</div>
                {successMsg}
              </div>
            )}


            {step === 'auth' ? (
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
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Password</label>
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
            ) : (
              <div className="space-y-8 py-4 animate-in zoom-in-95 duration-500">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Verify Your Email</h3>

                  <p className="text-sm text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                    We've sent a secure 6-digit code to <br />
                    <span className="text-slate-900 font-bold underline decoration-slate-200 underline-offset-4">{email}</span>
                  </p>
                  <div className={cn(
                    "flex items-center justify-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm w-fit mx-auto mt-2",
                    expiryTimer > 0 ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-red-50 text-red-600 border border-red-100"
                  )}>
                    {expiryTimer > 0 ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Code expires in: {formatTime(expiryTimer)}</span>
                      </>
                    ) : (
                      <span>Code has expired</span>
                    )}
                  </div>

                </div>

                <div className="space-y-8">
                  <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        disabled={expiryTimer === 0}
                        value={otp[index] || ''}

                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const newOtp = otp.split('');
                          newOtp[index] = val;
                          const finalOtp = newOtp.join('');
                          setOtp(finalOtp);

                          // Auto focus next
                          if (val && index < 5) {
                            document.getElementById(`otp-${index + 1}`).focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            document.getElementById(`otp-${index - 1}`).focus();
                          }
                          if (e.key === 'Enter' && otp.length === 6 && expiryTimer > 0) {
                            handleVerifyOTP();
                          }
                        }}
                        placeholder="•"
                        maxLength={1}
                        className={cn(
                          "w-12 h-14 text-center text-base font-black rounded-xl border-2 transition-all outline-none",
                          expiryTimer > 0
                            ? "border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            : "border-red-50 bg-red-50/30 text-red-300 cursor-not-allowed"
                        )}


                      />
                    ))}
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length < 6 || expiryTimer === 0}
                    className="btn-mindvista w-full !py-4 flex items-center justify-center gap-3 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="font-bold tracking-wide">
                          {expiryTimer > 0 ? 'VERIFY & SIGN IN' : 'CODE EXPIRED'}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>


                  <div className="pt-2 text-center flex flex-col items-center gap-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full" />
                    <button
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0}
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest transition-all",
                        resendTimer > 0
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 py-2 px-4 rounded-full border border-indigo-100/50"
                      )}
                    >

                      {resendTimer > 0 ? (
                        <span className="flex items-center gap-2">
                          Wait {resendTimer}s to resend
                        </span>
                      ) : (
                        "Resend Verification Code"
                      )}
                    </button>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                      Entered wrong email?
                      <button
                        onClick={() => {
                          setStep('auth');
                          setIsLogin(false);
                          setError('');
                          setSuccessMsg(''); // Clear success messages
                        }}

                        className="text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer ml-1"
                      >
                        Go back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {step === 'auth' && (
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
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

