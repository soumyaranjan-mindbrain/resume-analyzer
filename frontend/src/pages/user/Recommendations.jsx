import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Search,
  Activity,
  GitCompare,
  ChevronRight,
  ClipboardList,
  Star,
  RefreshCw,
  AlertCircle,
  Upload
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAnalysis } from '../../context/AnalysisContext';

const Recommendations = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    recommendations,
    resumes,
    loading,
    fetchRecommendations,
    fetchHistory
  } = useAnalysis();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      navigate('/history', { state: { fileToUpload: file } });
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchRecommendations();
  }, [fetchHistory, fetchRecommendations]);


  const checklist = [
    'Use quantitative metrics (e.g. 20% growth)',
    'Reverse chronological order for experience',
    'Include direct links to portfolio/LinkedIn',
    'Keep your contact info up to date',
    'Ensure white space is balanced',
    'Optimize for ATS with relevant keywords',
    'Keep it to 1-2 pages maximum',
    'Use a clean, professional font',
    'Proofread for any grammar errors',
    'Tailor your summary to the specific role',
    'Use strong action verbs for bullet points',
    'Avoid using first-person pronouns like "I"',
    'Save and send your resume in PDF format',
    'Highlight relevant certifications and honors'
  ];

  const tabs = ['Improvement Tips', 'Suggested Jobs'];

  if (loading.recommendations && recommendations.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto py-20 text-center">
        <div className="w-24 h-24 bg-yellow-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-yellow-600 shadow-xl shadow-yellow-500/10">
          <Lightbulb className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">No Recommendations Yet</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-10 font-normal">
          Once you upload your resume, our AI will provide personalized tips, keywords, and courses to help you land your dream job.
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 flex items-center gap-3 mx-auto transition-all"
        >
          <Upload className="w-5 h-5" /> Initialize Analysis
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.docx"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-8 md:px-4 px-0">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400 tracking-tight">No Matches Found</h3>
                <p className="text-slate-400 font-semibold mt-2">We're searching for more roles. Check back shortly!</p>
              </div>
            ) : (
              recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-none md:rounded-xl p-5 lg:p-6 border-x-0 md:border-x border-y md:border-slate-100 relative overflow-hidden group shadow-sm transition-all duration-500"
                >
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-6 px-4 md:px-0">
                    <div className="flex items-start lg:items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-xl lg:rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                        {rec.type === 'skill' ? <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" /> : <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />}
                      </div>
                      <div className="w-full">
                        <h3 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight mb-1">{rec.title}</h3>
                        <p className="text-slate-600 font-normal text-sm lg:max-w-[450px] leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>


        </div>


        <div className="w-full lg:w-[380px] space-y-8">

          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6 lg:mb-8">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  <ClipboardList className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">Best Practices</h3>
              </div>

              <div className="space-y-4 mb-10">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Star className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                    </div>
                    <span className="text-slate-600 font-medium text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/resume-maker', { state: { triggerAutoFill: true } })}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Optimize Now
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Recommendations;
