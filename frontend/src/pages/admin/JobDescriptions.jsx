import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Building2,
  Target,
  Users,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { getAllJobs, deleteJob } from '../../services/api';

const JobDescriptions = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job role?')) {
      try {
        await deleteJob(id);
        fetchJobs();
      } catch (error) {
        alert('Failed to delete job role');
      }
    }
  };

  const stats = [
    { label: 'Active Roles', value: jobs.length.toString(), icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Total Applicants', value: jobs.reduce((acc, job) => acc + (job.applicants || 0), 0).toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Pending Review', value: '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Hiring Rate', value: '18%', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Stat & Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl px-5 py-4 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", stat.bg, stat.color, stat.border)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate('/admin/jobs/new')}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200 h-fit whitespace-nowrap lg:min-w-[180px]"
        >
          <Plus className="w-5 h-5" /> New Job Role
        </button>
      </div>

      {/* Main Job Table - Full Width */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[600px]">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">Job Catalog</h3>
            <div className="relative flex-1 sm:max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search roles by title, company or tags..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
        </div>

        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-8 text-xs font-bold uppercase tracking-wider text-slate-500">Position</th>
                  <th className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Company</th>
                  <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Applicants</th>
                  <th className="py-3 px-8 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-8">
                        <div>
                          <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900 tracking-tight">{job.title}</p>
                              {job.status === 'Draft' && (
                                <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-bold border border-slate-200">Draft</span>
                              )}
                          </div>
                          <div className="flex gap-2 mt-1">
                              {job.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-medium text-slate-400">#{tag}</span>
                              ))}
                          </div>
                        </div>
                    </td>
                    <td className="py-5 px-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {job.company}
                        </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                        <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">{job.applicants}</span>
                    </td>
                    <td className="py-5 px-8 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title="Edit">
                              <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors" title="More">
                              <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
            <button className="px-8 py-2 border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-blue-500/50 hover:text-blue-600 transition-all">
              Load More Catalog Roles
            </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptions;
