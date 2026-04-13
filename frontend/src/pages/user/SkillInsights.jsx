import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Map, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  BookOpen, 
  ArrowUpRight,
  TrendingDown,
  Activity,
  Award,
  Star
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getAnalytics, getMyResumes } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SkillInsights = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Missing Skills');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resumeData = await getMyResumes();
        setResumes(resumeData.resumes || []);
        
        const analyticsData = await getAnalytics();
        setAnalytics(analyticsData.analytics || null);
      } catch (error) {
        console.error('Failed to fetch skill insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use real data from analytics or fallbacks
  const inDemandSkills = analytics?.inDemandSkills || [
    { name: 'Data Science', percentage: 92, color: 'bg-blue-500' },
    { name: 'Cloud Computing', percentage: 85, color: 'bg-emerald-500' },
    { name: 'Product Management', percentage: 70, color: 'bg-purple-500' },
    { name: 'Blockchain', percentage: 60, color: 'bg-orange-500' }
  ];

  const missingSkills = analytics?.missingSkills || [
    { name: 'System Design', value: 45, color: 'bg-blue-400' },
    { name: 'Unit Testing', value: 30, color: 'bg-emerald-400' },
    { name: 'API Docs', value: 25, color: 'bg-sky-400' }
  ];

  const tabs = ['Missing Skills', 'In-Demand Skills', 'Learning Paths'];

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
        <div className="w-24 h-24 bg-purple-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-purple-600 shadow-xl shadow-purple-500/10">
          <Target className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-4">Skill Library Empty</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
          Upload and analyze your resume to unlock detailed maps of your skill strengths, market demand, and personalized learning pathways.
        </p>
        <button 
          onClick={() => navigate('/upload')}
          className="bg-[#4b7bff] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/30 hover:scale-[1.05] transition-all"
        >
          Initialize Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-8 px-4">
      
      <div className="p-1.5 bg-slate-200/40 backdrop-blur-xl rounded-2xl flex items-center gap-1 border border-white/50 w-fit mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2.5 rounded-[0.9rem] font-bold text-sm transition-all duration-300",
              activeTab === tab 
                ? "bg-[#4b7bff] text-white shadow-lg shadow-blue-500/20" 
                : "text-[#64748b] hover:bg-white/60 hover:text-[#334155]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        <div className="lg:col-span-2 bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4b7bff]/5 via-transparent to-slate-900/[0.05] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                   <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                   <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">{missingSkills.length} Skills</h2>
                   <p className="text-slate-500 font-bold mt-1">Growth opportunities identified.</p>
                </div>
              </div>
              <p className="text-slate-400 font-medium text-sm mb-8 max-w-sm leading-relaxed">
                 By mastering these highly missing skills, you increase your job compatibility by up to 45%.
              </p>
              <button className="flex items-center gap-2 text-[#4b7bff] font-black text-sm hover:translate-x-1 transition-transform">
                View Learning Roadmap <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            
            <div className="relative flex flex-col items-center gap-8">
               <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="24" className="text-orange-100/50" />
                    <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="24" className="text-orange-400" strokeDasharray={502} strokeDashoffset={502 * 0.4} strokeLinecap="round" />
                    <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="24" className="text-blue-400" strokeDasharray={502} strokeDashoffset={502 * 0.75} strokeLinecap="round" />
                  </svg>
                  <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
                     <Activity className="w-6 h-6 text-orange-400" />
                  </div>
               </div>
               <div className="space-y-3">
                  {missingSkills.slice(0, 3).map((skill, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                       <span className="text-sm font-bold text-slate-600">{skill.name}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <Target className="w-6 h-6" />
             </div>
              <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Market Benchmarking</h3>
          </div>
          
          <div className="space-y-8 mb-8">
             {missingSkills.map((skill, i) => (
               <div key={i} className="space-y-3">
                  <div className="flex justify-between text-sm font-black text-slate-700">
                    <span>{skill.name}</span>
                    <span>{skill.value}% Match</span>
                  </div>
                  <div className="h-2.5 bg-slate-100/50 rounded-full overflow-hidden border border-white/30">
                    <div className={cn("h-full rounded-full transition-all duration-1000", skill.color)} style={{ width: `${skill.value}%` }} />
                  </div>
               </div>
             ))}
          </div>

          <div className="pt-6 border-t border-white/40 flex items-center gap-4 text-xs font-bold text-slate-400">
             <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-400 rounded-full" />
                Industry Avg
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-emerald-400 rounded-full" />
                Your State
             </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] flex flex-col">
          <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-8">In-Demand Skill Ranking</h3>
          <div className="flex-1 space-y-8">
             {inDemandSkills.map((skill, i) => (
               <div key={i} className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/60 shadow-sm">
                     {i === 0 ? <TrendingUp className="w-6 h-6 text-blue-500" /> : 
                      i === 1 ? <Zap className="w-6 h-6 text-emerald-500" /> :
                      i === 2 ? <Award className="w-6 h-6 text-purple-500" /> :
                      <BookOpen className="w-6 h-6 text-orange-500" />}
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <div className="flex justify-between items-end">
                       <span className="font-black text-[#1e293b] text-base">{skill.name}</span>
                       <span className="font-black text-slate-400 text-sm tracking-tighter">{skill.percentage}% Growth</span>
                    </div>
                    <div className="h-3 bg-slate-100/50 rounded-full overflow-hidden border border-white/30">
                       <div className={cn("h-full rounded-full transition-all duration-1000", skill.color)} style={{ width: `${skill.percentage}%` }} />
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] flex flex-col">
          <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-8">Skill Proficiency Growth</h3>
          <div className="flex-1 flex items-center justify-center min-h-[300px] relative">
             <div className="absolute inset-0 flex flex-col justify-between py-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-200/50 relative" />
                ))}
             </div>
             
             <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 400 200">
                <path d="M 0,160 C 80,140 160,100 240,110 S 320,60 400,40" fill="none" stroke="#4b7bff" strokeWidth="4" strokeLinecap="round" className="drop-shadow-lg" />
                <circle cx="400" cy="40" r="6" fill="#4b7bff" stroke="white" strokeWidth="2" />
                <path d="M 0,180 C 100,170 200,150 400,140" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" className="opacity-40" />
             </svg>
             <div className="absolute -bottom-4 inset-x-0 flex justify-between px-2 text-[10px] font-black text-slate-400">
                {['WK1', 'WK2', 'WK3', 'WK4', 'WK5'].map(m => <span key={m}>{m}</span>)}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Structured Upskilling</h3>
              <button onClick={() => navigate('/recommendations')} className="text-[#4b7bff] font-bold text-sm hover:underline">Full Catalog</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(analytics?.courses || []).length > 0 ? analytics.courses.map((course, idx) => (
                <div key={idx} className="bg-white/40 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 shadow-sm flex items-center gap-5">
                   <div className="w-16 h-16 bg-[#4b7bff]/10 rounded-2xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-8 h-8 text-[#4b7bff]" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-black text-[#1e293b] text-base mb-1 truncate">{course.name}</h4>
                      <button className="mt-4 px-6 py-2 bg-[#4b7bff] text-white rounded-[1rem] font-black text-[11px] shadow-lg shadow-blue-500/20">
                        Enroll Now
                      </button>
                   </div>
                </div>
              )) : (
                <div className="col-span-2 py-10 text-center bg-slate-900/5 rounded-[2rem] border border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold">No personalized courses yet. Complete your profile for better suggestions.</p>
                </div>
              )}
           </div>
        </div>

        <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
           <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-8">Strategic Goals</h3>
           <div className="space-y-6">
              {['Finish Unit Testing Path', 'Draft Portfolio Site', 'Update Tech Keywords'].map((label, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900/5 rounded-xl flex items-center justify-center">
                         <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="font-bold text-[#1e293b] text-sm">{label}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SkillInsights;
