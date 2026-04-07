import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  ArrowRight,
  Layout,
  Globe,
  Share2,
  BarChart2,
  Sparkles,
  TrendingUp,
  X,
  Menu,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center shadow-[0_0_12px_rgba(0,210,255,0.4)]">
            <Layout className="text-black w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">AuraResume</span>
        </div>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-2 py-1">
          {[
            { label: 'Product', active: true },
            { label: 'Solutions' },
            { label: 'Pricing' },
            { label: 'About' },
          ].map(({ label, active }) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                active
                  ? 'bg-[#00D2FF] text-black shadow-[0_0_10px_rgba(0,210,255,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => navigate('/auth')}
            className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-[#00D2FF] text-black text-[13px] font-bold rounded-full hover:bg-[#00D2FF]/90 hover:shadow-[0_0_18px_rgba(0,210,255,0.4)] transition-all"
          >
            Get Started
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-t border-white/5 px-6 pb-6"
          >
            {['Product', 'Solutions', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-3 text-sm text-gray-400 hover:text-white border-b border-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                className="flex-1 py-2 border border-white/10 rounded-full text-sm text-gray-400"
              >
                Sign In
              </button>
              <button 
                onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                className="flex-1 py-2 bg-[#00D2FF] text-black text-sm font-bold rounded-full"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#3A7BD5]/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00D2FF]/5 blur-[100px] rounded-full" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 text-center max-w-4xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] md:text-xs font-semibold text-gray-400 mb-8 tracking-[0.1em] uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
          New: GPT-4o Analysis Engine
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight mb-6"
        >
          Aura AI: Your Career,{' '}
          <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] animate-glow">
            Optimized.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-gray-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Get your resume ATS-ready in seconds with AI-driven insights and keyword
          analysis. Outsmart the algorithms and land your dream role.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 px-6 py-3 bg-[#00D2FF] text-black text-sm font-bold rounded-full hover:bg-[#00D2FF]/90 hover:shadow-[0_0_24px_rgba(0,210,255,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Analyze My Resume
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-3 border border-white/[0.12] text-sm font-medium text-gray-300 rounded-full hover:border-white/30 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 bg-white/[0.03]"
          >
            View Demo Analysis
          </button>
        </motion.div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PRODUCT PREVIEW (App Mockup)
───────────────────────────────────────────── */
const ProductPreview = () => (
  <section className="pb-24 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative rounded-[1.75rem] p-[1px] bg-gradient-to-b from-gray-700/60 via-gray-800/30 to-transparent shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
      >
        <div className="bg-[#0D1117] rounded-[1.7rem] overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05] bg-[#0D1117]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-[#1C2333] rounded-md px-8 py-1 text-[10px] text-gray-500 font-mono">
                app.auraresume.ai/dashboard
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="grid grid-cols-12 gap-0 min-h-[360px]">
            {/* Sidebar */}
            <div className="col-span-3 border-r border-white/[0.04] bg-[#090D14] p-4 flex flex-col gap-2">
              {/* Search bar */}
              <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-2 mb-3">
                <Search className="w-3 h-3 text-gray-600" />
                <div className="h-2 flex-1 bg-white/5 rounded" />
              </div>
              {['Dashboard', 'Resumes', 'Analysis', 'Jobs', 'Settings'].map((item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[10px] ${
                    i === 1
                      ? 'bg-[#00D2FF]/10 text-[#00D2FF]'
                      : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-[#00D2FF]' : 'bg-gray-700'}`} />
                  {item}
                </div>
              ))}
            </div>

            {/* Main panel */}
            <div className="col-span-6 border-r border-white/[0.04] bg-[#0D1117] p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-[10px] font-mono text-gray-500">Resume.pdf</span>
                <div className="ml-auto px-2 py-0.5 bg-[#00D2FF]/10 rounded text-[9px] text-[#00D2FF]">Analyzing...</div>
              </div>

              {/* Resume mock content */}
              <div className="space-y-2.5">
                <div className="h-4 w-2/5 bg-white/[0.08] rounded" />
                <div className="h-2.5 w-1/3 bg-white/[0.04] rounded" />
                <div className="h-px bg-white/[0.04] my-3" />
                <div className="h-2.5 w-full bg-white/[0.04] rounded" />
                <div className="h-2.5 w-5/6 bg-white/[0.04] rounded" />
                <div className="h-2.5 w-4/5 bg-white/[0.04] rounded" />
                <div className="h-px bg-white/[0.04] my-3" />
                <div className="space-y-2">
                  {[1, 0.8, 0.9, 0.7].map((w, i) => (
                    <div key={i} className="h-2 rounded" style={{ width: `${w * 100}%`, background: 'rgba(255,255,255,0.03)' }} />
                  ))}
                </div>
              </div>

              {/* AI scan overlay */}
              <motion.div
                animate={{ top: ['10%', '85%', '10%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/30 to-transparent"
                style={{ position: 'relative', marginTop: 12 }}
              />
            </div>

            {/* Right stats panel */}
            <div className="col-span-3 bg-[#090D14] p-4 flex flex-col gap-3">
              {/* ATS Score */}
              <div className="bg-[#111827]/80 rounded-xl p-3 border border-white/[0.04]">
                <div className="text-[9px] text-gray-500 mb-2 uppercase tracking-wider">ATS Score</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-white">78</div>
                  <div className="text-[9px] text-[#00D2FF] bg-[#00D2FF]/10 px-1.5 py-0.5 rounded">%</div>
                </div>
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '78%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] rounded-full"
                  />
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-[#111827]/80 rounded-xl p-3 border border-white/[0.04]">
                <div className="text-[9px] text-gray-500 mb-2 uppercase tracking-wider">Keywords</div>
                <div className="flex flex-wrap gap-1">
                  {['React', 'AI/ML', 'Python'].map(k => (
                    <span key={k} className="px-1.5 py-0.5 bg-[#3A7BD5]/20 border border-[#3A7BD5]/30 rounded text-[8px] text-[#3A7BD5]">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111827]/80 rounded-xl p-3 border border-white/[0.04] flex-1">
                <div className="text-[9px] text-gray-500 mb-2 uppercase tracking-wider">Suggestions</div>
                {[80, 60, 45].map((w, i) => (
                  <div key={i} className="mb-1.5">
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full bg-white/10 rounded-full" style={{ width: `${w}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   TRUSTED BY
───────────────────────────────────────────── */
const TrustedBy = () => (
  <section className="py-16 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-[0.25em] mb-10">
        Trusted by 100+ professionals at
      </p>
      <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
        {['Google', 'Stripe', 'Linear', 'Meta', 'Airbnb'].map((brand) => (
          <span
            key={brand}
            className="text-xl md:text-2xl font-bold text-gray-700 hover:text-gray-400 transition-colors duration-300 cursor-default tracking-tight"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   FEATURES (Why Aura AI)
───────────────────────────────────────────── */
const Features = () => {
  const features = [
    {
      icon: <BarChart2 className="w-5 h-5 text-[#00D2FF]" />,
      iconBg: 'bg-[#00D2FF]/10',
      title: 'ATS Scoring',
      desc: 'Measure your resume against industry-standard Applicant Tracking Systems with 99.9% accuracy.',
      visual: (
        <div className="relative w-28 h-28 flex items-center justify-center mt-6 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1F2937" strokeWidth="7" />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="url(#atsGrad)"
              strokeWidth="7"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              whileInView={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.78) }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#3A7BD5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">78</span>
            <span className="text-[10px] text-gray-500">/ 100</span>
          </div>
        </div>
      ),
    },
    {
      icon: <Search className="w-5 h-5 text-[#7C4DFF]" />,
      iconBg: 'bg-[#7C4DFF]/10',
      title: 'Keyword Analysis',
      desc: 'Automatically identify missing keywords from job descriptions to rank higher in search results.',
      visual: (
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {['Product Strategy', 'TypeScript'].map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['AI Models', 'Scalability'].map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-[#00D2FF]/5 border border-[#00D2FF]/20 text-[10px] text-[#00D2FF]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#00D2FF]" />,
      iconBg: 'bg-[#00D2FF]/10',
      title: 'Skill Roadmap',
      desc: 'Personalized learning paths and skill gaps identified based on your target career trajectory.',
      visual: (
        <div className="mt-6 space-y-3">
          {[
            { label: 'Leadership', val: 75, color: '#00D2FF' },
            { label: 'System Design', val: 45, color: '#3A7BD5' },
          ].map(({ label, val, color }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-400">{val}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${val}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="product" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Why Aura AI?</h2>
          <p className="text-gray-500 max-w-lg leading-relaxed">
            Precision engineering meets career strategy. Our platform identifies the gaps your resume didn't know it had.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group relative bg-[#0D1117] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] cursor-default overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D2FF]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-5`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              {f.visual}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   STATS STRIP
───────────────────────────────────────────── */
const Stats = () => (
  <section className="py-16 px-6">
    <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
      {[
        { number: '3x', label: 'More interview callbacks' },
        { number: '98%', label: 'ATS pass rate' },
        { number: '10k+', label: 'Resumes optimized' },
      ].map(({ number, label }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            {number}
          </div>
          <div className="text-xs text-gray-600 mt-1">{label}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────────── */
const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto relative rounded-[2rem] overflow-hidden"
      >
        {/* BG */}
        <div className="absolute inset-0 bg-[#0D1117] border border-white/[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3A7BD5]/10 via-transparent to-[#00D2FF]/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/40 to-transparent" />

        <div className="relative z-10 py-20 px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Ready to land your dream job?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="text-gray-500 text-base mb-10 max-w-md mx-auto leading-relaxed"
          >
            Join thousands of job seekers who increased their interview callbacks by 3x using Aura AI.
          </motion.p>
          <motion.button
            onClick={() => navigate('/auth')}
            className="px-8 py-3.5 bg-[#00D2FF] text-black text-sm font-bold rounded-full hover:bg-[#00D2FF]/90 hover:shadow-[0_0_28px_rgba(0,210,255,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Analyze My Resume Now
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-white/[0.05] bg-[#030712]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center">
              <Layout className="text-black w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-white">AuraResume AI</span>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-[13px] text-gray-600">
            {['Product', 'Solutions', 'Pricing', 'About'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-gray-300 transition-colors">
                {l}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[Globe, Share2, X].map((Icon, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-600 hover:text-white hover:border-white/20 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-5 border-t border-white/[0.04] text-[11px] text-gray-700">
          <p>© 2026 AuraResume AI. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map(l => (
              <a key={l} href="#" className="hover:text-gray-400 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
const Landing = () => (
  <div className="min-h-screen bg-[#030712] text-white selection:bg-[#00D2FF]/20 selection:text-white overflow-x-hidden">
    <Navbar />
    <Hero />
    <ProductPreview />
    <TrustedBy />
    <Features />
    <Stats />
    <CTA />
    <Footer />
  </div>
);

export default Landing;
