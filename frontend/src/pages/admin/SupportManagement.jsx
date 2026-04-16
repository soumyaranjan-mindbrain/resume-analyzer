import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    Search,
    Filter,
    Loader2,
    User,
    Mail,
    Send,
    X,
    ChevronRight,
    MessageCircle,
    Hash,
    Plus,
    Trash2,
    BookOpen,
    HelpCircle
} from 'lucide-react';
import {
    adminGetAllTickets,
    adminUpdateTicket,
    getFaqs,
    createFaq,
    deleteFaq
} from '../../services/api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const SupportManagement = () => {
    const [activeTab, setActiveTab] = useState('TICKETS');
    const [tickets, setTickets] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    // FAQ Management State
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [submittingFaq, setSubmittingFaq] = useState(false);
    const [newFaq, setNewFaq] = useState({
        question: '',
        answer: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'TICKETS') {
                const data = await adminGetAllTickets();
                setTickets(data.data || []);
            } else {
                const data = await getFaqs();
                setFaqs(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(`Failed to load ${activeTab.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return toast.error('Please enter a response');

        try {
            setSubmittingReply(true);
            await adminUpdateTicket(selectedTicket.id, {
                reply: replyText,
                status: 'RESOLVED'
            });
            toast.success('Reply sent and ticket resolved');
            setReplyText('');
            setSelectedTicket(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to update ticket');
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleCreateFaq = async (e) => {
        e.preventDefault();
        if (!newFaq.question.trim() || !newFaq.answer.trim()) {
            return toast.error('Please fill in both question and answer');
        }

        try {
            setSubmittingFaq(true);
            await createFaq(newFaq);
            toast.success('FAQ added successfully');
            setNewFaq({ question: '', answer: '' });
            setIsFaqModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to add FAQ');
        } finally {
            setSubmittingFaq(false);
        }
    };

    const handleDeleteFaq = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            await deleteFaq(id);
            toast.success('FAQ deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete FAQ');
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch =
            t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const filteredFaqs = faqs.filter(f =>
        f.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">

            {/* Header & Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start">
                    <button
                        onClick={() => setActiveTab('TICKETS')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'TICKETS' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <MessageSquare className="w-4 h-4" /> Support Tickets
                    </button>
                    <button
                        onClick={() => setActiveTab('FAQS')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'FAQS' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <BookOpen className="w-4 h-4" /> Manage FAQs
                    </button>
                </div>

                {activeTab === 'FAQS' && (
                    <button
                        onClick={() => setIsFaqModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-4 h-4" /> Add New FAQ
                    </button>
                )}
            </div>

            {activeTab === 'TICKETS' ? (
                <>
                    {/* Stats and Filter Header */}
                    <div className="flex flex-col xl:flex-row justify-between gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-all">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Tickets</p>
                                    <p className="text-3xl font-black text-slate-900">{tickets.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-500/30 transition-all">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                                    <p className="text-3xl font-black text-slate-900">{tickets.filter(t => t.status === 'OPEN').length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                    <Clock className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</p>
                                    <p className="text-3xl font-black text-slate-900">{tickets.filter(t => t.status === 'RESOLVED').length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group max-w-xs">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-inner"
                                />
                            </div>
                            <div className="bg-white p-1 rounded-full border border-slate-200 flex items-center shadow-inner">
                                <button
                                    onClick={() => setStatusFilter('ALL')}
                                    className={cn("px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all", statusFilter === 'ALL' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                                >ALL</button>
                                <button
                                    onClick={() => setStatusFilter('OPEN')}
                                    className={cn("px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all", statusFilter === 'OPEN' ? "bg-amber-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                                >OPEN</button>
                                <button
                                    onClick={() => setStatusFilter('RESOLVED')}
                                    className={cn("px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all", statusFilter === 'RESOLVED' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}
                                >RESOLVED</button>
                            </div>
                        </div>
                    </div>

                    {/* Tickets List */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[500px]">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Support Tickets</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total {filteredTickets.length} Student Queries</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Student Info</th>
                                        <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Query Details</th>
                                        <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 text-center">Status</th>
                                        <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Tickets...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTickets.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center text-slate-400 italic font-bold">No support tickets found matching your filters.</td>
                                        </tr>
                                    ) : (
                                        filteredTickets.map((ticket) => (
                                            <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center font-black text-slate-400 text-lg group-hover:scale-105 transition-transform">
                                                            {ticket.user?.profilePic ? <img src={ticket.user.profilePic} className="w-full h-full object-cover" /> : ticket.user?.name?.charAt(0)}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="text-sm font-black text-slate-900 tracking-tight">{ticket.user?.name || 'Unknown User'}</p>
                                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                                <Mail className="w-3.5 h-3.5" />
                                                                <span className="text-[11px] font-bold tracking-tight">{ticket.user?.email || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 max-w-sm">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase tracking-tighter">{ticket.subject}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 tracking-tighter flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> {formatDate(ticket.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-700 leading-snug line-clamp-2">{ticket.message}</p>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 text-center">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                        ticket.status === 'OPEN' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    )}>
                                                        {ticket.status === 'OPEN' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-8 text-right">
                                                    <button
                                                        onClick={() => setSelectedTicket(ticket)}
                                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-slate-800 hover:scale-105 transition-all shadow-lg active:scale-95"
                                                    >
                                                        Manage <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    {/* FAQ List Header */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Manage Knowledge Base</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{filteredFaqs.length} Active FAQs</p>
                            </div>
                        </div>
                        <div className="relative group max-w-xs">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* FAQ Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Loading FAQs...</p>
                            </div>
                        ) : filteredFaqs.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-20 text-center text-slate-400 font-bold italic">
                                No FAQs found.
                            </div>
                        ) : (
                            filteredFaqs.map((faq) => (
                                <div key={faq.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-6 items-start justify-between">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{faq.question}</h4>
                                        </div>
                                        <p className="text-sm font-bold text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-100">{faq.answer}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteFaq(faq.id)}
                                        className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm group-hover:shadow-md"
                                        title="Delete FAQ"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Ticket Response Modal */}
            {selectedTicket && activeTab === 'TICKETS' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedTicket(null)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                    <MessageCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Manage Support Ticket</h3>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Ticket ID: {selectedTicket.id?.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-3 relative overflow-hidden">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400">
                                        {selectedTicket.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 tracking-tight">{selectedTicket.user?.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedTicket.subject}</p>
                                    </div>
                                </div>
                                <p className="text-base font-bold text-slate-700 leading-relaxed italic">"{selectedTicket.message}"</p>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Official Admin Response</label>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Enter your response..."
                                    className="w-full px-8 py-6 bg-slate-50/50 border border-slate-200 rounded-[2.5rem] outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 min-h-[160px] resize-none shadow-inner"
                                />
                            </div>
                            <button
                                onClick={handleReply}
                                disabled={submittingReply}
                                className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg tracking-tight shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all"
                            >
                                {submittingReply ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Send Response & Resolve <Send className="w-5 h-5" /></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add FAQ Modal */}
            {isFaqModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsFaqModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                                    <HelpCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add New FAQ</h3>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Enhance Knowledge Base</p>
                                </div>
                            </div>
                            <button onClick={() => setIsFaqModalOpen(false)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateFaq} className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Question</label>
                                    <input
                                        type="text"
                                        value={newFaq.question}
                                        onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                                        placeholder="What is the common issue?"
                                        className="w-full px-8 py-5 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Detailed Answer</label>
                                    <textarea
                                        value={newFaq.answer}
                                        onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                                        placeholder="Describe the solution in detail..."
                                        className="w-full px-8 py-6 bg-slate-50/50 border border-slate-200 rounded-[2rem] outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 min-h-[160px] resize-none shadow-inner leading-relaxed"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={submittingFaq}
                                className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg tracking-tight shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {submittingFaq ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Publish FAQ <CheckCircle2 className="w-5 h-5" /></>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportManagement;
