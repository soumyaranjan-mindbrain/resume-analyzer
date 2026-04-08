import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  FileText,
  Building2,
  Tag,
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { cn } from '../../utils/cn';

const JobDescriptions = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Senior Frontend Developer', company: 'Google', tags: ['React', 'TypeScript', 'Tailwind'], applicants: 45, status: 'Active' },
    { id: 2, title: 'Product Manager', company: 'Amazon', tags: ['Agile', 'Jira', 'Strategy'], applicants: 28, status: 'Draft' },
    { id: 3, title: 'Data Scientist', company: 'Meta', tags: ['Python', 'PyTorch', 'SQL'], applicants: 62, status: 'Active' },
    { id: 4, title: 'Backend Engineer', company: 'Netflix', tags: ['Node.js', 'PostgreSQL', 'Docker'], applicants: 15, status: 'Active' },
    { id: 5, title: 'UI Designer', company: 'Airbnb', tags: ['Figma', 'Prototyping', 'Design Systems'], applicants: 34, status: 'Closed' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Page Actions */}
      <div className="flex justify-end mb-4">
        <button className="flex items-center gap-2 px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cyan-500/20">
          <Plus className="w-5 h-5" /> New Job Role
        </button>
      </div>

      {/* Grid of Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Simple Stats Sidebar for JD */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-50" />
               <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-100/50 rounded-2xl flex items-center justify-center text-emerald-600">
                     <Target className="w-8 h-8" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Active Roles</p>
                     <h3 className="text-4xl font-black text-slate-900 tracking-tighter">128</h3>
                  </div>
               </div>
            </div>

            <div className="bg-cyan-50 border border-cyan-100 rounded-[2rem] p-6 text-cyan-900 relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full" />
               <h4 className="font-black text-lg mb-6 relative z-10">Popular Tags</h4>
               <div className="flex flex-wrap gap-2 relative z-10">
                  {['React', 'Python', 'Agile', 'Figma', 'Node.js', 'SQL', 'Management'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer">
                      {tag}
                    </span>
                  ))}
               </div>
               <button className="mt-10 w-full py-4 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Manage Tags
               </button>
            </div>
         </div>

         {/* Job List Table */}
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col min-h-[600px]">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Job Catalog</h3>
               <div className="relative flex-1 md:max-w-xs group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search roles..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500/20 transition-all"
                  />
               </div>
            </div>

            <div className="overflow-x-auto flex-1">
               <table className="w-full text-left order-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Position</th>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Company</th>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Applicants</th>
                      <th className="py-5 px-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="group hover:bg-emerald-50/20 border-b border-slate-50 transition-colors">
                        <td className="py-6 px-8">
                           <div>
                              <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                                 {job.title}
                                 {job.status === 'Draft' && <span className="bg-slate-100 text-slate-400 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-tighter font-black">Draft</span>}
                              </p>
                              <div className="flex gap-1.5 mt-1.5">
                                 {job.tags.slice(0, 2).map(tag => (
                                   <span key={tag} className="text-[9px] font-bold text-slate-400">#{tag}</span>
                                 ))}
                              </div>
                           </div>
                        </td>
                        <td className="py-6 px-6">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <Building2 className="w-3.5 h-3.5 text-slate-300" />
                              {job.company}
                           </div>
                        </td>
                        <td className="py-6 px-6 text-center">
                           <span className="text-sm font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">{job.applicants}</span>
                        </td>
                        <td className="py-6 px-8 text-right">
                           <div className="flex items-center justify-end gap-2 shrink-0">
                              <button className="p-2.5 text-slate-400 hover:text-emerald-500 bg-slate-50 rounded-xl transition-all">
                                 <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 rounded-xl transition-all">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all">
                                 <MoreHorizontal className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

            <div className="p-8 border-t border-slate-50">
               <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-300 hover:border-emerald-500/20 hover:text-emerald-500 transition-all">
                  Click to Expand Catalog
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default JobDescriptions;


