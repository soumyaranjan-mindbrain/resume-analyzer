import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Moon,
  User,
  TrendingUp,
  Zap,
  DollarSign,
  Download,
  MoreHorizontal,
  AlertTriangle,
  ChevronDown,
  Layout,
  Star,
  LogOut,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
const TopBar = () => {
  const navigate = useNavigate();
  return (
  <div className="h-20 px-12 flex items-center justify-between bg-[#030712]/50 backdrop-blur-md sticky top-0 z-30 border-b border-white/[0.04]">
    <div className="flex items-center gap-10">
      <h2 className="text-2xl font-black text-white tracking-tight">Admin Dashboard</h2>
      <div className="w-[450px] relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input 
          type="text" 
          placeholder="Search users, resumes, or logs..."
          className="w-full bg-[#0D1117] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-3 text-[13px] text-white focus:outline-none focus:border-[#00D2FF]/20"
        />
      </div>
    </div>

    <div className="flex items-center gap-8">
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-all pl-4 border-l border-white/10">
          <LogOut className="w-5 h-5" />
          <span className="text-[11px] font-black uppercase tracking-widest hidden lg:block">Logout</span>
        </button>
      </div>
      <div className="flex items-center gap-4 pl-6 border-l border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] p-[1px]">
          <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-10 flex-1 relative overflow-hidden group hover:border-white/[0.08] transition-all"
  >
    <div className="relative z-10">
      <p className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-6">{title}</p>
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="text-5xl font-black text-white tracking-tight">{value}</h3>
      </div>
      <div className="flex items-center gap-2">
        {trend && <TrendingUp className="w-4 h-4 text-emerald-500" />}
        {Icon && <Icon className="w-4 h-4 text-[#00D2FF]" />}
        <p className={`text-[12px] font-bold ${trend ? 'text-emerald-500/80' : 'text-gray-600'}`}>{subtext}</p>
      </div>
    </div>
    
    {/* Abstract Background element */}
    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-[#00D2FF]/[0.03] transition-colors" />
  </motion.div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const Admin = () => {
  const users = [
    { name: 'Elena Sokolov', email: 'elena.s@fintech.io', status: 'JOB READY', statusColor: 'text-cyan-400 bg-cyan-400/5 border-cyan-400/10', activity: '2 mins ago' },
    { name: 'Jordan Dax', email: 'j.dax@creative.co', status: 'IMPROVING', statusColor: 'text-purple-400 bg-purple-400/5 border-purple-400/10', activity: '1 hour ago' },
    { name: 'Marcus Lee', email: 'm.lee@startup.net', status: 'NEW', statusColor: 'text-gray-400 bg-gray-400/5 border-gray-400/10', activity: '5 hours ago' },
    { name: 'Sarah Jenkins', email: 'sjenkins@global.com', status: 'JOB READY', statusColor: 'text-cyan-400 bg-cyan-400/5 border-cyan-400/10', activity: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white font-inter selection:bg-[#00D2FF]/30">
      <TopBar />
      
      <main className="p-12 max-w-[1440px] mx-auto space-y-12">
        
        {/* Stats Row */}
        <div className="flex gap-8">
          <StatCard title="Total Users" value="12.4k" subtext="+14% from last month" trend />
          <StatCard title="Active Today" value="1.2k" subtext="High engagement detected" icon={Zap} />
          <StatCard title="Subscription Revenue" value="$45k" subtext="Record monthly high" icon={DollarSign} />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-12 gap-8">
          {/* Chart Component */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-8 bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-12"
          >
            <div className="flex justify-between items-center mb-16">
              <h3 className="text-xl font-black text-white">User Growth</h3>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#00D2FF]/40" />
                 <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Past 6 Months</span>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-6 px-4">
              {[
                { m: 'Jan', v: '8.2k', h: 42 },
                { m: 'Feb', v: '9.4k', h: 58 },
                { m: 'Mar', v: '8.8k', h: 52 },
                { m: 'Apr', v: '10.5k', h: 72 },
                { m: 'May', v: '11.8k', h: 82 },
                { m: 'Jun', v: '12.4k', h: 100 },
              ].map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                    <span className="text-[10px] font-black text-[#00D2FF] bg-[#00D2FF]/10 px-2 py-1 rounded-lg">
                      {data.v}
                    </span>
                  </div>
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${data.h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="w-full bg-white/[0.03] border border-white/[0.04] rounded-2xl group-hover:bg-gradient-to-t group-hover:from-[#00D2FF]/40 group-hover:to-[#3A7BD5]/10 group-hover:border-[#00D2FF]/30 transition-all cursor-pointer relative shadow-lg shadow-black/20"
                  >
                     <div className="absolute inset-0 bg-gradient-to-t from-[#00D2FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl animate-pulse" />
                  </motion.div>
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{data.m}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Controls & Alerts */}
          <div className="col-span-4 space-y-8 flex flex-col">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 flex-1"
            >
              <div className="flex items-center gap-3 mb-10">
                 <Layout className="w-5 h-5 text-[#00D2FF]" />
                 <h3 className="text-sm font-black text-white tracking-widest uppercase">Data Controls</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] mb-3">Filter by Score</p>
                  <div className="relative group">
                    <select className="w-full bg-[#030712] border border-white/[0.04] rounded-2xl px-5 py-4 text-[12px] font-bold text-white appearance-none focus:outline-none focus:border-[#00D2FF]/20">
                      <option>Top Performers ({'>'} 90)</option>
                      <option>Underperforming ({'<'} 40)</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] mb-3">Filter by Date</p>
                  <div className="relative group">
                    <select className="w-full bg-[#030712] border border-white/[0.04] rounded-2xl px-5 py-4 text-[12px] font-bold text-white appearance-none focus:outline-none focus:border-[#00D2FF]/20">
                      <option>Last 24 Hours</option>
                      <option>Last 7 Days</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                  </div>
                </div>

                <button className="w-full py-5 mt-4 bg-[#00D2FF] text-black text-[13px] font-black rounded-2xl shadow-lg shadow-[#00D2FF]/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                   Update Dashboard
                </button>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-purple-950/20 border border-purple-500/10 rounded-[3rem] p-10 relative overflow-hidden"
            >
               <div className="relative z-10">
                  <h4 className="text-purple-400 text-[13px] font-black uppercase tracking-widest mb-3">Anomalous Activity</h4>
                  <p className="text-[11px] text-gray-500 font-bold leading-relaxed mb-1">
                    3 users detected using automated <br /> crawlers. Suggested: Revoke access.
                  </p>
               </div>
               <AlertTriangle className="absolute -right-4 -bottom-4 w-28 h-28 text-purple-900/20 rotate-12" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Table Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0D1117] border border-white/[0.04] rounded-[3.5rem] p-12"
        >
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-xl font-black text-white">Active Talent Pipeline</h3>
            <button className="flex items-center gap-3 px-6 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[11px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-[0.2em]">
               Export as CSV <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left">
                {['User Name', 'Email Address', 'Status', 'Last Activity', 'Actions'].map(th => (
                  <th key={th} className="text-[10px] font-black text-gray-800 uppercase tracking-[0.25em] pb-8 px-6">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-4">
              {users.map((u, i) => (
                <tr key={i} className="group hover:bg-white/[0.01] transition-colors rounded-3xl">
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[11px] font-black text-gray-600 uppercase tracking-tighter">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[14px] font-black text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="text-[13px] font-bold text-gray-600">{u.email}</span>
                  </td>
                  <td className="py-6 px-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.statusColor}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-6 px-6 text-[13px] text-gray-600 font-bold">
                    {u.activity}
                  </td>
                  <td className="py-6 px-6">
                    <button className="p-3 rounded-xl hover:bg-white/5 text-gray-700 hover:text-white transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-12 pt-10 border-t border-white/[0.04] flex justify-between items-center px-6">
            <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Showing 4 of 12,400 users</p>
            <div className="flex gap-6">
               <button className="text-[11px] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors">Previous</button>
               <button className="text-[11px] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors">Next</button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="pt-24 pb-8 text-center border-t border-white/[0.04]">
          <div className="flex justify-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700 mb-8 cursor-default">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map(l => (
              <span key={l} className="hover:text-gray-400 transition-colors cursor-pointer">{l}</span>
            ))}
          </div>
          <div className="space-y-1.5 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5]" />
              <p className="text-base font-black text-white tracking-tight">AuraResume AI</p>
            </div>
            <p className="text-[11px] font-bold text-gray-800 tracking-widest uppercase">© 2024 AuraResume AI. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Admin;
