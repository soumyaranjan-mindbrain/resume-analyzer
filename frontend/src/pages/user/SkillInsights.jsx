import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Target,
  Map,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  TrendingDown,
  Activity,
  Award,
  Star,
  BookOpen,
  Briefcase,
  Clock,
  Layers,
  Search,
  Key,
  Upload
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getAnalytics, getMyResumes } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SkillInsights = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      navigate('/history', { state: { fileToUpload: file } });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resumeData = await getMyResumes();
        setResumes(resumeData.resumes || []);

        const analyticsData = await getAnalytics();
        setAnalytics(analyticsData || null);
      } catch (error) {
        console.error('Failed to fetch skill insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use real data from analytics or fallbacks
  const inDemandSkills = analytics?.analytics?.inDemandSkills || [
    { name: 'Data Science', percentage: 92, color: 'bg-blue-500' },
    { name: 'Cloud Computing', percentage: 85, color: 'bg-emerald-500' },
    { name: 'Product Management', percentage: 70, color: 'bg-purple-500' },
    { name: 'Blockchain', percentage: 60, color: 'bg-orange-500' }
  ];

  const missingSkills = analytics?.analytics?.missingSkills || [
    { name: 'System Design', value: 45, color: 'bg-blue-400' },
    { name: 'Unit Testing', value: 30, color: 'bg-emerald-400' },
    { name: 'API Docs', value: 25, color: 'bg-sky-400' }
  ];



  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto py-20 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm border border-slate-100">
          <Target className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Skill Library Empty</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-8 font-normal">
          Upload and analyze your resume to unlock detailed maps of your skill strengths, market demand, and personalized learning pathways.
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
    <div className="max-w-[1400px] mx-auto pb-8 px-4">
      {/* Mastery Markers - Good Points & Critical Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Good Points / Strengths */}
        <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Mastery Peaks</h3>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Core Strengths Detected</p>
            </div>
          </div>
          <div className="space-y-6 relative z-10">
            {analytics?.analytics?.topStrengths && analytics.analytics.topStrengths.length > 0 ? (
              analytics.analytics.topStrengths.map((str, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{str}</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Elite</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.max(85, 100 - (i * 5))}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">Standard professional formatting detected.</p>
            )}
          </div>
        </div>

        {/* Critical Gaps / Weaknesses */}
        <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Strategic Gaps</h3>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">Actionable Insights</p>
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            {analytics?.analytics?.weaknesses && analytics.analytics.weaknesses.length > 0 ? (
              analytics.analytics.weaknesses.map((weak, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <p className="text-slate-700 text-sm font-medium leading-relaxed">{weak}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">No critical structural gaps identified.</p>
            )}
          </div>
        </div>
      </div>






      <div className="mt-12">
        {/* Personalized Career Roadmap - Luxury Glass UI */}
        <div className="bg-slate-900 rounded-[2.5rem] lg:rounded-[3.5rem] p-6 lg:p-14 relative overflow-hidden shadow-2xl">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 lg:mb-16 relative z-10">
            <div>
              <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">Career Roadmap</h3>
              <p className="text-slate-400 text-[11px] lg:text-xs font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                <span className="w-8 h-px bg-blue-500/50" />
                Bridging {missingSkills.length} Identified Gaps
              </p>
            </div>
            <div className="w-fit px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI Synthesized Pathway
            </div>
          </div>

          <div className="relative space-y-12 lg:space-y-16 before:absolute before:inset-0 before:left-[23px] lg:before:left-[31px] before:top-8 before:bottom-8 before:w-1 lg:before:w-1.5 before:bg-gradient-to-b before:from-blue-600/50 before:via-purple-600/20 before:to-transparent before:z-0">
            {analytics?.analytics?.roadmap?.phases ? analytics.analytics.roadmap.phases.map((phase, idx) => (
              <div key={idx} className="relative z-10 flex gap-5 lg:gap-10 group">
                {/* Step Indicator */}
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl group-hover:border-blue-500/50 transition-all shrink-0">
                  <div className={cn(
                    "w-7 h-7 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center font-black text-[10px] lg:text-xs ring-4 ring-slate-900/50 transition-all duration-500",
                    idx === 0 ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-white/10 text-slate-400"
                  )}>
                    {idx + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-4">
                    <h4 className="text-xl lg:text-2xl font-black text-white tracking-tight italic uppercase">{phase.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                        phase.difficulty === 'Advanced' ? "border-purple-500/30 text-purple-400 bg-purple-500/10" :
                          (phase.difficulty === 'Intermediate' ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10")
                      )}>
                        {phase.difficulty || 'Intermediate'}
                      </span>
                      <span className="text-[9px] font-black text-white/40 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">
                        {phase.estimatedDays || (idx + 1) * 14} Days
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/[0.05] rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Target className="w-3.5 h-3.5" /> High-Level Objective
                        </h5>
                        <p className="text-slate-300 text-[13px] lg:text-sm font-medium leading-relaxed">
                          {phase.objective}
                        </p>

                        {phase.steps && (
                          <div className="mt-6 flex flex-wrap gap-2">
                            {phase.steps.map((step, sIdx) => (
                              <div key={sIdx} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-2 group/step hover:border-blue-500/30 hover:text-white transition-all">
                                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                {step}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-6 lg:p-7 relative overflow-hidden group/project">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover/project:scale-125 transition-transform duration-700" />
                        <h5 className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4">Milestone Project</h5>
                        <h6 className="text-base lg:text-lg font-black text-white mb-2 italic tracking-tight uppercase line-clamp-1">{phase.project?.title}</h6>
                        <p className="text-[12px] text-slate-400 leading-relaxed font-medium line-clamp-3">{phase.project?.description}</p>

                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Recommended Build</span>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover/project:translate-x-1 group-hover/project:text-blue-500 transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-2 h-2 rounded-full shadow-[0_0_10px]",
                            phase.status === 'Locked' ? "bg-slate-600 shadow-slate-600/20" : "bg-blue-500 shadow-blue-500/50 animate-pulse"
                          )} />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {phase.status === 'Locked' ? 'Phase Locked' : 'In Progress'}
                          </span>
                        </div>
                        <div className="w-px h-3 bg-white/10 hidden sm:block" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">
                          Priority: <span className={cn(
                            "italic",
                            phase.priority === 'High' ? "text-rose-500" : "text-blue-400"
                          )}>{phase.priority || (idx === 0 ? 'High' : 'Medium')}</span>
                        </span>
                      </div>

                      <button className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5">
                        View Resources
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : missingSkills.length > 0 ? missingSkills.map((skill, idx) => (
              <div key={idx} className="relative z-10 flex gap-6 lg:gap-10 group">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl shrink-0">
                  <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-xl bg-white/10 flex items-center justify-center text-slate-400 font-black text-[10px] lg:text-xs italic">
                    {idx + 1}
                  </div>
                </div>

                <div className="flex-1 mt-2">
                  <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 lg:p-8 hover:bg-white/[0.04] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div>
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">Master {skill.name}</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                          Achieve professional proficiency in {skill.name} to increase your job match rating.
                        </p>
                      </div>
                      <button className="px-8 py-3.5 bg-blue-600 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all shrink-0">
                        Initiate Phase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-24 text-center bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                <Map className="w-16 h-16 text-white/5 mx-auto mb-6" />
                <p className="text-white/40 font-black text-xs uppercase tracking-[0.2em]">Upload a resume to generate your custom learning path.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillInsights;
