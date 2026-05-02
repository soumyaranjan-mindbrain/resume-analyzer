import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  ChevronRight,
  Activity,
  Star,
  Search,
  X,
  FileText,
  Upload as UploadIcon,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Zap,
  TrendingDown,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Ban,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { getAllJobs, getJobById, getResumes, reanalyzeResume, uploadResume, applyToJob } from '../../services/api';
import { useNavigate } from 'react-router-dom';


import { useAnalysis } from '../../context/AnalysisContext';

const APPLY_CONTEXT_KEY = 'apply_job_context_v1';
const GLOBAL_CACHE_KEY = 'MBI_GLOBAL_RESUME_CONTEXT';

const JobMatches = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { jobs, setJobs, loading, fetchJobs } = useAnalysis();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyStep, setApplyStep] = useState('choose'); // choose | uploading | processing | result | error
  const [resumeChoice, setResumeChoice] = useState('latest'); // latest | upload
  const [applyError, setApplyError] = useState('');
  const [applyResult, setApplyResult] = useState(null);

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    // Auto-continue apply flow after uploading a new resume
    if (loading.jobs) return;
    try {
      const raw = sessionStorage.getItem(APPLY_CONTEXT_KEY);
      if (!raw) return;
      const ctx = JSON.parse(raw);
      if (!ctx?.jobId || !ctx?.resumeId) return;

      const job = jobs.find((j) => (j.id || j._id) === ctx.jobId) || null;
      if (!job) return;

      sessionStorage.removeItem(APPLY_CONTEXT_KEY);
      openApply(job);
      void runApply(job, ctx.resumeId);
    } catch {
      // ignore
    }
  }, [loading.jobs, jobs]);

  const filteredJobs = jobs; // Default to all jobs since filters are removed

  const closeModals = () => {
    setDetailsOpen(false);
    setApplyOpen(false);
    setUploadFile(null);
    setUploadProgress(0);
  };

  const openDetails = (job) => {
    setSelectedJob(job);
    setDetailsOpen(true);
  };

  const openApply = (job) => {
    setSelectedJob(job);
    setResumeChoice('latest');
    setApplyError('');
    setApplyResult(null);
    setApplyStep('choose');
    setUploadFile(null);
    setUploadProgress(0);
    setApplyOpen(true);
  };

  const getLatestResumeId = async () => {
    const data = await getResumes();
    const resumes = Array.isArray(data?.resumes) ? data.resumes : [];
    if (!resumes.length) return null;

    const latest = resumes
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];
    return latest?.id || latest?._id || null;
  };

  const runApply = async (job, forcedResumeId) => {
    setApplyError('');
    setApplyResult(null);
    setApplyStep('processing');
    setUploadProgress(0);
    setCurrentResumeId(null);

    // Synthetic progress for processing phase
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 200);

    try {
      const jobId = job?.id || job?._id;
      if (!jobId) throw new Error('Job ID missing');

      const resumeId = forcedResumeId || (await getLatestResumeId());
      if (!resumeId) {
        setApplyStep('choose');
        setApplyError('No resume found. Please upload a resume first.');
        return;
      }

      const jobDetails = await getJobById(jobId);
      const jobDescription = jobDetails?.description || job?.description || '';
      if (!jobDescription) throw new Error('Job description missing');

      const analysis = await reanalyzeResume(resumeId, jobDescription);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setCurrentResumeId(resumeId);
      await new Promise(r => setTimeout(r, 500));

      setApplyResult(analysis);
      setApplyStep('result');

      // Sync to Global Cache
      try {
        const existing = JSON.parse(sessionStorage.getItem(GLOBAL_CACHE_KEY) || '{}');
        sessionStorage.setItem(GLOBAL_CACHE_KEY, JSON.stringify({
          ...existing,
          lastAnalysis: analysis,
          lastJobTitle: job.title,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.error('Failed to sync to global cache:', err);
      }
    } catch (e) {
      clearInterval(progressInterval);
      console.error('[runApply] Error:', e);
      const msg = e?.response?.data?.error || e?.message || 'Something went wrong during analysis.';
      setApplyError(msg);
      setApplyStep('error');
    }
  };

  const handleCopyJD = (job) => {
    const details = [
      `Job Title: ${job.title}`,
      `Company: ${job.company}`,
      `Location: ${job.location || 'Remote'}`,
      `Salary: ${job.salary || 'Competitive'}`,
      `Type: ${job.type || 'Full-time'}`,
      `\nDescription:\n${job.description || ''}`,
      `\nRequirements:\n${job.requirements || ''}`,
      `\nSkills: ${(job.skills || []).join(', ')}`
    ].join('\n');

    navigator.clipboard.writeText(details)
      .then(() => toast.success('Job Details Copied to Clipboard!'))
      .catch((err) => {
        console.error('Copy failed:', err);
        toast.error('Failed to copy details');
      });
  };

  const handleFinalApply = async () => {
    if (!selectedJob || !currentResumeId) return;

    try {
      setIsApplying(true);
      const jobId = selectedJob.id || selectedJob._id;
      await applyToJob(jobId, currentResumeId);

      // Update local state to reflect application status immediately
      setJobs(prevJobs => prevJobs.map(j =>
        (j.id === jobId || j._id === jobId) ? { ...j, isApplied: true } : j
      ));

      setApplyStep('success');
    } catch (err) {
      console.error('[handleFinalApply] Error:', err);
      const msg = err?.response?.data?.error || err?.message || 'Application failed';
      setApplyError(msg);
      setApplyStep('error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyContinue = async () => {
    if (!selectedJob) return;

    if (resumeChoice === 'latest') {
      await runApply(selectedJob);
    } else if (resumeChoice === 'upload' && uploadFile) {
      await handleFileUploadAndApply();
    }
  };

  const handleFileUploadAndApply = async () => {
    if (!uploadFile || !selectedJob) return;

    setApplyStep('uploading');
    setApplyError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      // Smooth progress simulation
      const smoothInterval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 1 : prev));
      }, 50);

      const uploadResp = await uploadResume(formData, (progressEvent) => {
        const realPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(prev => Math.max(prev, Math.min(realPercent, 99)));
      });

      clearInterval(smoothInterval);
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 800)); // Brief pause at 100% for feedback

      const resumeId = uploadResp?.resume?.id || uploadResp?.resume?._id;
      if (!resumeId) throw new Error('Upload failed');

      await runApply(selectedJob, resumeId);
    } catch (err) {
      console.error('[handleFileUploadAndApply] Error:', err);
      const msg = err?.response?.data?.error || err?.message || 'Upload failed. Please try again.';
      setApplyError(msg);
      setApplyStep('error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setApplyError('File size exceeds 5MB limit.');
        return;
      }
      setUploadFile(file);
      setApplyError('');
    }
  };

  if (loading.jobs && jobs.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-8">

      {/* Main Jobs List */}
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white/20 backdrop-blur-md rounded-[2.8rem] border border-white/40">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">No Matches Found</h3>
            <p className="text-slate-600 font-normal mt-2">We're searching for more roles. Check back shortly!</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id || job.id}
              className="bg-white rounded-[1.75rem] p-6 border border-slate-100 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] group/card hover:shadow-[0_15px_45px_rgba(0,0,0,0.07)] transition-all duration-500"
            >
              <div className="relative z-10">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                  <div className="flex items-start gap-6 flex-1 min-w-0">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                      <img src={job.logo || `https://ui-avatars.com/api/?name=${job.company}&background=random`} alt={job.company} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight group-hover/card:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium text-[9px] uppercase tracking-wider border border-blue-200">
                            {job.type || 'Full-time'}
                          </span>
                          {job.category && (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-[9px] uppercase tracking-wider border border-emerald-200">
                              {job.category}
                            </span>
                          )}
                          {job.isHired && (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg font-black text-[9px] uppercase tracking-widest border border-rose-200 flex items-center gap-1.5 shadow-sm">
                              <Ban className="w-3.5 h-3.5" /> Hired
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
                        <span className="text-blue-600 font-bold text-sm hover:underline cursor-pointer">{job.company}</span>
                        <div className="flex items-center gap-1.5 text-slate-600 font-normal text-[10px] uppercase tracking-widest">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location || 'Remote'}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-normal text-[10px] uppercase tracking-widest">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salary || 'Competitive'}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {(job.skills || []).slice(0, 4).map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50/50 rounded-lg border border-slate-200 text-slate-600 font-normal text-[9px] uppercase tracking-tight">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {skill}
                          </div>
                        ))}
                        {(job.skills?.length > 4) && (
                          <div className="px-3 py-1 text-slate-400 font-normal text-[9px] uppercase tracking-widest">
                            +{job.skills.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-6 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => openDetails(job)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2.5 px-4 lg:px-6 py-3 lg:py-3.5 bg-white text-slate-800 rounded-xl font-semibold text-[10px] lg:text-[11px] uppercase tracking-widest shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-2 lg:gap-3 flex-1 md:flex-none">
                      <button
                        onClick={() => handleCopyJD(job)}
                        className="flex items-center justify-center gap-2 px-3 lg:px-4 py-3 lg:py-3.5 bg-white text-blue-600 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest shadow-sm border border-blue-100 hover:bg-blue-50 transition-all active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        JD
                      </button>

                      <button
                        onClick={() => {
                          if (job.isApplied) return;
                          job.isHired ? toast.error('This role is no longer accepting applications') : openApply(job);
                        }}
                        disabled={job.isHired || job.isApplied}
                        className={cn(
                          "flex items-center justify-center gap-2 px-3 lg:px-4 py-3 lg:py-3.5 rounded-xl font-bold text-[10px] lg:text-[11px] uppercase tracking-widest shadow-md transition-all active:scale-95",
                          job.isApplied
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none cursor-default"
                            : (job.isHired
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 shadow-lg")
                        )}
                      >
                        {job.isApplied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Applied
                          </>
                        ) : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {detailsOpen && selectedJob && createPortal(
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[9990]" onClick={closeModals} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-200 shadow-[0_30px_100px_-25px_rgba(15,23,42,0.5)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
              <div className="p-5 lg:p-8 flex items-start justify-between gap-4 lg:gap-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white border border-slate-200 rounded-2xl lg:rounded-3xl flex items-center justify-center p-3 lg:p-4 shadow-sm shrink-0">
                    <img src={selectedJob.logo || `https://ui-avatars.com/api/?name=${selectedJob.company}&background=random`} alt={selectedJob.company} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl lg:text-3xl font-bold text-slate-900 tracking-tight truncate uppercase">{selectedJob.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <span className="text-blue-600 font-bold uppercase tracking-widest text-[9px] lg:text-[11px]">{selectedJob.company}</span>
                      <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="text-slate-500 font-medium text-[9px] lg:text-[11px] uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {selectedJob.location || 'Remote'}
                      </span>
                      <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="text-slate-500 font-medium text-[9px] lg:text-[11px] uppercase tracking-widest flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> {selectedJob.type || 'Full-time'}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={closeModals} className="p-2.5 lg:p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 lg:p-8 space-y-6 lg:space-y-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-100 text-center md:text-left">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Salary</p>
                    <p className="text-base lg:text-lg font-bold text-slate-800">{selectedJob.salary || 'Market Rate'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-100 text-center md:text-left">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Job Category</p>
                    <p className="text-base lg:text-lg font-bold text-slate-800">{selectedJob.category || 'Tech'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-100 text-center md:text-left">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Posted On</p>
                    <p className="text-base lg:text-lg font-bold text-slate-800">{selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'Recent'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Skills Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.skills || []).map((s, i) => (
                      <span key={i} className="px-3 lg:px-4 py-2 rounded-xl bg-slate-900 text-white text-[9px] lg:text-[10px] font-bold uppercase tracking-wider">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedJob.description && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Full Description</h4>
                    <p className="text-sm lg:text-md text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">{selectedJob.description}</p>
                  </div>
                )}

                {(selectedJob.requirements || selectedJob.responsibilities) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-4 border-t border-slate-100">
                    {selectedJob.requirements && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Core Requirements</h4>
                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedJob.requirements}</p>
                      </div>
                    )}
                    {selectedJob.responsibilities && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Internal Responsibilities</h4>
                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-5 lg:p-8 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 lg:gap-4">
                <button
                  onClick={closeModals}
                  className="px-8 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-[10px] lg:text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                >
                  Close
                </button>
                <button
                  onClick={() => selectedJob.isHired ? toast.error('This role is no longer accepting applications') : (setDetailsOpen(false) || openApply(selectedJob))}
                  disabled={selectedJob.isHired}
                  className={cn(
                    "px-10 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-[10px] lg:text-xs uppercase tracking-widest transition-all shadow-xl",
                    selectedJob.isHired
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10 active:scale-95"
                  )}
                >
                  {selectedJob.isHired ? 'Role Closed' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Apply & Analysis Modal */}
      {applyOpen && selectedJob && createPortal(
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[9990]" onClick={closeModals} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-200 shadow-[0_30px_100px_-25px_rgba(15,23,42,0.5)] overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
              <div className="p-6 lg:p-8 flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-3 shadow-sm shrink-0">
                    <img src={selectedJob.logo || `https://ui-avatars.com/api/?name=${selectedJob.company}&background=random`} alt={selectedJob.company} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight truncate uppercase">Apply: {selectedJob.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedJob.company}</p>
                  </div>
                </div>
                <button onClick={closeModals} className="p-3 rounded-2xl hover:bg-slate-50 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={cn("p-6 lg:p-8 space-y-6 overflow-y-auto flex-1", applyStep === 'result' ? 'bg-slate-50/30' : '')}>
                {applyStep === 'choose' && (
                  <>
                    <div className="space-y-4">
                      <label
                        className={cn(
                          "flex items-start gap-5 p-6 rounded-3xl border transition-all duration-300 cursor-pointer group",
                          resumeChoice === 'latest' ? "border-blue-500 bg-blue-50/50 shadow-md" : "border-slate-100 hover:border-slate-200 bg-white"
                        )}
                        onClick={() => setResumeChoice('latest')}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center shrink-0",
                          resumeChoice === 'latest' ? "border-blue-600 bg-blue-600" : "border-slate-200"
                        )}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-md font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Compare with Latest Resume</div>
                          <div className="text-xs text-slate-500 mt-1 font-medium">Use your existing resume stored in your profile.</div>
                        </div>
                      </label>

                      <div className={cn(
                        "flex flex-col gap-5 p-6 rounded-3xl border transition-all duration-300 cursor-default",
                        resumeChoice === 'upload' ? "border-blue-500 bg-blue-50/50 shadow-md" : "border-slate-100 hover:border-slate-200 bg-white"
                      )}>
                        <div className="flex items-start gap-5 cursor-pointer" onClick={() => { setResumeChoice('upload'); fileInputRef.current?.click(); }}>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center shrink-0",
                            resumeChoice === 'upload' ? "border-blue-600 bg-blue-600" : "border-slate-200"
                          )}>
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-md font-bold text-slate-800">Upload Fresh Resume</div>
                            <div className="text-xs text-slate-500 mt-1 font-medium">Upload a specifically tailored resume for this role.</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/resume-maker', { state: { triggerAutoFill: true, jobDescription: selectedJob.description } });
                              }}
                              className="mt-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2"
                            >
                              <Sparkles className="w-3 h-3" /> or create tailored resume with Resume Maker
                            </button>
                          </div>
                        </div>

                        {resumeChoice === 'upload' && (
                          <div
                            className={cn(
                              "mt-2 p-5 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all",
                              uploadFile ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200 bg-white hover:border-blue-300"
                            )}
                            onClick={() => fileInputRef.current.click()}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="hidden"
                              accept=".pdf,.docx"
                            />
                            {uploadFile ? (
                              <>
                                <FileText className="w-8 h-8 text-emerald-500" />
                                <div className="text-center">
                                  <p className="text-sm font-bold text-slate-800">{uploadFile.name}</p>
                                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Ready to Analyze</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <UploadIcon className="w-8 h-8 text-slate-300" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select PDF or DOCX</p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {applyError && (
                      <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-700 animate-shake">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <p className="text-sm font-bold">{applyError}</p>
                      </div>
                    )}
                  </>
                )}

                {applyStep === 'uploading' && (
                  <div className="py-12 flex flex-col items-center justify-center gap-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <div className="absolute inset-0 border-8 border-slate-100 rounded-full" />
                      <div
                        className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"
                      />
                      <div className="text-2xl font-black text-blue-600">{uploadProgress}%</div>
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-xl font-bold text-slate-800">Transmitting Resume...</h4>
                      <p className="text-sm font-medium text-slate-500 px-10">We are securely uploading your file to our AI matching engine.</p>
                    </div>
                  </div>
                )}

                {applyStep === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center gap-8 text-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <div className="absolute inset-0 border-8 border-slate-100 rounded-full" />
                      <div
                        className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"
                      />
                      <div className="text-2xl font-black text-blue-600">{uploadProgress}%</div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-bold text-slate-800">Analyzing Resume...</h4>
                      <p className="text-sm font-medium text-slate-500 px-12 leading-relaxed">
                        We are currently matching your experience against the <span className="text-slate-900 font-bold">{selectedJob.title}</span> requirements.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      {[ShieldCheck, Briefcase, Target].map((Icon, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {applyStep === 'result' && applyResult && (
                  <div className="space-y-8 animate-fade-in">

                    {/* Hero Score Section */}
                    <div className="relative p-8 rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                            <circle
                              cx="80" cy="80" r="72" fill="none" stroke="url(#scoreGradient)" strokeWidth="14"
                              strokeDasharray={2 * Math.PI * 72}
                              strokeDashoffset={2 * Math.PI * 72 * (1 - (applyResult?.analysis?.atsScore ?? 0) / 100)}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4b7bff" />
                                <stop offset="100%" stopColor="#10b981" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-white italic tracking-tighter">
                              {applyResult?.analysis?.atsScore ?? 0}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Match Score</span>
                          </div>
                        </div>

                        <div className="text-center md:text-left flex-1">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-500/20">
                              {applyResult?.analysis?.experienceLevel || 'Professional'}
                            </span>
                            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">
                              ATS Verified
                            </span>
                          </div>
                          <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {(applyResult?.analysis?.atsScore ?? 0) >= 80 ? 'Excellent Match' : (applyResult?.analysis?.atsScore ?? 0) >= 60 ? 'Good Match' : 'Improvement Recommended'}
                          </h4>
                          <p className="text-slate-400 text-sm leading-relaxed max-w-xl italic">
                            "{applyResult?.analysis?.summaryAnalysis?.substring(0, 180) || 'Your resume has been compared against industry requirements for this role.'}..."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Verdict - Glassmorphism */}
                    <div className="p-1 w-full rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-emerald-500/20">
                      <div className="bg-white/80 backdrop-blur-xl rounded-[1.9rem] p-6 lg:p-8 border border-white/40">
                        <h5 className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-6">
                          <Target className="w-5 h-5 text-blue-600" /> Match Analysis
                        </h5>
                        <p className="text-sm font-medium text-slate-700 leading-loose text-justify">
                          {applyResult?.analysis?.summaryAnalysis || applyResult?.analysis?.summary}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Breakdown Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Progress Bars */}
                      <div className="lg:col-span-5 space-y-6">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Score Breakdown</h5>
                        <div className="space-y-5">
                          {[
                            { label: 'Skill Alignment', value: applyResult?.analysis?.breakdown?.skillAlignment, max: 40, color: 'bg-blue-600' },
                            { label: 'Experience Relevance', value: applyResult?.analysis?.breakdown?.experienceRelevance, max: 30, color: 'bg-emerald-600' },
                            { label: 'Keywords Density', value: applyResult?.analysis?.breakdown?.keywords, max: 20, color: 'bg-amber-500' },
                            { label: 'Strategic Impact', value: applyResult?.analysis?.breakdown?.impact, max: 10, color: 'bg-indigo-600' }
                          ].map((item, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-600">
                                <span>{item.label}</span>
                                <span>{item.value}/{item.max}</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-lg", item.color)}
                                  style={{ width: `${(item.value / item.max) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Missing Keywords & Suggestions */}
                      <div className="lg:col-span-7 space-y-8">
                        <div className="bg-slate-50 border border-slate-200/60 rounded-[2rem] p-6 lg:p-8">
                          <h5 className="flex items-center gap-2 text-rose-600 font-bold text-[11px] uppercase tracking-[0.2em] mb-4">
                            <TrendingDown className="w-4 h-4" /> Recommended Keywords
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {(applyResult?.analysis?.keywordsMissing || []).length > 0 ? (
                              (applyResult?.analysis?.keywordsMissing || []).map((kw, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white text-slate-700 text-[10px] font-bold rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-400 uppercase tracking-tight">
                                  {kw}
                                </span>
                              ))
                            ) : (
                              <p className="text-xs font-medium text-slate-400 italic">Resume is keyword-perfect for this job.</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                            <h6 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4" /> Top Strengths
                            </h6>
                            <ul className="space-y-2">
                              {(applyResult?.analysis?.topStrengths || []).slice(0, 3).map((s, i) => (
                                <li key={i} className="text-[11px] font-bold text-slate-700 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-6 bg-slate-900 rounded-3xl text-white">
                            <h6 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-3 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" /> Optimization
                            </h6>
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">
                              "{applyResult?.analysis?.suggestions?.[0] || 'Refine your summary to match the job responsibilities.'}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {applyStep === 'error' && (
                  <div className="py-12 flex flex-col items-center justify-center gap-6 text-center animate-fade-in">
                    {applyError.toLowerCase().includes('already applied') ? (
                      <>
                        <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-blue-500/10 relative">
                          <ShieldCheck className="w-12 h-12 text-blue-600" />
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-blue-100 rounded-full flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="space-y-3 px-10">
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight">Application Already Active</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Our records indicate you've already applied for the <span className="text-slate-900 font-bold">{selectedJob.title}</span> role.
                            Your current application is under active review.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={closeModals}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                          >
                            Explore More Jobs
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center">
                          <AlertCircle className="w-10 h-10 text-rose-500" />
                        </div>
                        <div className="space-y-2 px-8">
                          <h4 className="text-xl font-bold text-slate-800 uppercase tracking-tight">System Interruption</h4>
                          <p className="text-sm font-medium text-slate-500">{applyError || 'We encountered a technical hurdle while processing your request. Please try again.'}</p>
                        </div>
                        <button
                          onClick={() => setApplyStep('choose')}
                          className="mt-4 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                          Try Again
                        </button>
                      </>
                    )}
                  </div>
                )}

                {applyStep === 'success' && (
                  <div className="py-20 flex flex-col items-center justify-center gap-8 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-emerald-500/10 relative">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center animate-bounce">
                        <Star className="w-4 h-4 fill-white" />
                      </div>
                    </div>
                    <div className="space-y-4 px-10">
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight">Application Transmitted!</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">
                        Your optimized resume has been successfully sent to <span className="text-slate-900 font-bold">{selectedJob.company}</span>.
                        Our AI has verified its competitive alignment with the requirements.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 text-left">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-600 leading-tight">
                        You can track this application and view your <br /> historical matching stats in the dashboard.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                <button
                  onClick={closeModals}
                  className="px-8 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                >
                  {applyStep === 'result' ? 'Close Analysis' : (applyStep === 'success' ? 'Finish' : 'Cancel')}
                </button>

                {applyStep === 'choose' && (
                  <button
                    onClick={handleApplyContinue}
                    disabled={resumeChoice === 'upload' && !uploadFile}
                    className={cn(
                      "px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3",
                      (resumeChoice === 'upload' && !uploadFile) ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-800"
                    )}
                  >
                    {resumeChoice === 'upload' ? (
                      <>
                        <UploadIcon className="w-4 h-4" /> Start Comparison
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Analyze Now
                      </>
                    )}
                  </button>
                )}

                {applyStep === 'result' && (
                  <button
                    onClick={handleFinalApply}
                    disabled={isApplying}
                    className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                  >
                    {isApplying ? 'Processing...' : (
                      <>
                        Apply for This Job <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}

                {applyStep === 'success' && (
                  <button
                    onClick={() => { closeModals(); navigate('/dashboard'); }}
                    className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Go to Dashboard
                  </button>
                )}

                {applyStep === 'error' && (
                  <button
                    onClick={() => setApplyStep('choose')}
                    className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Styles for progress loop */}
      <style>{`
        @keyframes progress-loop {
          0% { left: -100%; width: 30%; }
          50% { width: 50%; }
          100% { left: 100%; width: 30%; }
        }
        .animate-progress-loop {
          animation: progress-loop 2s infinite ease-in-out;
          position: absolute;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div >
  );
};

export default JobMatches;
