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
  ArrowRight,
  Filter,
  MapPin,
  DollarSign,
  Star,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Clock,
  ExternalLink,
  Trash2,
  Calendar,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
const Sidebar = () => {
  const navigate = useNavigate();
  const navItems = [
    { label: 'Dashboard', icon: Layout, path: '/dashboard' },
    { label: 'Resume Analysis', icon: BarChart2, path: '/upload' },
    { label: 'Job Matcher', icon: Briefcase, path: '/matcher' },
    { label: 'Saved Jobs', icon: Bookmark, active: true, path: '/saved' },
    { label: 'Settings', icon: Settings, path: '/profile' },
  ];

  return (
    <div className="w-64 h-screen bg-[#090D14] border-r border-white/[0.04] flex flex-col p-6 sticky top-0">
      <div className="mb-12">
        <h1 className="text-white text-lg font-bold cursor-pointer" onClick={() => navigate('/')}>Aura AI</h1>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mt-0.5 tracking-[0.25em]">Premium Tier</p>
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
        <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-400 text-[13px] font-medium transition-colors">
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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input 
          type="text" 
          placeholder="Search saved opportunities..."
          className="w-full bg-[#0D1117] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-[12px] text-white focus:outline-none focus:border-[#00D2FF]/20 transition-all"
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
          <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center overflow-hidden">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   SAVED JOB ITEM
───────────────────────────────────────────── */
const SavedJobCard = ({ job, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-[#0D1117] border border-white/[0.04] rounded-3xl p-8 hover:border-white/[0.08] hover:bg-white/[0.01] transition-all group flex flex-col md:flex-row items-center gap-10"
  >
    <div className="flex items-center gap-8 flex-1">
      <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br from-[#00D2FF]/10 to-transparent border border-[#00D2FF]/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Briefcase className="w-6 h-6 text-[#00D2FF]" />
      </div>
      <div>
        <h3 className="text-xl font-black text-white tracking-tight mb-1">{job.title}</h3>
        <div className="flex items-center gap-4 text-gray-600 text-[13px] font-bold tracking-tight">
          <span className="uppercase">{job.company}</span>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-1.5 font-bold">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-10">
      <div className="text-right flex flex-col gap-1 items-end">
        <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest leading-[0]">Match Score</span>
        <div className="flex items-baseline gap-1.5">
           <span className="text-2xl font-black text-white">{job.match}%</span>
           <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">High</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${job.status === 'Applied' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800/10 text-gray-500'}`}>
           {job.status}
         </span>
         <button className="p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-gray-800 hover:text-red-500 transition-all">
           <Trash2 className="w-5 h-5" />
         </button>
      </div>

      <button className="flex items-center gap-3 px-6 py-4 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] rounded-2xl text-[12px] font-black text-white group/btn uppercase tracking-widest">
        Full Details
        <ExternalLink className="w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors" />
      </button>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────── */
const Saved = () => {
  const savedJobs = [
    { title: 'Senior Product Designer', company: 'Linear', location: 'San Francisco', match: 94, status: 'Saved' },
    { title: 'Cloud Solutions Architect', company: 'Google Cloud', location: 'Remote', match: 89, status: 'Applied' },
    { title: 'Lead Frontend Engineer', company: 'Stripe', location: 'Dublin, IE', match: 87, status: 'Saved' },
    { title: 'AI Systems Architect', company: 'NVIDIA', location: 'Austin, TX', match: 82, status: 'Applied' },
  ];

  return (
    <div className="flex bg-[#030712] min-h-screen font-inter selection:bg-[#00D2FF]/30">
      <Sidebar />
      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        <TopBar />
        <main className="p-12 max-w-[1250px] mx-auto space-y-12">
           {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-cyan-400 fill-cyan-400" />
              </div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.25em]">Your Saved Pipeline</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Saved Jobs</h2>
            <p className="text-gray-600 text-sm font-bold max-w-lg leading-relaxed">
              Tracking your top-tier career potential. Re-analyze your resume for each specific job to maximize your success probability.
            </p>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-[#0D1117] border border-white/[0.04] rounded-3xl p-8 shadow-xl shadow-black/10">
               <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] mb-4">Total Saved</p>
               <h3 className="text-4xl font-black text-white">12</h3>
            </div>
            <div className="bg-[#0D1117] border border-white/[0.04] rounded-3xl p-8 shadow-xl shadow-black/10">
               <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] mb-4">Active Apps</p>
               <h3 className="text-4xl font-black text-white">04</h3>
            </div>
            <div className="bg-[#0D1117] border border-white/[0.04] rounded-3xl p-8 shadow-xl shadow-black/10">
               <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] mb-4">Interview Invites</p>
               <h3 className="text-4xl font-black text-[#00D2FF]">02</h3>
            </div>
            <div className="bg-[#0D1117] border border-white/[0.04] rounded-3xl p-8 shadow-xl shadow-black/10">
               <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] mb-4">Average Match</p>
               <h3 className="text-4xl font-black text-white">88%</h3>
            </div>
          </div>

          {/* List */}
          <div className="space-y-6">
             {savedJobs.map((job, i) => (
                <SavedJobCard key={i} job={job} index={i} />
             ))}
          </div>

          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/[0.04] rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex gap-8 items-center max-w-xl">
                <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                   <Clock className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                   <h4 className="text-xl font-black text-white tracking-tight mb-2">Resume Staleness Alert</h4>
                   <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                     It's been 14 days since your last analysis. Your profile has improved — <span className="text-purple-400 font-bold">Refresh your analysis</span> for Linear to potentially reach a 98% match score.
                   </p>
                </div>
             </div>
             <button className="px-10 py-5 bg-[#00D2FF] text-black text-[13px] font-black rounded-3xl uppercase tracking-widest shadow-xl shadow-[#00D2FF]/20 hover:scale-105 active:scale-95 transition-all">
                Run Re-Analysis
             </button>
          </div>

          {/* Footer */}
          <footer className="pt-24 pb-8 border-t border-white/[0.04] text-center">
            <div className="flex justify-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700 mb-8 cursor-default">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map(l => (
                <span key={l} className="hover:text-gray-400 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
            <div className="flex flex-col items-center gap-1.5">
               <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-[#00D2FF] to-[#7C4DFF]" />
                  <p className="text-base font-black text-white tracking-tight">AuraResume AI</p>
               </div>
               <p className="text-[11px] font-bold text-gray-800 tracking-widest uppercase">© 2024 AuraResume AI. ALL RIGHTS RESERVED.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Saved;
