import React, { useEffect, useState } from 'react';
import { 
  Lightbulb, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  GitCompare, 
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Star,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getFeedback, getMyResumes } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Improvement Tips');
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const resumeData = await getMyResumes();
        const list = resumeData.resumes || [];
        setResumes(list);
        if (list.length) {
          const feedback = await getFeedback(list[0].id);
          const tips = [
            ...(feedback.aiFeedback || []).map((text, idx) => ({ id: idx, title: text, description: text, actionText: 'Apply Tip', type: 'skill' })),
          ];
          setRecommendations(tips);
        }
      } catch {
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const courses = [
    {
      id: 1,
      name: 'JavaScript Fundamentals',
      platform: 'Coursera',
      rating: 4,
      duration: '20+ hours content'
    },
    {
      id: 2,
      name: 'Data Analysis with Python',
      platform: 'Udemy',
      rating: 5,
      duration: '15+ hours content'
    }
  ];

  const checklist = [
    'Use a clean and professional format',
    'Include a strong, specific resume summary',
    'Highlight key skills',
      'Tailor your experience to job roles',
    'Use relevant keywords'
  ];

  const tabs = ['Improvement Tips', 'Suggested Jobs', 'Skill Courses'];

  if (loading) {
    return <div className="min-h-[300px] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-8">
          
          <div className="p-1.5 bg-slate-200/40 backdrop-blur-xl rounded-2xl flex items-center gap-1 border border-white/50 w-fit">
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

          
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                className="bg-white/25 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/70 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2),inset_0_1px_3px_rgba(255,255,255,0.5)] hover:shadow-blue-500/10 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-900/[0.05] pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner pt-0.5">
                      {rec.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#1e293b] tracking-tight mb-1">{rec.title}</h3>
                      <p className="text-slate-500 font-medium text-sm max-w-[450px]">{rec.description}</p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-emerald-500/80 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20">
                    {rec.actionText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          
          <div>
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2),inset_0_1px_3px_rgba(255,255,255,0.5)] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4b7bff]/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-[#4b7bff]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#4b7bff]/20">
                      <Sparkles className="w-8 h-8 text-[#4b7bff]" />
                   </div>
                   <h3 className="text-xl font-black text-[#1e293b] tracking-tight mb-3">AI Resume Suggestions</h3>
                   <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                     Get automated tips for improving your resume content based on industry standards.
                   </p>
                    <button className="flex items-center gap-3 px-6 py-3 bg-white/60 border border-white/80 rounded-2xl font-black text-sm text-[#1e293b] hover:bg-white shadow-sm transition-all group/btn">
                       <RefreshCw className="w-4 h-4 text-[#4b7bff] group-hover/btn:rotate-180 transition-transform duration-500" />
                       Refresh Resume
                       <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
              </div>

              
              <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2),inset_0_1px_3px_rgba(255,255,255,0.5)] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-slate-900/10 rounded-2xl flex items-center justify-center mb-6 border border-slate-900/10">
                      <GitCompare className="w-8 h-8 text-slate-600" />
                   </div>
                   <h3 className="text-xl font-black text-[#1e293b] tracking-tight mb-3">Compare Resumes</h3>
                   <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                     Analyze and compare your multiple resume versions side by side to see which one performs best.
                   </p>
                   <button className="flex items-center gap-3 px-6 py-3 bg-white/60 border border-white/80 rounded-2xl font-black text-sm text-[#1e293b] hover:bg-white shadow-sm transition-all">
                      <GitCompare className="w-4 h-4 text-slate-500" />
                       Compare Results
                       <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="w-full lg:w-[380px] space-y-8">
          
          <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                   <ClipboardList className="w-6 h-6 text-[#4b7bff]" />
                </div>
                <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Resume Checklist</h3>
              </div>

              <div className="space-y-4 mb-10">
                 {checklist.map((item, idx) => (
                   <div key={idx} className="flex items-start gap-3">
                      <span className="text-slate-400 font-black text-sm mt-1">{idx + 1}</span>
                      <span className="text-slate-600 font-bold text-sm leading-relaxed">{item}</span>
                   </div>
                 ))}
              </div>

              <button className="w-full py-4 bg-slate-100/60 border border-white/80 rounded-2xl font-black text-slate-600 text-sm hover:bg-white hover:text-[#4b7bff] transition-all">
                Optimize Resume
              </button>
            </div>
          </div>

          
          <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-8">Suggested Skill Courses</h3>
              
              <div className="space-y-8">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-4">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-[#4b7bff]/10 rounded-xl flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-[#4b7bff]" />
                       </div>
                       <div>
                          <h4 className="font-black text-[#1e293b] text-base mb-1">{course.name}</h4>
                          <div className="flex items-center gap-3">
                             <span className="text-slate-400 text-xs font-bold">{course.platform}</span>
                             <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={cn("w-3 h-3 pt-0.5", i < course.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />
                                ))}
                             </div>
                          </div>
                          <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase tracking-wider">{course.duration}</p>
                       </div>
                    </div>
                    <button className="w-full py-3 bg-[#4b7bff] text-white rounded-[1.2rem] font-black text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.03] transition-all">
                       View Course
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;

