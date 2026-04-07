import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  FileText, 
  Maximize2, 
  Map, 
  Zap,
  Globe,
  Award,
  Users
} from 'lucide-react';

const Analytics = () => {
  const branchData = [
    { name: 'Computer Science', avg: '82%', growth: '+8.4%', trend: 'up' },
    { name: 'Information Tech', avg: '76%', growth: '+2.1%', trend: 'up' },
    { name: 'Data Science', avg: '68%', growth: '-4.2%', trend: 'down' },
    { name: 'AI & ML', avg: '79%', growth: '+12.5%', trend: 'up' },
  ];

  return (
    <div className="space-y-12">
      {/* Top Banner with Export */}
      <div className="flex items-center justify-between">
         <div>
            <h3 className="text-xl font-black text-white tracking-tight">Institutional Analytics</h3>
            <p className="text-[13px] text-gray-600 font-bold mt-1">Holistic view of student performance and readiness trends.</p>
         </div>
         <div className="flex gap-4">
            <button className="px-8 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[11px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
               <Download className="w-4 h-4" /> Export PDF
            </button>
            <button className="px-8 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[11px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
               <Download className="w-4 h-4" /> Export CSV
            </button>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {branchData.map((branch, i) => (
           <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-10 group hover:border-[#00D2FF]/20 transition-all cursor-pointer relative overflow-hidden"
           >
              <div className="relative z-10">
                 <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-8">{branch.name}</h4>
                 <div className="flex items-baseline gap-4 mb-4">
                    <p className="text-4xl font-black text-white">{branch.avg}</p>
                    <span className={`text-[12px] font-black uppercase ${branch.trend === 'up' ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1`}>
                       {branch.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                       {branch.growth}
                    </span>
                 </div>
                 <p className="text-[11px] text-gray-700 font-black tracking-widest uppercase">AVERAGE ATS SCORE</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-[#00D2FF]/[0.02] transition-colors" />
           </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
         <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-12 bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-12 shadow-2xl shadow-black/20"
         >
            <div className="flex justify-between items-center mb-16">
               <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Improving Resume Trends</h3>
                  <p className="text-[13px] text-gray-600 font-bold mt-1">Average score growth across iterations by department.</p>
               </div>
               <div className="flex items-center gap-6">
                  {['CSE', 'IT', 'DS'].map(l => (
                     <div key={l} className="flex items-center gap-2 group cursor-pointer">
                        <div className={`w-3 h-3 rounded-full ${l === 'CSE' ? 'bg-[#00D2FF]' : l === 'IT' ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest group-hover:text-white transition-colors">{l}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="h-80 flex items-end justify-between gap-12 px-6">
               {[12, 18, 26, 32, 45, 58, 64, 72, 85, 91].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                     {/* Bars */}
                     <div className="w-full flex items-end gap-1.5 h-full min-h-[100px]">
                        <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${val * 0.8}%` }}
                           className="flex-1 bg-[#00D2FF]/20 border border-[#00D2FF]/30 rounded-t-lg group-hover:bg-[#00D2FF]/40 transition-all cursor-pointer relative"
                        />
                        <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${val * 0.6}%` }}
                           className="flex-1 bg-purple-500/20 border border-purple-500/30 rounded-t-lg group-hover:bg-purple-500/40 transition-all cursor-pointer relative"
                        />
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${val * 0.3}%` }}
                           className="flex-1 bg-emerald-500/20 border border-emerald-500/30 rounded-t-lg group-hover:bg-emerald-500/40 transition-all cursor-pointer relative"
                        />
                     </div>
                     <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}</span>
                  </div>
               ))}
            </div>
         </motion.div>
      </div>

       <div className="grid grid-cols-3 gap-8">
          <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 flex flex-col items-center text-center group transition-all cursor-pointer">
              <Globe className="w-14 h-14 text-white/5 opacity-50 mb-8 group-hover:text-[#00D2FF] group-hover:opacity-100 transition-all" />
              <h4 className="text-[14px] font-black text-white mb-2 tracking-tight">Geographic Outreach</h4>
              <p className="text-[12px] text-gray-700 font-bold mb-8 italic">Placement trends by region and university partners.</p>
              <button className="w-full py-4 bg-white/[0.02] border border-white/5 text-[11px] font-black text-gray-400 rounded-2xl hover:text-white transition-all uppercase tracking-widest">View Map</button>
          </div>
           <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 flex flex-col items-center text-center group transition-all cursor-pointer">
              <Award className="w-14 h-14 text-white/5 opacity-50 mb-8 group-hover:text-emerald-500 group-hover:opacity-100 transition-all" />
              <h4 className="text-[14px] font-black text-white mb-2 tracking-tight">Top Performers</h4>
              <p className="text-[12px] text-gray-700 font-bold mb-8 italic">Review elite cohort metrics and leaderboard stats.</p>
              <button className="w-full py-4 bg-white/[0.02] border border-white/5 text-[11px] font-black text-gray-400 rounded-2xl hover:text-white transition-all uppercase tracking-widest">View Rankings</button>
          </div>
           <div className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 flex flex-col items-center text-center group transition-all cursor-pointer">
              <Users className="w-14 h-14 text-white/5 opacity-50 mb-8 group-hover:text-purple-500 group-hover:opacity-100 transition-all" />
              <h4 className="text-[14px] font-black text-white mb-2 tracking-tight">Cohort Analytics</h4>
              <p className="text-[12px] text-gray-700 font-bold mb-8 italic">Batch-wise performance comparison and insights.</p>
              <button className="w-full py-4 bg-white/[0.02] border border-white/5 text-[11px] font-black text-gray-400 rounded-2xl hover:text-white transition-all uppercase tracking-widest">Compare Batches</button>
          </div>
       </div>
    </div>
  );
};

export default Analytics;
