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
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
const Sidebar = () => {
  const navigate = useNavigate();
  const navItems = [
    { label: 'Dashboard', icon: Layout, path: '/dashboard' },
    { label: 'Resume Analysis', icon: BarChart2, path: '/upload' },
    { label: 'Job Matcher', icon: Briefcase, active: true, path: '/matcher' },
    { label: 'Saved Jobs', icon: Bookmark, path: '/saved' },
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
          placeholder="Search jobs, companies, skills..."
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
   JOB CARD
───────────────────────────────────────────── */
const JobCard = ({ job, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-8 hover:border-white/[0.08] hover:bg-white/[0.01] transition-all group cursor-default relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-10">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${job.grad} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="w-full h-full rounded-2xl bg-[#0D1117] flex items-center justify-center overflow-hidden">
             {/* Abstract logo placeholder */}
             <div className={`w-6 h-6 rounded ${job.grad} opacity-80 blur-[2px]`} />
             <div className={`absolute w-4 h-4 rounded-full border border-white/20`} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-1">{job.title}</h3>
          <p className="text-[13px] text-gray-600 font-bold tracking-tight uppercase">{job.company}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00D2FF]/5 border border-[#00D2FF]/10 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
          <span className="text-[10px] font-black text-[#00D2FF] uppercase tracking-widest">{job.match}% AI Match</span>
        </div>
        <p className="text-[12px] text-gray-500 font-bold mb-1">{job.salary}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-10">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
        <MapPin className="w-4 h-4 text-gray-700" />
        <span className="text-[12px] text-gray-400 font-bold">{job.location}</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
        <Briefcase className="w-4 h-4 text-gray-700" />
        <span className="text-[12px] text-gray-400 font-bold">{job.type}</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-10">
      {job.skills.map(skill => (
        <span key={skill} className="px-3 py-1 bg-white/[0.03] border border-white/[0.06] rounded-full text-[10px] text-gray-500 font-black tracking-tight uppercase">
          {skill}
        </span>
      ))}
    </div>

    <div className="flex gap-4">
      <button className="flex-1 py-4 bg-[#00D2FF] text-black text-[13px] font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00D2FF]/90 transition-all uppercase tracking-widest group/btn">
        Apply Now
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
      <button className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/[0.08] transition-all">
        <Bookmark className="w-5 h-5 focus:fill-purple-500 hover:fill-gray-600" />
      </button>
    </div>

    {/* Subtle gloss effect */}
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.div>
);

/* ─────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────── */
const Matcher = () => {
  const jobs = [
    { 
      title: 'Senior Cloud Architect', 
      company: 'Nebula Systems', 
      match: 96, 
      location: 'San Francisco, CA', 
      salary: '$180k - $240k', 
      type: 'Full-time',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'React'],
      grad: 'from-[#00D2FF] to-[#3A7BD5]'
    },
    { 
      title: 'Head of Product Design', 
      company: 'Zenith AI', 
      match: 92, 
      location: 'Remote, US', 
      salary: '$165k - $210k', 
      type: 'Contract',
      skills: ['Figma', 'System Design', 'UX Strategy'],
      grad: 'from-purple-500 to-indigo-600'
    },
    { 
      title: 'Full Stack Engineer', 
      company: 'Stellar FinTech', 
      match: 88, 
      location: 'New York, NY', 
      salary: '$140k - $190k', 
      type: 'Full-time',
      skills: ['TypeScript', 'Node.js', 'Next.js', 'PostgreSQL'],
      grad: 'from-cyan-400 to-emerald-500'
    },
    { 
      title: 'Machine Learning Engineer', 
      company: 'Aura Core', 
      match: 85, 
      location: 'Austin, TX', 
      salary: '$155k - $200k', 
      type: 'Full-time',
      skills: ['Python', 'PyTorch', 'Data Pipeline'],
      grad: 'from-pink-500 to-rose-600'
    },
  ];

  return (
    <div className="flex bg-[#030712] min-h-screen font-inter selection:bg-[#00D2FF]/30">
      <Sidebar />
      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        <TopBar />
        <main className="p-12 max-w-[1300px] mx-auto space-y-12">
          {/* Header */}
          <header className="flex justify-between items-end mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
                </div>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.25em]">Smart Matching Engined</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-2">AI Job Matcher</h2>
              <p className="text-gray-600 text-sm font-bold max-w-lg leading-relaxed">
                Analyzing your professional profile against 100k+ global listings to find your ideal career trajectory.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-[10px] text-gray-800 font-bold uppercase tracking-widest mb-1">Your Resume Score</p>
                  <p className="text-2xl font-black text-white leading-tight">88<span className="text-lg text-gray-600">/100</span></p>
               </div>
               <button onClick={() => navigate('/upload')} className="px-6 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] rounded-2xl text-[12px] font-black text-white flex items-center gap-3 transition-all uppercase tracking-widest">
                  Improve Score
               </button>
            </div>
          </header>

          {/* Filter Bar */}
          <div className="bg-[#090D14] border border-white/[0.04] rounded-3xl p-6 flex items-center gap-4 sticky top-20 z-20 shadow-2xl shadow-black/40">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-gray-600" />
              <input type="text" placeholder="Job Title or Keyword..." className="w-full bg-[#030712] border border-white/[0.06] rounded-2xl pl-12 pr-4 py-4 text-[13px] text-white focus:outline-none focus:border-[#00D2FF]/20" />
            </div>
            <div className="w-[180px] relative flex items-center">
              <MapPin className="absolute left-4 w-4 h-4 text-gray-600" />
              <input type="text" defaultValue="Remote" className="w-full bg-[#030712] border border-white/[0.06] rounded-2xl pl-12 pr-4 py-4 text-[13px] text-white focus:outline-none" />
            </div>
            <div className="w-[180px] relative flex items-center">
              <DollarSign className="absolute left-4 w-4 h-4 text-gray-600" />
              <input type="text" defaultValue="$150k+" className="w-full bg-[#030712] border border-white/[0.06] rounded-2xl pl-12 pr-4 py-4 text-[13px] text-white focus:outline-none" />
            </div>
            <button className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-8">
            {jobs.map((job, i) => (
              <JobCard key={i} job={job} index={i} />
            ))}
          </div>

          <div className="py-20 flex justify-center">
            <button className="px-10 py-5 border-2 border-white/[0.04] hover:border-white/[0.1] rounded-3xl text-[12px] font-black text-gray-600 hover:text-white transition-all uppercase tracking-[0.2em]">
              Load More Opportunities
            </button>
          </div>

          {/* Footer */}
          <footer className="pt-24 pb-8 border-t border-white/[0.04] text-center">
            <div className="flex justify-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700 mb-8 cursor-default">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map(l => (
                <span key={l} className="hover:text-gray-400 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
            <div className="space-y-1.5 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center" />
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

export default Matcher;
