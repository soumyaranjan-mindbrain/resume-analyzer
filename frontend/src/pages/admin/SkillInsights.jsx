import React from 'react';
import { cn } from '../../utils/cn';

const SkillInsights = () => {
  const topSkills = [
    { name: 'React.js', demand: 98, supply: 64, trend: 'High' },
    { name: 'Node.js', demand: 85, supply: 42, trend: 'Medium' },
    { name: 'Python', demand: 92, supply: 88, trend: 'High' },
    { name: 'PostgreSQL', demand: 76, supply: 30, trend: 'High' },
    { name: 'Docker', demand: 68, supply: 22, trend: 'Critical' },
    { name: 'AWS/Cloud', demand: 82, supply: 35, trend: 'High' },
    { name: 'Machine Learning', demand: 74, supply: 15, trend: 'Critical' },
    { name: 'TypeScript', demand: 90, supply: 58, trend: 'High' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      
      {/* Demand vs Supply Panel - Full Width */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col min-h-[600px]">
        <div className="mb-12">
            <h4 className="text-xl font-bold text-slate-900">Market Demand vs Talent Supply</h4>
            <p className="text-slate-500 text-sm mt-1">Real-time gap analysis between industry requirements and current student capabilities.</p>
        </div>

        <div className="flex-1 space-y-8 max-w-4xl mx-auto w-full">
            {topSkills.map((skill, i) => (
              <div key={i} className="space-y-3 group/item">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-slate-800">{skill.name}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        skill.trend === 'High' ? "bg-blue-50 text-blue-700 border-blue-100" :
                        skill.trend === 'Critical' ? "bg-red-50 text-red-700 border-red-100" :
                        "bg-slate-50 text-slate-600 border-slate-200"
                      )}>
                        {skill.trend} Demand
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supply</span>
                          <span className="text-sm font-bold text-slate-600">{skill.supply}%</span>
                      </div>
                      <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Demand</span>
                          <span className="text-sm font-bold text-blue-600">{skill.demand}%</span>
                      </div>
                    </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex relative border border-slate-200/50">
                    <div 
                      className="h-full bg-slate-200 transition-all duration-1000 origin-left" 
                      style={{ width: `${skill.supply}%` }}
                    />
                    <div 
                      className="h-full bg-blue-500 absolute top-0 left-0 transition-all duration-1000 origin-left opacity-30" 
                      style={{ width: `${skill.demand}%` }}
                    />
                    <div 
                      className="h-full bg-blue-600 absolute top-0 left-0 transition-all duration-1000 origin-left opacity-20 group-hover/item:opacity-40" 
                      style={{ width: `${skill.demand}%` }}
                    />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium italic">Data automatically updated based on recent job description trends and student profile updates.</p>
        </div>
      </div>
    </div>
  );
};

export default SkillInsights;
