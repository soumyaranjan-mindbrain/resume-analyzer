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
  Sparkles,
  Rocket,
  Package
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
            {analytics?.analytics?.roadmap?.phases ? analytics.analytics.roadmap.phases.map((phase, idx) => (
              <div key={idx} className="relative z-10 flex gap-3 lg:gap-8 group">
                {/* Step Indicator */}
                <div className="w-9 h-9 lg:w-14 lg:h-14 bg-white border border-slate-200 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-sm group-hover:border-blue-500/50 transition-all shrink-0">
                  <div className={cn(
                    "w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center font-black text-[10px] lg:text-xs ring-4 ring-white transition-all duration-500",
                    idx === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-100 text-slate-400"
                  )}>
                    {idx + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1.5 mb-2.5">
                    <h4 className="text-base lg:text-xl font-bold text-slate-800 tracking-tight leading-tight uppercase">{phase.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border",
                        phase.difficulty === 'Advanced' ? "border-purple-200 text-purple-600 bg-purple-50" :
                          (phase.difficulty === 'Intermediate' ? "border-blue-200 text-blue-600 bg-blue-50" : "border-emerald-200 text-emerald-600 bg-emerald-50")
                      )}>
                        {phase.difficulty || 'Intermediate'}
                      </span>
                      <span className="text-[8px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-slate-100">
                        {phase.estimatedDays || (idx + 1) * 14} Days
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-100 rounded-none md:rounded-[1rem] lg:rounded-[2rem] p-3 lg:p-6 hover:bg-white hover:shadow-md transition-all duration-500 border-x-0 md:border-x">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                          <Target className="w-3 h-3" /> Core Objective
                        </h5>
                        <p className="text-slate-600 text-[12px] lg:text-sm font-medium leading-relaxed">
                          {phase.objective}
                        </p>

                        {phase.steps && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {phase.steps.map((step, sIdx) => (
                              <div key={sIdx} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[9px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-1.5 hover:border-blue-500/30 hover:text-blue-600 transition-all">
                                <CheckCircle2 className="w-2.5 h-2.5 text-blue-500" />
                                {step}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-none md:rounded-2xl p-4 lg:p-6 relative overflow-hidden group/project shadow-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm">
                              <Rocket className="w-5 h-5 animate-bounce-slow" />
                            </div>
                            <div>
                              <h5 className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5">Capstone Experience</h5>
                              <h6 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight uppercase leading-tight line-clamp-1">{phase.project?.title || "Enterprise Prototype"}</h6>
                            </div>
                          </div>

                          <p className="text-sm text-slate-800 leading-relaxed font-semibold mb-8 max-w-[500px]">
                            {phase.project?.description || "Build a production-grade application to validate your mastery of this phase's core architecture and deployment patterns."}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                              <h6 className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Package className="w-3 h-3" /> Tech Stack Radar
                              </h6>
                              <div className="flex flex-wrap gap-2">
                                {(phase.skills || ["React", "Node.js", "MongoDB", "Auth0"]).map((s, i) => (
                                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] text-slate-800 font-bold uppercase tracking-tight shadow-sm">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h6 className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Key Masteries
                              </h6>
                              <ul className="space-y-2.5">
                                {["Clean Architecture", "API Orchestration", "Security Headers"].map((item, i) => (
                                  <li key={i} className="text-[10px] text-slate-800 font-semibold flex items-center gap-2.5">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )) : missingSkills.length > 0 ? missingSkills.map((skill, idx) => (
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
