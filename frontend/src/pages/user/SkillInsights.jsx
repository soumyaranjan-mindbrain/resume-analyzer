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
          className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-md hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 mx-auto"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Good Points / Strengths */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <CheckCircle2 className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Performance Strengths</h3>
          </div>
          <div className="space-y-4 relative z-10">
            {analytics?.analytics?.topStrengths && analytics.analytics.topStrengths.length > 0 ? (
              analytics.analytics.topStrengths.map((str, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{str}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">Standard professional formatting detected.</p>
            )}
          </div>
        </div>

        {/* Critical Gaps / Weaknesses */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <AlertCircle className="w-24 h-24 text-rose-500" />
          </div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
              <Activity className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Optimization Gaps</h3>
          </div>
          <div className="space-y-4 relative z-10">
            {analytics?.analytics?.weaknesses && analytics.analytics.weaknesses.length > 0 ? (
              analytics.analytics.weaknesses.map((weak, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{weak}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">No critical structural gaps identified.</p>
            )}
          </div>
        </div>

        {/* Strategic Goals - Moved to Top Row */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden shadow-sm h-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Strategic Goals</h3>
          </div>

          <div className="space-y-4">
            {missingSkills.slice(0, 3).map((skill, i) => (
              <div key={i} className="flex flex-col p-4 bg-slate-50 border border-slate-100 rounded-2xl group transition-all hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </div>
                    <span className="font-bold text-slate-700 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">Learn {skill.name}</span>
                  </div>
                  <div className="text-[9px] font-bold text-blue-600">Q2 Target</div>
                </div>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            ))}
            {missingSkills.length === 0 && (
              ['Finish Unit Testing Path', 'Draft Portfolio Site', 'Update Tech Keywords'].map((label, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <span className="font-bold text-slate-700 text-xs">{label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>






      <div className="mt-12">
        {/* Personalized Career Roadmap - Now Full Screen */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Personalized Career Roadmap</h3>
              <p className="text-slate-500 font-normal mt-1">Strategic steps to bridge your {missingSkills.length} identified skill gaps.</p>
            </div>
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-blue-100">
              AI Generated Path
            </div>
          </div>

          <div className="relative space-y-12 before:absolute before:inset-0 before:left-[31px] before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-100 before:z-0">
            {analytics?.analytics?.roadmap?.phases ? analytics.analytics.roadmap.phases.map((phase, idx) => (
              <div key={idx} className="relative z-10 flex gap-8 group">
                {/* Step Indicator */}
                <div className="w-16 h-16 bg-white border-4 border-slate-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-blue-50 transition-all shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs ring-4 ring-slate-50">
                    {idx + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">{phase.title}</h4>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                      phase.status === 'Locked' ? "text-slate-400 bg-slate-100" : "text-emerald-600 bg-emerald-50"
                    )}>
                      {phase.status || 'Recommended'}
                    </span>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                            phase.difficulty === 'Advanced' ? "bg-purple-50 text-purple-600 border border-purple-100" :
                              (phase.difficulty === 'Intermediate' ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100")
                          )}>
                            {phase.difficulty || 'Intermediate'}
                          </span>
                          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> {phase.estimatedDays || (idx + 1) * 14} Days
                          </span>
                        </div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Focus Objective</h5>
                        <p className="text-slate-600 text-sm font-normal leading-relaxed">
                          {phase.objective}
                        </p>

                        {phase.steps && (
                          <ul className="mt-4 space-y-2">
                            {phase.steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-2 text-[11px] text-slate-500 font-normal">
                                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-5">
                          <Layers className="w-12 h-12 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1">Recommended Project</h5>
                          <h6 className="text-sm font-bold text-slate-800 mb-1">{phase.project?.title}</h6>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{phase.project?.description}</p>
                        </div>

                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            phase.status === 'Locked' ? "bg-slate-300" : "bg-blue-500 animate-pulse"
                          )} />
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                            {phase.status === 'Locked' ? 'Locked' : 'Active Phase'}
                          </span>
                        </div>
                        <div className="w-px h-3 bg-slate-200" />
                        <span className="text-[11px] font-medium text-slate-400">
                          Priority: <span className={cn(
                            "font-bold",
                            phase.priority === 'High' ? "text-rose-500" : "text-blue-500"
                          )}>{phase.priority || (idx === 0 ? 'High' : 'Medium')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : missingSkills.length > 0 ? missingSkills.map((skill, idx) => (
              <div key={idx} className="relative z-10 flex gap-8 group">
                {/* Step Indicator */}
                <div className="w-16 h-16 bg-white border-4 border-slate-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-blue-50 transition-all shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs ring-4 ring-slate-50">
                    {idx + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">Master {skill.name}</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">High Priority</span>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Objective</h5>
                        <p className="text-slate-600 text-sm font-normal leading-relaxed">
                          Achieve professional proficiency in {skill.name} to increase your job match rating.
                        </p>
                      </div>
                      <div className="flex flex-col justify-end items-end">
                        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">
                          Generate Detailed Path
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                <Map className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-bold font-normal">Upload a resume to generate your custom learning path.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillInsights;
