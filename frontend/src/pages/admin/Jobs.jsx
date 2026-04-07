import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Briefcase, 
  Building2, 
  Users, 
  ExternalLink, 
  Star,
  Search,
  MoreVertical,
  Layers,
  ChevronDown,
  Layout,
  BookOpen
} from 'lucide-react';

const Jobs = () => {
  const jobs = [
    { title: 'Frontend Developer', company: 'TechNova', location: 'Remote', candidates: 45, status: 'Active', category: 'Engineering' },
    { title: 'UI/UX Designer', company: 'CreativeFlow', location: 'San Francisco', candidates: 28, status: 'Active', category: 'Design' },
    { title: 'Data Scientist', company: 'Quantum Analytics', location: 'Hybrid', candidates: 15, status: 'Active', category: 'Data Science' },
    { title: 'Backend Lead', company: 'CloudScale', location: 'London', candidates: 62, status: 'Closed', category: 'Engineering' },
    { title: 'Cybersecurity Analyst', company: 'ShieldGuard', location: 'Washington D.C', candidates: 34, status: 'Active', category: 'Security' },
  ];

  return (
    <div className="space-y-12">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white tracking-tight">Manage Job Descriptions</h3>
        <button className="px-8 py-4 bg-[#00D2FF] text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Job
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-10 space-y-10 min-h-[600px]">
          <div>
            <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-6">Filter by Category</h4>
            <div className="space-y-4">
              {['Engineering', 'Design', 'Data Science', 'Security', 'Product'].map(cat => (
                <div key={cat} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-4 h-4 rounded border border-white/5 bg-white/[0.02] group-hover:border-[#00D2FF] transition-all" />
                  <span className="text-[13px] font-bold text-gray-500 group-hover:text-[#00D2FF] transition-colors">{cat}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-6">Status Overlay</h4>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                  <span className="text-[13px] font-bold text-white">Active Postings</span>
               </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500 opacity-40 shadow-[0_0_10px_rgba(107,114,128,0.4)]" />
                  <span className="text-[13px] font-bold text-gray-500">Archived/Closed</span>
               </div>
            </div>
          </div>

           <div className="pt-8 border-t border-white/[0.04] flex flex-col gap-6">
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all cursor-pointer">
                <BookOpen className="w-5 h-5 text-[#00D2FF]" />
                <span className="text-[13px] font-black text-white">JD Templates</span>
              </div>
               <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all cursor-pointer">
                <Layers className="w-5 h-5 text-gray-600" />
                <span className="text-[13px] font-black text-gray-500">Bulk Import</span>
              </div>
           </div>
        </div>

        {/* Jobs List */}
        <div className="col-span-3 space-y-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-[#00D2FF]" />
            <input type="text" placeholder="Search by title, company, or skill tag..." className="w-full bg-[#0D1117] border border-white/[0.04] rounded-[2rem] pl-16 pr-6 py-5 text-[14px] text-white focus:outline-none focus:border-[#00D2FF]/20 placeholder:text-gray-700" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-[#00D2FF]/20 transition-all cursor-pointer shadow-xl shadow-black/10"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center transition-transform group-hover:scale-105">
                     <Briefcase className={`w-7 h-7 ${job.status === 'Active' ? 'text-[#00D2FF]' : 'text-gray-700 opacity-40'}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[18px] font-black text-white group-hover:text-[#00D2FF] transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-4 text-gray-600 text-[13px] font-bold">
                       <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company}</span>
                       <span className="flex items-center gap-1.5 opacity-60"><Star className="w-3.5 h-3.5 text-amber-500" /> {job.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="text-center group-hover:scale-110 transition-transform">
                      <p className="text-[11px] font-black text-gray-700 uppercase tracking-widest mb-1">MBI CANDIDATES</p>
                      <p className="text-xl font-black text-white">{job.candidates}</p>
                   </div>
                   <div className="flex items-center gap-3 pl-12 border-l border-white/[0.04]">
                      <button className="p-3.5 rounded-xl bg-white/[0.03] text-gray-600 hover:text-white transition-all shadow-sm">
                         <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-3.5 rounded-xl bg-white/[0.03] text-gray-600 hover:text-red-400 transition-all shadow-sm">
                         <Trash2 className="w-4.5 h-4.5" />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
          
           <div className="py-12 text-center text-[11px] font-black text-gray-700 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
            Load More Listings
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
