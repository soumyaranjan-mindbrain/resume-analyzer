import React, { useState } from 'react';
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

const SkillInsights = () => {
  const [activeTab, setActiveTab] = useState('Missing Skills');

  const inDemandSkills = [
    { name: 'Data Analytics', percentage: 78, color: 'bg-blue-500' },
    { name: 'JavaScript', percentage: 65, color: 'bg-emerald-500' },
    { name: 'Project Management', percentage: 50, color: 'bg-purple-500' },
    { name: 'SQL', percentage: 45, color: 'bg-orange-500' }
  ];

  const missingSkills = [
    { name: 'Data Analysis', value: 35, color: 'bg-blue-400' },
    { name: 'Project Management', value: 10, color: 'bg-emerald-400' },
    { name: 'SQL', value: 17, color: 'bg-sky-400' }
  ];

  const tabs = ['Missing Skills', 'In-Demand Skills', 'Learning Paths'];

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
                   <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">3 Skills</h2>
                   <p className="text-slate-500 font-bold mt-1">Skill gaps identified from your resume.</p>
                </div>
              </div>
              <p className="text-slate-400 font-medium text-sm mb-8 max-w-sm leading-relaxed">
                 Identify and bridge your skill gaps for better job opportunities and job market trends.
              </p>
              <button className="flex items-center gap-2 text-[#4b7bff] font-black text-sm hover:translate-x-1 transition-transform">
                View Details <ChevronRight className="w-4 h-4" />
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
                     <AlertCircle className="w-6 h-6 text-orange-400" />
                  </div>
               </div>
               <div className="space-y-3">
                  {['Data Analysis', 'Project Management', 'SQL'].map((skill, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <AlertCircle className="w-4 h-4 text-orange-400" />
                       <span className="text-sm font-bold text-slate-600">{skill}</span>
                    </div>
                  ))}
               </div>
               <button className="px-10 py-3.5 bg-[#4b7bff] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:scale-[1.05] transition-all">
                  Start Learning
               </button>
            </div>
          </div>
        </div>

        
        <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <AlertCircle className="w-6 h-6" />
             </div>
              <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Key Missing Skills</h3>
          </div>
          
          <div className="space-y-8 mb-8">
             {missingSkills.map((skill, i) => (
               <div key={i} className="space-y-3">
                  <div className="flex justify-between text-sm font-black text-slate-700">
                    <span>{skill.name}</span>
                    <span>{skill.value}%</span>
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
                Skill Demand
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-emerald-400 rounded-full" />
                Student Supply
             </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        
        <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] flex flex-col">
          <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-8">Top In-Demand Skills</h3>
          <div className="flex-1 space-y-8">
             {inDemandSkills.map((skill, i) => (
               <div key={i} className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/60 shadow-sm">
                     {i === 0 ? <Activity className="w-6 h-6 text-blue-500" /> : 
                      i === 1 ? <Target className="w-6 h-6 text-emerald-500" /> :
                      i === 2 ? <Award className="w-6 h-6 text-purple-500" /> :
                      <BookOpen className="w-6 h-6 text-orange-500" />}
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <div className="flex justify-between items-end">
                       <span className="font-black text-[#1e293b] text-base">{skill.name}</span>
                       <span className="font-black text-slate-400 text-sm tracking-tighter">{skill.percentage}%</span>
                    </div>
                    <div className="h-3 bg-slate-100/50 rounded-full overflow-hidden border border-white/30">
                       <div className={cn("h-full rounded-full transition-all duration-1000", skill.color)} style={{ width: `${skill.percentage}%` }} />
                    </div>
                  </div>
               </div>
             ))}
          </div>
          <button className="mt-10 flex items-center gap-2 text-slate-400 hover:text-[#4b7bff] font-bold text-sm transition-colors group">
             Find related courses <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        
        <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] flex flex-col">
          <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-8">Skill Demand vs. Supply</h3>
          <div className="flex-1 flex items-center justify-center min-h-[300px] relative">
             
             <div className="absolute inset-0 flex flex-col justify-between py-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-200/50 relative">
                     <span className="absolute -left-8 -top-2 text-[10px] font-black text-slate-400">{120 - (i * 20)}</span>
                  </div>
                ))}
             </div>
             
             <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 400 200">
                
                <path d="M 0,150 C 100,100 200,80 400,30" fill="none" stroke="#4b7bff" strokeWidth="4" strokeLinecap="round" className="drop-shadow-lg" />
                <circle cx="400" cy="30" r="6" fill="#4b7bff" stroke="white" strokeWidth="2" />
                
                <path d="M 0,170 C 100,140 200,130 400,120" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" className="opacity-60" />
                <circle cx="400" cy="120" r="6" fill="#10b981" stroke="white" strokeWidth="2" />
             </svg>
             
             <div className="absolute -bottom-4 inset-x-0 flex justify-between px-2 text-[10px] font-black text-slate-400">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map(m => <span key={m}>{m}</span>)}
             </div>
             
             <div className="absolute top-[20px] right-2 px-3 py-1.5 bg-[#4b7bff] text-white rounded-lg text-xs font-black shadow-lg">110%</div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        
        <div className="lg:col-span-2 bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Recommended Courses</h3>
              <button className="text-[#4b7bff] font-bold text-sm hover:underline">See All</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((id) => (
                <div key={id} className="bg-white/40 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 shadow-sm flex items-center gap-5 hover:bg-white/60 transition-all cursor-pointer group">
                   <div className="w-16 h-16 bg-[#4b7bff]/10 rounded-2xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-8 h-8 text-[#4b7bff]" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-black text-[#1e293b] text-base mb-1 truncate">JavaScript Fundamentals</h4>
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                         <span>Coursera</span>
                         <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-3 h-3 pt-0.5", i < 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />)}
                         </div>
                      </div>
                      <button className="mt-4 px-6 py-2 bg-[#4b7bff] text-white rounded-[1rem] font-black text-[11px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                        View Course
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        
        <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/70 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
           <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-8">Next Steps</h3>
           <div className="space-y-6">
              {[
                { label: 'Learn Python Basics', icon: <TrendingUp className="w-4 h-4 text-blue-500" /> },
                { label: 'Improve Project Management', icon: <Award className="w-4 h-4 text-emerald-500" /> },
                { label: 'Master SQL Techniques', icon: <Zap className="w-4 h-4 text-orange-500" /> }
              ].map((step, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl hover:bg-white/60 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900/5 rounded-xl flex items-center justify-center">
                         {step.icon}
                      </div>
                      <span className="font-bold text-[#1e293b] text-sm group-hover:text-[#4b7bff] transition-colors">{step.label}</span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#4b7bff] transition-colors" />
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default SkillInsights;

