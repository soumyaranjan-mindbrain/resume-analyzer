import React, { useState, useEffect } from 'react';
import {
  Users,
  FileCheck,
  Target,
  ArrowUpRight,
  Loader2,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useAdmin } from '../../context/AdminContext';

const StatsCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="relative group h-full"
  >
    {/* Depth Shadow Layers */}
    <div className="absolute inset-x-4 -bottom-2 h-8 bg-slate-900/[0.06] blur-xl rounded-[2rem] -z-10 group-hover:bg-slate-900/[0.1] transition-all duration-500" />

    <div className="admin-card glass-card relative h-full !p-4 flex items-center gap-5 overflow-hidden group-hover:translate-y-[-4px] transition-all duration-500 min-h-[110px]">
      {/* Background Accent Glow */}
      <div className={cn(
        "absolute -right-10 -top-10 w-32 h-32 blur-[80px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500",
        stat.bg.replace('bg-', 'bg-')
      )} />

      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center border border-white/60 shadow-sm relative overflow-hidden shrink-0",
        stat.bg
      )}>
        <stat.icon className={cn("w-7 h-7 relative z-10", stat.color)} />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
      </div>

      <div className="relative z-10">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
        <h4 className="text-2xl font-bold text-slate-800 flex items-baseline gap-1 tabular-nums leading-none">
          {stat.value}
          {stat.unit && <span className="text-sm font-semibold text-slate-500">{stat.unit}</span>}
        </h4>
      </div>
    </div>
  </motion.div>
);

const BarChart = ({ data, filter }) => {
  if (!data || data.length === 0) return null;

  const width = 1000;
  const height = 300;
  const padding = 50;
  const bottomPadding = 40;

  const allValues = data.flatMap(d => [d.resumes, d.analyzed]);
  const maxVal = Math.max(...allValues, 10) * 1.1;
  const getY = (val) => height - (val / maxVal) * (height - padding - bottomPadding) - bottomPadding;

  // Responsive logic: Width adjusts based on data count
  const groupWidth = (width - padding * 2) / data.length;
  const barWidth = Math.min(groupWidth * 0.35, 24);
  const gap = barWidth * 0.2;

  return (
    <div className="relative w-full h-full group/chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f38d49" />
            <stop offset="100%" stopColor="#ffb97a" />
          </linearGradient>
          <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id="barShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Horizontal Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <g key={i}>
            <line
              x1={padding} y1={getY(maxVal * p)}
              x2={width - padding} y2={getY(maxVal * p)}
              stroke="#f1f5f9"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={padding - 10} y={getY(maxVal * p)}
              textAnchor="end" alignmentBaseline="middle"
              className="text-[10px] font-bold fill-slate-300"
            >
              {Math.round(maxVal * p)}
            </text>
          </g>
        ))}

        {/* The Bars */}
        {data.map((d, i) => {
          const groupCenterX = padding + i * groupWidth + groupWidth / 2;
          const bar1X = groupCenterX - barWidth - gap / 2;
          const bar2X = groupCenterX + gap / 2;
          const baseY = height - bottomPadding;

          return (
            <g key={i} className="group/month">
              {/* Resumes Bar */}
              <motion.rect
                initial={{ height: 0, y: baseY }}
                animate={{ height: Math.max(baseY - getY(d.resumes), 2), y: getY(d.resumes) }}
                transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
                x={bar1X}
                width={barWidth}
                rx={barWidth / 4}
                fill="url(#barGradient1)"
                filter="url(#barShadow)"
                className="hover:brightness-110 cursor-pointer"
              />
              {/* Analyzed Bar */}
              <motion.rect
                initial={{ height: 0, y: baseY }}
                animate={{ height: Math.max(baseY - getY(d.analyzed), 2), y: getY(d.analyzed) }}
                transition={{ delay: i * 0.05 + 0.1, duration: 1, ease: "circOut" }}
                x={bar2X}
                width={barWidth}
                rx={barWidth / 4}
                fill="url(#barGradient2)"
                filter="url(#barShadow)"
                className="hover:brightness-110 cursor-pointer"
              />
              {/* X-Axis Label */}
              <text
                x={groupCenterX}
                y={height - 10}
                textAnchor="middle"
                className="text-[12px] font-bold fill-slate-400"
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const AdminDashboard = () => {
  const { stats: statsRaw, analytics: analyticsMap, loading, fetchDashboardStats, fetchAnalytics } = useAdmin();
  const [stats, setStats] = useState([]);
  const [filter, setFilter] = useState('month');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchAnalytics(filter)
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadData();
  }, [filter, fetchDashboardStats, fetchAnalytics]);

  const analytics = analyticsMap[filter] || null;

  useEffect(() => {
    if (statsRaw && analytics) {
      setStats([
        { label: 'Total Students', value: statsRaw.totalUsers?.toLocaleString() || '0', trend: analytics.userGrowth || '0%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Resumes Analyzed', value: statsRaw.totalAnalyses?.toLocaleString() || '0', trend: analytics.resumeGrowth || '0%', icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Average Score', value: `${analytics.averageAtsScore || 0}`, unit: '%', trend: analytics.scoreGrowth || '0%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      ]);
    }
  }, [statsRaw, analytics]);

  const isLoading = loading.dashboard || loading.analytics;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full max-w-7xl mx-auto p-4 lg:p-0">


      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <StatsCard key={i} stat={stat} index={i} />
        ))}
      </div>

      {/* Premium SVG Area Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 border border-white/90 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] relative overflow-hidden"
      >
        {/* Background Depth Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Platform Analytics</h3>
            <p className="text-slate-600 text-sm font-medium mt-1">Detailed monitoring of user engagement and resume processing trends.</p>
          </div>

          <div className="flex gap-2 bg-slate-50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-100 shadow-inner">
            {['week', 'month'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setFilter(f);
                }}
                className={cn(
                  "px-6 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300",
                  filter === f
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[350px] w-full mt-4">
          <BarChart data={analytics?.chartData} filter={filter} />
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100/60">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                </div>
              ))}
            </div>
            <span className="text-slate-500 text-xs font-semibold">+ 12 active observers</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-600">Metric Density</span>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
              Full Spectrum <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div >
  );
};

export default AdminDashboard;
