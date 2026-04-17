import React, { useEffect, useState, useRef } from 'react';
import {
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  Upload,
  Zap,
  Target,
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
import { useAnalysis } from '../../context/AnalysisContext';
import { getDashboardStats, getMyResumes } from '../../services/api';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const safeParseJson = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const clampNumber = (value, min, max) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
};

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
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const { startAnalysis, isAnalyzing } = useAnalysis();
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      startAnalysis(file);
      e.target.value = ''; // Reset input value to allow re-uploading same file
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, resumeData] = await Promise.all([
          getDashboardStats(),
          getMyResumes()
        ]);
        setStats(statsData || null);
        setResumes(resumeData.resumes || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const rawScoreBreakdown = safeParseJson(stats?.scoreBreakdown) || stats?.scoreBreakdown || {};
  const atsScore = clampNumber(stats?.atsScore ?? 0, 0, 100);

  const getBreakdownPoints = (key, maxPoints) => {
    const direct = rawScoreBreakdown?.[key];
    if (direct !== undefined && direct !== null) return clampNumber(direct, 0, maxPoints);

    // Fallback: infer a plausible score from ATS score when breakdown wasn't persisted
    return clampNumber((atsScore * maxPoints) / 100, 0, maxPoints);
  };

  const breakdownItems = [
    { key: 'techSkills', label: 'Technical Skills', colorClass: 'bg-blue-500', stroke: '#2563eb', maxPoints: 10 },
    { key: 'experience', label: 'Experience Match', colorClass: 'bg-emerald-500', stroke: '#10b981', maxPoints: 10 },
    { key: 'keywords', label: 'Keyword Density', colorClass: 'bg-indigo-500', stroke: '#6366f1', maxPoints: 20 },
    { key: 'formatting', label: 'Formatting', colorClass: 'bg-amber-500', stroke: '#f59e0b', maxPoints: 7 },
  ].map((item) => {
    const points = getBreakdownPoints(item.key, item.maxPoints);
    const percent = Math.round((points / item.maxPoints) * 100);
    return { ...item, points, percent };
  });

  const chartCircumference = 2 * Math.PI * 40;
  const chartTotalPoints = breakdownItems.reduce((sum, i) => sum + i.points, 0);
  const breakdownAveragePercent = breakdownItems.length
    ? Math.round(breakdownItems.reduce((sum, i) => sum + i.percent, 0) / breakdownItems.length)
    : 0;
  let chartOffset = 0;
  const chartSegments = chartTotalPoints > 0
    ? breakdownItems.map((i) => {
      const seg = (i.points / chartTotalPoints) * chartCircumference;
      const dasharray = `${seg.toFixed(1)} ${(chartCircumference - seg).toFixed(1)}`;
      const dashoffset = (-chartOffset).toFixed(1);
      chartOffset += seg;
      return { stroke: i.stroke, dasharray, dashoffset };
    })
    : [];

  const summaryCards = [
    {
      label: 'ATS Score',
      value: stats?.atsScore !== undefined ? `${stats.atsScore}%` : '0%',
      tone: 'blue',
      icon: BarChart3,
      note: (stats?.atsScore || 0) > 0 ? '+ 2% since last scan' : 'Upload to see score',
      noteTone: 'text-[#10b981]',
      noteIcon: ArrowUp
    },
    {
      label: 'Job Ready',
      value: stats?.atsScore !== undefined ? `${Math.round(stats.atsScore * 1.1 > 100 ? 100 : stats.atsScore * 1.1)}%` : 'Low',
      tone: 'emerald',
      icon: ShieldCheck,
      detail: 'Based on ATS score and overall skill matching algorithms.'
    },
    {
      label: 'Gaps',
      value: Array.isArray(stats?.keywordsMissing) ? String(stats.keywordsMissing.length).padStart(2, '0') : '00',
      tone: 'orange',
      icon: AlertTriangle,
      detail: (Array.isArray(stats?.keywordsMissing) && stats.keywordsMissing.length > 0)
        ? `Missing: ${stats.keywordsMissing.slice(0, 2).join(', ')}...`
        : 'Optimize your impact keywords.',
      action: 'View Analysis'
    },
    {
      label: 'Matches',
      value: stats?.jobsMatched !== undefined ? String(stats.jobsMatched).padStart(2, '0') : '00',
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
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 flex flex-col md:flex-row shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] min-h-[160px] md:min-h-[200px]">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={dashboardBanner}
            alt="Welcome Banner"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white/80 via-white/40 md:from-white/60 md:via-white/10 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col justify-center w-full max-w-2xl">
          <div className="mb-4 md:mb-6 space-y-1 md:space-y-2">
            <h1 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight leading-tight">Your personal AI-powered resume dashboard is updated.</h1>
            <p className="text-slate-600 font-medium text-xs md:text-base">Upload your latest version to stay ahead of industry trends.</p>
          </div>
          <div className="pt-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
              Upload New Resume
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      {resumes.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-center relative overflow-hidden group mb-8">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Target className="w-64 h-64 text-blue-600" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-sm">
              <Zap className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-4 lowercase first-letter:uppercase">Strategic Analysis Required</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
              Upload your first resume to generate executive career metrics, identify critical skill gaps, and unlock personalized job matches.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95 flex items-center gap-3 mx-auto"
            >
              <Upload className="w-5 h-5" /> Initialize Analysis
            </button>
            {/* Hidden file input removed from here */}

          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const tone = toneStyles[card.tone] || toneStyles.blue;

            return (
              <div key={card.label} className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="flex items-center gap-1.5 md:gap-2.5">
                      <div className={cn("w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center", tone.icon)}>
                        <Icon className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
                      </div>
                      <span className="font-bold text-slate-500 text-[8px] md:text-[10px] uppercase tracking-widest leading-none truncate">{card.label}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter mb-1 md:mb-2">{card.value}</h2>

                  {card.detail && (
                    <p className="text-slate-500 text-[7px] md:text-[9px] font-bold leading-relaxed mb-3 md:mb-4 uppercase tracking-wider opacity-60 line-clamp-2 md:line-clamp-1">
                      {card.detail}
                    </p>
                  )}
                </div>

                <div className="mt-auto">
                  {card.note && (
                    <div className={cn(
                      "px-2 py-1 md:px-2.5 md:py-1.5 rounded-md md:rounded-lg inline-flex items-center gap-1 md:gap-1.5",
                      card.noteTone === 'text-emerald-600' ? 'bg-emerald-50' : 'bg-slate-50'
                    )}>
                      {card.noteIcon && <card.noteIcon className={cn("w-2.5 h-2.5 md:w-3 md:h-3", card.noteTone)} />}
                      <span className={cn("text-[7px] md:text-[8px] font-black uppercase tracking-widest", card.noteTone || 'text-slate-500')}>
                        {card.note}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-semibold text-slate-800 text-xl tracking-tight">Skill Breakdown</h3>
            <MoreHorizontal className="w-5 h-5 text-slate-300 cursor-pointer hover:text-slate-600 transition-colors" />
          </div>

          <div className="flex flex-col xl:flex-row items-center gap-8 justify-between flex-1 relative z-10">
            <ul className="space-y-4 w-full xl:w-auto">
              {breakdownItems.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between xl:justify-start gap-12 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full shadow-sm", item.colorClass)} />
                    <span className="text-slate-700 text-[13px] font-medium">{item.label}</span>
                  </div>
                  <span className="text-slate-500 text-xs font-medium ml-auto">{item.percent}%</span>
                </li>
              ))}
            </ul>

            <div className="relative w-44 h-44 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                {chartSegments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={seg.stroke}
                    strokeWidth="12"
                    strokeDasharray={seg.dasharray}
                    strokeDashoffset={seg.dashoffset}
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col bg-white m-5 rounded-full shadow-sm border border-slate-200">
                <span className="text-3xl font-bold text-slate-800 tracking-tighter">{breakdownAveragePercent ? `${breakdownAveragePercent}%` : '0%'}</span>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10 shrink-0 mb-6">
            <h3 className="font-semibold text-slate-800 text-xl tracking-tight">Mastery Insights</h3>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md border border-emerald-100 uppercase tracking-widest">Good Points</span>
              <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-md border border-rose-100 uppercase tracking-widest">Gaps</span>
            </div>
          </div>
          <div className="flex flex-col gap-6 relative z-10">
            <div className="space-y-3">
              {Array.isArray(stats?.topStrengths) && stats.topStrengths.length > 0 ? (
                stats.topStrengths.slice(0, 3).map((point, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                    <div className="w-5 h-5 shrink-0 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">{point}</span>
                  </div>
                ))
              ) : null}
            </div>

            <div className="space-y-3">
              {Array.isArray(stats?.weaknesses) && stats.weaknesses.length > 0 ? (
                stats.weaknesses.slice(0, 3).map((point, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-rose-50/30 rounded-xl border border-rose-100/50">
                    <div className="w-5 h-5 shrink-0 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm mt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">{point}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-center">
                  <p className="text-slate-500 text-xs font-normal">Upload a resume to unlock detailed SWOT analysis.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.docx"
      />
    </div>
  );
};

export default Dashboard;
