import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Users,
  FileText,
  Briefcase,
  Zap,
  BarChart2,
  Cpu,
  Settings as SettingsIcon,
  Search,
  Bell,
  Moon,
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  Activity,
  History,
  Target
} from 'lucide-react';

// Import Admin Sub-components from local directory
import AdminDashboard from './Dashboard';
import AdminStudents from './Students';
import AdminReports from './Reports';
import AdminJobs from './Jobs';
import AdminJobReadiness from './JobReadiness';
import AdminAnalytics from './Analytics';
import AdminSkillInsights from './SkillInsights';
import AdminSettings from './Settings';

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
const Sidebar = ({ activeView, setActiveView }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'jobs', label: 'Job Descriptions', icon: Briefcase },
    { id: 'readiness', label: 'Job Readiness', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'skills', label: 'Skill Insights', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="w-[320px] h-screen bg-[#030712] border-r border-white/[0.04] flex flex-col p-10 sticky top-0 z-40 overflow-hidden">
      {/* Brand */}
      <div className="mb-16 flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] p-[1px] shadow-lg shadow-[#00D2FF]/20 group-hover:scale-110 transition-transform">
          <div className="w-full h-full rounded-xl bg-[#030712] flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="space-y-0.5">
           <h1 className="text-xl font-black text-white tracking-tight">Aptica Admin</h1>
           <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em]">Institutional Tier</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 -mx-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 group relative ${
              activeView === item.id 
                ? 'bg-white/[0.04] text-[#00D2FF] shadow-[0_4px_20px_rgba(0,0,0,0.2)]' 
                : 'text-gray-600 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {activeView === item.id && (
               <motion.div layoutId="sidebar-active" className="absolute left-0 w-1.5 h-6 bg-[#00D2FF] rounded-r-full shadow-[0_0_15px_rgba(0,210,255,0.6)]" />
            )}
            <item.icon className={`w-5 h-5 transition-colors ${activeView === item.id ? 'text-[#00D2FF]' : 'text-gray-800 group-hover:text-gray-400'}`} />
            <span className="text-[13px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="pt-10 border-t border-white/[0.04] space-y-6">
         <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">System Status</span>
            </div>
            <p className="text-[12px] font-bold text-white uppercase italic">Optimal Performance</p>
         </div>
         <button 
           onClick={() => navigate('/')} 
           className="w-full flex items-center gap-4 px-6 py-4 text-gray-700 hover:text-red-400 transition-all font-black text-[13px] uppercase tracking-widest"
         >
           <LogOut className="w-5 h-5" /> Logout
         </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
const TopBar = ({ title }) => {
  return (
    <div className="h-24 px-12 flex items-center justify-between bg-[#030712]/50 backdrop-blur-xl sticky top-0 z-30 border-b border-white/[0.04] shadow-2xl shadow-black/20">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">{title}</h2>
        <div className="w-[450px] relative group hidden xl:block">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-700 group-focus-within:text-[#00D2FF] transition-colors" />
          <input 
            type="text" 
            placeholder="Search students, archives, or configuration..."
            className="w-full bg-[#0D1117] border border-white/[0.04] rounded-2xl pl-14 pr-6 py-4 text-[13px] text-white focus:outline-none focus:border-[#00D2FF]/20 placeholder:text-gray-800 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex items-center gap-6 pr-10 border-r border-white/5">
           <button className="text-gray-700 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00D2FF] rounded-full border-[2.5px] border-[#030712]" />
           </button>
           <button className="text-gray-700 hover:text-white transition-all">
              <Moon className="w-5 h-5" />
           </button>
           <button className="text-gray-700 hover:text-white transition-all">
              <History className="w-5 h-5" />
           </button>
        </div>
        
        <div className="flex items-center gap-4 group cursor-pointer bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-2.5 hover:bg-white/[0.04] transition-all">
           <div className="text-right">
              <p className="text-[13px] font-black text-white">Soumya R.</p>
              <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Master Admin</p>
           </div>
           <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] p-[1px]">
              <div className="w-full h-full rounded-xl bg-[#030712] flex items-center justify-center overflow-hidden italic font-black text-white text-[12px]">
                 SR
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ADMIN ROOT
───────────────────────────────────────────── */
const Admin = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <AdminDashboard />;
      case 'students': return <AdminStudents />;
      case 'reports': return <AdminReports />;
      case 'jobs': return <AdminJobs />;
      case 'readiness': return <AdminJobReadiness />;
      case 'analytics': return <AdminAnalytics />;
      case 'skills': return <AdminSkillInsights />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  const getPageTitle = () => {
    switch(activeView) {
      case 'dashboard': return 'Overview';
      case 'students': return 'Student Management';
      case 'reports': return 'Analysis Reports';
      case 'jobs': return 'Job Descriptions';
      case 'readiness': return 'Readiness Tracker';
      case 'analytics': return 'Deep Analytics';
      case 'skills': return 'Skill Gap Insights';
      case 'settings': return 'System Settings';
      default: return 'Admin Panel';
    }
  };

  return (
    <div className="flex bg-[#030712] min-h-screen font-inter selection:bg-[#00D2FF]/30 overflow-x-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar relative flex flex-col">
        <TopBar title={getPageTitle()} />
        
        <main className="p-12 space-y-12 max-w-[1600px] mx-auto min-h-screen flex-1 flex flex-col text-white pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <footer className="pt-32 pb-8 border-t border-white/[0.04]">
            <div className="flex justify-center gap-12 text-[11px] font-black uppercase tracking-[0.25em] text-gray-800 mb-10 cursor-default">
              {['Security Center', 'Audit Logs', 'Compliance', 'Privacy Tier', 'Infrastructure'].map(l => (
                <span key={l} className="hover:text-gray-400 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] shadow-lg shadow-[#00D2FF]/10" />
                 <p className="text-lg font-black text-white tracking-tighter">Aptica Admin Console</p>
              </div>
              <p className="text-[11px] font-black text-gray-800 tracking-[0.3em] uppercase">SYSTEM VERSION 2.4.0-STABLE • © 2024 MIND BRAIN INC.</p>
            </div>
          </footer>
        </main>
        
        {/* Subtle background glow */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#00D2FF]/[0.02] rounded-full blur-[150px] -z-10 pointer-events-none" />
        <div className="fixed bottom-0 left-[320px] w-[600px] h-[600px] bg-purple-600/[0.02] rounded-full blur-[150px] -z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default Admin;
