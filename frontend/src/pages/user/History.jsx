import React, { useState, useEffect } from 'react';
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
  PlayCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getResumes, deleteResume, analyzeResume } from '../../services/api';

const History = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id);
        setResumes(resumes.filter(r => (r._id || r.id) !== id));
      } catch (error) {
        alert('Failed to delete resume');
      }
    }
  };

  const handleAnalyze = async (id) => {
    try {
      setLoading(true);
      await analyzeResume(id);
      fetchResumes();
    } catch (error) {
      alert('Analysis failed');
      setLoading(false);
    }
  };

  if (loading && resumes.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8">



      <div className="space-y-6">
        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-white/20 backdrop-blur-md rounded-[2.8rem] border border-white/40">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Resumes Found</h3>
            <p className="text-slate-400 font-medium mt-2">Try adjusting your filters or upload a new resume.</p>
          </div>
        ) : (
          resumes.map((resume) => {
            const isAnalyzed = Boolean(resume.analysis);
            const atsScore = resume.analysis?.atsScore ?? 0;

            return (
            <div
              key={resume._id || resume.id}
              className="bg-white/20 backdrop-blur-3xl rounded-[2.8rem] p-8 border border-white/60 relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] hover:shadow-blue-500/10 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-900/[0.1] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-24 bg-blue-50/20 backdrop-blur-md border border-white/40 rounded-[1.2rem] flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <FileText className="w-10 h-10 text-[#4b7bff]/80" />
                      {isAnalyzed && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute bottom-3 right-3 bg-white rounded-full p-0.5 shadow-sm" />
                      )}
                    </div>

                    <div className="flex-1 pt-1">
                      <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-4 group-hover:text-[#4b7bff] transition-colors">{resume.fileName || resume.filename}</h3>

                      <div className="flex flex-wrap items-center gap-6">
                        {isAnalyzed && (
                          <div className="flex items-center gap-4 py-1.5 pl-1.5 pr-6 bg-slate-900/[0.04] backdrop-blur-sm rounded-full border border-white/40">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-100" />
                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-500" strokeDasharray={126} strokeDashoffset={126 - (126 * atsScore) / 100} strokeLinecap="round" />
                              </svg>
                              <span className="absolute text-[11px] font-black text-[#1e293b]">{atsScore}%</span>
                            </div>
                            <div>
                              <span className="block text-xs font-black text-slate-400 leading-tight">ATS Score</span>
                              <span className="block text-sm font-bold text-[#1e293b] truncate max-w-[140px] uppercase tracking-tighter">
                                {resume.analysis?.jobTitle || 'General Analysis'}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {new Date(resume.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase border",
                      isAnalyzed
                        ? "bg-emerald-100/40 text-emerald-700 border-emerald-200"
                        : "bg-orange-100/40 text-orange-700 border-orange-200"
                    )}>
                      {isAnalyzed ? 'analyzed' : 'uploaded'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/40">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {isAnalyzed ? (
                      <>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-[#4b7bff] text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                          <Eye className="w-4 h-4" />
                          View Report
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-white/40 text-[#1e293b] rounded-2xl font-black text-sm border border-white/60 hover:bg-white/60 transition-all">
                          <GitCompare className="w-4 h-4" />
                          Matches
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAnalyze(resume._id || resume.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Run Analysis
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleAnalyze(resume._id || resume.id)}
                      className="p-3 text-slate-400 hover:text-[#4b7bff] hover:bg-white/40 rounded-xl transition-all" title="Refresh Analysis"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id || resume.id)}
                      className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50/40 rounded-xl transition-all" title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
