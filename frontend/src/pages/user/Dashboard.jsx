import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { motion, AnimatePresence } from 'framer-motion';
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

import { useSocket } from '../../context/SocketContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const { socket } = useSocket();
  const { startAnalysis, isAnalyzing, dashboardStats, loading: analysisLoading, fetchDashboardData } = useAnalysis();

  const stats = dashboardStats?.stats;
  const resumes = dashboardStats?.resumes || [];
  const loading = analysisLoading.dashboard;


  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Real-time automatic background refresh disabled as per user request

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      startAnalysis(file);
      e.target.value = ''; // Reset input value to allow re-uploading same file
    }
  };

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
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      unit: '%'
    },
    {
      label: 'Total Resumes',
      value: resumes.length.toString().padStart(2, '0'),
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Skill Gaps',
      value: Array.isArray(stats?.keywordsMissing) ? String(stats.keywordsMissing.length).padStart(2, '0') : '00',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  const isLoading = loading && !stats;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Session...</p>
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
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">Your personal AI-powered resume dashboard is updated.</h1>
            <p className="text-slate-700 font-bold text-xs md:text-base">Upload your latest version to stay ahead of industry trends.</p>
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
        <div className="bg-white rounded-3xl lg:rounded-[2rem] p-6 lg:p-12 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-center relative overflow-hidden group mb-8">
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
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <AnimatePresence>
            {summaryCards.map((card, i) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group h-full cursor-pointer"
                  onClick={() => card.label === 'Skill Gaps' ? navigate('/insights') : card.label === 'Total Resumes' ? navigate('/history') : null}
                >
                  <div className="admin-card glass-card relative h-full !p-5 flex items-center gap-5 overflow-hidden group-hover:translate-y-[-4px] transition-all duration-500 border-white/40 shadow-sm hover:shadow-md">
                    <div className={cn(
                      "absolute -right-8 -top-8 w-32 h-32 blur-[60px] rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500",
                      card.bg
                    )} />

                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border border-white/80 shadow-sm relative overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-110",
                      card.bg
                    )}>
                      <Icon className={cn("w-6 h-6 relative z-10 transition-colors duration-500", card.color)} />
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-md" />
                    </div>

                    <div className="relative z-10 space-y-0.5">
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{card.label}</p>
                      <h4 className="text-2xl md:text-3xl font-black text-slate-900 flex items-baseline gap-1 tabular-nums tracking-tighter leading-none">
                        {card.value.replace('%', '')}
                        {card.value.includes('%') && <span className="text-sm font-bold text-slate-400 ml-0.5">%</span>}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col relative overflow-hidden">
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
                  <span className="text-slate-700 text-xs font-black ml-auto">{item.percent}%</span>
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
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 opacity-60">out of 100</span>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col justify-between relative overflow-hidden">
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
