import React from 'react';
import { 
  CloudLightning, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  Search,
  CheckCircle2,
  FileSearch,
  Trophy
} from 'lucide-react';
import { cn } from '../../utils/cn';

const SkillInsights = () => {
  const topSkills = [
    { name: 'React.js', demand: 98, supply: 64, trend: 'High' },
    { name: 'Node.js', demand: 85, supply: 42, trend: 'Medium' },
    { name: 'Python', demand: 92, supply: 88, trend: 'High' },
    { name: 'PostgreSQL', demand: 76, supply: 30, trend: 'High' },
    { name: 'Docker', demand: 68, supply: 22, trend: 'Critical' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-8">
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group min-h-[450px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-bl-[8rem] -mr-12 -mt-12 transition-all group-hover:bg-amber-100/50" />
            <div className="relative z-10 space-y-2">
               <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Market Demand vs Talent Supply</h4>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Global hiring trends across tech stacks.</p>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center space-y-8 mt-10">
               {topSkills.map((skill, i) => (
                 <div key={i} className="space-y-2.5 group/item">
                    <div className="flex justify-between items-end">
                       <span className="font-black text-slate-700">{skill.name}</span>
                       <div className="flex gap-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supply: {skill.supply}%</span>
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Demand: {skill.demand}%</span>
                       </div>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden flex relative">
                       <div 
                        className="h-full bg-slate-200 transition-all duration-1000 origin-left" 
                        style={{ width: `${skill.supply}%` }}
                       />
                       <div 
                        className="h-full bg-amber-500 absolute top-0 left-0 transition-all duration-1000 origin-left opacity-30 blur-[1px]" 
                        style={{ width: `${skill.demand}%` }}
                       />
                       <div 
                        className="h-full bg-amber-500 absolute top-0 left-0 transition-all duration-1000 origin-left opacity-10 group-hover/item:opacity-40" 
                        style={{ width: `${skill.demand}%` }}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         
         <div className="space-y-8">
            <div className="bg-cyan-50 border border-cyan-100 rounded-[2rem] p-8 text-cyan-900 relative overflow-hidden group shadow-2xl">
               <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-amber-500/20 to-transparent" />
               <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                     <Trophy className="w-7 h-7 text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter leading-tight">Elite Talent Identified</h3>
                  <p className="text-slate-400 font-medium">12 students found with rare skillset combinations (Rust + AI + Cloud).</p>
                  <button className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all">
                     View Talent List
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">System Recommendations</h4>
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
               </div>
               
               <div className="space-y-4">
                  {[
                    "Introduce workshop on 'Infrastructure as Code' to bridge DevOps gap.",
                    "Update Skill Search to include 'Vector Databases' as a high-demand keyword.",
                    "Review branch EE students for sudden surge in Embedded C matching."
                  ].map((rec, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50">
                       <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                       <p className="text-sm font-bold text-slate-700 leading-relaxed">{rec}</p>
                    </div>
                  ))}
               </div>
               
               <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:border-amber-500/20 hover:text-amber-500 transition-all mt-4">
                  Generate Fresh Insights
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SkillInsights;


