import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Search, 
  BookOpen, 
  Sparkles, 
  GitCompare, 
  ChevronRight,
  ClipboardList,
  Star,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getFeedback, getMyResumes } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Improvement Tips');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resumeData = await getMyResumes();
        setResumes(resumeData.resumes || []);
        
        if (resumeData.resumes?.length > 0) {
          const feedbackData = await getFeedback(resumeData.resumes[0]._id || resumeData.resumes[0].id);
          // Assuming feedbackData has recommendations array
          setRecommendations(feedbackData.recommendations || []);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const courses = [
    {
      id: 1,
      name: 'Advanced React Patterns',
      platform: 'Coursera',
      rating: 5,
      duration: '12 hours content'
    },
    {
      id: 2,
      name: 'System Design for Interviews',
      platform: 'Udemy',
      rating: 4,
      duration: '20+ hours content'
    }
  ];

  const checklist = [
    'Use quantitative metrics (e.g. 20% growth)',
    'Reverse chronological order for experience',
    'Include direct links to portfolio/LinkedIn',
    'Keep your contact info up to date',
    'Ensure white space is balanced'
  ];

  const tabs = ['Improvement Tips', 'Suggested Jobs', 'Skill Courses'];

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
        <div className="w-24 h-24 bg-yellow-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-yellow-600 shadow-xl shadow-yellow-500/10">
          <Lightbulb className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-4">No Recommendations Yet</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
          Once you upload your resume, our AI will provide personalized tips, keywords, and courses to help you land your dream job.
        </p>
        <button 
          onClick={() => navigate('/upload')}
          className="bg-[#4b7bff] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/30 hover:scale-[1.05] transition-all"
        >
          Analyze Resume
        </button>
      </div>
    );
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
            {recommendations.length === 0 ? (
              <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white text-center">
                 <Sparkles className="w-12 h-12 text-blue-500/50 mx-auto mb-4" />
                 <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Optimized!</h3>
                 <p className="text-slate-400 font-bold mt-2">Your current resume looks great. Check back after adding new experience!</p>
              </div>
            ) : (
              recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="bg-white/25 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/70 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2),inset_0_1px_3px_rgba(255,255,255,0.5)] hover:shadow-blue-500/10 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-900/[0.05] pointer-events-none" />
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner pt-0.5">
                        {rec.type === 'skill' ? <Sparkles className="w-6 h-6 text-blue-500" /> : <Lightbulb className="w-6 h-6 text-yellow-500" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#1e293b] tracking-tight mb-1">{rec.title}</h3>
                        <p className="text-slate-500 font-medium text-sm max-w-[450px]">{rec.description}</p>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-emerald-500/80 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap">
                      {rec.actionText || 'Implementation Tip'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          
          <div>
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2),inset_0_1px_3px_rgba(255,255,255,0.5)] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4b7bff]/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-[#4b7bff]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#4b7bff]/20">
                      <RefreshCw className="w-8 h-8 text-[#4b7bff]" />
                   </div>
                   <h3 className="text-xl font-black text-[#1e293b] tracking-tight mb-3">Re-run Analysis</h3>
                   <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                     Update your profile or upload a fresh version to get the latest insights.
                   </p>
                    <button 
                      onClick={() => navigate('/upload')}
                      className="flex items-center gap-3 px-6 py-3 bg-white/60 border border-white/80 rounded-2xl font-black text-sm text-[#1e293b] hover:bg-white shadow-sm transition-all group/btn"
                    >
                       <RefreshCw className="w-4 h-4 text-[#4b7bff] group-hover/btn:rotate-180 transition-transform duration-500" />
                       New Upload
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
                     Analyze and compare your multiple resume versions side by side.
                   </p>
                   <button 
                    onClick={() => navigate('/history')}
                    className="flex items-center gap-3 px-6 py-3 bg-white/60 border border-white/80 rounded-2xl font-black text-sm text-[#1e293b] hover:bg-white shadow-sm transition-all"
                   >
                      <GitCompare className="w-4 h-4 text-slate-500" />
                       View History
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
                <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Best Practices</h3>
              </div>

              <div className="space-y-4 mb-10">
                 {checklist.map((item, idx) => (
                   <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                      </div>
                      <span className="text-slate-600 font-bold text-sm leading-relaxed">{item}</span>
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => navigate('/upload')}
                className="w-full py-4 bg-slate-100/60 border border-white/80 rounded-2xl font-black text-slate-600 text-sm hover:bg-white hover:text-[#4b7bff] transition-all"
              >
                Optimize Now
              </button>
            </div>
          </div>

          
          <div className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-8">Upskilling Path</h3>
              
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
                       </div>
                    </div>
                    <button className="w-full py-3 bg-[#4b7bff] text-white rounded-[1.2rem] font-black text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.03] transition-all">
                       Enroll Path
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
