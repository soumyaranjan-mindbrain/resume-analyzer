import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  Upload,
  ArrowUp,
  MoreHorizontal,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  ListChecks
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dashboardBanner from '../../assets/dashboard-banner-seamless.png';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/api';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const toneStyles = {
  blue: {
    card: 'bg-[#f0f7ff]/25 hover:shadow-blue-500/30',
    icon: 'text-[#4b7bff]',
    orb: 'bg-blue-500/10',
    accent: 'text-blue-300 group-hover:text-blue-500'
  },
  emerald: {
    card: 'bg-[#f0fff4]/25 hover:shadow-emerald-500/30',
    icon: 'text-[#10b981]',
    orb: 'bg-emerald-500/10',
    accent: 'text-emerald-300 group-hover:text-emerald-500'
  },
  orange: {
    card: 'bg-[#fffcf0]/25 hover:shadow-orange-500/30',
    icon: 'text-[#f59e0b]',
    orb: 'bg-orange-500/10',
    accent: 'text-orange-300 group-hover:text-orange-500'
  },
  purple: {
    card: 'bg-[#f7f0ff]/25 hover:shadow-purple-500/30',
    icon: 'text-[#8b5cf6]',
    orb: 'bg-purple-500/10',
    accent: 'text-purple-300 group-hover:text-purple-500'
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const summaryCards = [
    {
      label: 'ATS Score',
      value: stats ? `${stats.atsScore}%` : '0%',
      tone: 'blue',
      icon: BarChart3,
      note: stats?.atsScore > 0 ? '+ 2% since last scan' : 'Upload to see score',
      noteTone: 'text-[#10b981]',
      noteIcon: ArrowUp
    },
    {
      label: 'Job Ready',
      value: stats ? (stats.atsScore > 70 ? '92%' : 'Low') : '0%',
      tone: 'emerald',
      icon: ShieldCheck,
      detail: 'Based on ATS score and overall skill matching algorithms.'
    },
    {
      label: 'Gaps',
      value: stats ? stats.keywordsMissing.toString().padStart(2, '0') : '00',
      tone: 'orange',
      icon: AlertTriangle,
      action: 'View Analysis'
    },
    {
      label: 'Matches',
      value: stats ? stats.jobsMatched.toString().padStart(2, '0') : '00',
      tone: 'purple',
      icon: Briefcase,
      detail: 'Relevant matches found in your field.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin shadow-lg shadow-blue-500/20" />
          <p className="text-[#4b7bff] font-black uppercase tracking-widest text-xs animate-pulse">Syncing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 flex shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] min-h-[300px]">
        <div className="absolute inset-0 w-full h-full">
           <img 
             src={dashboardBanner} 
             alt="Welcome Banner" 
             className="w-full h-full object-cover object-center" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/10 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 p-12 flex flex-col justify-center w-full max-w-2xl">
          <h1 className="text-5xl font-black text-[#1e293b] tracking-tighter">Welcome, <span className="text-[#4b7bff]">{user?.name?.split(' ')[0] || 'User'}</span>!</h1>
          <p className="text-[#64748b] text-base font-medium max-w-md leading-relaxed">
            Your personal AI-powered resume dashboard is updated with the latest trends.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center gap-3 bg-[#4b7bff] text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-[#3b63d6] transition-all shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95"
            >
              <Upload className="w-5 h-5" />
              Upload New Resume
            </button>
          </div>

          <p className="text-[13px] text-[#64748b] pt-1 font-semibold opacity-80">
            Haven't updated your resume in awhile? Upload the latest version now!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const tone = toneStyles[card.tone];
          const dynamicValue = card.value;
          return (
            <div key={card.label} className={`bg-white/25 backdrop-blur-3xl rounded-[2.8rem] p-7 border border-white/60 relative overflow-hidden group shadow-[0_45px_100px_-20px_rgba(15,23,42,0.35),inset_0_1px_3px_rgba(255,255,255,0.5)] transition-all duration-700 ${tone.card}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/[0.12] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 p-6 cursor-pointer">
                <ChevronRight className={`w-4 h-4 ${tone.accent} transition-colors`} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/80 ${tone.icon} flex items-center justify-center shadow-sm backdrop-blur-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-[#334155] text-sm uppercase tracking-wide">{card.label}</span>
              </div>
               <h2 className="text-5xl font-black text-[#1e293b] tracking-tight mb-2">{dynamicValue}</h2>
              <div className="flex flex-col gap-1">
                {card.note && (
                  <span className={card.noteTone + " text-xs font-black inline-flex items-center gap-1"}>
                    <card.noteIcon className="w-3.5 h-3.5" /> {card.note}
                  </span>
                )}
                {card.detail && <span className="text-[#64748b] text-[11px] font-semibold leading-relaxed max-w-[90%] opacity-70">{card.detail}</span>}
                {card.action && (
                  <button className="text-[#4b7bff] text-xs font-black uppercase tracking-wider hover:underline flex items-center gap-1">
                    {card.action} <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 ${tone.orb} rounded-full blur-2xl`} />
            </div>
          );
        })}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

        
        <div className="bg-white/25 backdrop-blur-[40px] rounded-[2.8rem] p-8 shadow-[0_60px_100px_-20px_rgba(15,23,42,0.4),inset_0_1px_4px_rgba(255,255,255,0.6)] border border-white/70 h-full relative overflow-hidden group transition-all duration-700 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-900/[0.15] pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-black text-[#1e293b] text-xl tracking-tight">Performance</h3>
            <MoreHorizontal className="w-5 h-5 text-[#cbd5e1] cursor-pointer" />
          </div>

          <p className="text-[#94a3b8] text-[11px] font-black uppercase tracking-widest mb-6 relative z-10">ATS Score History</p>

          <div className="w-full h-48 relative flex-1">
            <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-[#94a3b8] font-bold pb-6 w-8">
              <span>80</span>
              <span>65</span>
              <span>40</span>
            </div>
            <div className="ml-8 absolute inset-0 pb-6 border-b border-slate-100/50">
              <div className="w-full h-[1px] bg-slate-50 absolute top-[0%]" />
              <div className="w-full h-[1px] bg-slate-50 absolute top-[50%]" />
              <div className="w-full h-[1px] bg-slate-50 absolute top-[100%]" />

              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4b7bff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4b7bff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 100 Q 100 80 150 75 T 300 60 T 450 30 L 450 120 L 10 120 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 10 100 Q 100 80 150 75 T 300 60 T 450 30"
                  fill="none"
                  stroke="#4b7bff"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="100" r="5" fill="white" stroke="#4b7bff" strokeWidth="2.5" />
                <circle cx="150" cy="75" r="5" fill="white" stroke="#4b7bff" strokeWidth="2.5" />
                <circle cx="300" cy="60" r="5" fill="white" stroke="#4b7bff" strokeWidth="2.5" />
                <circle cx="450" cy="30" r="5" fill="white" stroke="#4b7bff" strokeWidth="2.5" />
              </svg>
            </div>

            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-[#94a3b8] font-black uppercase tracking-tighter px-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform" />
        </div>

        
        <div className="bg-[#fcfaff]/25 backdrop-blur-[40px] rounded-[2.8rem] p-8 shadow-[0_60px_100px_-20px_rgba(15,23,42,0.4),inset_0_1px_4px_rgba(255,255,255,0.6)] border border-white/70 h-full relative overflow-hidden group transition-all duration-700 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-900/[0.15] pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-black text-[#1e293b] text-xl tracking-tight">Skill Breakdown</h3>
            <MoreHorizontal className="w-5 h-5 text-[#cbd5e1] cursor-pointer hover:text-slate-600 transition-colors" />
          </div>

          <div className="flex flex-col xl:flex-row items-center gap-8 justify-between flex-1 relative z-10">
            <ul className="space-y-4 w-full xl:w-auto">
              {[
                { label: "Technical Skills", color: "bg-[#4b7bff]", percent: stats ? `${Math.min(stats.atsScore, 40)}%` : "35%" },
                { label: "Experience Match", color: "bg-[#10b981]", percent: stats ? `${Math.min(stats.atsScore, 30)}%` : "30%" },
                { label: "Keyword Density", color: "bg-[#8b5cf6]", percent: stats ? `${Math.min(stats.atsScore, 20)}%` : "20%" },
                { label: "Formatting", color: "bg-[#f59e0b]", percent: "15%" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center justify-between xl:justify-start gap-4 p-3 bg-white/50 rounded-2xl border border-white hover:bg-white transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full shadow-sm", item.color)} />
                    <span className="text-[#334155] text-[13px] font-bold">{item.label}</span>
                  </div>
                  <span className="text-[#94a3b8] text-[11px] font-black ml-auto">{item.percent}</span>
                </li>
              ))}
            </ul>

            <div className="relative w-44 h-44 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-2xl">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="14" strokeDasharray="37.7 251.3" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="14" strokeDasharray="50.2 251.3" strokeDashoffset="-37.7" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4b7bff" strokeWidth="14" strokeDasharray="87.9 251.3" strokeDashoffset="-87.9" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="14" strokeDasharray="75.5 251.3" strokeDashoffset="-175.8" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col bg-white m-4 rounded-full shadow-inner border border-slate-50">
                <span className="text-3xl font-black text-[#1e293b] tracking-tighter">{stats ? `${stats.atsScore}%` : '0%'}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform" />
        </div>

        
        <div className="bg-[#fffdf0]/25 backdrop-blur-[40px] rounded-[2.8rem] p-8 shadow-[0_60px_100px_-20px_rgba(15,23,42,0.4),inset_0_1px_4px_rgba(255,255,255,0.6)] border border-white/70 h-full relative overflow-hidden group transition-all duration-700 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-900/[0.15] pointer-events-none" />
          <div className="flex items-center justify-between relative z-10 shrink-0 mb-6">
            <h3 className="font-black text-[#1e293b] text-xl tracking-tight">Suggestions</h3>
          </div>
          <div className="flex items-center justify-between flex-1 relative z-10">
            <div>
              <ul className="space-y-5">
                {(stats?.suggestions || [
                  { label: "JavaScript", text: "Add JavaScript to your skills section", color: "decoration-[#10b981]/30" },
                  { label: "Data Analysis", text: "Include \"Data Analysis\" keywords", color: "decoration-[#10b981]/30" },
                  { label: "Summary", text: "Refine your professional summary", color: "decoration-[#10b981]/30" }
                ]).slice(0, 3).map((step, i) => (
                  <li key={i} className="flex items-center gap-4 group/item">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-white text-[#10b981] flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[#334155] text-sm font-medium">
                      {typeof step === 'string' ? step : step.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-32 h-32 ml-4 bg-white rounded-full flex items-center justify-center border-8 border-[#fffdf0] shadow-[10px_10px_30px_rgba(0,0,0,0.05)] shrink-0">
              <TrendingUp className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <div className="absolute right-0 top-0 w-48 h-48 bg-yellow-500/10 rounded-bl-[150px] pointer-events-none group-hover:scale-105 transition-transform" />
        </div>

        
        <div className="bg-[#f8f9fc]/25 backdrop-blur-[40px] rounded-[2.8rem] p-8 shadow-[0_60px_100px_-20px_rgba(15,23,42,0.4),inset_0_1px_4px_rgba(255,255,255,0.6)] border border-white/70 h-full group transition-all duration-700 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-900/[0.15] pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-black text-[#1e293b] text-xl tracking-tight">Activity</h3>
            <MoreHorizontal className="w-5 h-5 text-[#cbd5e1] cursor-pointer" />
          </div>

          <div className="space-y-6 flex-1 relative z-10 justify-center flex flex-col">
            {[
              { icon: FileCheck2, title: "Resume analyzed", time: stats ? "Today" : "30m ago", status: "New", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: ListChecks, title: "Job matched", time: stats ? "Recently" : "2h ago", status: "Done", color: "text-emerald-500", bg: "bg-emerald-50" },
              { icon: TrendingUp, title: "ATS score boost", time: stats ? "Current" : "5d ago", status: stats ? `+${stats.atsScore}%` : "+3%", color: "text-purple-500", bg: "bg-purple-50" },
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between group/act">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/act:scale-110", act.bg, act.color)}>
                    <act.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[#1e293b] text-sm font-black">{act.title}</h4>
                    <p className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-tighter">{act.time}</p>
                  </div>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white border border-slate-100 shadow-sm", act.color)}>
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
