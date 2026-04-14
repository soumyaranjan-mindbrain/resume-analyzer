import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getAnalytics, getReports } from '../../services/api';

const JobReadiness = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [pool, setPool] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, reportsData] = await Promise.all([
          getAnalytics(),
          getReports()
        ]);

        if (analyticsData.readinessBreakdown) {
          setStats([
            { label: 'Market Ready', value: analyticsData.readinessBreakdown.marketReady + '%', color: 'emerald' },
            { label: 'Developing', value: analyticsData.readinessBreakdown.developing + '%', color: 'blue' },
            { label: 'Critical Gap', value: analyticsData.readinessBreakdown.criticalGap + '%', color: 'orange' },
          ]);
        }

        if (reportsData.recentReports) {
          const mappedPool = reportsData.recentReports.map(report => ({
            id: report.resumeId,
            name: report.studentName,
            role: 'Jobs Matched: ' + report.jobsMatched,
            match: Math.min(100, Math.round(report.atsScore * 1.1)), // Mocked match based on ATS
            readiness: report.atsScore >= 80 ? 'Ready' : 'Developing',
            score: report.atsScore
          }));
          setPool(mappedPool);
        }
      } catch (error) {
        console.error('Error fetching job readiness data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPool = pool.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Readiness Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-pulse h-32">
              <div className="h-4 bg-slate-100 rounded w-24 mb-4"></div>
              <div className="h-8 bg-slate-100 rounded w-16 mb-4"></div>
              <div className="h-2 bg-slate-100 rounded-full w-full"></div>
            </div>
          ))
        ) : (
          stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group overflow-hidden">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
               <div className="flex items-baseline justify-between">
                  <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    stat.color === 'emerald' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    stat.color === 'blue' ? "bg-blue-50 text-blue-700 border-blue-100" :
                    "bg-amber-50 text-amber-700 border-amber-100"
                  )}>
                     {stat.color === 'emerald' ? 'Top Tier' : stat.color === 'blue' ? 'Growing' : 'Needs Focus'}
                  </span>
               </div>
               <div className="mt-4">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        stat.color === 'emerald' ? "bg-emerald-500" :
                        stat.color === 'blue' ? "bg-blue-500" : "bg-amber-500"
                      )} 
                      style={{ width: stat.value }}
                     />
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Main Readiness Pool Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-bold text-slate-900">Job Readiness Pool</h4>
              <span className="bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded-full font-bold border border-blue-100">{pool.length} Candidates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm sm:w-64"
                  />
              </div>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  <Filter className="w-5 h-5" />
              </button>
            </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 py-20">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-medium">Analyzing candidate pool...</p>
              </div>
            ) : filteredPool.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-500 font-medium">
                No candidates match your criteria.
              </div>
            ) : (
              filteredPool.map((student) => (
                <div key={student.id} className="p-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:border-blue-200 transition-all cursor-pointer group shadow-sm hover:shadow-md flex flex-col justify-between h-48">
                  <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 shadow-sm">
                            {student.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <h5 className="font-bold text-slate-900 group-hover:text-blue-600 tracking-tight transition-colors">{student.name}</h5>
                            <p className="text-xs text-slate-500">{student.role}</p>
                        </div>
                      </div>
                       <div className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        student.readiness === 'Ready' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                        {student.readiness === 'Ready' ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <Clock className="w-3 h-3 inline mr-1" />}
                        {student.readiness}
                      </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Market Match</span>
                      <span className="text-lg font-bold text-slate-900">{student.match}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          student.match >= 90 ? "bg-emerald-500" : "bg-blue-500"
                        )} 
                        style={{ width: `${student.match}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-bold text-slate-600">ATS: {student.score}%</span>
                    </div>
                    <button className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:text-blue-700 transition-colors">
                      Profile <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
        </div>

        {!loading && filteredPool.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
              <button className="px-8 py-2 border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-blue-500/50 hover:text-blue-600 transition-all">
                Load More Pool Candidates
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobReadiness;
