import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Upload, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Eye,
  GitCompare,
  PlayCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

const History = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const resumes = [
    {
      id: 1,
      name: 'James_Anderson_Software_Engineer.pdf',
      status: 'Analyzed',
      score: 78,
      date: '2 days ago',
      role: 'Software Engineer',
      type: 'analyzed'
    },
    {
      id: 2,
      name: 'James_Anderson_Product_Manager.pdf',
      status: 'Draft',
      score: null,
      date: '1 month ago',
      role: 'Product Manager',
      type: 'draft'
    },
    {
      id: 3,
      name: 'James_Anderson_Product_Manager.pdf',
      status: 'Draft',
      score: null,
      date: '2 days ago',
      role: null,
      type: 'draft'
    }
  ];

  const tabs = ['All', 'Analyzed', 'Drafts'];

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      {/* Filters Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        {/* Tabs */}
        <div className="p-1.5 bg-slate-200/40 backdrop-blur-xl rounded-2xl flex items-center gap-1 border border-white/50 w-full md:w-auto">
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
          <button className="px-3 text-slate-400 hover:text-slate-600">
             <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 w-full md:max-w-md">
          <div className="relative flex-1 group">
            <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-[#4b7bff] transition-colors" />
            <input 
              type="text"
              placeholder="Search resumes..."
              className="w-full pl-14 pr-6 py-4 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[1.5rem] text-sm font-semibold text-[#1e293b] placeholder:text-[#94a3b8] focus:border-[#4b7bff]/30 focus:ring-4 focus:ring-[#4b7bff]/10 transition-all outline-none shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-4 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[1.5rem] text-slate-500 hover:text-[#4b7bff] transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Resumes List */}
      <div className="space-y-6">
        {resumes.map((resume) => (
          <div 
            key={resume.id}
            className="bg-white/20 backdrop-blur-3xl rounded-[2.8rem] p-8 border border-white/60 relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] hover:shadow-blue-500/10 transition-all duration-500"
          >
            {/* Dark glass weighted gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-900/[0.1] pointer-events-none" />
            
            <div className="relative z-10">
              {/* Card Top Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-start gap-6">
                  {/* File Icon with Glass Backdrop */}
                  <div className="w-20 h-24 bg-blue-50/20 backdrop-blur-md border border-white/40 rounded-[1.2rem] flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                     <FileText className="w-10 h-10 text-[#4b7bff]/80" />
                     {resume.status === 'Analyzed' && (
                       <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute bottom-3 right-3 bg-white rounded-full p-0.5 shadow-sm" />
                     )}
                  </div>

                  <div className="flex-1 pt-1">
                    <h3 className="text-2xl font-black text-[#1e293b] tracking-tight mb-4 group-hover:text-[#4b7bff] transition-colors">{resume.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      {resume.score && (
                        <div className="flex items-center gap-4 py-1.5 pl-1.5 pr-6 bg-slate-900/[0.04] backdrop-blur-sm rounded-full border border-white/40">
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-100" />
                              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-500" strokeDasharray={126} strokeDashoffset={126 - (126 * resume.score) / 100} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-[11px] font-black text-[#1e293b]">{resume.score}%</span>
                          </div>
                          <div>
                            <span className="block text-xs font-black text-slate-400 leading-tight">ATS Score</span>
                            <span className="block text-sm font-bold text-[#1e293b] truncate max-w-[140px]">{resume.role || 'General Analysis'}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {resume.date}
                      </div>

                      {resume.role && !resume.score && (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900/[0.04] backdrop-blur-sm rounded-full border border-white/40 text-[#1e293b] font-bold text-sm">
                          <Plus className="w-4 h-4" />
                          Full-time
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className={cn(
                        "px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase border",
                        resume.status === 'Analyzed' 
                            ? "bg-emerald-100/40 text-emerald-700 border-emerald-200" 
                            : "bg-orange-100/40 text-orange-700 border-orange-200"
                    )}>
                        {resume.status}
                    </span>
                    <button className="p-2.5 bg-slate-100/40 backdrop-blur-md rounded-xl border border-white/60 text-slate-400 hover:text-slate-600 transition-all active:scale-95">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
              </div>

              {/* Card Actions Bottom Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/40">
                 <div className="flex items-center gap-3 w-full sm:w-auto">
                    {resume.status === 'Analyzed' ? (
                        <>
                           <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-[#4b7bff] text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                                <Eye className="w-4 h-4" />
                                View Report
                            </button>
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-white/40 text-[#1e293b] rounded-2xl font-black text-sm border border-white/60 hover:bg-white/60 transition-all">
                                <GitCompare className="w-4 h-4" />
                                Compare
                            </button>
                        </>
                    ) : (
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                            <PlayCircle className="w-4 h-4" />
                            Run Analysis
                        </button>
                    )}
                 </div>

                 <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button className="p-3 text-slate-400 hover:text-[#4b7bff] hover:bg-white/40 rounded-xl transition-all" title="Rename">
                        <Edit3 className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-[#4b7bff] hover:bg-white/40 rounded-xl transition-all" title="Download">
                        <Download className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50/40 rounded-xl transition-all" title="Delete">
                        <Trash2 className="w-5 h-5" />
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

export default History;
