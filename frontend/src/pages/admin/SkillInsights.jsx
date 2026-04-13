import { getSkillInsights } from '../../services/api';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import React from 'react';

const SkillInsights = () => {
  const [topSkills, setTopSkills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInsights = async () => {
      try {
        const data = await getSkillInsights();
        setTopSkills(data);
      } catch (error) {
        console.error('Failed to fetch skill insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (topSkills.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500 font-medium">No skill data available yet. Analyzed resumes and job roles will populate this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      
      {/* Demand vs Supply Panel - Full Width */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col min-h-[600px]">
        <div className="mb-3">
          <p className="text-sm text-slate-500">Data automatically updated based on recent job description trends and student profile updates.</p>
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
      </div>
    </div>
  );
};

export default SkillInsights;
