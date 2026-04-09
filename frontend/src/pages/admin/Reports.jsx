import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  LayoutGrid, 
  List,
  Eye,
  Download,
  Calendar
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Reports = () => {
  const [viewMode, setViewMode] = useState('list');

  const reports = [
    { id: 1, student: 'Alex Rivera', role: 'Full Stack Developer', score: 85, date: '2026-04-01', status: 'High' },
    { id: 2, student: 'Sarah Chen', role: 'Data Scientist', score: 92, date: '2026-04-03', status: 'Exceptional' },
    { id: 3, student: 'Marcus Bell', role: 'Backend Engineer', score: 68, date: '2026-04-05', status: 'Medium' },
    { id: 4, student: 'Elena Vance', role: 'UI/UX Designer', score: 45, date: '2026-04-07', status: 'Needs Improvement' },
    { id: 5, student: 'David Kim', role: 'DevOps Engineer', score: 78, date: '2026-04-07', status: 'High' },
    { id: 6, student: 'James Wilson', role: 'Product Manager', score: 88, date: '2026-04-08', status: 'High' },
  ];

  const viewButtonClass = (mode) =>
    cn(
      "p-2.5 rounded-xl transition-all",
      viewMode === mode ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
    );

  const scoreClass = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-blue-500";
    return "text-orange-500";
  };

  const statusClass = (status) => {
    if (status === 'Exceptional') return "bg-emerald-50 text-emerald-600";
    if (status === 'High') return "bg-blue-50 text-blue-600";
    if (status === 'Medium') return "bg-orange-50 text-orange-600";
    return "bg-red-50 text-red-600";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
           <button 
            onClick={() => setViewMode('grid')}
            className={viewButtonClass('grid')}
           >
              <LayoutGrid className="w-5 h-5" />
           </button>
           <button 
            onClick={() => setViewMode('list')}
            className={viewButtonClass('list')}
           >
              <List className="w-5 h-5" />
           </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         <div className="lg:col-span-2 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports by student, role or keyword..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/20 font-bold text-slate-700 transition-all"
            />
         </div>
         <div className="bg-white border border-slate-100 rounded-[2rem] px-6 py-2 shadow-sm flex items-center gap-4">
            <Calendar className="w-5 h-5 text-slate-400" />
            <select className="bg-transparent border-none outline-none font-bold text-sm text-slate-600 w-full appearance-none cursor-pointer">
               <option>Last 30 Days</option>
               <option>Last 7 Days</option>
               <option>Last 24 Hours</option>
               <option>All Time</option>
            </select>
         </div>
         <button className="flex items-center justify-center gap-3 bg-white border border-slate-100 rounded-[2rem] py-4 shadow-sm hover:bg-cyan-50 transition-all font-black text-xs uppercase tracking-widest text-slate-600">
            <Filter className="w-4 h-4" /> More Filters
         </button>
      </div>

      {viewMode === 'list' ? (
        
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[450px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left order-collapse">
              <thead>
                <tr className="bg-cyan-50/50">
                  <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student & Report</th>
                  <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Role</th>
                  <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">ATS Score</th>
                  <th className="py-6 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="group hover:bg-purple-50/30 transition-colors border-b border-slate-50">
                    <td className="py-6 px-10">
                      <div>
                        <p className="text-sm font-black text-slate-900">{report.student}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-2">
                           <Calendar className="w-3 h-3 text-slate-300" /> {report.date}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                       <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">{report.role}</span>
                    </td>
                    <td className="py-6 px-6">
                       <div className="flex flex-col items-center gap-1">
                          <span className={cn(
                            "text-base font-black",
                            scoreClass(report.score)
                          )}>{report.score}%</span>
                          <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                              className={cn("h-full", report.score >= 80 ? "bg-emerald-500" : report.score >= 60 ? "bg-blue-500" : "bg-orange-500")} 
                              style={{ width: `${report.score}%` }} 
                             />
                          </div>
                       </div>
                    </td>
                    <td className="py-6 px-6">
                       <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border",
                          statusClass(report.status)
                        )}>
                          {report.status}
                       </span>
                    </td>
                    <td className="py-6 px-10 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-cyan-500 hover:text-white transition-all">
                             <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button className="p-2 bg-cyan-50 text-slate-400 rounded-xl hover:text-purple-500 hover:bg-purple-50 transition-all">
                             <Download className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {reports.map((report) => (
             <div key={report.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-[5rem] -mr-8 -mt-8 -z-0 opacity-50 transition-all group-hover:bg-purple-50" />
                
                <div className="relative z-10 space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                         <span className="font-black text-lg">{report.score}</span>
                      </div>
                      <span className={cn(
                         "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                         report.status === 'Exceptional' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      )}>{report.status}</span>
                   </div>
                   
                   <div>
                      <h4 className="font-black text-slate-900 text-lg">{report.student}</h4>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-1">{report.role}</p>
                   </div>
                   
                   <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                         <Calendar className="w-3.5 h-3.5" /> {report.date}
                      </div>
                      <button className="text-purple-500 font-black text-xs hover:underline flex items-center gap-1">
                         View Full Report <ArrowUpRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      
      <div className="flex justify-center pt-8">
         <button className="px-12 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-cyan-500 hover:text-white hover:border-slate-900 transition-all shadow-sm">
            Load More Reports
         </button>
      </div>

    </div>
  );
};

export default Reports;



