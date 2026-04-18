import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  Trash2,
  CheckCircle2,
  Eye,
  Activity,
  TrendingUp,
  Star,
  Plus,
  Search,
  Upload,
  Filter,
  MoreHorizontal,
  Download,
  Edit3,
  Clock,
  ChevronRight,
  GitCompare,
  PlayCircle,
  X,
  Target,
  ShieldCheck,
  XCircle,
  AlertCircle,
  Zap,
  Hash,
  Cpu
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getResumes, deleteResume, analyzeResume } from '../../services/api';
import { useAnalysis } from '../../context/AnalysisContext';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

const getNameFromPath = (resume) => {
  if (!resume) return 'Untitled Resume';
  const path = resume.fileName || resume.fileUrl || resume.file_path;
  if (!path) return 'Untitled Resume';
  const parts = path.split(/[/\\]/);
  const fileName = parts[parts.length - 1];
  return fileName.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/, '');
};

const ReportModal = ({ isOpen, onClose, resume }) => {
  if (!isOpen || !resume) return null;

  const analysis = resume.analysis || {};
  const atsScore = analysis.atsScore ?? 0;

  const getGrade = (score) => {
    if (score >= 90) return { label: "Strategic Excellence", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100" };
    if (score >= 75) return { label: "Executive Standard", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100" };
    if (score >= 60) return { label: "Competitive Ready", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" };
    if (score >= 40) return { label: "Growth Required", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" };
    return { label: "Critical Remediation", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-100" };
  };

  const grade = getGrade(atsScore);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-50 overflow-hidden print:overflow-visible print:h-auto animate-in fade-in duration-500 font-sans">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-0 print:hidden" onClick={onClose} />
      <div className="relative z-20 px-4 lg:px-8 py-3 lg:py-5 flex items-center justify-between bg-white border-b border-slate-100 print:hidden">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base lg:text-lg font-black text-slate-900 tracking-tight lg:mb-1 truncate">Career Strategy Report</h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-slate-500 font-bold text-[9px] uppercase tracking-widest leading-none">Ref: 2026-ASR</span>
                <span className="text-blue-600 font-black text-[9px] lg:text-[10px] uppercase tracking-widest truncate max-w-[120px] lg:max-w-none">{getNameFromPath(resume)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="h-10 px-5 border border-slate-200 text-slate-600 rounded-xl hidden sm:flex items-center gap-2 hover:bg-slate-50 transition-all font-bold text-[10px] uppercase tracking-widest">
              <X className="w-4 h-4" /> Discard
            </button>
            <button onClick={() => window.print()} className="h-10 px-6 bg-slate-900 text-white rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
              <Download className="w-4 h-4" /> <span className="font-bold text-[11px] uppercase tracking-widest">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 py-6 lg:py-10 md:px-4 lg:px-8 px-0 print:p-12 print:overflow-visible print:h-auto">
        <div className="max-w-[1280px] mx-auto space-y-0 md:space-y-6 lg:space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-5 lg:gap-6">
            <div className="lg:col-span-4 bg-white rounded-none md:rounded-xl p-3 lg:p-8 border-x-0 md:border-x border-y md:border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="relative w-36 h-36 lg:w-44 lg:h-44 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - atsScore / 100)} strokeLinecap="round"
                    className={cn(
                      "transition-all duration-1000",
                      atsScore >= 75 ? "text-indigo-600" :
                        atsScore >= 60 ? "text-emerald-500" :
                          atsScore >= 40 ? "text-amber-500" : "text-rose-500"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">{atsScore}</span>
                  <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2.5">Overall Match</span>
                </div>
              </div>
              <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border mb-3", grade.bg, grade.color, grade.border)}>
                {grade.label}
              </div>
              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-[0.2em]">SaaS Benchmarked Verdict</p>
            </div>
            <div className="lg:col-span-8 bg-white border-x-0 md:border-x border-y md:border-slate-100 rounded-none md:rounded-xl p-3 lg:p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 tracking-tight uppercase">Strategic Assessment</h4>
                </div>
                <p className="text-base lg:text-lg font-bold text-slate-700 leading-relaxed italic">
                  "{(!analysis.summary || analysis.summary.includes('⚠️ Platform Error') || analysis.summary.includes('Analysis failed'))
                    ? "Please upload a professional resume to analyze properly."
                    : analysis.summary}"
                </p>
              </div>
            </div>
          </div>

          {analysis.scoreBreakdown && (
            <div className="bg-white rounded-none md:rounded-xl p-5 lg:p-6 border-x-0 md:border-x border-y md:border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <h4 className="text-[11px] font-black text-slate-900 tracking-tight uppercase">Technical Matrix</h4>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 lg:gap-x-10 gap-y-6 lg:gap-y-8">
                {Object.entries(analysis.scoreBreakdown).map(([key, value]) => {
                  const max = key === 'keywords' ? 20 : (key === 'achievements' || key === 'skillAlignment') ? 40 : 10;
                  const ratio = (value / max) * 100;
                  return (
                    <div key={key} className="space-y-2.5">
                      <div className="flex items-end justify-between px-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-base font-black text-slate-900 leading-none">{value}<span className="text-[10px] text-slate-300 ml-0.5">/{max}</span></span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-1000", ratio > 70 ? "bg-blue-600" : ratio > 40 ? "bg-indigo-400" : "bg-slate-300")}
                          style={{ width: `${Math.min(100, ratio)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-5">
            <div className="bg-white rounded-none md:rounded-xl p-3.5 lg:p-6 border-x-0 md:border-x border-y md:border-slate-100 shadow-sm group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase">Strengths</h4>
              </div>
              <div className="space-y-3">
                {(analysis.topStrengths || ["Technical Depth", "Execution Focus", "Strategic Thinking", "Impact Orientation"]).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 group-hover/strengths:bg-white transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <p className="text-slate-700 font-bold text-xs tracking-tight">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-none md:rounded-xl p-3.5 lg:p-6 border-x-0 md:border-x border-y md:border-slate-100 shadow-sm group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 border border-rose-100 shadow-sm group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase">Critical Gaps</h4>
              </div>
              <div className="space-y-3">
                {(analysis.weaknesses || ["Metric Precision", "Keywords Missing", "Quantified Impact", "Role Alignment"]).map((w, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 group-hover/weaknesses:bg-white transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <p className="text-slate-700 font-bold text-xs tracking-tight">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="bg-white rounded-none md:rounded-xl p-3.5 lg:p-8 border-x-0 md:border-x border-y md:border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase">Tactical Roadmap</h4>
              </div>
              <div className="space-y-0 pl-1">
                {(analysis.suggestions || [])
                  .filter(step => !step.includes('⚠️ Platform Error') && !step.includes('Analysis failed'))
                  .map((step, i) => (
                    <div key={i} className="flex gap-4 pb-4 last:pb-0 group/step">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-lg bg-white text-slate-900 flex items-center justify-center text-xs font-black border border-slate-200 group-hover/step:bg-blue-600 group-hover/step:text-white group-hover/step:border-blue-600 transition-all duration-300 relative z-10 shadow-xs">
                          {i + 1}
                        </div>
                        {i !== analysis.suggestions.length - 1 && (
                          <div className="w-px flex-1 bg-slate-100 group-hover/step:bg-blue-200 transition-colors my-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 group-hover/step:bg-white transition-all">
                          <div className="flex items-start gap-2.5">
                            <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            <p className="font-bold text-xs text-slate-800 leading-relaxed tracking-tight">{step}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="pt-10 border-t border-slate-100 flex items-center justify-between text-slate-500 font-bold text-[9px] uppercase tracking-widest">
            <div className="flex gap-8">
              <span>Verified Analytics</span>
              <span>Proprietary ATS Logic</span>
              <span>Human-Optimized</span>
            </div>
            <div>&copy; 2026 Strategy Engine</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const { startAnalysis, isAnalyzing } = useAnalysis();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, resumeId: null });

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getResumes();
      setResumes(data.resumes || []);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleViewReport = (resume) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };

  const handleUploadSuccess = async (newResumeId) => {
    await fetchResumes();
    navigate('/history', { state: { openReportId: newResumeId }, replace: true });
    setHasAutoOpened(false);
  };

  const handleDirectUpload = async (file) => {
    startAnalysis(file);
  };

  // Auto-effects
  useEffect(() => {
    if (!loading && resumes.length > 0 && location.state?.openReportId && !hasAutoOpened) {
      const resumeToOpen = resumes.find(r => (r._id || r.id) === location.state.openReportId);
      if (resumeToOpen) {
        handleViewReport(resumeToOpen);
        setHasAutoOpened(true);
        window.history.replaceState({}, document.title);
      }
    }

    if (!loading && location.state?.fileToUpload && !isAnalyzing) {
      const file = location.state.fileToUpload;
      window.history.replaceState({}, document.title);
      handleDirectUpload(file);
    }
  }, [resumes, loading, location.state, hasAutoOpened, isAnalyzing]);

  const handleDelete = (resumeId) => {
    setDeleteModal({ isOpen: true, resumeId });
  };

  const confirmDelete = async () => {
    const resumeId = deleteModal.resumeId;
    try {
      setLoading(true);
      await deleteResume(resumeId);
      setResumes(prev => prev.filter(r => (r._id || r.id) !== resumeId));
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error(error.response?.data?.error || 'Could not delete resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (resumeId) => {
    try {
      setLoading(true);
      await analyzeResume(resumeId);
      await fetchResumes();
    } catch (error) {
      console.error('Analysis Error:', error);
      alert('Analysis failed.');
      setLoading(false);
    }
  };

  if (loading && resumes.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    total: resumes.length,
    average: resumes.length ? Math.round(resumes.reduce((acc, r) => acc + (r.analysis?.atsScore || 0), 0) / resumes.length) : 0,
    top: resumes.length ? Math.max(...resumes.map(r => r.analysis?.atsScore || 0)) : 0
  };

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 sm:px-0">
      {/* Header removed as requested */}

      {resumes.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-5 mb-8 md:mb-10">
          <div className="bg-white p-3 lg:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 lg:w-28 lg:h-28 bg-blue-50 rounded-full opacity-50 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <p className="text-[7px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 lg:mb-3">Total</p>
              <div className="flex items-end gap-1 lg:gap-2.5">
                <span className="text-xl lg:text-4xl font-black text-slate-900 tracking-tighter">{stats.total}</span>
                <span className="text-[7px] lg:text-[10px] font-bold text-blue-600 mb-0.5 lg:mb-1.5 uppercase tracking-tight hidden sm:inline">Active</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 lg:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 lg:w-28 lg:h-28 bg-emerald-50 rounded-full opacity-50 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <p className="text-[7px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 lg:mb-3">Avg</p>
              <div className="flex items-end gap-1 lg:gap-2.5">
                <span className="text-xl lg:text-4xl font-black text-slate-900 tracking-tighter">{stats.average}%</span>
                <div className="flex flex-col mb-0.5 lg:mb-1.5">
                  <TrendingUp className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-emerald-500 mb-0.5" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 lg:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 lg:w-28 lg:h-28 bg-amber-50 rounded-full opacity-50 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <p className="text-[7px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 lg:mb-3">Peak</p>
              <div className="flex items-end gap-1 lg:gap-2.5">
                <span className="text-xl lg:text-4xl font-black text-slate-900 tracking-tighter">{stats.top}%</span>
                <div className="flex flex-col mb-0.5 lg:mb-1.5">
                  <Star className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-amber-500 mb-0.5 fill-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">History is Empty</h3>
            <p className="text-slate-500 font-medium mt-2 mb-10">Upload your first resume to see AI insights here.</p>
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.docx';
                input.onchange = (e) => handleDirectUpload(e.target.files[0]);
                input.click();
              }}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 mx-auto hover:bg-black transition-all shadow-xl active:scale-95 shadow-slate-900/10"
            >
              <Upload className="w-5 h-5" /> Upload Now
            </button>
          </div>
        ) : (
          <>
            {/* Global NeuralAnalysisOverlay handles the showing of analysis now */}

            {resumes.map((resume) => {
              const isAnalyzed = Boolean(resume.analysis);
              const atsScore = resume.analysis?.atsScore ?? 0;
              const rId = resume._id || resume.id;
              return (
                <div key={rId} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm group/card hover:shadow-md transition-all duration-300 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm group-hover/card:bg-white group-hover/card:border-blue-100 transition-all duration-300">
                          <FileText className="w-6 h-6 text-blue-500/40 group-hover/card:text-blue-600 transition-colors" />
                        </div>
                        {isAnalyzed && (
                          <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white p-0.5 rounded-lg shadow-lg z-20 ring-4 ring-white animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base lg:text-lg font-bold text-slate-800 tracking-tight group-hover/card:text-blue-600 transition-colors truncate">
                          {getNameFromPath(resume)}
                        </h3>
                      </div>
                    </div>

                    {isAnalyzed && (
                      <div className="flex-1 flex justify-center items-center gap-5">
                        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="22" cy="22" r="20" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                            <circle
                              cx="22" cy="22" r="20" fill="none"
                              stroke={atsScore >= 80 ? "#10b981" : atsScore >= 50 ? "#3b82f6" : "#f59e0b"}
                              strokeWidth="3"
                              strokeDasharray={125}
                              strokeDashoffset={125 - (125 * atsScore) / 100}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <span className="absolute text-xs font-black text-slate-800">{atsScore}%</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest hidden lg:block">ATS Score</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 lg:gap-4 justify-between sm:justify-end border-t sm:border-t-0 border-slate-50 pt-4 sm:pt-0">
                      {isAnalyzed ? (
                        <button
                          onClick={() => handleViewReport(resume)}
                          className="h-10 px-6 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-sm active:scale-95 text-[10px] uppercase tracking-widest"
                        >
                          <Eye className="w-4 h-4" />
                          View Report
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAnalyze(rId)}
                          className="h-10 px-6 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <Activity className="w-4 h-4" />
                          Generate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rId)}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all group/del"
                        title="Delete Permanent"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} resume={selectedResume} />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, resumeId: null })}
        onConfirm={confirmDelete}
        title="Delete Resume"
        message="Are you sure you want to delete this resume and all AI analysis permanently? This action cannot be undone."
        confirmText="Yes, Delete Permanently"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default History;
