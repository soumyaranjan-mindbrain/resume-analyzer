import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ExternalLink, 
  Layers, 
  Calendar, 
  BadgeCheck, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Download,
  Search
} from 'lucide-react';

const Reports = () => {
  const reports = [
    { name: 'S_Elena_Resume.pdf', score: 88, role: 'Full Stack Engineer', date: '2024-03-24', improves: 12, trend: 'up' },
    { name: 'JD_Resume_v2.pdf', score: 72, role: 'UI/UX Designer', date: '2024-03-22', improves: -5, trend: 'down' },
    { name: 'Marcus_DS.pdf', score: 54, role: 'Data Scientist', date: '2024-03-20', improves: 0, trend: 'neutral' },
    { name: 'Sarah_Senior_Dev.pdf', score: 91, role: 'Backend Lead', date: '2024-03-19', improves: 8, trend: 'up' },
    { name: 'Alex_CySec.pdf', score: 68, role: 'Security Analyst', date: '2024-03-18', improves: 3, trend: 'up' },
  ];

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#00D2FF]/10 to-[#3A7BD5]/10 border border-white/[0.04] rounded-[2.5rem] p-10 flex items-center justify-between"
      >
        <div className="space-y-2">
           <h3 className="text-xl font-black text-white tracking-tight">Recent Analysis Archive</h3>
           <p className="text-[13px] text-gray-400 font-bold">Monitor and compare resume performance metrics.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 min-w-[120px] text-center">
            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.2em] mb-1">THIS WEEK</p>
            <p className="text-2xl font-black text-white">452</p>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 min-w-[120px] text-center">
            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.2em] mb-1">AVG. SCORE</p>
            <p className="text-2xl font-black text-[#00D2FF]">76.4%</p>
          </div>
        </div>
      </motion.div>

      {/* Reports Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-10 pb-4 shadow-2xl shadow-black/20"
      >
         <div className="flex justify-between items-center mb-10 px-4">
            <div className="flex items-center gap-6">
               <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase">Reports History</h3>
               <div className="w-80 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" placeholder="Filter reports..." className="w-full bg-black/20 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-[#00D2FF]/20" />
               </div>
            </div>
            <button className="flex items-center gap-3 px-6 py-3 bg-[#00D2FF] text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all">
               <Layers className="w-4 h-4" /> Compare Selected
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/[0.02]">
                     <th className="pb-8 px-6 text-[11px] font-black text-gray-700 uppercase tracking-widest">Document</th>
                     <th className="pb-8 px-6 text-[11px] font-black text-gray-700 uppercase tracking-widest">ATS Score</th>
                     <th className="pb-8 px-6 text-[11px] font-black text-gray-700 uppercase tracking-widest">Target Role</th>
                     <th className="pb-8 px-6 text-[11px] font-black text-gray-700 uppercase tracking-widest">Date Analytics</th>
                     <th className="pb-8 px-6 text-right text-[11px] font-black text-gray-700 uppercase tracking-widest">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {reports.map((report, i) => (
                     <tr key={i} className="group hover:bg-white/[0.01] transition-all cursor-pointer border-b border-white/[0.01]">
                        <td className="py-6 px-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
                                 <FileText className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-[14px] font-black text-white">{report.name}</span>
                           </div>
                        </td>
                        <td className="py-6 px-6">
                           <div className="flex items-center gap-3">
                              <span className={`text-[15px] font-black ${report.score > 80 ? 'text-emerald-500' : report.score > 60 ? 'text-amber-500' : 'text-red-500'}`}>
                                 {report.score}%
                              </span>
                              {report.improves !== 0 && (
                                 <div className={`flex items-center gap-0.5 text-[10px] font-black uppercase ${report.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {report.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {Math.abs(report.improves)}%
                                 </div>
                              )}
                           </div>
                        </td>
                        <td className="py-6 px-6">
                           <span className="px-4 py-1.5 rounded-xl bg-[#3A7BD5]/5 border border-[#3A7BD5]/20 text-[#3A7BD5] text-[10px] font-black uppercase tracking-widest">
                              {report.role}
                           </span>
                        </td>
                        <td className="py-6 px-6">
                           <div className="flex items-center gap-2 text-gray-600 text-[13px] font-bold">
                              <Calendar className="w-4 h-4" /> {report.date}
                           </div>
                        </td>
                        <td className="py-6 px-6">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2.5 rounded-xl bg-white/[0.03] text-gray-600 hover:text-white transition-all">
                                 <ExternalLink className="w-4 h-4" />
                              </button>
                               <button className="p-2.5 rounded-xl bg-white/[0.03] text-gray-600 hover:text-white transition-all">
                                 <Download className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="py-8 text-center text-[11px] font-black text-gray-700 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
            Load More Archives
         </div>
      </motion.div>
    </div>
  );
};

export default Reports;
