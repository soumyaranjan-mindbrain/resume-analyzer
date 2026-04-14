import React, { useState, useEffect } from 'react';
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
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getAdminStudents, deleteAdminStudent, createAdminStudent } from '../../services/api';
import toast from 'react-hot-toast';

const Students = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', course: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAdminStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createAdminStudent(newStudent);
      toast.success('Student added successfully');
      setShowAddModal(false);
      setNewStudent({ name: '', email: '', course: '', phone: '' });
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteAdminStudent(id);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && student.status === activeTab;
  });
  
  const stats = [
    { label: 'Active Students', value: students.length.toLocaleString(), change: '+5%', status: 'up' },
    { label: 'New This Week', value: Math.floor(students.length * 0.1), change: '+12%', status: 'up' },
    { label: 'Job Ready', value: Math.floor(students.length * 0.6), change: '+3%', status: 'up' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
            </div>
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-lg",
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-all shadow-sm"
                />
             </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all shadow-sm shadow-blue-200"
              >
                 <Plus className="w-4 h-4" /> Add Student
              </button>
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
               {loading ? (
                 <tr>
                   <td colSpan="6" className="py-10 text-center">
                     <div className="flex flex-col items-center gap-2">
                       <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                       <p className="text-sm text-slate-500 font-medium">Loading students...</p>
                     </div>
                   </td>
                 </tr>
               ) : filteredStudents.length === 0 ? (
                 <tr>
                   <td colSpan="6" className="py-10 text-center text-slate-500 font-medium">
                     No students found matching your criteria.
                   </td>
                 </tr>
               ) : (
                 filteredStudents.slice(0, pageSize).map((student) => (
                   <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 px-6">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                             {student.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 tracking-tight">{student.name}</p>
                            <p className="text-sm font-normal text-slate-500">{student.email}</p>
                          </div>
                       </div>
                     </td>
                     <td className="py-4 px-6">
                       <span className="text-sm text-slate-700">{student.course || student.branch || 'N/A'}</span>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-900 w-8">{student.score || 0}%</span>
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className={cn("h-full rounded-full", 
                                 (student.score || 0) >= 80 ? "bg-emerald-500" : 
                                 (student.score || 0) >= 60 ? "bg-blue-500" : "bg-amber-500"
                               )} 
                               style={{ width: `${student.score || 0}%` }} 
                             />
                          </div>
                       </div>
                     </td>
                     <td className="py-4 px-6">
                       <div className={cn(
                         "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                         student.status === 'Hired' ? "bg-emerald-50 text-emerald-700" :
                         student.status === 'Needs Review' ? "bg-amber-50 text-amber-700" :
                         "bg-blue-50 text-blue-700"
                       )}>
                          {student.status === 'Hired' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                           student.status === 'Needs Review' ? <Clock className="w-3.5 h-3.5" /> :
                           <TrendingUp className="w-3.5 h-3.5" />}
                          {student.status || 'Active'}
                       </div>
                     </td>
                     <td className="py-4 px-6 text-sm font-normal text-slate-500">{student.lastActive || new Date(student.updatedAt).toLocaleDateString()}</td>
                     <td className="py-4 px-6">
                       <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title="View details">
                             <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" 
                            title="Delete"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors" title="More options">
                             <MoreHorizontal className="w-4 h-4" />
                          </button>
                       </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
             <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">{filteredStudents.length > pageSize ? pageSize : filteredStudents.length}</span> of <span className="font-medium text-slate-900">{filteredStudents.length}</span> students</p>
             
             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Show</span>
               <select 
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-xl font-bold text-slate-900">Add New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <Filter className="w-5 h-5 rotate-45 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  required
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  required
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Course</label>
                  <input
                    type="text"
                    value={newStudent.course}
                    onChange={(e) => setNewStudent({...newStudent, course: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="B.Tech"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="1234567890"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;