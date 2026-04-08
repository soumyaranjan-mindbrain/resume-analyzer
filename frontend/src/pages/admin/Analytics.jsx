import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Zap, 
  Globe, 
  Download,
  Calendar,
  Layers,
  PieChart
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Analytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-8">
      
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
              <Download className="w-4 h-4" /> Download PDF Report
           </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Platform Usage', value: '+42%', sub: 'vs last month', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Search Queries', value: '18.4K', sub: 'Last 7 days', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
           { label: 'Processing Time', value: '1.2s', sub: 'Avg per resume', icon: Layers, color: 'text-purple-500', bg: 'bg-purple-50' },
           { label: 'Active Sessions', value: '246', sub: 'Current online', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="relative z-10 flex flex-col items-center">
                 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110", stat.bg, stat.color)}>
                    <stat.icon className="w-7 h-7" />
                 </div>
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <span className="mt-4 px-3 py-1 bg-slate-50 border border-slate-100/50 rounded-lg text-[10px] font-bold text-slate-500">{stat.sub}</span>
              </div>
           </div>
         ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6 min-h-[450px] flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
               <h4 className="text-xl font-black text-slate-900 tracking-tight">Growth Projection</h4>
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-4">
                     <span className="w-3 h-3 rounded-full bg-blue-500" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth</span>
                  </div>
                  <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                     <Calendar className="w-4 h-4" />
                  </button>
               </div>
            </div>
            
            
            <div className="flex-1 flex items-end gap-3 pb-8 relative z-10">
               {[40, 70, 45, 90, 65, 80, 55, 95, 75, 40, 85, 100].map((h, i) => (
                 <div key={i} className="flex-1 space-y-3 group/bar">
                    <div className="relative w-full h-[300px] flex items-end justify-center">
                       <div 
                        className="w-full bg-blue-100 group-hover/bar:bg-blue-500 rounded-2xl transition-all duration-700 ease-out cursor-pointer origin-bottom shadow-sm"
                        style={{ height: `${h}%` }}
                       />
                       <div className="absolute top-0 -translate-y-8 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-cyan-500 text-white text-[10px] font-black px-2 py-1 rounded select-none pointer-events-none">
                          {h}%
                       </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter text-center">M{i+1}</div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-cyan-50 border border-cyan-100 rounded-[3rem] p-10 text-cyan-900 flex flex-col justify-between min-h-[500px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-6">
               <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-200/50 rounded-2xl flex items-center justify-center">
                  <PieChart className="w-8 h-8 text-cyan-600" />
               </div>
               <h3 className="text-3xl font-black tracking-tight leading-none">Branch Performance</h3>
               <p className="text-slate-400 font-medium">Computer Science leading with 62.4% success rate.</p>
            </div>

            <div className="relative z-10 space-y-6 pb-4">
               {[
                 { label: 'Computer Science', val: 88, color: 'bg-blue-500' },
                 { label: 'Information Tech', val: 74, color: 'bg-purple-500' },
                 { label: 'Electronics', val: 56, color: 'bg-emerald-500' },
               ].map((b, i) => (
                 <div key={i} className="space-y-2.5">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{b.label}</span>
                       <span className="font-black text-sm">{b.val}%</span>
                    </div>
                    <div className="h-2 bg-cyan-100 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full transition-all duration-1000", b.color)} style={{ width: `${b.val}%` }} />
                    </div>
                 </div>
               ))}
            </div>

            <button className="relative z-10 w-full py-5 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] shadow-xl transition-all">
               View Full Matrix
            </button>
         </div>
      </div>
    </div>
  );
};

export default Analytics;



