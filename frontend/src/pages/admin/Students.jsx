import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  GraduationCap, 
  Mail, 
  Tag as BranchIcon,
  Search as SearchIcon,
  Settings as ControlIcon,
  ChevronDown
} from 'lucide-react';

const Students = () => {
  const students = [
    { name: 'Elena Sokolov', email: 'elena.s@mbi.edu', branch: 'Computer Science', score: 88, status: 'Active' },
    { name: 'Jordan Dax', email: 'j.dax@mbi.edu', branch: 'Information Technology', score: 72, status: 'Active' },
    { name: 'Marcus Lee', email: 'm.lee@mbi.edu', branch: 'Data Science', score: 54, status: 'Inactive' },
    { name: 'Sarah Jenkins', email: 'sjenkins@mbi.edu', branch: 'Software Engineering', score: 91, status: 'Active' },
    { name: 'Alex Rivera', email: 'arivera@mbi.edu', branch: 'Cybersecurity', score: 68, status: 'Active' },
    { name: 'Chloe Chen', email: 'cchen@mbi.edu', branch: 'AI & ML', score: 79, status: 'Active' },
  ];

  return (
    <div className="space-y-12">
      {/* Top Controls */}
      <div className="flex gap-8">
        <div className="flex-1 relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-[#00D2FF]" />
          <input 
            type="text" 
            placeholder="Search students by name, email, or branch..."
            className="w-full bg-[#0D1117] border border-white/[0.04] rounded-2xl pl-12 pr-4 py-4 text-[13px] text-white focus:outline-none focus:border-[#00D2FF]/20"
          />
        </div>
        <div className="w-[200px] relative">
          <select className="w-full bg-[#0D1117] border border-white/[0.04] rounded-2xl px-5 py-4 text-[13px] font-bold text-white appearance-none focus:outline-none focus:border-[#00D2FF]/20">
            <option>All Branches</option>
            <option>CSE</option>
            <option>IT</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
        </div>
        <button className="px-8 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[11px] font-black text-[#00D2FF] hover:text-white transition-all uppercase tracking-widest flex items-center gap-3">
          <Filter className="w-4 h-4 text-[#00D2FF]" /> Filter
        </button>
      </div>

      {/* Student List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0D1117] border border-white/[0.04] rounded-[3.5rem] p-10 shadow-2xl shadow-black/20 overflow-x-auto"
      >
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.02]">
              {['Name', 'Email & Branch', 'Score Hist.', 'Status', 'Actions'].map(th => (
                <th key={th} className="pb-8 px-6 text-[11px] font-black text-gray-700 uppercase tracking-widest">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => (
              <tr key={student.name} className="group hover:bg-white/[0.01] transition-all cursor-pointer">
                <td className="py-6 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-[12px] font-black text-white">
                      {student.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <span className="text-[14px] font-black text-white group-hover:text-[#00D2FF] transition-colors">{student.name}</span>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-gray-500">{student.email}</span>
                    <span className="text-[11px] font-black text-[#00D2FF] uppercase tracking-widest mt-1 opacity-60">{student.branch}</span>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00D2FF]" style={{ width: `${student.score}%` }} />
                    </div>
                    <span className="text-[13px] font-black text-white">{student.score}%</span>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                    student.status === 'Active' ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' : 'text-gray-500 bg-gray-500/5 border-gray-500/10'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl bg-white/[0.03] text-white hover:bg-[#00D2FF] hover:text-black transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/[0.03] text-gray-600 hover:text-white transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination placeholder */}
        <div className="mt-12 pt-10 border-t border-white/[0.04] flex justify-between items-center px-4">
          <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">Showing 6 of 1,240 students</p>
          <div className="flex gap-6">
              <button className="text-[11px] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors disabled:opacity-30" disabled>Previous</button>
              <button className="text-[11px] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Students;
