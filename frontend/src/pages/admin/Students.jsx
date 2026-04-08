import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  ArrowUpRight,
  TrendingUp,
  Mail,
  Trash2,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Students = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Active Students', value: '1,124', change: '+5%', status: 'up' },
    { label: 'New This Week', value: '84', change: '+12%', status: 'up' },
    { label: 'Job Ready', value: '642', change: '+3%', status: 'up' },
    { label: 'Avg Analysis', value: '3.4', change: '-2%', status: 'down' },
  ];

  const students = [
    { id: 1, name: 'Alex Rivera', email: 'alex.r@example.com', branch: 'CS', score: 82, status: 'Active', lastActive: '2h ago' },
    { id: 2, name: 'Sarah Chen', email: 'sarah.c@example.com', branch: 'IT', score: 94, status: 'Hired', lastActive: '5h ago' },
    { id: 3, name: 'Marcus Bell', email: 'marcus.b@example.com', branch: 'ECE', score: 65, status: 'Active', lastActive: '1d ago' },
    { id: 4, name: 'Elena Vance', email: 'elena.v@example.com', branch: 'CS', score: 45, status: 'Needs Review', lastActive: '3h ago' },
    { id: 5, name: 'David Kim', email: 'david.k@example.com', branch: 'IT', score: 78, status: 'Active', lastActive: '12h ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Page Actions Only */}
      <div className="flex justify-end gap-3 mb-4">
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cyan-500/20">
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-blue-50/50" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                <span className={cn(
                  "text-[10px] font-black px-1.5 py-0.5 rounded-md",
                  stat.status === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Active', 'Hired', 'Needs Review'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search name, email or branch..."
                  className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 w-full md:w-64 transition-all"
                />
             </div>
             <button className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 hover:text-slate-800 transition-all">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Info</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Branch</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Avg Score</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Activity</th>
                <th className="py-5 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="group hover:bg-blue-50/30 transition-colors border-b border-slate-50">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                         {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</p>
                        <p className="text-xs font-bold text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-widest">{student.branch}</span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-slate-700">{student.score}%</span>
                       <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", 
                              student.score >= 80 ? "bg-emerald-500" : 
                              student.score >= 60 ? "bg-blue-500" : "bg-orange-500"
                            )} 
                            style={{ width: `${student.score}%` }} 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                      student.status === 'Hired' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      student.status === 'Active' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                      "bg-orange-50 text-orange-600 border border-orange-100"
                    )}>
                       {student.status === 'Hired' ? <CheckCircle2 className="w-3 h-3" /> :
                        student.status === 'Active' ? <TrendingUp className="w-3 h-3" /> :
                        <Clock className="w-3 h-3" />}
                       {student.status}
                    </div>
                  </td>
                  <td className="py-6 px-6 text-xs font-bold text-slate-400">{student.lastActive}</td>
                  <td className="py-6 px-8">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all">
                          <Eye className="w-4 h-4" />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-8 bg-slate-50/50 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-400">Showing 5 of 1,284 students</p>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-400 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Students;


