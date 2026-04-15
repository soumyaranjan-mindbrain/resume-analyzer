import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileCheck, 
  Target, 
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getDashboardStats, getAnalytics } from '../../services/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, analyticsData] = await Promise.all([
          getDashboardStats(),
          getAnalytics()
        ]);
        
        setAnalytics(analyticsData);
        
        setStats([
          { label: 'Total Students', value: statsData.totalUsers?.toLocaleString() || '0', trend: analyticsData.userGrowth || '0%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Resumes Analyzed', value: statsData.totalAnalyses?.toLocaleString() || '0', trend: analyticsData.resumeGrowth || '0%', icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Average Score', value: `${analyticsData.averageAtsScore || 0}%`, trend: '+4.5%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ]);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = analytics?.chartData || [];
  const maxVal = Math.max(...chartData.map(d => Math.max(d.resumes, d.analyzed, d.matched)), 10);
  const yAxisTicks = [maxVal, Math.round(maxVal*0.75), Math.round(maxVal*0.5), Math.round(maxVal*0.25), 0];
  const chartHeight = 320;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
       {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="admin-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Grouped Bar Chart Section */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col min-h-[550px] relative overflow-hidden">
          {/* Dotted Background Pattern like in image */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Platform Growth Analysis</h3>
                <p className="text-slate-500 text-sm font-normal mt-1">Detailed monthly metrics for resume processing and success rates.</p>
            </div>
            <div className="flex gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button className="px-4 py-1.5 text-slate-600 rounded-md font-medium text-sm hover:bg-white transition-all">Week</button>
                <button className="px-4 py-1.5 bg-white text-slate-900 rounded-md font-medium text-sm shadow-sm border border-slate-200 transition-all">Month</button>
            </div>
          </div>

          {/* Chart Area Container */}
          <div className="flex-1 flex gap-4 relative z-10">
            
            {/* Y-Axis Ticks */}
            <div className="flex flex-col justify-between text-[10px] font-bold text-slate-400 pb-10 pr-2">
              {yAxisTicks.map(tick => (
                <span key={tick} className="h-0 flex items-center justify-end">{tick}</span>
              ))}
            </div>

            {/* Bars and Grid */}
            <div className="flex-1 flex flex-col relative h-[350px]">
              
              {/* Horizontal Grid Lines - Light Dotted */}
              <div className="absolute inset-0 flex flex-col justify-between pb-10 pointer-events-none z-0">
                {yAxisTicks.map(tick => (
                  <div key={tick} className="w-full border-t border-slate-100 border-dashed h-0" />
                ))}
              </div>

              {/* The Bars */}
              <div className="relative h-full flex items-end justify-between px-4 pb-10 z-10" style={{ height: chartHeight }}>
                {chartData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center justify-end gap-2 group/month h-full relative">
                    <div className="flex items-end gap-1 px-1 h-full">
                      {/* Orange Bar - Resumes */}
                      <div 
                        className="w-3 sm:w-4 bg-gradient-to-t from-[#f38d49] to-[#ffb97a] rounded-t-sm transition-all duration-500 hover:brightness-110 relative group/bar shadow-sm border border-white/60"
                        style={{ height: `${Math.max((data.resumes / maxVal) * chartHeight, 4)}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-30">
                          {data.resumes} Resumes
                        </div>
                      </div>
                      {/* Teal Bar - Analyzed */}
                      <div 
                        className="w-3 sm:w-4 bg-gradient-to-t from-[#19bfc1] to-[#59e5e0] rounded-t-sm transition-all duration-500 hover:brightness-110 relative group/bar shadow-sm border border-white/60"
                        style={{ height: `${Math.max((data.analyzed / maxVal) * chartHeight, 4)}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-30">
                          {data.analyzed} Analyzed
                        </div>
                      </div>
                      {/* Blue Bar - Matched */}
                      <div 
                        className="w-3 sm:w-4 bg-gradient-to-t from-[#2563eb] to-[#5d8eff] rounded-t-sm transition-all duration-500 hover:brightness-110 relative group/bar shadow-sm border border-white/60"
                        style={{ height: `${Math.max((data.matched / maxVal) * chartHeight, 4)}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-30">
                          {data.matched} Matched
                        </div>
                      </div>
                    </div>
                    {/* X-Axis Labels */}
                    <span className="text-[10px] font-bold text-slate-400 absolute -bottom-7">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend Area */}
          <div className="flex flex-wrap items-center justify-center gap-10 pt-12 border-t border-slate-100 mt-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-lg bg-[#f38d49]" />
              <span className="text-xs font-bold text-slate-600">Resumes Uploaded</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-lg bg-[#26d0ce]" />
              <span className="text-xs font-bold text-slate-600">AI Analyzed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-lg bg-[#2563eb]" />
              <span className="text-xs font-bold text-slate-600">Job Matched</span>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
