import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Building2,
  Target,
  Users,
  Loader2,
  Layers,
  ChevronRight,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  XCircle,
  BarChart3,
  X,
  Calendar,
  Mail,
  Phone,
  ArrowUpRight,
  User
} from 'lucide-react';
import { getAllJobs, deleteJob, toggleJobHiredStatus, getJobApplicants } from '../../services/api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

const JobDescriptions = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobId: null });
  const [statsModal, setStatsModal] = useState({ isOpen: false, job: null, applicants: [], loading: false });

  const fetchJobs = async (silent = false) => {
    try {
      // Only show loader if we have no data yet
      if (!silent && jobs.length === 0) setLoading(true);
      const data = await getAllJobs();
      const mappedJobs = data.map(job => ({
        ...job,
        tags: job.tags || job.skillsRequired || [],
        applicants: job._count?.applications || 0
      }));
      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (!silent) toast.error('Failed to fetch jobs');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, jobId: id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.jobId;
    // Optimistic update
    const originalJobs = [...jobs];
    setJobs(prev => prev.filter(job => job.id !== id));

    try {
      await deleteJob(id);
      toast.success('Job role deleted successfully');
      // Refresh silently in background to keep data in sync
      fetchJobs(true);
    } catch (error) {
      // Rollback on error
      setJobs(originalJobs);
      toast.error('Failed to delete job role');
    }
  };

  const handleToggleHired = async (id) => {
    // Optimistic update
    const originalJobs = [...jobs];
    setJobs(prev => prev.map(job =>
      job.id === id ? { ...job, isHired: !job.isHired } : job
    ));

    try {
      await toggleJobHiredStatus(id);
      toast.success('Job status updated');
      // Refresh silently in background to keep data in sync
      fetchJobs(true);
    } catch (error) {
      // Rollback on error
      setJobs(originalJobs);
      console.error('Error toggling hired status:', error);
      toast.error('Failed to update job status');
    }
  };

  const handleViewStats = async (job) => {
    setStatsModal({ isOpen: true, job, applicants: [], loading: true });
    try {
      const response = await getJobApplicants(job.id);
      setStatsModal(prev => ({ ...prev, applicants: response.applications || [], loading: false }));
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to fetch applicant stats');
      setStatsModal(prev => ({ ...prev, loading: false }));
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = [
    {
      label: 'Active Roles',
      value: jobs.length.toString(),
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      borderColor: 'border-blue-100',
      gradient: 'from-blue-500/10 to-transparent'
    },
    {
      label: 'Total Applicants',
      value: jobs.reduce((acc, job) => acc + (job.applicants || 0), 0).toLocaleString(),
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      gradient: 'from-emerald-500/10 to-transparent'
    },
    {
      label: 'Unique Skills',
      value: [...new Set(jobs.flatMap(j => j.tags))].length.toString(),
      icon: Layers,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      borderColor: 'border-purple-100',
      gradient: 'from-purple-500/10 to-transparent'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">

      {/* Premium Stat Cards */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {stats.map((stat, i) => (
            <div key={i} className={cn(
              "relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 border shadow-sm group hover:shadow-md transition-all duration-300",
              stat.borderColor
            )}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.gradient)} />

              <div className="relative flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                </div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border-2 shadow-inner group-hover:scale-110 transition-transform duration-300", stat.bg, stat.color, stat.borderColor)}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>

            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/admin/jobs/new')}
          className="flex items-center justify-center gap-3 px-6 py-4 lg:px-8 lg:py-6 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 h-full whitespace-nowrap lg:min-w-[220px] group w-full lg:w-auto"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-5 h-5" />
          </div>
          <span>Create New Role</span>
        </button>
      </div>

      {/* Main Job Table - Premium Glass UI */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col min-h-[500px] overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Job Catalog</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage all available job descriptions</p>
          </div>
          <div className="relative flex-1 md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, company or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Position & Skills</th>
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Company</th>
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Applicants</th>
                <th className="py-5 px-8 text-right text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-black tracking-widest uppercase">Syncing with DB...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Layers className="w-10 h-10 text-slate-300" />
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No active roles found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="text-base font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{job.title}</p>
                          {job.isHired && (
                            <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Hired
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] font-black text-slate-400 bg-slate-100/50 px-2 py-0.5 rounded border border-slate-200/50 uppercase">
                              {tag}
                            </span>
                          ))}
                          {job.tags.length > 3 && (
                            <span className="text-[10px] font-black text-blue-400 px-2 py-0.5 uppercase">
                              +{job.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors border border-slate-200/50">
                          <Building2 className="w-4 h-4 text-slate-400" />
                        </div>
                        {job.company}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="inline-flex flex-col items-center gap-1 group/chip">
                        <span className="text-lg font-black text-slate-900 group-hover/chip:scale-125 transition-transform duration-300">{job.applicants}</span>
                        <div className="w-8 h-1 bg-blue-500 rounded-full scale-x-0 group-hover/chip:scale-x-100 transition-transform duration-300" />
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 lg:opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleViewStats(job)}
                          className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-200 rounded-xl hover:shadow-lg hover:shadow-purple-500/10 transition-all transform hover:-translate-y-0.5"
                          title="View Applicant Stats"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleHired(job.id)}
                          className={cn(
                            "p-2.5 border rounded-xl transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-lg",
                            job.isHired
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                              : "bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200"
                          )}
                          title={job.isHired ? "Reopen Job" : "Mark as Hired"}
                        >
                          {job.isHired ? <RotateCcw className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                          className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all transform hover:-translate-y-0.5"
                          title="Edit Role"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 rounded-xl hover:shadow-lg hover:shadow-red-500/10 transition-all transform hover:-translate-y-0.5"
                          title="Delete Role"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, jobId: null })}
        onConfirm={confirmDelete}
        title="Delete Job Role"
        message="Are you sure you want to delete this job role? This action cannot be undone."
        confirmText="Yes, Delete Role"
        cancelText="Cancel"
        type="danger"
      />

      {/* Applicants Stats Modal */}
      {statsModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setStatsModal({ ...statsModal, isOpen: false })} />

          <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{statsModal.job?.title}</h2>
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-100">Stats View</span>
                </div>
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                  <Building2 className="w-3.5 h-3.5" /> {statsModal.job?.company}
                </p>
              </div>
              <button
                onClick={() => setStatsModal({ ...statsModal, isOpen: false })}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {statsModal.loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Analyzing application data...</p>
                </div>
              ) : statsModal.applicants.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-40">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-inner">
                    <Users className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* Summary row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Candidates</p>
                      <h4 className="text-3xl font-black text-slate-900">{statsModal.applicants.length}</h4>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 space-y-2">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Average ATS Score</p>
                      <h4 className="text-3xl font-black text-emerald-700">
                        {Math.round(statsModal.applicants.reduce((acc, curr) => acc + (curr.resume?.analysis?.atsScore || 0), 0) / statsModal.applicants.length)}%
                      </h4>
                    </div>
                    <div className="bg-purple-50/50 border border-purple-100 rounded-3xl p-6 space-y-2">
                      <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Top Candidate Score</p>
                      <h4 className="text-3xl font-black text-purple-700">
                        {Math.max(...statsModal.applicants.map(a => a.resume?.analysis?.atsScore || 0))}%
                      </h4>
                    </div>
                  </div>

                  {/* Applicants Table */}
                  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Candidate</th>
                          <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                          <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Applied Date</th>
                          <th className="py-4 px-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">ATS Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {statsModal.applicants.map((app) => (
                          <tr key={app.id} className="group hover:bg-slate-50/30 transition-colors">
                            <td className="py-5 px-8">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm font-black text-slate-500 uppercase">
                                  {app.user?.name ? app.user.name[0] : <User className="w-5 h-5" />}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-900 tracking-tight">{app.user?.name || 'Unknown Candidate'}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Candidate ID: {app.id.slice(-6).toUpperCase()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                  <Mail className="w-3 h-3 opacity-40" />
                                  {app.user?.email}
                                </div>
                                {app.user?.phone && (
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Phone className="w-2.5 h-2.5 opacity-40" />
                                    {app.user.phone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-tighter">
                                <Calendar className="w-3.5 h-3.5 opacity-40" />
                                {new Date(app.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                            </td>
                            <td className="py-5 px-8 text-right">
                              <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                <span className={cn(
                                  "text-lg font-black tracking-tighter",
                                  (app.resume?.analysis?.atsScore || 0) >= 80 ? "text-emerald-600" :
                                    (app.resume?.analysis?.atsScore || 0) >= 60 ? "text-blue-600" : "text-slate-600"
                                )}>
                                  {app.resume?.analysis?.atsScore || 0}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default JobDescriptions;
