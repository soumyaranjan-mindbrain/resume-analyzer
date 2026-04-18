import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FileEdit,
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
  LogOut,
  Monitor,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import NeuralAnalysisOverlay from '../ui/NeuralAnalysisOverlay';
import SlimFooter from './SlimFooter';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'My Resumes', icon: FileText },
    { path: '/resume-maker', label: 'Resume Maker', icon: FileEdit },
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
    { path: '/admin/support', label: 'Support Management', icon: HelpCircle },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  const pageInfo = {
    '/dashboard': {
      title: `Welcome, ${user?.name?.split(' ')[0] || 'User'}!`,
      subtitle: 'Welcome back to your personalized career intelligence suite.'
    },
    '/history': { title: 'My Resumes', subtitle: 'Manage and track all your analyzed documents.' },
    '/resume-maker': { title: 'Resume Maker', subtitle: 'Construct your professional narrative with AI.' },
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
    '/admin/support': { title: 'Support Management', subtitle: 'Manage student support queries and FAQs.' },
    '/admin/settings': { title: 'Settings', subtitle: 'Configure platform parameters and users.' },
  };

  const currentPage = pageInfo[location.pathname];

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex w-full h-[100dvh] overflow-hidden print:h-auto print:overflow-visible">


      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Sidebar */}
      <aside
        className={cn(
          "absolute lg:static top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-spring flex flex-col pt-8 pb-8 shrink-0 print:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* sidebar gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center px-6 mb-12 shrink-0 w-full overflow-hidden">
          <Logo size="md" className="w-full" onClick={() => navigate('/')} />
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
            onClick={() => { logout(); navigate('/', { replace: true }); }}
            className="flex items-center gap-3 w-full px-4 py-3 border border-red-50 bg-red-50/20 rounded-2xl font-bold text-xs text-red-600 hover:bg-red-600 hover:text-white transition-all group shadow-sm"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>


      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[#eff3f6] print:h-auto print:overflow-visible px-0">

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


          <header className="h-20 lg:h-24 px-4 lg:px-8 shrink-0 flex items-center justify-between z-30 print:hidden">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-600 hover:text-blue-600 transition-all mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 flex-1 min-w-0">
              {currentPage && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 overflow-hidden">
                  <h2 className="text-sm lg:text-xl font-bold text-slate-800 tracking-tight truncate">{currentPage.title}</h2>
                  <p className="text-[10px] lg:text-xs font-medium text-slate-500 tracking-wide truncate">{currentPage.subtitle}</p>
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
                        onClick={() => { logout(); navigate('/', { replace: true }); setProfileOpen(false); }}
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
            {user?.role === 'admin' && isMobile ? (
              <div className="h-[100dvh] fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                {/* Premium Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-blue-100/40 blur-[120px] rounded-full animate-pulse" />
                  <div className="absolute bottom-[-15%] left-[-15%] w-[90%] h-[90%] bg-slate-200/40 blur-[140px] rounded-full" />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                </div>

                <div className="relative z-10 max-w-sm w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-spring">

                  <div className="space-y-4 mb-10">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] italic">
                      Admin Access <br />
                      <span className="text-blue-600">Restricted</span>
                    </h3>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest opacity-80">Device Mismatch Detected</p>
                  </div>

                  <p className="text-slate-600 text-sm font-semibold leading-relaxed mb-10 px-4">
                    The MindVista Control Panel is a high-precision instrument optimized for <span className="text-blue-600 italic">Desktop Architectures</span> only. Large-scale data visualization requires a wider viewport.
                  </p>

                  <div className="space-y-3 mb-12">
                    {[
                      { id: '01', text: 'Switch to a Desktop Workstation' },
                      { id: '02', text: 'Login via Windows or MacOS Browser' }
                    ].map((step, i) => (
                      <div key={i} className="group bg-white/60 backdrop-blur-xl border border-white shadow-sm rounded-3xl p-5 flex items-center gap-5 hover:bg-white hover:shadow-md transition-all duration-500">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-[12px] shrink-0 shadow-lg shadow-slate-900/10">
                          {step.id}
                        </div>
                        <p className="text-xs font-black text-slate-800 text-left uppercase tracking-tight">{step.text}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => { logout(); navigate('/', { replace: true }); }}
                    className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.25em] hover:bg-blue-600 hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)] transition-all duration-500 group relative overflow-hidden active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    Return to Landing Page <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </div>

                <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3">
                  <div className="w-12 h-1 bg-slate-200 rounded-full" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Precision Operations Required</p>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
          <SlimFooter />
        </div>
      </main>


      <style dangerouslySetInnerHTML={{
        __html: `
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
      <NeuralAnalysisOverlay />
    </div>
  );
};

export default AppLayout;
