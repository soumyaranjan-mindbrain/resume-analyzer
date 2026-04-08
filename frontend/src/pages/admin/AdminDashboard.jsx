import React from 'react';
import { 
  Users, 
  FileCheck, 
  Target, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Settings, 
  Search, 
  Bell, 
  ArrowUpRight, 
  Cpu, 
  Zap, 
  ShieldCheck,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Students', value: '1,284', trend: '+12.5%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Resumes Analyzed', value: '3,842', trend: '+18.2%', icon: FileCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Average Score', value: '74%', trend: '+4.5%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Job Readiness', value: '42%', trend: '+2.1%', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const recentActivity = [
    { id: 1, student: 'Alex Rivera', action: 'Rescore', score: 92, time: '2m ago' },
    { id: 2, student: 'Sarah Chen', action: 'Uploaded', score: 85, time: '12m ago' },
    { id: 3, student: 'Marcus Bell', action: 'Rescore', score: 64, time: '1h ago' },
    { id: 4, student: 'Elena Vance', action: 'Created', score: 45, time: '3h ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-opacity-80" />
            <div className="relative z-10">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-cyan-700/60 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group min-h-[450px] flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-bl-[8rem] -mr-20 -mt-20 opacity-50" />
           <div className="relative z-10 flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Platform Growth</h3>
                 <p className="text-cyan-700/60 text-sm font-bold mt-1">Daily analysis trends across all branches.</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-5 py-2.5 bg-cyan-50 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all">Week</button>
                 <button className="px-5 py-2.5 bg-cyan-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all">Month</button>
              </div>
           </div>

           
           <div className="relative h-64 flex items-end gap-3 pb-4">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 40, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-500/10 hover:bg-blue-500 rounded-2xl transition-all duration-700 ease-out origin-bottom cursor-pointer group/bar" style={{ height: `${h}%` }}>
                   <div className="absolute top-0 -translate-y-8 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-cyan-500 text-white text-[10px] font-black px-2 py-1 rounded">
                      {h}%
                   </div>
                </div>
              ))}
           </div>

           <div className="relative z-10 flex items-center justify-between pt-10 border-t border-slate-50">
              <div className="flex items-center gap-6">
                 <div>
                    <p className="text-[10px] font-black text-cyan-700/60 uppercase tracking-widest mb-1">Peak Time</p>
                    <p className="text-xl font-black text-slate-900">14:00 - 16:00</p>
                 </div>
                 <div className="w-[1px] h-10 bg-slate-100" />
                 <div>
                    <p className="text-[10px] font-black text-cyan-700/60 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                       <p className="text-xl font-black text-emerald-500 uppercase tracking-tight text-sm">System Optimal</p>
                    </div>
                 </div>
              </div>
              <button className="p-4 bg-cyan-50 rounded-2xl text-cyan-700/60 hover:text-slate-900 hover:bg-slate-100 transition-all">
                 <ArrowUpRight className="w-6 h-6" />
              </button>
           </div>
        </div>

        
        <div className="space-y-8">
           
           <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity</h4>
                 <button className="p-2 text-cyan-700/60 hover:text-slate-900 hover:bg-cyan-50 rounded-xl transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                 </button>
              </div>
              <div className="space-y-6">
                 {recentActivity.map((activity) => (
                   <div key={activity.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-700/60 font-black group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                            {activity.student.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{activity.student}</p>
                            <p className="text-[10px] font-bold text-cyan-700/60 uppercase tracking-widest">{activity.action} • {activity.time}</p>
                         </div>
                      </div>
                      <span className={cn(
                        "text-[10px] font-black px-2 py-1 rounded-lg",
                        activity.score >= 80 ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'
                      )}>
                        {activity.score}%
                      </span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-cyan-50 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-cyan-700/60 hover:bg-cyan-500 hover:text-white transition-all shadow-inner">
                 View Audit Log
              </button>
           </div>

           
           <div className="bg-cyan-50 border border-cyan-100 rounded-[2rem] p-6 text-cyan-900 shadow-sm relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-cyan-600" />
                 </div>
                 <h4 className="font-black tracking-tight">System Health</h4>
              </div>
              <div className="relative z-10 space-y-4">
                 {[
                   { label: 'Cloud API', status: 'Online', color: 'bg-blue-400' },
                   { label: 'DB Latency', status: '12ms', color: 'bg-blue-400' },
                   { label: 'Storage', status: '82%', color: 'bg-emerald-400' }
                 ].map((h, i) => (
                   <div key={i} className="flex justify-between items-center px-4 py-3 bg-white/50 border border-cyan-100/30 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700/60">{h.label}</span>
                      <div className="flex items-center gap-2">
                         <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", h.color)} />
                         <span className="text-xs font-black uppercase tracking-tighter">{h.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;




