import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  ShieldCheck,
  BarChart3,
  CloudLightning,
  HelpCircle,
  Bell,
  Search,
  Menu,
  X,
  BrainCircuit,
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'My Resumes', icon: FileText },
    { path: '/matches', label: 'Job Matches', icon: Briefcase },
    { path: '/recommendations', label: 'Recommendations', icon: ShieldCheck },
    { path: '/insights', label: 'Skill Insights', icon: CloudLightning },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/students', label: 'Students', icon: User },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { path: '/admin/jobs', label: 'Job Descriptions', icon: Briefcase },
    { path: '/admin/readiness', label: 'Job Readiness', icon: ShieldCheck },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/insights', label: 'Skill Insights', icon: CloudLightning },
    { path: '/admin/settings', label: 'Settings', icon: HelpCircle },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  const pageInfo = {
    '/history': { title: 'My Resumes', subtitle: 'Manage and track all your analyzed documents.' },
    '/matches': { title: 'Job Matches', subtitle: 'High-probability career opportunities for you.' },
    '/recommendations': { title: 'Recommendations', subtitle: 'AI-driven suggestions for your next career move.' },
    '/insights': { title: 'Skill Insights', subtitle: 'Detailed breakdown of your professional expertise.' },
    '/profile': { title: 'My Profile', subtitle: 'Manage your personal information and settings.' },
    '/support': { title: 'Help & Support', subtitle: 'Need assistance? We are here to help.' },
    '/admin': { title: 'Admin Dashboard', subtitle: 'Platform overview and system metrics.' },
    '/admin/students': { title: 'Student Management', subtitle: 'Manage student accounts and records.' },
    '/admin/reports': { title: 'Global Reports', subtitle: 'Analyze student resume performance data.' },
    '/admin/jobs': { title: 'Job Descriptions', subtitle: 'Manage available job roles and requirements.' },
    '/admin/readiness': { title: 'Job Readiness', subtitle: 'Monitor students ready for the industry.' },
    '/admin/analytics': { title: 'System Analytics', subtitle: 'Deep dive into platform usage trends.' },
    '/admin/insights': { title: 'Market Insights', subtitle: 'Global skill gaps and demand trends.' },
    '/admin/settings': { title: 'Admin Settings', subtitle: 'Configure platform parameters and users.' },
  };

  const currentPage = pageInfo[location.pathname];

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex font-sans w-full h-[100dvh] overflow-hidden">
        
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="absolute inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "absolute lg:static top-0 left-0 z-50 h-full w-64 bg-[#f8fafe] border-r border-[#e2e8f0] transform transition-transform duration-300 ease-spring flex flex-col pt-8 pb-8 shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
          {/* Logo Area */}
          <div className="flex items-center gap-3 px-8 mb-10 shrink-0">
            <BrainCircuit className="w-8 h-8 text-[#4169e1] fill-[#4169e1]/20" />
            <span className="font-display font-black text-2xl tracking-tight text-[#1e293b]">Kredo</span>
            <button 
              className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto w-full">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200",
                    isActive 
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 translate-x-2" 
                      : "text-[#64748b] hover:bg-white hover:text-[#334155] hover:shadow-sm"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-[#94a3b8]")} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer Actions */}
          <div className="px-5 mt-auto shrink-0 w-full space-y-2">
             <NavLink 
               to="/support"
               className={({ isActive }) => cn(
                "flex items-center gap-3 w-full px-4 py-3 border rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-[#4b7bff] text-white shadow-lg border-transparent shadow-blue-500/10" 
                  : "bg-white/40 shadow-sm border-white/60 text-[#64748b] hover:text-[#334155] hover:bg-white/60"
              )}
             >
              <HelpCircle className="w-5 h-5" />
              Support
            </NavLink>

            <button 
              onClick={() => { logout(); navigate('/auth', { replace: true }); }}
              className="flex items-center gap-3 w-full px-4 py-3 border border-red-100/30 bg-red-50/10 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500/80 hover:bg-red-500 hover:text-white transition-all group shadow-sm hover:shadow-red-500/20"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-slate-50/80">
          {/* Dynamic Mesh Background Blooms */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -right-[5%] w-[70%] h-[70%] bg-cyan-200/40 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute -bottom-[10%] -left-[5%] w-[65%] h-[65%] bg-lime-200/40 blur-[130px] rounded-full animate-pulse shadow-[0_0_100px_rgba(190,242,100,0.3)]" style={{ animationDuration: '12s' }} />
            <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-blue-100/30 blur-[100px] rounded-full" />
            
            {/* Base Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/40 opacity-70" />
          </div>

          <div className="relative z-10 flex flex-col h-full">
          
          {/* Topbar */}
          <header className="h-24 px-8 shrink-0 flex items-center justify-between z-30">
            
            <div className="flex items-center gap-4 flex-1">
              {currentPage && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-xl font-black text-[#1e293b] tracking-tight">{currentPage.title}</h2>
                  <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">{currentPage.subtitle}</p>
                </div>
              )}
            </div>

            {/* Profile & Actions */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-1.5 pr-4 ml-2 hover:shadow-md transition-all border border-transparent hover:border-[#4b7bff]/20"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold text-[#334155] hidden sm:block">{user?.name || 'User'}</span>
                  <ChevronDown className={cn("w-4 h-4 text-[#94a3b8] hidden sm:block transition-transform", profileOpen && "rotate-180")} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[1.8rem] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2)] overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-4 duration-300">
                      <button 
                        onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-6 py-3.5 text-sm font-bold text-[#475569] hover:bg-white hover:text-[#4b7bff] transition-all"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <div className="h-[1px] bg-slate-100/50 mx-4 my-1" />
                      <button 
                        onClick={() => { logout(); navigate('/auth', { replace: true }); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-6 py-3.5 text-sm font-bold text-red-500 hover:bg-white transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
            {children}
          </div>
        </div>
      </main>
      
      {/* Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
};

export default AppLayout;
