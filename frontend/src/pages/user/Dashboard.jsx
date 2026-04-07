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
  MoreVertical,
  Zap,
  TrendingDown,
  Lightbulb,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
const Sidebar = () => {
  const navigate = useNavigate();
  const navItems = [
    { label: 'Dashboard', icon: Layout, active: true, path: '/dashboard' },
    { label: 'Resume Analysis', icon: BarChart2, path: '/upload' },
    { label: 'Job Matcher', icon: Briefcase, path: '/matcher' },
    { label: 'Saved Jobs', icon: Bookmark, path: '/saved' },
    { label: 'Settings', icon: Settings, path: '/profile' },
  ];

  return (
    <div className="w-64 h-screen bg-[#090D14] border-r border-white/[0.04] flex flex-col p-6 sticky top-0">
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-white text-lg font-bold cursor-pointer" onClick={() => navigate('/')}>Aptica AI</h1>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mt-0.5">Premium Tier</p>
      </div>

      {/* Nav */}
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

      {/* Bottom Nav */}
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
    <h2 className="text-white text-lg font-bold">Dashboard</h2>
    
    <div className="flex-1 max-w-lg mx-12">
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-[#00D2FF]" />
        <input 
          type="text" 
          placeholder="Search resumes..."
          className="w-full bg-[#0D1117] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00D2FF]/40 transition-all"
        />
      </div>
    </div>

    <div className="flex items-center gap-6">
      <button className="relative text-gray-400 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#030712]" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors">
        <Moon className="w-5 h-5" />
      </button>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] p-[1px]">
        <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   STATS CARDS
───────────────────────────────────────────── */
const StatCard = ({ title, value, sub, icon: Icon, color, progress }) => (
  <div className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-white/[0.1] transition-all shadow-xl shadow-black/10">
    <div className="flex justify-between items-start mb-6">
      <div>
        <p className="text-[11px] text-gray-700 font-black tracking-[0.2em] mb-10 uppercase">{title}</p>
        <div className="flex items-baseline gap-2.5">
          <h3 className="text-5xl font-black text-white tracking-tighter">{value}</h3>
          {sub && <span className={`text-[14px] font-black ${sub.startsWith('+') ? 'text-[#00D2FF]' : 'text-red-500'}`}>{sub}</span>}
        </div>
      </div>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {progress !== undefined && (
      <div className="mt-8">
        <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-[#00D2FF] rounded-full shadow-[0_0_15px_rgba(0,210,255,0.4)]"
          />
        </div>
      </div>
    )}
    {title === "Keywords Missing" && (
      <p className="mt-6 text-[12px] text-gray-700 font-bold leading-relaxed italic">
        Add 'Cloud Architecture' to improve score.
      </p>
    )}
    {title === "Jobs Matched" && (
      <p className="mt-6 text-[12px] text-gray-700 font-bold leading-relaxed">
        Matches based on your latest analysis.
      </p>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   SCORE TRENDS CHART
───────────────────────────────────────────── */
const TrendsChart = () => (
  <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 flex-1 shadow-2xl shadow-black/20">
    <div className="flex justify-between items-center mb-12">
      <div>
        <h3 className="text-xl font-black text-white tracking-tight">Score Trends</h3>
        <p className="text-[13px] text-gray-600 font-bold mt-1">Performance tracking across iterations</p>
      </div>
      <div className="flex items-center bg-white/[0.02] border border-white/[0.08] rounded-full p-1.5">
        <button className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-black bg-white rounded-full transition-all">Week</button>
        <button className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-gray-700 hover:text-gray-400 transition-colors">Month</button>
      </div>
    </div>

    <div className="h-72 mt-8 relative">
      <div className="absolute inset-0 flex flex-col justify-between py-2">
        {[1, 2, 3].map(i => <div key={i} className="h-px w-full bg-white/[0.02]" />)}
      </div>
      
      <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00D2FF" stopOpacity="0" />
          </linearGradient>
          <filter id="chartGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path 
          d="M0,200 C150,180 200,160 300,165 C400,170 450,185 550,130 C650,75 750,110 800,115"
          fill="none"
          stroke="#00D2FF"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#chartGlow)"
          className="animate-draw"
        />
        
        <circle cx="300" cy="165" r="5" fill="#00D2FF" />
        <circle cx="550" cy="130" r="5" fill="#00D2FF" />
        <circle cx="800" cy="115" r="5" fill="#00D2FF" />
      </svg>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   AI SUGGESTIONS
───────────────────────────────────────────── */
const AISuggestions = () => (
  <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 w-[360px] flex flex-col shadow-2xl shadow-black/20 overflow-hidden relative">
    <h3 className="text-xl font-black text-white tracking-tight mb-8">AI Suggestions</h3>
    
    <div className="space-y-8 flex-1">
      <div className="flex gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-[#00D2FF] border-t-transparent animate-spin duration-[4s]" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-[#00D2FF]" />
        </div>
        <div className="space-y-1">
          <p className="text-[13px] text-gray-300 font-bold leading-relaxed">
            Your <span className="text-[#00D2FF]">Action Verbs</span> density is low. Try replacing <br/> "Managed" with "Orchestrated".
          </p>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-b-transparent animate-spin duration-[5s] direction-reverse" />
          <Lightbulb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
        </div>
        <div className="space-y-1">
          <p className="text-[13px] text-gray-300 font-bold leading-relaxed">
            <span className="text-purple-400">Skills Gap</span>: 3 job matches require AWS Lambda experience you haven't listed.
          </p>
        </div>
      </div>
    </div>

    <button className="mt-10 w-full py-4 bg-[#00D2FF] text-black font-black text-[13px] rounded-2xl hover:bg-[#00D2FF]/90 hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all transform active:scale-95 uppercase tracking-widest">
      Run Deep Analysis
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   RECENT ANALYSIS
───────────────────────────────────────────── */
const RecentAnalysis = () => (
  <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-12 shadow-2xl shadow-black/20">
    <div className="flex justify-between items-center mb-10">
      <h3 className="text-xl font-black text-white tracking-tight">Recent Analysis</h3>
      <button className="text-[13px] font-black text-[#00D2FF] hover:underline uppercase tracking-wide">View All</button>
    </div>
    
    <table className="w-full">
      <thead className="border-b border-white/[0.03]">
        <tr className="text-[11px] text-gray-700 font-black uppercase tracking-[0.2em] text-left">
          <th className="pb-6">Document Name</th>
          <th className="pb-6 text-center">Score</th>
          <th className="pb-6 text-center">Date</th>
          <th className="pb-6 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.02]">
        {[
          { name: 'Resume Final_v2.pdf', score: '85%', date: '2 days ago', color: 'bg-[#00D2FF]/10 text-[#00D2FF]' },
          { name: 'Resume_Draft_v1.pdf', score: '72%', date: '1 week ago', color: 'bg-white/[0.04] text-gray-400' },
        ].map((item) => (
          <tr key={item.name} className="group hover:bg-white/[0.01] transition-colors cursor-default">
            <td className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover:bg-white/[0.06] transition-all">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-[14px] font-bold text-white tracking-tight">{item.name}</span>
              </div>
            </td>
            <td className="py-6 text-center">
              <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest ${item.color}`}>
                {item.score} Score
              </span>
            </td>
            <td className="py-6 text-center text-gray-600 text-[13px] font-bold">{item.date}</td>
            <td className="py-6 text-right">
              <button className="p-2.5 text-gray-800 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─────────────────────────────────────────────
   DASHBOARD ROOT
───────────────────────────────────────────── */
const Dashboard = () => {
  return (
    <div className="flex bg-[#030712] min-h-screen font-inter selection:bg-[#00D2FF]/30 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        <TopBar />
        
        <main className="p-12 space-y-12 max-w-[1400px] mx-auto min-h-screen flex flex-col text-white">
          <div className="flex-1 space-y-12">
            {/* Top Cards Row */}
            <div className="grid grid-cols-3 gap-8">
              <StatCard 
                title="Precision Score" 
                value="85%" 
                sub="+5.2%" 
                icon={BarChart2} 
                color="bg-[#00D2FF]" 
                progress={85}
              />
              <StatCard 
                title="Critical Insights" 
                value="12" 
                sub="Critical" 
                icon={TrendingDown} 
                color="bg-red-500/80" 
              />
              <StatCard 
                title="Jobs Matched" 
                value="42" 
                sub="New" 
                icon={Briefcase} 
                color="bg-purple-600" 
              />
            </div>

            {/* Charts Row */}
            <div className="flex gap-8">
              <TrendsChart />
              <AISuggestions />
            </div>

            {/* Table */}
            <RecentAnalysis />
          </div>

          {/* Footer */}
          <div className="pt-20 pb-8 border-t border-white/[0.04] text-center">
            <div className="flex justify-center gap-10 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-700 mb-8 cursor-default">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map(l => (
                <span key={l} className="hover:text-gray-400 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-black text-white tracking-tight">ApticaResume AI</p>
              <p className="text-[11px] font-bold text-gray-800 tracking-widest uppercase">© 2024 ApticaResume AI. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
