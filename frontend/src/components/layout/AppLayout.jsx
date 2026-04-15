import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  ShieldCheck,
  BarChart3,
  CloudLightning,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'My Resumes', icon: FileText },
    { path: '/matches', label: 'Jobs', icon: Briefcase },
    { path: '/recommendations', label: 'Recommendations', icon: ShieldCheck },
    { path: '/insights', label: 'Skill Insights', icon: CloudLightning },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/students', label: 'Students', icon: User },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { path: '/admin/jobs', label: 'Job Descriptions', icon: Briefcase },
    { path: '/admin/insights', label: 'Market Insights', icon: CloudLightning },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  const pageInfo = {
    '/dashboard': { 
      title: `Welcome, ${user?.name?.split(' ')[0] || 'User'}!`, 
      subtitle: 'Welcome back to your personalized career intelligence suite.' 
    },
    '/history': { title: 'My Resumes', subtitle: 'Manage and track all your analyzed documents.' },
    '/matches': { title: 'Jobs', subtitle: 'High-probability career opportunities for you.' },
    '/recommendations': { title: 'Recommendations', subtitle: 'AI-driven suggestions for your next career move.' },
    '/insights': { title: 'Skill Insights', subtitle: 'Detailed breakdown of your professional expertise.' },
    '/profile': { title: 'My Profile', subtitle: 'Manage your personal information and settings.' },
    '/support': { title: 'Help & Support', subtitle: 'Need assistance? We are here to help.' },
    '/admin': { title: 'Admin Dashboard', subtitle: 'Platform overview and system metrics.' },
    '/admin/students': { title: 'Student Management', subtitle: 'Manage student accounts and records.' },
    '/admin/reports': { title: 'Global Reports', subtitle: 'Analyze student resume performance data.' },
    '/admin/jobs': { title: 'Job Descriptions', subtitle: 'Manage available job roles and requirements.' },
    '/admin/jobs/new': { title: 'Create New Job Role', subtitle: 'Add a new position to the recruitment catalog.' },
    '/admin/insights': { title: 'Market Insights', subtitle: 'Global skill gaps and demand trends.' },
    '/admin/settings': { title: 'Admin Settings', subtitle: 'Configure platform parameters and users.' },
  };

  const currentPage = pageInfo[location.pathname];

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex w-full h-[100dvh] overflow-hidden">
        
      
      {sidebarOpen && (
        <div 
          className="absolute inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      {/* Sidebar */}
      <aside 
        className={cn(
          "absolute lg:static top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-spring flex flex-col pt-8 pb-8 shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
          {/* sidebar gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3 px-6 mb-10 shrink-0">
            <Logo size="sm" onClick={() => navigate('/')} />
            <button 
              className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          
          <nav className="relative z-10 flex-1 px-4 space-y-2 overflow-y-auto w-full border-b border-slate-100 mb-4 pb-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all duration-200",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          
          <div className="relative z-10 px-5 mt-auto shrink-0 w-full space-y-2">
            {user?.role !== 'admin' && (
              <NavLink 
                to="/support"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 w-full px-4 py-3 border rounded-2xl font-bold text-xs transition-all",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md border-transparent" 
                    : "bg-white shadow-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <HelpCircle className="w-5 h-5" />
                Support Center
              </NavLink>
            )}

            <button 
              onClick={() => { logout(); navigate('/auth', { replace: true }); }}
              className="flex items-center gap-3 w-full px-4 py-3 border border-red-50 bg-red-50/20 rounded-2xl font-bold text-xs text-red-600 hover:bg-red-600 hover:text-white transition-all group shadow-sm"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Sign Out
            </button>
          </div>
        </aside>

        
        <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[#eff3f6]">
          
          {user?.role !== 'admin' ? (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute -top-[10%] -right-[5%] w-[70%] h-[70%] bg-blue-100/30 blur-[130px] rounded-full" />
              <div className="absolute -bottom-[10%] -left-[5%] w-[65%] h-[65%] bg-slate-200/30 blur-[130px] rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-70" />
            </div>
          ) : (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.4]">
               {/* Secondary tint for admin panel */}
               <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-50/50 blur-[120px] rounded-full" />
               <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-slate-100/50 blur-[120px] rounded-full" />
            </div>
          )}

          <div className="relative z-10 flex flex-col h-full">
          
          
          <header className="h-24 px-8 shrink-0 flex items-center justify-between z-30">
            
            <div className="flex items-center gap-4 flex-1">
              {currentPage && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">{currentPage.title}</h2>
                  <p className="text-xs font-medium text-slate-500 tracking-wide">{currentPage.subtitle}</p>
                </div>
              )}
            </div>

            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-white shadow-sm rounded-2xl p-1.5 pr-4 ml-2 hover:shadow-md transition-all border border-slate-100"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                    {user?.profilePic ? (
                      <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                   <span className="text-sm font-bold text-slate-700 hidden sm:block">{user?.name || 'User'}</span>

                  <ChevronDown className={cn("w-4 h-4 text-slate-500 hidden sm:block transition-transform", profileOpen && "rotate-180")} />
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

          
          <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
            {children}
          </div>
        </div>
      </main>
      
      
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
