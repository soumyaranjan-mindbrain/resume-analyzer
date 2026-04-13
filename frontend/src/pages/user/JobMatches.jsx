import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Zap,
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
        <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#4b7bff] shadow-xl shadow-blue-500/10">
          <Briefcase className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-4">No Resume Detected</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
          Upload your resume first so our AI can find high-probability job matches tailored to your unique skills.
        </p>
        <button 
          onClick={() => navigate('/upload')}
          className="bg-[#4b7bff] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/30 hover:scale-[1.05] transition-all"
        >
          Upload Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 border",
                activeFilter === tag 
                  ? "bg-[#4b7bff]/10 text-[#4b7bff] border-[#4b7bff]/20 shadow-sm" 
                  : "bg-white/40 text-slate-500 border-white/60 hover:bg-white/60 hover:text-slate-700"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden md:block">Sort By</span>
          <select className="px-4 py-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl text-sm font-bold text-[#1e293b] outline-none cursor-pointer hover:bg-white/60 transition-all">
            <option>Best Matches</option>
            <option>Recent</option>
            <option>Salary (High to Low)</option>
          </select>
        </div>
      </div>

      
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white/20 backdrop-blur-md rounded-[2.8rem] border border-white/40">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Matches Found</h3>
            <p className="text-slate-400 font-medium mt-2">We're searching for more roles. Check back shortly!</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div 
              key={job._id || job.id}
              className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] hover:shadow-blue-500/15 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-900/[0.12] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-white/60 backdrop-blur-lg border border-white/80 rounded-3xl flex items-center justify-center p-4 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                       <img src={job.logo || `https://ui-avatars.com/api/?name=${job.company}&background=random`} alt={job.company} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                         <h3 className="text-2xl font-black text-[#1e293b] tracking-tight group-hover:text-[#4b7bff] transition-colors">{job.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                        <span className="text-[#4169e1] font-bold text-base hover:underline cursor-pointer">{job.company}</span>
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {job.location || 'Remote'}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-8 text-sm font-bold text-slate-600">
                         <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {job.type || 'Full-time'}
                         </div>
                         <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            {job.salary || 'Competitive'}
                         </div>
                         <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {job.posted || 'Recent'}
                         </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                          {(job.skills || []).slice(0, 3).map((skill, idx) => (
                             <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-slate-900/[0.04] backdrop-blur-sm rounded-full border border-white/40 text-[#1e293b] font-bold text-xs group-hover:bg-white/60 transition-all">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                {skill}
                             </div>
                          ))}
                          {(job.skills?.length > 3) && (
                            <div className="px-4 py-2 bg-slate-200/40 text-slate-500 font-black text-[10px] uppercase tracking-wider rounded-full border border-white/40">
                                +{job.skills.length - 3} More
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-6 self-start md:self-auto">
                      <div className="flex items-center gap-4 bg-emerald-500/[0.08] backdrop-blur-md px-5 py-2.5 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/[0.12] transition-all">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-xl font-black text-emerald-600 tracking-tight">{job.matchScore || 85}%</span>
                          <div className="w-px h-6 bg-emerald-200/50" />
                          <div className="w-8 h-8 rounded-full bg-emerald-100/50 flex items-center justify-center">
                               <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                          </div>
                      </div>

                      <button className="flex items-center gap-3 px-8 py-3.5 bg-[#4b7bff] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:scale-[1.05] active:scale-95 transition-all w-full md:w-auto justify-center">
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
