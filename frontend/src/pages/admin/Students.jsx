import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  X,
  MoreHorizontal,
  TrendingUp,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Loader2,
  User as UserIcon,
  Mail as MailIcon
} from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { cn } from '../../utils/cn';
import { deleteAdminStudent } from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { createPortal } from 'react-dom';
import { useAdmin } from '../../context/AdminContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Students = () => {
  const [pageSize, setPageSize] = useState(5);
  const { students, loading, fetchStudents } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, studentId: null });

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const exportCSV = () => {
    const headers = ["Name", "Email", "ATS Score", "Status"];
    const rows = filteredStudents.map(s => [
      s.name,
      s.email,
      `${s.score || 0}%`,
      s.status || 'Active'
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Student Performance Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const tableColumn = ["Name", "Email", "ATS Score", "Status"];
    const tableRows = filteredStudents.map(s => [
      s.name,
      s.email,
      `${s.score || 0}%`,
      s.status || 'Active'
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillBox: [37, 99, 235], fillColor: [37, 99, 235] }
    });

    doc.save(`students_report_${new Date().toISOString().split('T')[0]}.pdf`);
    setExportOpen(false);
  };

  const scoreOptions = [
    { label: 'All Scores', value: 'all' },
    { label: 'Less than 30%', value: 'lt30' },
    { label: 'Less than 50%', value: 'lt50' },
    { label: 'Higher than 50%', value: 'gt50' },
    { label: 'Higher than 60%', value: 'gt60' },
    { label: 'Higher than 70%', value: 'gt70' },
    { label: 'Higher than 80%', value: 'gt80' },
    { label: 'Higher than 90%', value: 'gt90' },
  ];

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, studentId: id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.studentId;
    try {
      await deleteAdminStudent(id);
      toast.success('Student deleted successfully');
      fetchStudents(true);
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const score = student.score || 0;
    let matchesScore = true;
    if (scoreFilter === 'lt30') matchesScore = score < 30;
    else if (scoreFilter === 'lt50') matchesScore = score < 50;
    else if (scoreFilter === 'gt50') matchesScore = score >= 50;
    else if (scoreFilter === 'gt60') matchesScore = score >= 60;
    else if (scoreFilter === 'gt70') matchesScore = score >= 70;
    else if (scoreFilter === 'gt80') matchesScore = score >= 80;
    else if (scoreFilter === 'gt90') matchesScore = score >= 90;

    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">

          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group flex-1 min-w-[180px] lg:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap"
              >
                <Download className="w-4 h-4" /> Export
              </button>

              {exportOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
                  <div className="absolute right-0 mt-2 w-24 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={exportCSV} className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all uppercase tracking-tight">
                      .csv
                    </button>
                    <button onClick={exportPDF} className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all uppercase tracking-tight">
                      .pdf
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={cn(
                  "p-2 border rounded-lg transition-all shadow-sm",
                  scoreFilter !== 'all' ? "bg-blue-600 border-transparent text-white ring-2 ring-blue-500/20" : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <Filter className="w-5 h-5" />
              </button>

              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Score</span>
                    </div>
                    {scoreOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setScoreFilter(opt.value); setFilterOpen(false); }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2 text-sm font-bold transition-all",
                          scoreFilter === opt.value ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {opt.label}
                        {scoreFilter === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Info</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Score</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading.students && filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-sm text-slate-500 font-medium">Synchronizing Students...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-slate-500 font-medium">
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

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {selectedStudent && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setSelectedStudent(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <UserIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Student Profile</h3>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Administrative View</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-inner">
                <div className="w-20 h-20 rounded-[1.8rem] bg-white border-2 border-blue-100 flex items-center justify-center font-black text-blue-600 text-3xl shadow-sm">
                  {selectedStudent.name?.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">{selectedStudent.name}</h4>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <MailIcon className="w-4 h-4" />
                    {selectedStudent.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Course / Branch", value: selectedStudent.course || selectedStudent.branch || 'N/A' },
                  { label: "Phone Number", value: selectedStudent.phone || 'N/A' },
                  { label: "Enrollment Status", value: selectedStudent.status || 'Active' },
                  { label: "Average ATS Score", value: `${selectedStudent.score || 0}%`, highlight: true },
                  { label: "GitHub Profile", value: selectedStudent.github ? <a href={selectedStudent.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><GithubIcon className="w-3.5 h-3.5" /> View GitHub</a> : 'Not Linked' },
                  { label: "LinkedIn Profile", value: selectedStudent.linkedin ? <a href={selectedStudent.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><LinkedinIcon className="w-3.5 h-3.5" /> View LinkedIn</a> : 'Not Linked' }
                ].map((info, i) => (
                  <div key={i} className="space-y-2 px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.label}</p>
                    <div className={cn("text-[15px] font-black tracking-tight", info.highlight ? "text-blue-600" : "text-slate-700")}>{info.value}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="group relative w-full py-6 bg-slate-900 text-white rounded-[1.8rem] font-black text-lg tracking-tight overflow-hidden transition-all duration-300 hover:shadow-2xl active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Return to Directory</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, studentId: null })}
        onConfirm={confirmDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student record? This action will remove all associated performance data."
        confirmText="Yes, Delete Record"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Students;