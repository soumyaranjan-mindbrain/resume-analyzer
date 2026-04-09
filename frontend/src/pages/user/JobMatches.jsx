import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  Star
} from 'lucide-react';
import { cn } from '../../utils/cn';

const JobMatches = () => {
  const [activeFilter, setActiveFilter] = useState('Software Engineer');
  const [searchQuery, setSearchQuery] = useState('');

  const jobs = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg',
      location: 'New York, NY',
      matchScore: 93,
      type: 'Full-time',
      salary: '$90,000 - $110,000',
      posted: '2 hours ago',
      skills: ['JavaScript', 'Data Analysis', 'SQL'],
      otherSkillsCount: 3
    },
    {
      id: 2,
      title: 'Data Analyst',
      company: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      location: 'San Francisco, CA',
      matchScore: 90,
      type: 'Full-time',
      salary: '$85,000 - $100,000',
      posted: '1 day ago',
      skills: ['Data Analysis', 'SQL'],
      otherSkillsCount: 2
    },
    {
      id: 3,
      title: 'Junior Developer',
      company: 'OpenAI',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      location: 'Austin, TX',
      matchScore: 89,
      type: 'Full-time',
      salary: '$70,000 - $90,000',
      posted: '3 days ago',
      skills: ['JavaScript', 'Python', 'Programming'],
      otherSkillsCount: 3
    },
    {
      id: 4,
      title: 'Business Analyst',
      company: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      location: 'Seattle, WA',
      matchScore: 87,
      type: 'Full-time',
      salary: '$80,000 - $95,000',
      posted: '2 days ago',
      skills: ['Data Analysis', 'Business Intelligence'],
      otherSkillsCount: 3
    }
  ];

  const filterTags = ['Software Engineer', 'Analyst', 'Open Now'];

  const getTagIcon = (tag) => (tag === 'Analyst' ? <Star className="w-3.5 h-3.5 inline mr-2 fill-current" /> : null);

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
              {getTagIcon(tag)}
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
        {jobs.map((job) => (
          <div 
            key={job.id}
            className="bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] hover:shadow-blue-500/15 transition-all duration-500"
          >
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-900/[0.12] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-6">
                  
                  <div className="w-20 h-20 bg-white/60 backdrop-blur-lg border border-white/80 rounded-3xl flex items-center justify-center p-4 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                     <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-2xl font-black text-[#1e293b] tracking-tight group-hover:text-[#4b7bff] transition-colors">{job.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                      <span className="text-[#4169e1] font-bold text-base hover:underline cursor-pointer">{job.company}</span>
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {job.location}
                      </div>
                    </div>

                    
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-8 text-sm font-bold text-slate-600">
                       <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          {job.type}
                       </div>
                       <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          {job.salary}
                       </div>
                       <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {job.posted}
                       </div>
                       <div className="flex items-center gap-2 text-slate-400 font-medium">
                          <Zap className="w-4 h-4 fill-slate-300 text-slate-300" />
                          Matching keywords: +{job.otherSkillsCount} more
                       </div>
                    </div>

                    
                    <div className="flex flex-wrap items-center gap-3">
                        {job.skills.map((skill, idx) => (
                           <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-slate-900/[0.04] backdrop-blur-sm rounded-full border border-white/40 text-[#1e293b] font-bold text-xs group-hover:bg-white/60 transition-all">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              {skill}
                           </div>
                        ))}
                        <div className="px-4 py-2 bg-slate-200/40 text-slate-500 font-black text-[10px] uppercase tracking-wider rounded-full border border-white/40">
                            +{job.otherSkillsCount} More
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-6 self-start md:self-auto">
                    <div className="flex items-center gap-4 bg-emerald-500/[0.08] backdrop-blur-md px-5 py-2.5 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/[0.12] transition-all">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-xl font-black text-emerald-600 tracking-tight">{job.matchScore}%</span>
                        <div className="w-px h-6 bg-emerald-200/50" />
                        <div className="w-8 h-8 rounded-full bg-emerald-100/50 flex items-center justify-center">
                             <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        </div>
                    </div>

                    <button className="flex items-center gap-3 px-8 py-3.5 bg-[#4b7bff] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:scale-[1.05] active:scale-95 transition-all w-full md:w-auto justify-center">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobMatches;

