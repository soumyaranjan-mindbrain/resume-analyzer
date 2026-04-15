import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getAllJobs, getJobById, getResumes, reanalyzeResume } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const APPLY_CONTEXT_KEY = 'apply_job_context_v1';

const JobMatches = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyStep, setApplyStep] = useState('choose'); // choose | processing | result | error
  const [resumeChoice, setResumeChoice] = useState('latest'); // latest | upload
  const [applyError, setApplyError] = useState('');
  const [applyResult, setApplyResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const jobData = await getAllJobs();
        const list = Array.isArray(jobData) ? jobData : (jobData?.jobs || []);
        const normalized = list.map((job) => ({
          ...job,
          skills: Array.isArray(job.skillsRequired) ? job.skillsRequired : (Array.isArray(job.skills) ? job.skills : []),
        }));
        setJobs(normalized);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Auto-continue apply flow after uploading a new resume
    if (loading) return;
    try {
      const raw = sessionStorage.getItem(APPLY_CONTEXT_KEY);
      if (!raw) return;
      const ctx = JSON.parse(raw);
      if (!ctx?.jobId || !ctx?.resumeId) return;

      const job = jobs.find((j) => (j.id || j._id) === ctx.jobId) || null;
      if (!job) return;

      sessionStorage.removeItem(APPLY_CONTEXT_KEY);
      openApply(job);
      // immediately proceed with the newly uploaded resume
      void runApply(job, ctx.resumeId);
    } catch {
      // ignore
    }
  }, [loading, jobs]);

  const filterTags = ['All', 'Open Now'];

  const filteredJobs = jobs.filter(job => {
    const title = String(job.title || '').toLowerCase();
    const company = String(job.company || '').toLowerCase();

    if (activeFilter !== 'All') {
      // Placeholder for future filters (e.g., only active postings)
      if (activeFilter === 'Open Now') {
        // If backend later adds a status field, we can filter here.
        // For now, treat all jobs as open.
      }
    }

    if (!searchText.trim()) return true;
    const q = searchText.trim().toLowerCase();
    return title.includes(q) || company.includes(q);
  });

  const closeModals = () => {
    setDetailsOpen(false);
    setApplyOpen(false);
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
      setApplyResult(analysis);
      setApplyStep('result');
    } catch (e) {
      setApplyError(e?.message || 'Apply failed. Please try again.');
      setApplyStep('error');
    }
  };

  const handleApplyContinue = async () => {
    if (!selectedJob) return;

    if (resumeChoice === 'upload') {
      const jobId = selectedJob?.id || selectedJob?._id;
      sessionStorage.setItem(
        APPLY_CONTEXT_KEY,
        JSON.stringify({ jobId })
      );
      navigate('/upload');
      return;
    }

    await runApply(selectedJob);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-8">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 border",
                activeFilter === tag 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-[340px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search jobs by title or company..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none hover:border-blue-400 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      
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
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                         <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover/card:text-blue-600 transition-colors">{job.title}</h3>
                         <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium text-[9px] uppercase tracking-wider border border-blue-200">
                           {job.type || 'Full-time'}
                         </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
                        <span className="text-blue-600 font-medium text-sm hover:underline cursor-pointer">{job.company}</span>
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

                  <div className="flex items-center gap-6 shrink-0">
                      <button
                        onClick={() => openDetails(job)}
                        className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-slate-800 rounded-xl font-semibold text-[11px] uppercase tracking-widest shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
                      >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openApply(job)}
                        className="flex items-center gap-2.5 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-[11px] uppercase tracking-widest shadow-md hover:bg-slate-800 active:scale-95 transition-all"
                      >
                          Apply Now
                          <ChevronRight className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {detailsOpen && selectedJob && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={closeModals} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.4)] overflow-hidden">
              <div className="p-6 flex items-start justify-between gap-4 border-b border-slate-100">
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight truncate">{selectedJob.title}</h3>
                  <p className="text-sm font-medium text-slate-500 truncate">{selectedJob.company} • {selectedJob.location || 'Remote'} • {selectedJob.type || 'Full-time'}</p>
                </div>
                <button onClick={closeModals} className="p-2 rounded-xl hover:bg-slate-50 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {(selectedJob.skills || []).map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      {s}
                    </span>
                  ))}
                </div>

                {selectedJob.salary && (
                  <div className="text-sm font-medium text-slate-700">
                    Salary: <span className="text-slate-900 font-bold">{selectedJob.salary}</span>
                  </div>
                )}

                {selectedJob.description && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Job Description</h4>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>
                )}

                {selectedJob.requirements && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Requirements</h4>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedJob.requirements}</p>
                  </div>
                )}

                {selectedJob.responsibilities && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Responsibilities</h4>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => { setDetailsOpen(false); openApply(selectedJob); }}
                  className="px-7 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Apply Modal */}
      {applyOpen && selectedJob && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={closeModals} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.4)] overflow-hidden">
              <div className="p-6 flex items-start justify-between gap-4 border-b border-slate-100">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight truncate">Apply: {selectedJob.title}</h3>
                  <p className="text-sm font-medium text-slate-500 truncate">{selectedJob.company}</p>
                </div>
                <button onClick={closeModals} className="p-2 rounded-xl hover:bg-slate-50 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {applyStep === 'choose' && (
                  <>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="resumeChoice"
                          checked={resumeChoice === 'latest'}
                          onChange={() => setResumeChoice('latest')}
                          className="mt-1"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-800">Proceed with latest uploaded resume</div>
                          <div className="text-xs text-slate-500">We’ll compare your most recent resume with this job description.</div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="resumeChoice"
                          checked={resumeChoice === 'upload'}
                          onChange={() => setResumeChoice('upload')}
                          className="mt-1"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-800">Upload a new resume</div>
                          <div className="text-xs text-slate-500">Upload a fresh version, then we’ll run the comparison automatically.</div>
                        </div>
                      </label>
                    </div>

                    {applyError && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold">
                        {applyError}
                      </div>
                    )}
                  </>
                )}

                {applyStep === 'processing' && (
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl border-4 border-blue-100 border-t-blue-600 animate-spin" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800">Comparing your resume with the job description…</div>
                      <div className="text-xs text-slate-500">This usually takes a few seconds.</div>
                    </div>
                  </div>
                )}

                {applyStep === 'result' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-widest text-emerald-600">Comparison Ready</div>
                          <div className="text-sm font-bold text-slate-900">ATS Score: {applyResult?.analysis?.atsScore ?? applyResult?.atsScore ?? 0}%</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { closeModals(); navigate('/dashboard'); }}
                        className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs uppercase tracking-widest"
                      >
                        View Dashboard
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Summary</div>
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-6">
                        {applyResult?.analysis?.summary || applyResult?.summary || 'Your comparison is ready. Check dashboard for detailed breakdown.'}
                      </div>
                    </div>
                  </div>
                )}

                {applyStep === 'error' && (
                  <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700">
                    <div className="text-sm font-bold mb-1">Apply failed</div>
                    <div className="text-sm font-medium">{applyError || 'Please try again.'}</div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Close
                </button>

                {applyStep === 'choose' && (
                  <button
                    onClick={handleApplyContinue}
                    className="px-7 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 inline-flex items-center gap-2"
                  >
                    {resumeChoice === 'upload' ? (
                      <>
                        <FileText className="w-4 h-4" /> Upload Resume
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4" /> Proceed
                      </>
                    )}
                  </button>
                )}

                {applyStep === 'error' && (
                  <button
                    onClick={() => runApply(selectedJob)}
                    className="px-7 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobMatches;
