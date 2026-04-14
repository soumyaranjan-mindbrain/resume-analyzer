import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Search,
  Activity,
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
        const list = resumeData.resumes || [];
        setResumes(list);

        if (list.length > 0) {
          const feedbackData = await getFeedback(list[0]._id || list[0].id);
          const tips = [
            ...(feedbackData.aiFeedback || []).map((text, idx) => ({
              id: idx,
              title: text,
              description: text,
              actionText: 'Apply Tip',
              type: 'skill'
            })),
            ...(feedbackData.recommendations || [])
          ];
          setRecommendations(tips);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const checklist = [
    'Use quantitative metrics (e.g. 20% growth)',
    'Reverse chronological order for experience',
    'Include direct links to portfolio/LinkedIn',
    'Keep your contact info up to date',
    'Ensure white space is balanced'
  ];

  const tabs = ['Improvement Tips', 'Suggested Jobs'];

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
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">No Recommendations Yet</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-10 font-normal">
          Once you upload your resume, our AI will provide personalized tips, keywords, and courses to help you land your dream job.
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
        >
          Initialize Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-8">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="flex-1 space-y-8">

          <div className="p-1.5 bg-slate-100 rounded-2xl flex items-center gap-1 border border-slate-200 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-[0.9rem] font-medium text-sm transition-all duration-300",
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>


          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400 tracking-tight">No Matches Found</h3>
                <p className="text-slate-400 font-semibold mt-2">We're searching for more roles. Check back shortly!</p>
              </div>
            ) : (
              recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-100 relative overflow-hidden group shadow-sm transition-all duration-500"
                >
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                        {rec.type === 'skill' ? <Activity className="w-6 h-6 text-blue-600" /> : <Lightbulb className="w-6 h-6 text-amber-500" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">{rec.title}</h3>
                        <p className="text-slate-600 font-normal text-sm max-w-[450px] leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>


          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Re-run Analysis */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                    <RefreshCw className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-3">Re-run Analysis</h3>
                  <p className="text-slate-600 font-normal text-sm mb-8 leading-relaxed">
                    Update your profile or upload a fresh version to get the latest insights.
                  </p>
                  <button
                    onClick={() => navigate('/upload')}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-all group/btn"
                  >
                    <RefreshCw className="w-4 h-4 text-blue-600 group-hover/btn:rotate-180 transition-transform duration-500" />
                    New Upload
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Card 2: History Compare */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
                    <GitCompare className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-3">Compare Resumes</h3>
                  <p className="text-slate-600 font-normal text-sm mb-8 leading-relaxed">
                    Analyze and compare your multiple resume versions side by side.
                  </p>
                  <button
                    onClick={() => navigate('/history')}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
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

          <div className="bg-white rounded-2xl p-8 border border-slate-100 relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Best Practices</h3>
              </div>

              <div className="space-y-4 mb-10">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Star className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                    </div>
                    <span className="text-slate-600 font-medium text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/upload')}
                className="w-full py-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-500 text-sm hover:bg-slate-100 hover:text-blue-600 transition-all"
              >
                Optimize Now
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Recommendations;
