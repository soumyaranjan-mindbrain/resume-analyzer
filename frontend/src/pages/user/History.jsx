import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Upload,
  Plus,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  GitCompare,
  PlayCircle,
  X,
  Target,
  Sparkles,
  Zap,
  TrendingUp,
  XCircle,
  AlertCircle,
  Hash
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getResumes, deleteResume, analyzeResume } from '../../services/api';

const ReportModal = ({ isOpen, onClose, resume }) => {
  if (!isOpen || !resume) return null;

  const analysis = resume.analysis || {};
  const atsScore = analysis.atsScore ?? 0;

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

  return (
    <div className="fixed inset-0 lg:left-64 z-[100] flex flex-col bg-[#fcfdfe] overflow-hidden animate-in slide-in-from-right duration-500 shadow-2xl">
      {/* Background Decor - Subtle & Professional */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-slate-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-50 rounded-full blur-[120px]" />
      </div>

      {/* Header - Solid & Professional */}
      <div className="relative z-20 px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-[1240px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-blue-50">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">Career Strategy Report</h2>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest leading-none">Analysis: {resume.fileName}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-widest border border-blue-100">AI Intelligence</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-200 text-slate-600 rounded-xl hidden sm:flex items-center gap-2 hover:bg-slate-50 transition-all font-bold text-[10px] uppercase tracking-wider"
            >
              <X className="w-4 h-4" />
              Close Report
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span className="font-bold text-xs tracking-tight">Download Full Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 py-8 px-6">
        <div className="max-w-[1240px] mx-auto space-y-8">

          {/* Top Score Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Large Score Card */}
            {/* Score Card */}
            <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative">
              <div className="absolute top-0 right-0 p-6 opacity-40">
                <Target className="w-5 h-5 text-slate-300" />
              </div>
              <div className="relative w-48 h-48 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="86" fill="none" stroke="#f8fafc" strokeWidth="12" />
                  <circle
                    cx="96" cy="96" r="86" fill="none" stroke="url(#score-grad)" strokeWidth="12"
                    strokeDasharray={540} strokeDashoffset={540 - (540 * atsScore) / 100} strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-bold text-slate-900 tracking-tight">{atsScore}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">ATS INDEX</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {atsScore >= 75 ? "Executive Ready" : "Optimization Needed"}
                </h3>
                <p className="text-slate-500 text-xs font-medium">
                  Matches <span className="text-slate-900 font-semibold tracking-tight">Tier-1 Standards</span>
                </p>
              </div>
            </div>

            {/* Summary & Tags */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  Executive Summary
                </div>
                <h3 className="text-2xl font-medium text-slate-800 leading-[1.6]">
                  {analysis.summary || "Your resume represents a strong professional profile with significant growth potential."}
                </h3>
                <div className="pt-8 grid grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Experience Level</span>
                    <span className="text-xl font-bold text-slate-900">{analysis.experienceLevel || "Professional"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Target Role</span>
                    <span className="text-xl font-bold text-slate-900">Software Engineer</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Assessment</span>
                    <span className="text-xl font-bold text-blue-600">A+ Grade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight">Technical Strengths</h4>
                  <p className="text-emerald-600 font-semibold text-[10px] uppercase tracking-widest mt-0.5">Key Highlights</p>
                </div>
              </div>
              <div className="space-y-4">
                {(analysis.topStrengths || ["Professional Formatting", "Impactful Verb Usage", "Technical Proficiency"]).map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 font-semibold text-sm leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 border border-rose-100 shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight">Critical Gaps</h4>
                  <p className="text-rose-600 font-semibold text-[10px] uppercase tracking-widest mt-0.5">Attention Needed</p>
                </div>
              </div>
              <div className="space-y-4">
                {(analysis.weaknesses || ["Keyword Density", "Quantifiable Metrics", "Actionable Headers"]).map((w, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 font-semibold text-sm leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Intelligence Section */}
          <div className="space-y-8">
            {/* Roadmap Section */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <TrendingUp className="w-24 h-24 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 border border-slate-100">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Strategic Roadmap</h4>
                      <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-widest mt-0.5">Personalized Optimization Steps</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analysis.suggestions.map((step, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center text-xs font-bold mb-4 border border-slate-100 shadow-sm">0{i+1}</div>
                        <p className="font-bold text-sm leading-[1.6] text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Keyword Optimization Card */}
            {(analysis.keywordsMissing?.length > 0 || analysis.trends?.length > 0) && (
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                    <GitCompare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">Keyword Optimization</h4>
                    <p className="text-indigo-600 font-semibold text-[10px] uppercase tracking-widest mt-0.5">Missing Professional Anchors</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {analysis.keywordsMissing.map((kw, i) => (
                    <span key={kw} className="px-4 py-2 bg-slate-50 rounded-xl text-slate-600 text-xs font-bold border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-default">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-4" />
        </div>
      </div>

      {/* Content Spacer for Scroll focus */}
      <div className="h-6 shrink-0" />
    </div>
  );
};

const History = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Delete this resume and all AI analysis permanently?')) return;

    try {
      setLoading(true);
      await deleteResume(resumeId);
      setResumes(prev => prev.filter(r => (r._id || r.id) !== resumeId));
    } catch (error) {
      console.error('Delete Error:', error);
      const errorMsg = error.response?.data?.error || 'Could not delete resume. Ensure you are logged in and try again.';
      alert(errorMsg);
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
      alert('Analysis failed. check your API limits.');
      setLoading(false);
    }
  };

  const handleViewReport = (resume) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };

  if (loading && resumes.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 sm:px-0">
      <div className="space-y-8">
        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-400 tracking-tight">History is Empty</h3>
            <p className="text-slate-400 font-semibold mt-2 mb-10">Upload your first resume to see AI insights here.</p>
            <button
              onClick={() => navigate('/upload')}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 mx-auto hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              <Upload className="w-5 h-5" />
              Upload Now
            </button>
          </div>
        ) : (
          resumes.map((resume) => {
            const isAnalyzed = Boolean(resume.analysis);
            const atsScore = resume.analysis?.atsScore ?? 0;
            const rId = resume._id || resume.id;

            return (
              <div key={rId} className="bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] group/card hover:shadow-[0_15px_45px_rgba(0,0,0,0.07)] transition-all duration-500 relative overflow-hidden mb-4 last:mb-0">
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                  {/* Left: Info Section */}
                  <div className="flex items-start gap-6 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-14 h-18 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <FileText className="w-7 h-7 text-blue-500/50" />
                      </div>
                      {isAnalyzed && (
                        <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full shadow-lg z-20 ring-4 ring-white">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                        <h3 className="text-xl font-extrabold text-slate-800 truncate tracking-tight group-hover/card:text-blue-600 transition-colors">
                          {resume.fileName || "Draft Scan"}
                        </h3>
                        <span className={cn(
                          "px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider border",
                          isAnalyzed
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {isAnalyzed ? 'Optimized' : 'Draft'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-5 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                        <div className="flex items-center gap-1.5 bg-slate-50/50 py-1.5 px-3 rounded-lg border border-slate-100/30">
                          <Clock className="w-3.5 h-3.5 opacity-70" />
                          {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'}
                        </div>
                        <div className="flex items-center gap-1.5 opacity-50">
                          <Hash className="w-3.5 h-3.5" />
                          {rId.slice(-6).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Sleek Score Zone */}
                  {isAnalyzed && (
                    <div className="relative group/score flex items-center gap-6 py-3.5 px-7 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] shrink-0 scale-90 md:scale-100 origin-right transition-all hover:border-blue-100">
                      <div className="flex flex-col items-end">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-1">
                          {atsScore}
                          <span className="text-xl text-blue-500 font-bold ml-1">%</span>
                        </span>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em] leading-none">ATS Index</span>
                      </div>
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                          <circle 
                            cx="32" cy="32" r="28" fill="none" 
                            stroke={atsScore >= 80 ? "#10b981" : atsScore >= 50 ? "#3b82f6" : "#f59e0b"} 
                            strokeWidth="4" 
                            strokeDasharray={176} 
                            strokeDashoffset={176 - (176 * atsScore) / 100} 
                            strokeLinecap="round" 
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 bg-white m-2 rounded-full flex items-center justify-center shadow-inner border border-slate-50">
                           <Sparkles className="w-4 h-4 text-blue-300" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {isAnalyzed ? (
                      <>
                        <button
                          onClick={() => handleViewReport(resume)}
                          className="flex-1 sm:flex-none py-3 px-7 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2.5 hover:bg-blue-700 transition-all shadow-md active:scale-95 text-[11px] uppercase tracking-widest"
                        >
                          <Eye className="w-4 h-4" />
                          Review Strategic Report
                        </button>
                        <button className="flex-1 sm:flex-none py-3 px-7 border border-slate-200 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                          Matches
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAnalyze(rId)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:bg-slate-800 active:scale-95 transition-all w-full sm:w-auto"
                      >
                        <Zap className="w-4 h-4" />
                        Generate Strategy
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleDelete(rId)}
                      className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all group/del" title="Delete Permanent"
                    >
                      <Trash2 className="w-4.5 h-4.5 group-hover/del:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resume={selectedResume}
      />
    </div>
  );
};

export default History;
