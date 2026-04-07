import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  BarChart2,
  FileText,
  Search,
  Bell,
  Moon,
  User,
  Settings,
  Briefcase,
  Bookmark,
  HelpCircle,
  LogOut,
  Upload as UploadIcon,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
const Sidebar = () => {
  const navigate = useNavigate();
  const navItems = [
    { label: 'Dashboard', icon: Layout, path: '/dashboard' },
    { label: 'Resume Analysis', icon: BarChart2, active: true, path: '/upload' },
    { label: 'Job Matcher', icon: Briefcase, path: '/matcher' },
    { label: 'Saved Jobs', icon: Bookmark, path: '/saved' },
    { label: 'Settings', icon: Settings, path: '/profile' },
  ];

  return (
    <div className="w-64 h-screen bg-[#090D14] border-r border-white/[0.04] flex flex-col p-6 sticky top-0">
      <div className="mb-12">
        <h1 className="text-white text-lg font-bold cursor-pointer" onClick={() => navigate('/')}>Aura AI</h1>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mt-0.5">Premium Tier</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              item.active 
                ? 'bg-white/[0.06] text-[#00D2FF]' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
            }`}
          >
            <item.icon className={`w-4 h-4 ${item.active ? 'text-[#00D2FF]' : 'text-gray-600 group-hover:text-gray-400'}`} />
            <span className="text-[13px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="space-y-4 pt-6 border-t border-white/[0.04]">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-gray-300 text-[13px] font-medium transition-colors">
          <HelpCircle className="w-4 h-4" />
          Help Center
        </button>
        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-400 text-[13px] font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
const TopBar = () => (
  <div className="h-16 px-8 flex items-center justify-between border-b border-white/[0.04] bg-[#030712]/50 backdrop-blur-md sticky top-0 z-30">
    <div className="flex-1 max-w-lg">
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 focus-within:text-[#00D2FF] transition-colors" />
        <input 
          type="text" 
          placeholder="Search analysis history..."
          className="w-full bg-[#0D1117] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-[12px] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00D2FF]/40 transition-all"
        />
      </div>
    </div>

    <div className="flex items-center gap-6">
      <button className="text-gray-400 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors">
        <Moon className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-3 pl-4 border-l border-white/10">
        <div className="text-right">
          <p className="text-[12px] font-bold text-white leading-tight">Alex Rivera</p>
          <p className="text-[9px] font-bold text-[#00D2FF] uppercase tracking-tighter">Pro Account</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] p-[1px]">
          <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   UPLOAD SECTION
───────────────────────────────────────────── */
const UploadSection = () => (
  <div className="grid grid-cols-12 gap-8 mb-12">
    <div className="col-span-8">
      <h2 className="text-2xl font-bold text-white mb-2">Resume Optimization</h2>
      <p className="text-[12px] text-gray-500 max-w-xl leading-relaxed mb-10">
        Upload your current resume and an optional job description. Our AI will analyze your profile against industry standards and specific job requirements.
      </p>

      {/* Upload Dropzone */}
      <motion.div 
        whileHover={{ scale: 1.005 }}
        className="relative h-72 rounded-[2.5rem] border-2 border-dashed border-cyan-500/20 bg-cyan-900/[0.03] flex flex-col items-center justify-center group hover:border-[#00D2FF]/40 transition-all cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
          <UploadIcon className="w-6 h-6 text-[#00D2FF]" />
        </div>
        <h3 className="text-sm font-bold text-white mb-2">Upload Resume (PDF/DOCX)</h3>
        <p className="text-[12px] text-gray-600 mb-6 text-center">Drag and drop or click to browse files</p>
        <p className="text-[10px] text-gray-800 font-bold uppercase tracking-[0.2em]">Max File Size: 5MB</p>
        
        {/* Subtle corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none" />
      </motion.div>
    </div>

    {/* Job Description Sidebar */}
    <div className="col-span-4 flex flex-col">
      <div className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-8 flex-1 flex flex-col shadow-lg shadow-black/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <FileText className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="text-[14px] font-bold text-white">Job Description (Optional)</h3>
        </div>
        <textarea 
          placeholder="Paste the target job description here to enable tailored AI matching..."
          className="w-full flex-1 bg-[#090D14] border border-white/[0.06] rounded-2xl p-5 text-[12px] text-gray-400 placeholder:text-gray-700 focus:outline-none focus:border-[#00D2FF]/20 resize-none mb-8 leading-relaxed"
        />
        <button className="w-full py-4 bg-[#00D2FF] text-black font-black text-[13px] rounded-2xl hover:bg-[#00D2FF]/90 hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all transform active:scale-95 shadow-sm uppercase tracking-wider">
          Run Analysis
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   ANALYSIS RESULTS
───────────────────────────────────────────── */
const ResultsSection = () => (
  <div className="mb-12">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
      <div className="px-4 py-1.5 bg-[#00D2FF]/10 border border-[#00D2FF]/20 rounded-full flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
        <span className="text-[10px] font-black text-[#00D2FF] uppercase tracking-[0.15em]">Real-Time Data</span>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-8">
      {/* Compatibility Circle */}
      <div className="col-span-4 bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-xl shadow-black/10">
        <p className="text-[11px] font-bold text-gray-700 uppercase tracking-[0.2em] mb-12">ATS Compatibility</p>
        
        <div className="relative w-52 h-52 flex items-center justify-center mb-12">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#00D2FF"
              strokeWidth="6"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 * (1 - 0.87) }}
              transition={{ duration: 2, ease: "easeOut" }}
              strokeLinecap="round"
              filter="drop-shadow(0 0 10px rgba(0,210,255,0.5))"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-white tracking-tighter">87</span>
            <span className="text-[13px] font-bold text-gray-600 mt-1">/ 100</span>
          </div>
        </div>

        <h4 className="text-xl font-black text-white mb-3">Excellent Match!</h4>
        <p className="text-[12px] text-gray-500 leading-relaxed font-medium">Your resume ranks in the top 5% of applicants for this role profile.</p>
      </div>

      <div className="col-span-8 space-y-8">
        {/* Keywords */}
        <div className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-10 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500" />
              </div>
              <h4 className="text-[15px] font-bold text-white tracking-tight">Critical Missing Keywords</h4>
            </div>
            <span className="text-[11px] font-black text-purple-400 uppercase tracking-widest">+12% Score Potential</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {['Cloud Architecture', 'Leadership', 'React Native', 'Agile Methodology', 'GraphQL'].map(tag => (
              <div key={tag} className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all cursor-default group">
                <span className="text-[13px] font-bold text-gray-400 group-hover:text-white transition-colors">{tag}</span>
                <div className="w-4 h-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                   <AlertCircle className="w-3.5 h-3.5 text-purple-500/50" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Improvements */}
        <div className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-[15px] font-bold text-white tracking-tight">Actionable Improvements</h4>
          </div>
          <div className="space-y-6">
            {[
              <>Quantify your achievements in the Experience section. Instead of "Managed a team," use "Managed a team of <span className="text-[#00D2FF]">12+ developers</span> to deliver 3 flagship products."</>,
              <>Strengthen your Summary by highlighting your <span className="text-[#00D2FF]">8+ years of expertise</span> in full-stack architecture earlier in the paragraph.</>,
              "The formatting in your Education section is slightly inconsistent with the rest of the document. Standardize font weights."
            ].map((text, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  </div>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed font-medium group-hover:text-gray-400 transition-colors">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   ROADMAP SECTION
───────────────────────────────────────────── */
const RoadmapSection = () => (
  <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-12 mb-12 shadow-2xl shadow-black/20">
    <div className="flex items-center justify-between mb-16">
      <div>
        <h3 className="text-2xl font-black text-white mb-2">Upskilling Roadmap</h3>
        <p className="text-xs text-gray-600 font-medium">Path to achieving a 100% match for Senior Cloud Engineer positions.</p>
      </div>
      <button className="flex items-center gap-3 px-6 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-[12px] font-black text-white hover:bg-white/[0.08] hover:border-white/20 transition-all uppercase tracking-wide">
        <GraduationCap className="w-5 h-5 text-gray-400" />
        Recommended Courses
      </button>
    </div>

    {/* Roadmap Visual */}
    <div className="relative pt-12 pb-20">
      {/* Track Base */}
      <div className="absolute top-[60px] left-8 right-8 h-1 bg-white/[0.03] rounded-full" />
      
      {/* Animated Progress Line */}
      <div className="absolute top-[60px] left-8 right-8 h-1 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '68%' }}
          transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-[#00D2FF] via-purple-500 to-transparent"
        />
      </div>

      <div className="grid grid-cols-4 gap-8 px-4 relative z-10">
        {[
          { label: 'React Mastery', status: 'completed', icon: CheckCircle2 },
          { label: 'System Design', status: 'completed', icon: CheckCircle2 },
          { label: 'AWS Architect', status: 'in-progress', icon: ChevronRight },
          { label: 'Lead Ops', status: 'locked', icon: Lock },
        ].map((step, i) => (
          <div key={step.label} className="flex flex-col items-center group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-8 border-[3px] transition-all duration-300 ${
              step.status === 'completed' 
                ? 'bg-cyan-400 border-cyan-400/20 text-black shadow-[0_0_20px_rgba(0,210,255,0.4)]' 
                : step.status === 'in-progress'
                ? 'bg-[#030712] border-purple-500/60 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                : 'bg-[#030712] border-gray-800 text-gray-700'
            }`}>
              {step.status === 'in-progress' ? (
                 <div className="relative">
                   <div className="w-7 h-7 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                   <ChevronRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
                 </div>
              ) : <step.icon className="w-5 h-5" strokeWidth={3} />}
            </div>
            <p className={`text-[14px] font-black mb-1.5 transition-colors ${step.status === 'locked' ? 'text-gray-700' : 'text-white'}`}>
              {step.label}
            </p>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              step.status === 'completed' ? 'text-cyan-400' 
              : step.status === 'in-progress' ? 'text-purple-500' 
              : 'text-gray-800'
            }`}>
              {step.status === 'completed' ? 'Completed' : step.status === 'in-progress' ? 'In Progress' : 'Next Milestone'}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   UPLOAD PAGE ROOT
───────────────────────────────────────────── */
const Upload = () => {
  return (
    <div className="flex bg-[#030712] min-h-screen font-inter selection:bg-[#00D2FF]/30 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        <TopBar />
        <main className="p-12 max-w-[1250px] mx-auto min-h-screen flex flex-col">
          <div className="flex-1">
            <UploadSection />
            <ResultsSection />
            <RoadmapSection />
          </div>

          {/* Footer */}
          <div className="pt-20 pb-8 border-t border-white/[0.04] text-center">
            <div className="flex justify-center gap-10 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-700 mb-8 cursor-default">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map(l => (
                <span key={l} className="hover:text-gray-400 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-black text-white tracking-tight">AuraResume AI</p>
              <p className="text-[11px] font-bold text-gray-800 tracking-widest uppercase">© 2024 AuraResume AI. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upload;
