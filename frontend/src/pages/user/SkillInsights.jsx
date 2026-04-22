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
  Upload,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAnalysis } from '../../context/AnalysisContext';
import { useNavigate } from 'react-router-dom';
import { toggleRoadmapPhase } from '../../services/api';
import toast from 'react-hot-toast';

const SkillInsights = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    skillInsights: analytics,
    resumes,
    loading,
    fetchSkillInsights,
    fetchHistory
  } = useAnalysis();

  const [completedPhases, setCompletedPhases] = useState([]);
  const [toggling, setToggling] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      navigate('/history', { state: { fileToUpload: file } });
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchSkillInsights();
  }, [fetchHistory, fetchSkillInsights]);

  useEffect(() => {
    if (analytics?.analytics?.completedPhases) {
      setCompletedPhases(analytics.analytics.completedPhases);
    }
  }, [analytics]);

  const handleTogglePhase = async (idx) => {
    try {
      setToggling(idx);
      // Optimistic Update
      const isAlreadyCompleted = completedPhases.includes(idx);
      const newCompleted = isAlreadyCompleted
        ? completedPhases.filter(i => i !== idx)
        : [...completedPhases, idx];

      setCompletedPhases(newCompleted);

      await toggleRoadmapPhase(idx);
      await fetchSkillInsights(true);
      toast.success(isAlreadyCompleted ? "Phase reset" : "Phase completed!");
    } catch (error) {
      console.error('Failed to toggle phase:', error);
      toast.error('Failed to update progress');
      fetchSkillInsights(true);
    } finally {
      setToggling(null);
    }
  };

  // Logic for Active Indicator: The first index not in completedPhases
  const roadmapPhases = analytics?.analytics?.roadmap?.phases || [];
  const activePhaseIndex = roadmapPhases.findIndex((_, index) => !completedPhases.includes(index));
  const finalActiveIndex = activePhaseIndex === -1 && roadmapPhases.length > 0 ? roadmapPhases.length : activePhaseIndex;



  const missingSkills = analytics?.analytics?.missingSkills || [
    { name: 'System Design', value: 45, color: 'bg-blue-400' },
    { name: 'Unit Testing', value: 30, color: 'bg-emerald-400' },
    { name: 'API Docs', value: 25, color: 'bg-sky-400' }
  ];



  if (loading.insights && !analytics) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto py-10 lg:py-20 text-center">
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
    <div className="max-w-[1400px] mx-auto pb-8 md:px-4 px-0">
      {/* Mastery Markers - Good Points & Critical Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-5 lg:gap-8 mb-0 md:mb-8 lg:mb-12">
        {/* Good Points / Strengths */}
        <div className="bg-white rounded-none md:rounded-[1.5rem] p-5 lg:p-10 border-x-0 md:border-x border-y md:border-slate-100 shadow-sm relative overflow-hidden group">
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
                <div key={i} className="flex items-center gap-3 p-3.5 bg-emerald-50/30 rounded-xl border border-emerald-100/50 group-hover:bg-white transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{str}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">Standard professional formatting detected.</p>
            )}
          </div>
        </div>

        {/* Critical Gaps / Weaknesses */}
        <div className="bg-white rounded-none md:rounded-[1.5rem] p-5 lg:p-10 border-x-0 md:border-x border-y md:border-slate-100 shadow-sm relative overflow-hidden group">
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






      <div className="mt-0 md:mt-6 lg:mt-10">
        {/* Personalized Career Roadmap - High-Density Light UI */}
        <div className="bg-white rounded-none md:rounded-[1.2rem] lg:rounded-[3rem] p-5 lg:p-10 relative overflow-hidden shadow-sm border-x-0 md:border-x border-y md:border-slate-100 italic-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8 relative z-10">
            <div>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Career Roadmap</h3>
              <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <span className="w-6 h-px bg-blue-500/30" />
                Bridging {missingSkills.length} Identified Gaps
              </p>
            </div>
          </div>

          <div className="relative space-y-4 lg:space-y-6 before:absolute before:inset-0 before:left-[17px] lg:before:left-[27px] before:top-8 before:bottom-0 before:w-px lg:before:w-1 before:bg-slate-200 before:z-0">
            {analytics?.analytics?.roadmap?.phases ? analytics.analytics.roadmap.phases.map((phase, idx) => {
              const isCompleted = completedPhases.includes(idx);
              const isActive = idx === finalActiveIndex;

              return (
                <div key={idx} className={cn(
                  "relative z-10 flex gap-3 lg:gap-8 group transition-all duration-500",
                  isCompleted ? "opacity-75" : "opacity-100"
                )}>
                  {/* Step Indicator */}
                  <div className={cn(
                    "w-9 h-9 lg:w-14 lg:h-14 bg-white border rounded-lg lg:rounded-2xl flex items-center justify-center shadow-sm transition-all shrink-0",
                    isCompleted ? "border-emerald-500/30" : (isActive ? "border-blue-500/50" : "border-slate-200")
                  )}>
                    <div className={cn(
                      "w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center font-black text-[10px] lg:text-xs ring-4 ring-white transition-all duration-700",
                      isCompleted ? "bg-emerald-500 text-white rotate-[360deg]" :
                        (isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110" : "bg-slate-100 text-slate-400")
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1.5 mb-2.5">
                      <h4 className={cn(
                        "text-base lg:text-xl font-bold tracking-tight leading-tight uppercase transition-colors",
                        isCompleted ? "text-emerald-600 line-through opacity-60" : "text-slate-800"
                      )}>{phase.title}</h4>
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <span className="text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={cn(
                      "bg-slate-50/50 border rounded-none md:rounded-[1rem] lg:rounded-[2rem] p-3 lg:p-6 transition-all duration-500 border-x-0 md:border-x group-hover:bg-white",
                      isCompleted ? "border-emerald-100/50" : (isActive ? "border-blue-100 scale-[1.01] shadow-xl shadow-blue-500/5 bg-white" : "border-slate-100")
                    )}>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h5 className={cn(
                              "text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                              isCompleted ? "text-emerald-500" : "text-blue-600"
                            )}>
                              <Target className="w-3 h-3" /> Core Objective
                            </h5>
                            <button
                              onClick={() => handleTogglePhase(idx)}
                              disabled={toggling === idx}
                              className={cn(
                                "text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all",
                                isCompleted
                                  ? "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                                  : "bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95"
                              )}
                            >
                              {toggling === idx ? "Saving..." : (isCompleted ? "Mark Incomplete" : "Mark as Complete")}
                            </button>
                          </div>
                          <p className={cn(
                            "text-[12px] lg:text-sm font-medium leading-relaxed transition-all",
                            isCompleted ? "text-slate-400 italic" : "text-slate-600"
                          )}>
                            {phase.objective}
                          </p>

                          {phase.steps && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {phase.steps.map((step, sIdx) => (
                                <div key={sIdx} className={cn(
                                  "px-2 py-1 border rounded-lg text-[9px] font-bold uppercase tracking-tight flex items-center gap-1.5 transition-all",
                                  isCompleted ? "bg-emerald-50/50 border-emerald-100 text-emerald-600/70" : "bg-white border-slate-100 text-slate-500 hover:border-blue-500/30 hover:text-blue-600"
                                )}>
                                  <CheckCircle2 className={cn("w-2.5 h-2.5", isCompleted ? "text-emerald-500" : "text-blue-500")} />
                                  {step}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : missingSkills.length > 0 ? missingSkills.map((skill, idx) => (
              <div key={idx} className="relative z-10 flex gap-4 lg:gap-8 group">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 font-black text-[10px] lg:text-xs italic border border-slate-100">
                    {idx + 1}
                  </div>
                </div>

                <div className="flex-1 mt-1">
                  <div className="bg-slate-50/30 border border-slate-100/60 rounded-none md:rounded-[1.5rem] p-3.5 hover:bg-white/50 transition-all duration-300 border-x-0 md:border-x">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-black text-slate-800 italic uppercase tracking-tight mb-1">Master {skill.name}</h4>
                        <p className="text-slate-500 text-[12px] font-medium leading-normal">
                          Achieve professional proficiency to increase your market match.
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-500/10 hover:bg-blue-700 active:scale-95 transition-all shrink-0">
                        Initiate Phase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                <Map className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Upload a resume to generate your trajectory.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillInsights;
