import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  LayoutGrid, 
  List,
  Eye,
  Download,
  Calendar,
  Loader2,
  TrendingUp,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getReports } from '../../services/api';

const Reports = () => {
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        if (data.recentReports) {
          const mappedReports = data.recentReports.map(report => ({
            id: report.resumeId,
            resumeId: report.resumeId,
            student: report.studentName,
            studentName: report.studentName,
            fileName: report.fileName,
            role: 'Matched Jobs: ' + report.jobsMatched,
            jobsMatched: report.jobsMatched,
            score: report.atsScore,
            atsScore: report.atsScore,
            date: new Date(report.createdAt).toLocaleDateString(),
            createdAt: report.createdAt,
            status: report.atsScore >= 85 ? 'Exceptional' : 
                    report.atsScore >= 70 ? 'High' : 
                    report.atsScore >= 50 ? 'Medium' : 'Needs Improvement'
          }));
          setReports(mappedReports);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const stats = [
    { label: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Efficiency', value: '94%', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Reliability', value: '99.9%', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ];

  const filteredReports = reports.filter(r => 
    r.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewButtonClass = (mode) =>
    cn(
      "p-2 rounded-lg transition-all",
      viewMode === mode ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
    );

  const statusClass = (score) => {
    if (score >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (score >= 70) return "bg-blue-50 text-blue-700 border-blue-100";
    if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-red-50 text-red-700 border-red-100";
  };

  const getStatusLabel = (score) => {
    if (score >= 85) return 'Exceptional';
    if (score >= 70) return 'High';
    if (score >= 50) return 'Medium';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Filters & View Toggle Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
           <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
              />
           </div>
           <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 min-w-[160px]">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select className="bg-transparent border-none outline-none text-sm font-medium text-slate-600 w-full cursor-pointer">
                 <option>Last 30 Days</option>
                 <option>Last 7 Days</option>
                 <option>Last 24 Hours</option>
                 <option>All Time</option>
              </select>
           </div>
           <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" /> Filters
           </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
           <button 
            onClick={() => setViewMode('grid')}
            className={viewButtonClass('grid')}
           >
              <LayoutGrid className="w-4 h-4" />
           </button>
           <button 
            onClick={() => setViewMode('list')}
            className={viewButtonClass('list')}
           >
              <List className="w-4 h-4" />
           </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[450px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Student & Date</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Target Role</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">ATS Score</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Status</th>
                  <th className="py-4 px-6 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-slate-500 font-medium">Loading reports...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-slate-500 font-medium">
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.resumeId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight">{report.studentName}</p>
                          <p className="text-xs font-normal text-slate-500 mt-0.5">{new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                         <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{report.fileName}</span>
                      </td>
                      <td className="py-4 px-6">
                         <div className="flex flex-col items-center gap-1.5">
                            <span className={cn(
                              "text-sm font-bold",
                              report.atsScore >= 80 ? "text-emerald-600" : report.atsScore >= 60 ? "text-blue-600" : "text-amber-600"
                            )}>{report.atsScore}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                className={cn("h-full", report.atsScore >= 80 ? "bg-emerald-500" : report.atsScore >= 60 ? "bg-blue-500" : "bg-amber-500")} 
                                style={{ width: `${report.atsScore}%` }} 
                               />
                            </div>
                         </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                          <span className={cn(
                             "inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border",
                             statusClass(report.atsScore)
                           )}>
                             {getStatusLabel(report.atsScore)}
                          </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                               <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Download">
                               <Download className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-medium">Loading reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500 font-medium">
                No reports found.
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-sm",
                      report.score >= 80 ? "bg-emerald-500 shadow-emerald-500/20" : report.score >= 60 ? "bg-blue-500 shadow-blue-500/20" : "bg-amber-500 shadow-amber-500/20"
                    )}>
                        {report.score}
                    </div>
                    <span className={cn(
                        "text-[11px] font-bold px-2.5 py-1 rounded-full border",
                        statusClass(report.status)
                    )}>{report.status}</span>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-slate-900 text-lg tracking-tight">{report.student}</h4>
                    <p className="text-slate-500 font-normal text-sm mt-1">{report.role}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5" /> {report.date}
                    </div>
                    <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1 transition-colors">
                        Full Report <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
         </div>
      )}

      {/* Pagination / Load More */}
      <div className="flex justify-center pt-4">
         <button className="px-8 py-2.5 bg-white border border-slate-200 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Load More Reports
         </button>
      </div>

    </div>
  );
};

export default Reports;
