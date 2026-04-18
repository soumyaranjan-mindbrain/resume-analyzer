import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Loader2,
  Mail,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAdmin } from '../../context/AdminContext';
import PremiumSelect from '../../components/ui/PremiumSelect';

const Reports = () => {
  const { reports, loading, fetchReports } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('30d');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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

  const mappedReports = reports.map(report => ({
    id: report.id,
    resumeId: report.resumeId,
    studentName: report.resume?.user?.name || 'Unknown',
    studentEmail: report.resume?.user?.email || 'N/A',
    fileName: report.resume?.fileName || 'resume',
    atsScore: report.atsScore,
    createdAt: report.createdAt,
    status: report.atsScore >= 85 ? 'Exceptional' :
      report.atsScore >= 70 ? 'High' :
        report.atsScore >= 50 ? 'Medium' : 'Needs Improvement'
  }));

  const filteredReports = mappedReports.filter(r => {
    const matchesSearch =
      r.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fileName?.toLowerCase().includes(searchQuery.toLowerCase());

    const score = r.atsScore || 0;
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

  const statusClass = (score) => {
    if (score >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (score >= 70) return "bg-blue-50 text-blue-700 border-blue-100";
    if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-red-50 text-red-700 border-red-100";
  };

  const getStatusLabel = (score) => {
    if (score >= 85) return 'Exceptional';
    if (score >= 70) return 'High';
    if (score >= 50) return 'Medium';
    return 'Needs Improvement';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6 animate-in fade-in duration-500">

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search reports by name, email or file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
            />
          </div>

          <PremiumSelect
            options={[
              { label: 'Last 30 Days', value: '30d' },
              { label: 'Last 7 Days', value: '7d' },
              { label: 'Last 24 Hours', value: '24h' },
              { label: 'All Time', value: 'all' }
            ]}
            value={timeFilter}
            onChange={setTimeFilter}
            icon={Calendar}
          />

          <PremiumSelect
            options={scoreOptions}
            value={scoreFilter}
            onChange={setScoreFilter}
            icon={Filter}
            placeholder="Score Filter"
          />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Student & Contact</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Analysis Date</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">ATS Score</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading.reports ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-sm text-slate-500 font-medium">Loading reports...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-slate-500 font-medium">
                    No reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm">
                          {getInitials(report.studentName)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{report.studentName}</p>
                          <div className="flex items-center gap-1 mt-0.5 text-slate-400 group">
                            <Mail className="w-3 h-3" />
                            <span className="text-[11px] font-medium leading-tight">{report.studentEmail}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-slate-600">{formatDate(report.createdAt)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={cn(
                          "text-sm font-bold",
                          report.atsScore >= 80 ? "text-emerald-600" : report.atsScore >= 60 ? "text-blue-600" : "text-amber-600"
                        )}>{report.atsScore}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full", report.atsScore >= 80 ? "bg-emerald-500" : report.atsScore >= 60 ? "bg-blue-500" : "bg-amber-500")}
                            style={{ width: `${report.atsScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border",
                        statusClass(report.atsScore)
                      )}>
                        {getStatusLabel(report.atsScore)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
