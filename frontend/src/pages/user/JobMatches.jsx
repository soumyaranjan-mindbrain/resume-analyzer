import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Activity,
  Star,
  Search
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getMatchedJobs, getResumes } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const JobMatches = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // We might need a resumeId for matching, 
        // but the current API might return matches for the latest resume
        const resumeData = await getResumes();
        setResumes(resumeData.resumes || []);
        
        const jobData = await getMatchedJobs();
        setJobs(jobData.jobs || []);
      } catch (error) {
        console.error('Failed to fetch job matches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterTags = ['All', 'Software Engineer', 'Analyst', 'Open Now'];

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'All') return true;
    return job.title.toLowerCase().includes(activeFilter.toLowerCase());
  });

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
          <Briefcase className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">No Resume Detected</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-8 font-normal">
          Upload your resume first so our AI can find high-probability job matches tailored to your unique skills.
        </p>
        <button 
          onClick={() => navigate('/upload')}
          className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold uppercase tracking-widest text-sm shadow-md hover:bg-blue-700 transition-all active:scale-95"
        >
          Upload Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-8">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 border",
                activeFilter === tag 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-[11px] font-normal text-slate-400 uppercase tracking-wider hidden md:block">Sort By</span>
          <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none cursor-pointer hover:border-blue-400 transition-all shadow-sm">
            <option>Best Matches</option>
            <option>Recent</option>
            <option>Salary (High to Low)</option>
          </select>
        </div>
      </div>

      
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white/20 backdrop-blur-md rounded-[2.8rem] border border-white/40">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">No Matches Found</h3>
            <p className="text-slate-600 font-normal mt-2">We're searching for more roles. Check back shortly!</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div 
              key={job._id || job.id}
              className="bg-white rounded-[1.75rem] p-6 border border-slate-100 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] group/card hover:shadow-[0_15px_45px_rgba(0,0,0,0.07)] transition-all duration-500"
            >
              <div className="relative z-10">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                  <div className="flex items-start gap-6 flex-1 min-w-0">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                       <img src={job.logo || `https://ui-avatars.com/api/?name=${job.company}&background=random`} alt={job.company} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                         <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover/card:text-blue-600 transition-colors">{job.title}</h3>
                         <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium text-[9px] uppercase tracking-wider border border-blue-200">
                           {job.type || 'Full-time'}
                         </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
                        <span className="text-blue-600 font-medium text-sm hover:underline cursor-pointer">{job.company}</span>
                         <div className="flex items-center gap-1.5 text-slate-600 font-normal text-[10px] uppercase tracking-widest">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location || 'Remote'}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-normal text-[10px] uppercase tracking-widest">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salary || 'Competitive'}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                          {(job.skills || []).slice(0, 4).map((skill, idx) => (
                             <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50/50 rounded-lg border border-slate-200 text-slate-600 font-normal text-[9px] uppercase tracking-tight">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                {skill}
                             </div>
                          ))}
                          {(job.skills?.length > 4) && (
                            <div className="px-3 py-1 text-slate-400 font-normal text-[9px] uppercase tracking-widest">
                                +{job.skills.length - 4}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                       <div className="flex items-center gap-5 py-3 px-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] group/score transition-all hover:border-emerald-100">
                           <div className="text-right">
                             <div className="text-4xl font-bold text-slate-800 tracking-tighter leading-none mb-0.5">
                               {job.matchScore || 85}
                               <span className="text-base text-emerald-500 font-medium ml-1">%</span>
                             </div>
                             <div className="text-[9px] font-normal text-slate-400 uppercase tracking-[0.2em] leading-none">
                               Match Index
                             </div>
                           </div>
                          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <div className="absolute inset-0 bg-slate-50 rounded-xl shadow-inner border border-slate-100" />
                            <Activity className="relative z-10 w-6 h-6 text-emerald-500" />
                          </div>
                      </div>

                      <button className="flex items-center gap-2.5 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-[11px] uppercase tracking-widest shadow-md hover:bg-slate-800 active:scale-95 transition-all">
                          Apply Now
                          <ChevronRight className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobMatches;
