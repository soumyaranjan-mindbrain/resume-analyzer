import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Plus,
  Edit,
  Download,
  Mail,
  Smartphone,
  Shield,
  Zap,
  Globe,
  Share2,
  Copy,
  Star,
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
    { label: 'Saved Jobs', icon: Bookmark, path: '/saved' },
    { label: 'Settings', icon: Settings, active: true, path: '/profile' },
  ];

  return (
    <div className="w-64 h-screen bg-[#090D14] border-r border-white/[0.04] flex flex-col p-6 sticky top-0">
      <div className="mb-12">
        <h1 className="text-white text-lg font-bold cursor-pointer" onClick={() => navigate('/')}>Aura AI</h1>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mt-0.5 tracking-widest">Premium Tier</p>
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
        <button 
          onClick={() => navigate('/upload')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00D2FF] text-black text-[12px] font-black rounded-xl hover:bg-[#00D2FF]/90 hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all uppercase tracking-wider mb-6"
        >
          <Plus className="w-4 h-4 text-black" strokeWidth={3} />
          Analyze New Resume
        </button>
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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input 
          type="text" 
          placeholder="Search profile..."
          className="w-full bg-[#0D1117] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-[12px] text-white placeholder:text-gray-600 focus:outline-none"
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
          <p className="text-[9px] font-bold text-[#00D2FF] uppercase tracking-tighter">Premium</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center p-0.5 overflow-hidden">
          <img src="/alex-rivera-profile.png" alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */
const Toggle = ({ active }) => (
  <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-[#00D2FF]' : 'bg-gray-800'}`}>
    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${active ? 'right-1' : 'left-1'}`} />
  </div>
);

/* ─────────────────────────────────────────────
   PAGE CONTENT
───────────────────────────────────────────── */
const Profile = () => {
  const navigate = useNavigate();
  return (
    <div className="flex bg-[#030712] min-h-screen font-inter selection:bg-[#00D2FF]/30">
      <Sidebar />
      <div className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        <TopBar />
        <main className="p-12 max-w-[1250px] mx-auto space-y-8">
          <header className="mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Account Settings</h2>
            <p className="text-xs text-gray-600 font-medium tracking-tight">Manage your professional profile and Aura AI preferences.</p>
          </header>

          <div className="grid grid-cols-12 gap-8">
             {/* Left Panel: Profile */}
             <div className="col-span-8 flex flex-col gap-8">
                {/* Profile Card */}
                <div className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-10 flex items-center gap-10">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-2 border-[#00D2FF]/20 p-1.5 shadow-[0_0_30px_rgba(0,210,255,0.1)]">
                       <img src="/alex-rivera-profile.png" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <button className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#030712] border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00D2FF] transition-all">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 h-full py-2">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black text-white tracking-tight">Alex Rivera</h3>
                      <span className="px-3 py-1 bg-[#00D2FF]/10 border border-[#00D2FF]/20 rounded-full text-[9px] font-black uppercase text-[#00D2FF] tracking-widest shadow-[0_0_15px_rgba(0,210,255,0.2)]">Premium Member</span>
                    </div>
                    <p className="text-[12px] text-gray-500 font-medium mb-8">alex.rivera@design.co</p>
                    
                    <div className="flex gap-4">
                      <button className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[11px] font-black text-white hover:bg-white/[0.06] transition-all uppercase tracking-wide">
                        Update Avatar
                      </button>
                      <button className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[11px] font-black text-white hover:bg-white/[0.06] transition-all uppercase tracking-wide">
                        Download Portfolio
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-[#0D1117] border border-white/[0.04] rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-0.5">Total Resumes</p>
                      <p className="text-xl font-black text-white">42</p>
                    </div>
                  </div>
                  <div className="bg-[#0D1117] border border-white/[0.04] rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                      <BarChart2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-cyan-400 font-black uppercase tracking-widest mb-0.5">Avg ATS Score</p>
                      <p className="text-xl font-black text-white">88%</p>
                    </div>
                  </div>
                  <div className="bg-[#0D1117] border border-white/[0.04] rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Search className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-purple-400 font-black uppercase tracking-widest mb-2">Top Missing Skills</p>
                      <div className="flex gap-2">
                        <span className="text-[9px] font-black text-white bg-white/[0.05] px-2 py-0.5 rounded">Python</span>
                        <span className="text-[9px] font-black text-white bg-white/[0.05] px-2 py-0.5 rounded">Cloud Arch</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Details Row */}
                <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h4 className="text-lg font-black text-white tracking-tight">Personal Details</h4>
                    <button className="text-[12px] font-black text-[#00D2FF] uppercase hover:underline">Save Changes</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      <label className="text-[9px] text-gray-700 font-black uppercase tracking-widest ml-1">Full Name</label>
                      <input type="text" defaultValue="Alex Rivera" className="w-full bg-[#030712] border border-white/[0.06] rounded-2xl p-4 text-[13px] text-white focus:outline-none focus:border-[#00D2FF]/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-gray-700 font-black uppercase tracking-widest ml-1">Email Address</label>
                      <input type="email" defaultValue="alex.rivera@design.co" className="w-full bg-[#030712] border border-white/[0.06] rounded-2xl p-4 text-[13px] text-white focus:outline-none focus:border-[#00D2FF]/20" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] text-gray-700 font-black uppercase tracking-widest ml-1">Professional Headline</label>
                    <input type="text" defaultValue="Senior Product Designer & Systems Architect" className="w-full bg-[#030712] border border-white/[0.06] rounded-2xl p-4 text-[13px] text-white focus:outline-none focus:border-[#00D2FF]/20" />
                  </div>
                </div>

                {/* Security */}
                <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10">
                  <h4 className="text-lg font-black text-white tracking-tight mb-8">Security & Password</h4>
                  
                  <div className="space-y-5">
                    <div className="bg-[#030712] border border-white/[0.06] rounded-2xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-600">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-white mb-0.5">Password Settings</p>
                          <p className="text-[11px] text-gray-700 font-bold uppercase tracking-widest">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <button className="px-5 py-2 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] rounded-xl text-[11px] font-black uppercase text-white tracking-widest">Update</button>
                    </div>

                    <div className="bg-[#030712] border border-white/[0.06] rounded-2xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-600">
                          <Globe className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-white mb-0.5">Two-Factor Authentication</p>
                          <p className="text-[11px] text-gray-700 font-bold uppercase tracking-widest">Enable an extra layer of security</p>
                        </div>
                      </div>
                      <Toggle active={false} />
                    </div>
                  </div>
                </div>
             </div>

             {/* Right Panel: Actions & Prefs */}
             <div className="col-span-4 flex flex-col gap-8">
                {/* Quick Actions */}
                <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-8 flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <Zap className="w-4 h-4 text-[#00D2FF] fill-[#00D2FF]" />
                    <h3 className="text-[14px] font-black text-white tracking-tight">Quick Actions</h3>
                  </div>
                  
                  <div className="space-y-4 mb-10">
                    <button className="w-full bg-[#030712] border border-white/[0.04] hover:bg-white/[0.02] rounded-2xl p-4 flex items-center justify-between text-gray-500 hover:text-white transition-all">
                      <span className="text-[12px] font-black uppercase tracking-widest">Export My Data</span>
                      <Download className="w-4 h-4 text-gray-700" />
                    </button>
                    <button onClick={() => navigate('/')} className="w-full bg-red-500/10 border border-red-500/10 hover:bg-red-500/20 rounded-2xl p-4 flex items-center justify-between text-red-500 transition-all">
                      <span className="text-[12px] font-black uppercase tracking-widest">Logout Session</span>
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-gray-800 font-bold leading-relaxed">
                    Last logged in: Oct 24, 2024 at 10:45 AM from <br/> San Francisco, CA.
                  </p>
                </div>

                {/* Notification Prefs */}
                <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10">
                  <h4 className="text-[16px] font-black text-white tracking-tight mb-8">Notification Prefs</h4>
                  <div className="space-y-8">
                    {[
                      { label: 'ATS Match Alerts', desc: 'Get notified when a new resume hits 90%+', active: true },
                      { label: 'Email Digest', desc: 'Weekly summary of job market trends', active: true },
                      { label: 'Browser Pings', desc: 'Real-time job opportunity tracking', active: false },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                          <p className="text-[13px] font-black text-white mb-0.5">{item.label}</p>
                          <p className="text-[11px] text-gray-700 font-bold leading-tight">{item.desc}</p>
                        </div>
                        <Toggle active={item.active} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referral Panel */}
                <div className="bg-gradient-to-br from-[#7C4DFF] to-[#00D2FF] rounded-[3rem] p-10 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white mb-4 leading-[1.1]">Refer a friend, get 3 months free.</h3>
                    <p className="text-[12px] font-black text-white/70 mb-8 leading-relaxed">
                      Share the power of AI with your network and extend your premium membership.
                    </p>
                    <button className="w-full py-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center gap-3 text-white text-[12px] font-black uppercase tracking-widest hover:bg-white/30 transition-all">
                      <Copy className="w-4 h-4" />
                      Copy Referral Link
                    </button>
                  </div>
                  
                  {/* Decorative blobs */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-[2s]" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-900/40 blur-[50px] rounded-full" />
                </div>
             </div>
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
                <div className="w-4 h-4 rounded bg-gradient-to-br from-[#00D2FF] to-[#7C4DFF] flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-black fill-black" />
                </div>
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

export default Profile;
