import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  TrendingUp,
  Trash2,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Students = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [pageSize, setPageSize] = useState(5);
  
  const stats = [
    { label: 'Active Students', value: '1,124', change: '+5%', status: 'up' },
    { label: 'New This Week', value: '84', change: '+12%', status: 'up' },
    { label: 'Job Ready', value: '642', change: '+3%', status: 'up' },
  ];

  const students = [
    { id: 1, name: 'Alex Rivera', email: 'alex.r@example.com', branch: 'CS', score: 82, status: 'Active', lastActive: '2h ago' },
    { id: 2, name: 'Sarah Chen', email: 'sarah.c@example.com', branch: 'IT', score: 94, status: 'Hired', lastActive: '5h ago' },
    { id: 3, name: 'Marcus Bell', email: 'marcus.b@example.com', branch: 'ECE', score: 65, status: 'Active', lastActive: '1d ago' },
    { id: 4, name: 'Elena Vance', email: 'elena.v@example.com', branch: 'CS', score: 45, status: 'Needs Review', lastActive: '3h ago' },
    { id: 5, name: 'David Kim', email: 'david.k@example.com', branch: 'IT', score: 78, status: 'Active', lastActive: '12h ago' },
    { id: 6, name: 'James Wilson', email: 'james.w@example.com', branch: 'CS', score: 88, status: 'Active', lastActive: '1h ago' },
    { id: 7, name: 'Priya Sharma', email: 'priya.s@example.com', branch: 'IT', score: 91, status: 'Hired', lastActive: '4h ago' },
    { id: 8, name: 'Lucas Meyer', email: 'lucas.m@example.com', branch: 'ME', score: 55, status: 'Needs Review', lastActive: '6h ago' },
    { id: 9, name: 'Ana Garcia', email: 'ana.g@example.com', branch: 'CS', score: 72, status: 'Active', lastActive: '8h ago' },
    { id: 10, name: 'Ryan Taylor', email: 'ryan.t@example.com', branch: 'EE', score: 84, status: 'Active', lastActive: '10h ago' },
    { id: 11, name: 'Sophie Wong', email: 'sophie.w@example.com', branch: 'IT', score: 96, status: 'Hired', lastActive: '30m ago' },
    { id: 12, name: 'Oliver Brown', email: 'oliver.b@example.com', branch: 'CS', score: 68, status: 'Active', lastActive: '1d ago' },
    { id: 13, name: 'Emma Davis', email: 'emma.d@example.com', branch: 'ECE', score: 75, status: 'Active', lastActive: '2d ago' },
    { id: 14, name: 'Noah Wilson', email: 'noah.w@example.com', branch: 'CS', score: 42, status: 'Needs Review', lastActive: '5h ago' },
    { id: 15, name: 'Isabella Martinez', email: 'isabella.m@example.com', branch: 'IT', score: 89, status: 'Active', lastActive: '7h ago' },
    { id: 16, name: 'Liam Johnson', email: 'liam.j@example.com', branch: 'ME', score: 81, status: 'Hired', lastActive: '9h ago' },
    { id: 17, name: 'Mia Thompson', email: 'mia.t@example.com', branch: 'CS', score: 63, status: 'Active', lastActive: '11h ago' },
    { id: 18, name: 'Ethan Hunt', email: 'ethan.h@example.com', branch: 'IT', score: 92, status: 'Hired', lastActive: '15m ago' },
    { id: 19, name: 'Zoe Clark', email: 'zoe.c@example.com', branch: 'EE', score: 58, status: 'Needs Review', lastActive: '1d ago' },
    { id: 20, name: 'Aiden Smith', email: 'aiden.s@example.com', branch: 'CS', score: 76, status: 'Active', lastActive: '3h ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
            </div>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-lg",
              stat.status === 'up' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            )}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            {['All', 'Active', 'Hired', 'Needs Review'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="relative group flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-all shadow-sm"
                />
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                <Download className="w-4 h-4" /> Export
             </button>
             <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Info</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Score</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.slice(0, pageSize).map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-semibold text-blue-600 text-sm shrink-0">
                         {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-700">{student.branch}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-medium text-slate-900 w-8">{student.score}%</span>
                       <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", 
                              student.score >= 80 ? "bg-emerald-500" : 
                              student.score >= 60 ? "bg-blue-500" : "bg-amber-500"
                            )} 
                            style={{ width: `${student.score}%` }} 
                          />
                       </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                      student.status === 'Hired' ? "bg-emerald-50 text-emerald-700" :
                      student.status === 'Active' ? "bg-blue-50 text-blue-700" :
                      "bg-amber-50 text-amber-700"
                    )}>
                       {student.status === 'Hired' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                        student.status === 'Active' ? <TrendingUp className="w-3.5 h-3.5" /> :
                        <Clock className="w-3.5 h-3.5" />}
                       {student.status}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">{student.lastActive}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1">
                       <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title="View details">
                          <Eye className="w-4 h-4" />
                       </button>
                       <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                       </button>
                       <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors" title="More options">
                          <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
             <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">{students.length > pageSize ? pageSize : students.length}</span> of <span className="font-medium text-slate-900">1,284</span> students</p>
             
             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show</span>
               <select 
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer"
               >
                 {[5, 15, 25, 50].map(size => (
                   <option key={size} value={size}>{size}</option>
                 ))}
               </select>
             </div>
           </div>

           <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-400 cursor-not-allowed shadow-sm">Previous</button>
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Students;