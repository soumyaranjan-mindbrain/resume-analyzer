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
import { useSocket } from '../../context/SocketContext';

const StatsCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="relative group h-full"
  >
    <div className="admin-card glass-card relative h-full !p-4 flex items-center gap-4 overflow-hidden group-hover:translate-y-[-4px] transition-all duration-500 border-white/40 shadow-sm hover:shadow-md">
      <div className={cn(
        "absolute -right-8 -top-8 w-32 h-32 blur-[60px] rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500",
        stat.bg
      )} />

      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center border border-white/80 shadow-sm relative overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-110",
        stat.bg
      )}>
        <stat.icon className={cn("w-6 h-6 relative z-10 transition-colors duration-500", stat.color)} />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-md" />
      </div>

      <div className="relative z-10 space-y-0.5">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{stat.label}</p>
        <h4 className="text-2xl font-black text-slate-900 flex items-baseline gap-1 tabular-nums tracking-tighter leading-none">
          {stat.value}
          {stat.unit && <span className="text-sm font-bold text-slate-400 ml-0.5">{stat.unit}</span>}
        </h4>
      </div>
    </div>
  </motion.div>
);

const BarChart = ({ data, filter }) => {
  if (!data || data.length === 0) return null;

  // Dynamic scaling based on data volume
  const width = Math.max(1000, data.length * 80);
  const height = 400;
  const padding = 40;
  const bottomPadding = 80;

  const allValues = data.flatMap(d => [d.resumes, d.analyzed]);
  const rawMax = Math.max(...allValues, 20);
  const maxVal = Math.ceil(rawMax / 10) * 10;
  const getY = (val) => height - (val / maxVal) * (height - padding - bottomPadding) - bottomPadding;

  const groupWidth = (width - padding * 2) / data.length;
  const barWidth = Math.min(groupWidth * 0.3, 30);
  const gap = barWidth * 0.4;

  return (
    <div className="relative w-full h-full group/chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f38d49" />
            <stop offset="100%" stopColor="#ffb97a" />
          </linearGradient>
          <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id="barShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
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
              x={padding - 15} y={getY(maxVal * p)}
              textAnchor="end" alignmentBaseline="middle"
              className="text-[12px] font-black fill-slate-500"
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

          // Rotation logic for dense data
          const isDense = data.length > 8;

          return (
            <g key={i} className="group/month">
              {/* Resumes Bar */}
              <motion.rect
                initial={{ height: 0, y: baseY }}
                animate={{ height: Math.max(baseY - getY(d.resumes), 2), y: getY(d.resumes) }}
                transition={{ delay: i * 0.05, duration: 0.8, ease: "backOut" }}
                x={bar1X}
                width={barWidth}
                rx={barWidth / 3}
                fill="url(#barGradient1)"
                filter="url(#barShadow)"
                className="hover:brightness-110 cursor-pointer"
              />
              {/* Analyzed Bar */}
              <motion.rect
                initial={{ height: 0, y: baseY }}
                animate={{ height: Math.max(baseY - getY(d.analyzed), 2), y: getY(d.analyzed) }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.8, ease: "backOut" }}
                x={bar2X}
                width={barWidth}
                rx={barWidth / 3}
                fill="url(#barGradient2)"
                filter="url(#barShadow)"
                className="hover:brightness-110 cursor-pointer"
              />
              {/* X-Axis Label with Smart Rotation */}
              <text
                x={isDense ? groupCenterX + 5 : groupCenterX}
                y={baseY + 30}
                textAnchor={isDense ? "end" : "middle"}
                transform={isDense ? `rotate(-35, ${groupCenterX}, ${baseY + 30})` : ""}
                className={cn(
                  "text-[12px] font-black fill-slate-600 transition-colors group-hover/month:fill-indigo-700",
                  isDense && "text-[10px]"
                )}
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
  const { socket } = useSocket();
  const [stats, setStats] = useState([]);
  const [filter, setFilter] = useState('month');

  const loadData = async (range = filter) => {
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchAnalytics(range)
      ]);

      // Eagerly pre-fetch the other range in the background
      const otherRange = range === 'month' ? 'week' : 'month';
      fetchAnalytics(otherRange);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadData(filter);
  }, [filter]); // fetchDashboardStats and fetchAnalytics are stable from useCallback

  // Real-time background refresh disabled as per user request
  const analytics = analyticsMap[filter] || null;

  useEffect(() => {
    if (statsRaw && analytics) {
      setStats([
        { label: 'Total Students', value: statsRaw.totalUsers?.toLocaleString() || '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Reports Generated', value: statsRaw.totalAnalyses?.toLocaleString() || '0', icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'ATS Match Score', value: `${analytics.averageAtsScore || 0}`, unit: '%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      ]);
    }
  }, [statsRaw, analytics]);

  const isLoading = (loading.dashboard && !statsRaw) || (loading.analytics && !analytics);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-indigo-500" />
          </motion.div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Analytics...</p>
        </div>
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
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Platform Analytics</h3>
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
                  "px-6 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300",
                  filter === f
                    ? "bg-white text-indigo-700 shadow-sm border border-slate-300"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full mt-4">
          <BarChart data={analytics?.chartData} filter={filter} />
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-end gap-6 pt-8 border-t border-slate-100/60">
          <button className="px-8 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center gap-3">
            Download Report <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div >
  );
};

export default AdminDashboard;
