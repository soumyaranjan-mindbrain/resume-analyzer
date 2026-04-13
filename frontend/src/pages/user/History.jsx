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
  AlertCircle
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
    <div className="fixed inset-0 lg:left-64 z-[100] flex flex-col bg-[#f8faff] overflow-hidden animate-in slide-in-from-right duration-500 shadow-2xl">
      {/* Background Decor - Site Consistent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Header - Glassmorphic fixed */}
      <div className="relative z-20 px-6 py-4 flex items-center justify-between glass-nav border-b border-white/60 shadow-sm">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-blue-50">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Career Strategy Report</h2>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-black text-[9px] uppercase tracking-widest leading-none">Analysis: {resume.fileName}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest italic border border-blue-100">Expert Review</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="btn-outline !py-2 !px-6 hidden sm:flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider">Close Detail</span>
            </button>
            <button
              onClick={() => window.print()}
              className="btn-kredo !py-2 !px-6 flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider">Download Full Report</span>
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
            <div className="lg:col-span-4 clay-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Target className="w-5 h-5 text-slate-100" />
              </div>
              <div className="relative w-44 h-44 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="88" cy="88" r="80" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle
                    cx="88" cy="88" r="80" fill="none" stroke="url(#score-grad)" strokeWidth="12"
                    strokeDasharray={502} strokeDashoffset={502 - (502 * atsScore) / 100} strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7b61ff" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter italic">{atsScore}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60 mt-1">ATS INDEX</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  {atsScore >= 75 ? "Executive Ready" : "Optimization Needed"}
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-4">
                  Analysis matches <span className="text-slate-600">Tier-1 Standards</span>
                </p>
              </div>
            </div>

            {/* Summary & Tags */}
            <div className="lg:col-span-8 bg-white/80 backdrop-blur-md border border-white rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-center relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 -mr-10 -mt-10" />
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Insights
                </div>
                <h3 className="text-xl font-medium text-slate-700 leading-relaxed italic">
                  "{analysis.summary || "Your resume represents a strong professional profile with significant growth potential."}"
                </h3>
                <div className="pt-6 grid grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest block">Experience Level</span>
                    <span className="text-xl font-black text-slate-800">{analysis.experienceLevel || "Professional"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest block">Matched Roles</span>
                    <span className="text-xl font-black text-slate-800">Software Engineer</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest block">Potential Score</span>
                    <span className="text-xl font-black text-blue-600">A+ Grade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="glass-card rounded-[2.5rem] p-8 border-white shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Main Strengths</h4>
                  <p className="text-emerald-600/70 text-[9px] font-black uppercase tracking-widest">Premium Qualities</p>
                </div>
              </div>
              <div className="space-y-3">
                {(analysis.topStrengths || ["Professional Formatting", "Impactful Verb Usage", "Technical Proficiency"]).map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-white/60 hover:bg-white transition-all shadow-sm">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                    <p className="text-slate-700 font-bold text-sm tracking-tight">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="glass-card rounded-[2.5rem] p-8 border-white shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 border border-rose-100">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Critical Gaps</h4>
                  <p className="text-rose-600/70 text-[9px] font-black uppercase tracking-widest">Needs Improvement</p>
                </div>
              </div>
              <div className="space-y-3">
                {(analysis.weaknesses || ["Keyword Density", "Quantifiable Metrics", "Actionable Headers"]).map((w, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-white/60 hover:bg-white transition-all shadow-sm">
                    <span className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                    <p className="text-slate-700 font-bold text-sm tracking-tight">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Intelligence Section */}
          <div className="space-y-8">
            {/* Personalized Recommendations */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="clay-card p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <TrendingUp className="w-24 h-24 text-blue-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Personalized Roadmap</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analysis.suggestions.map((step, i) => (
                      <div key={i} className="group p-6 bg-white/60 hover:bg-blue-600 rounded-[2rem] border border-white shadow-sm transition-all duration-300">
                        <p className="font-bold text-sm leading-relaxed text-slate-700 group-hover:text-white transition-colors italic">"{step}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Missing Keywords & Skills */}
            {(analysis.keywordsMissing?.length > 0 || analysis.trends?.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {analysis.keywordsMissing?.length > 0 && (
                  <div className={`glass-card p-8 rounded-[2.5rem] border-white shadow-sm ${analysis.trends?.length > 0 ? 'lg:col-span-12' : 'lg:col-span-12'}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <GitCompare className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Keyword Optimization</h4>
                        <p className="text-indigo-600/70 text-[9px] font-black uppercase tracking-widest">Missing from your profile</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordsMissing.map((kw, i) => (
                        <span key={kw} className="px-4 py-2 bg-white rounded-xl text-slate-600 text-xs font-bold border border-slate-100/50 shadow-sm hover:border-indigo-200 transition-colors uppercase tracking-wider">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
    <div className="max-w-[1200px] mx-auto py-10 px-4">
      <div className="space-y-8">
        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-white/20 backdrop-blur-md rounded-[2.8rem] border border-white/40 shadow-sm">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">History is Empty</h3>
            <p className="text-slate-400 font-medium mt-2 mb-8">Upload your first resume to see AI insights here.</p>
            <button
              onClick={() => navigate('/upload')}
              className="btn-kredo !px-10 !py-4"
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
              <div
                key={rId}
                className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/80 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-blue-500/5 transition-all duration-500"
              >
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-20 bg-white rounded-2xl flex flex-col items-center justify-center border border-blue-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <FileText className="w-8 h-8 text-blue-500/60" />
                        {isAnalyzed && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-3 group-hover:text-blue-600 transition-colors uppercase italic">{resume.fileName || "Unnamed Resume"}</h3>

                        <div className="flex flex-wrap items-center gap-4">
                          {isAnalyzed && (
                            <div className="flex items-center gap-3 py-1.5 px-4 bg-slate-900/[0.04] rounded-full border border-white/40">
                              <div className="relative w-10 h-10 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="20" cy="20" r="17" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                  <circle cx="20" cy="20" r="17" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={106} strokeDashoffset={106 - (106 * atsScore) / 100} strokeLinecap="round" />
                                </svg>
                                <span className="absolute text-[10px] font-black text-slate-900">{atsScore}%</span>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Score Match</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                            <Clock className="w-4 h-4" />
                            {new Date(resume.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full font-black text-[9px] tracking-[0.2em] uppercase border shadow-sm",
                        isAnalyzed
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {isAnalyzed ? 'Optimized' : 'Ready'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100/50">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {isAnalyzed ? (
                        <>
                          <button
                            onClick={() => handleViewReport(resume)}
                            className="btn-kredo flex-1 sm:flex-none !py-3 !px-8"
                          >
                            <Eye className="w-4 h-4" />
                            Detailed Report
                          </button>
                          <button className="btn-outline flex-1 sm:flex-none !py-3 !px-8 font-black text-[10px] uppercase tracking-wider">
                            Matches
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleAnalyze(rId)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          <Zap className="w-4 h-4" />
                          Generate Insight
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleDelete(rId)}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Delete Permanent"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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
