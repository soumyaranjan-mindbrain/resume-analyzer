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
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 sm:px-0">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 flex shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] min-h-[200px]">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={dashboardBanner}
            alt="Welcome Banner"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/10 to-transparent" />
        </div>

        <div className="relative z-10 p-8 flex flex-col justify-center w-full max-w-2xl">
          <div className="mb-4 space-y-1">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Your personal AI-powered resume dashboard is updated.</h1>
            <p className="text-slate-500 font-semibold text-sm">Upload your latest version to stay ahead of industry trends.</p>
          </div>
          <div className="pt-0">
            <button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Upload className="w-5 h-5" />
              Upload New Resume
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const tone = toneStyles[card.tone];
          const dynamicValue = card.value;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center", tone.icon)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-500 text-xs uppercase tracking-wider">{card.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">{dynamicValue}</h2>
              <div className="flex flex-col gap-1">
                {card.note && (
                  <span className={card.noteTone + " text-xs font-bold inline-flex items-center gap-1"}>
                    <card.noteIcon className="w-3.5 h-3.5" /> {card.note}
                  </span>
                )}
                {card.detail && <span className="text-slate-400 text-[11px] font-semibold leading-relaxed max-w-[90%]">{card.detail}</span>}
                {card.action && (
                  <button className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                    {card.action} <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">




        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-bold text-slate-800 text-xl tracking-tight">Skill Breakdown</h3>
            <MoreHorizontal className="w-5 h-5 text-slate-300 cursor-pointer hover:text-slate-600 transition-colors" />
          </div>

          <div className="flex flex-col xl:flex-row items-center gap-8 justify-between flex-1 relative z-10">
            <ul className="space-y-4 w-full xl:w-auto">
              {[
                { label: "Technical Skills", color: "bg-blue-500", percent: stats ? `${Math.min(stats.atsScore, 40)}%` : "35%" },
                { label: "Experience Match", color: "bg-emerald-500", percent: stats ? `${Math.min(stats.atsScore, 30)}%` : "30%" },
                { label: "Keyword Density", color: "bg-indigo-500", percent: stats ? `${Math.min(stats.atsScore, 20)}%` : "20%" },
                { label: "Formatting", color: "bg-amber-500", percent: "15%" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center justify-between xl:justify-start gap-12 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full shadow-sm", item.color)} />
                    <span className="text-slate-700 text-[13px] font-semibold">{item.label}</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-bold ml-auto">{item.percent}</span>
                </li>
              ))}
            </ul>

            <div className="relative w-44 h-44 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="37.7 251.3" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#6366f1" strokeWidth="12" strokeDasharray="50.2 251.3" strokeDashoffset="-37.7" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563eb" strokeWidth="12" strokeDasharray="87.9 251.3" strokeDashoffset="-87.9" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="75.5 251.3" strokeDashoffset="-175.8" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col bg-white m-5 rounded-full shadow-sm border border-slate-200">
                <span className="text-3xl font-bold text-slate-800 tracking-tighter">{stats ? `${stats.atsScore}%` : '0%'}</span>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10 shrink-0 mb-6">
            <h3 className="font-bold text-slate-800 text-xl tracking-tight">Suggestions</h3>
          </div>
          <div className="flex items-center justify-between flex-1 relative z-10">
            <div>
              <ul className="space-y-4">
                {stats?.suggestions && stats.suggestions.length > 0 ? (
                  stats.suggestions.slice(0, 3).map((step, i) => (
                    <li key={i} className="flex items-center gap-4 group/item">
                      <div className="w-6 h-6 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-slate-600 text-sm font-semibold">
                        {typeof step === 'string' ? step : step.text}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 text-sm font-bold opacity-80">No suggestions available</p>
                    <p className="text-slate-400 text-[11px] font-semibold leading-relaxed">Upload a resume to get AI-powered insights and optimization tips.</p>
                  </li>
                )}
              </ul>
            </div>

            <div className="w-32 h-32 ml-4 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0">
              <TrendingUp className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>



      </div>

    </div>
  );
};

export default Dashboard;
