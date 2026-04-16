import React, { useState, useEffect } from 'react';
import {
   HelpCircle,
   Plus,
   Send,
   LifeBuoy,
   BookOpen,
   MessageSquare,
   Globe,
   Loader2,
   CheckCircle2,
   Clock,
   History,
   ChevronDown,
   Bug,
   User,
   Star,
   MoreHorizontal
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { getFaqs, createTicket, getUserTickets } from '../../services/api';
import toast from 'react-hot-toast';

const Support = () => {
   const { user } = useAuth();
   const [activeFaq, setActiveFaq] = useState(null);
   const [faqs, setFaqs] = useState([]);
   const [tickets, setTickets] = useState([]);
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);

   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
   const [formData, setFormData] = useState({
      subject: 'General Inquiry',
      message: ''
   });

   const categories = [
      { id: 'general', label: 'General Inquiry', icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
      { id: 'bug', label: 'Resume Analysis Bug', icon: Bug, color: 'text-rose-500', bg: 'bg-rose-50' },
      { id: 'account', label: 'Account Issues', icon: User, color: 'text-amber-500', bg: 'bg-amber-50' },
      { id: 'feature', label: 'Feature Recommendation', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { id: 'other', label: 'Other', icon: MoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-50' }
   ];

   const selectedCategory = categories.find(c => c.label === formData.subject) || categories[0];

   const fetchData = async () => {
      try {
         setLoading(true);
         const [faqData, ticketData] = await Promise.all([
            getFaqs(),
            getUserTickets(user?.id)
         ]);
         setFaqs(faqData.data || []);
         setTickets(ticketData.data || []);
      } catch (error) {
         console.error('Error fetching support data:', error);
         toast.error('Failed to load support data');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (user?.id) {
         fetchData();
      }
   }, [user?.id]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.message.trim()) {
         return toast.error('Please enter a message');
      }

      try {
         setSubmitting(true);
         await createTicket({
            userId: user.id,
            subject: formData.subject,
            message: formData.message
         });
         toast.success('Support ticket submitted successfully');
         setFormData({ subject: 'General Inquiry', message: '' });
         fetchData(); // Refresh tickets list
      } catch (error) {
         toast.error('Failed to submit ticket');
      } finally {
         setSubmitting(false);
      }
   };



   return (
      <div className="min-h-screen bg-slate-50/20">
         <div className="max-w-[1400px] mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-700">

            {/* Hero Section */}
            <div className="text-center relative py-8 border-b border-slate-100 mb-6">
               <div className="absolute inset-x-0 -top-16 -bottom-16 bg-gradient-to-b from-blue-50/40 to-transparent blur-3xl -z-10 opacity-50" />
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 font-bold text-[8px] mb-4 border border-blue-100 tracking-widest uppercase">
                  <LifeBuoy className="w-3 h-3" /> Help & Support
               </div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">How can we help today?</h1>
               <p className="text-slate-500 font-medium text-base max-w-xl mx-auto mb-2 leading-relaxed opacity-80">Search our knowledge base or get in touch with our team for personalized assistance.</p>
            </div>

            <div className="space-y-16">
               {/* FAQs Section */}
               <div className="space-y-8">
                  <div className="flex items-center gap-3 px-1">
                     <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <BookOpen className="w-5 h-5" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Quick Answers</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     {loading ? (
                        <div className="flex justify-center py-12">
                           <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                     ) : faqs.length === 0 ? (
                        <div className="bg-white border border-slate-200 border-dashed rounded-xl p-8 text-center text-sm">
                           <p className="text-slate-400 font-bold italic">No FAQs found.</p>
                        </div>
                     ) : (
                        faqs.map((faq, i) => (
                           <div key={faq.id || i} className={cn(
                              "bg-white border transition-all duration-300 group overflow-hidden",
                              activeFaq === i ? "border-blue-500/30 shadow-lg shadow-blue-500/5 rounded-2xl" : "border-slate-100/80 hover:border-slate-200 rounded-xl"
                           )}>
                              <button
                                 onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                 className="w-full flex items-center justify-between p-5 text-left transition-colors"
                              >
                                 <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-500 transition-colors uppercase tracking-widest w-6">0{i + 1}</span>
                                    <span className={cn(
                                       "font-bold text-sm transition-colors leading-snug",
                                       activeFaq === i ? "text-blue-600" : "text-slate-700 group-hover:text-slate-900"
                                    )}>{faq.question}</span>
                                 </div>
                                 <div className={cn(
                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0",
                                    activeFaq === i ? "rotate-180 bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-300 border-slate-100 bg-slate-50 group-hover:border-slate-200"
                                 )}>
                                    <Plus className={cn("w-3.5 h-3.5 transition-transform duration-300", activeFaq === i ? "rotate-45" : "")} />
                                 </div>
                              </button>
                              <div className={cn(
                                 "grid transition-all duration-300 ease-in-out",
                                 activeFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                              )}>
                                 <div className="overflow-hidden">
                                    <div className="px-14 pb-6 text-slate-500 font-medium text-[13px] leading-relaxed max-w-5xl">
                                       <div className="w-8 h-0.5 bg-blue-500/20 mb-4 rounded-full" />
                                       {faq.answer}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start border-t border-slate-100 pt-16">
                  {/* Ticket Form Section */}
                  <div className="xl:col-span-2 bg-white rounded-[1.5rem] p-8 lg:p-10 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/30 rounded-bl-[4rem] -mr-12 -mt-12 group-hover:bg-blue-100/20 transition-colors duration-500" />

                     <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                           <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
                              <MessageSquare className="w-5.5 h-6" />
                           </div>
                           <div>
                              <h3 className="text-xl font-black text-slate-900 tracking-tight">Support Ticket</h3>
                              <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em] mt-1 ml-0.5">Direct Assistance</p>
                           </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Subject Category</label>
                                 <div className="relative">
                                    <button
                                       type="button"
                                       onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                       className={cn(
                                          "w-full px-6 py-4 bg-slate-50/50 border rounded-xl outline-none transition-all flex items-center justify-between group/btn shadow-inner",
                                          isCategoryOpen ? "border-blue-500 bg-white ring-4 ring-blue-500/5" : "border-slate-200 hover:border-slate-300"
                                       )}
                                    >
                                       <div className="flex items-center gap-3">
                                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm", selectedCategory.bg)}>
                                             <selectedCategory.icon className={cn("w-4 h-4", selectedCategory.color)} />
                                          </div>
                                          <span className="font-bold text-slate-700 text-sm">{formData.subject}</span>
                                       </div>
                                       <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isCategoryOpen ? "rotate-180 text-blue-500" : "")} />
                                    </button>

                                    {isCategoryOpen && (
                                       <>
                                          <div
                                             className="fixed inset-0 z-40"
                                             onClick={() => setIsCategoryOpen(false)}
                                          />
                                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-2">
                                             <div className="grid grid-cols-1 gap-1">
                                                {categories.map((cat) => (
                                                   <button
                                                      key={cat.id}
                                                      type="button"
                                                      onClick={() => {
                                                         setFormData(prev => ({ ...prev, subject: cat.label }));
                                                         setIsCategoryOpen(false);
                                                      }}
                                                      className={cn(
                                                         "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                                                         formData.subject === cat.label ? "bg-blue-50/50" : "hover:bg-slate-50"
                                                      )}
                                                   >
                                                      <div className={cn(
                                                         "w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                                                         cat.bg,
                                                         formData.subject === cat.label ? "ring-2 ring-white" : ""
                                                      )}>
                                                         <cat.icon className={cn("w-4.5 h-4.5", cat.color)} />
                                                      </div>
                                                      <span className={cn(
                                                         "text-[13px] font-bold transition-colors",
                                                         formData.subject === cat.label ? "text-blue-600" : "text-slate-600 group-hover:text-slate-900"
                                                      )}>
                                                         {cat.label}
                                                      </span>
                                                      {formData.subject === cat.label && (
                                                         <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                                                      )}
                                                   </button>
                                                ))}
                                             </div>
                                          </div>
                                       </>
                                    )}
                                 </div>
                              </div>
                              <div className="flex items-center pt-5">
                                 <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/30 w-full">
                                    <p className="text-[10px] text-blue-600 font-bold leading-relaxed flex items-center gap-2">
                                       <Clock className="w-3.5 h-3.5 shrink-0" />
                                       Typical response within 24 hours.
                                    </p>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">How can we help?</label>
                              <textarea
                                 value={formData.message}
                                 onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                 className="w-full px-6 py-5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 min-h-[160px] resize-none placeholder:text-slate-300 shadow-inner text-sm leading-relaxed"
                                 placeholder="Please describe your issue..."
                              />
                           </div>

                           <button
                              disabled={submitting}
                              className="w-full py-4.5 bg-blue-600 text-white rounded-xl font-black tracking-widest text-sm shadow-[0_15px_30px_-8px_rgba(37,99,235,0.25)] hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                           >
                              {submitting ? (
                                 <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                 <>Submit Ticket <Send className="w-4 h-4" /></>
                              )}
                           </button>
                        </form>
                     </div>
                  </div>

                  {/* Recent Tickets Section */}
                  <div className="xl:col-span-1 space-y-6">
                     {tickets.length > 0 ? (
                        <div className="bg-white rounded-[1.5rem] p-8 text-slate-900 space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 h-full border-t border-t-blue-100">
                           <div className="flex items-center justify-between px-1">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Clock className="w-4.5 h-4.5" />
                                 </div>
                                 <h4 className="text-lg font-black tracking-tight text-slate-900">Recent</h4>
                              </div>
                              <span className="text-[9px] font-black px-2.5 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-widest border border-slate-200">{tickets.length}</span>
                           </div>
                           <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                              {tickets.slice(0, 3).map((ticket) => (
                                 <div key={ticket.id} className="p-5 bg-slate-50/30 rounded-xl border border-slate-100 group hover:border-blue-500/10 hover:bg-white transition-all duration-300">
                                    <div className="flex items-center justify-between mb-3">
                                       <span className="text-[9px] font-black uppercase tracking-widest text-blue-600/70">{ticket.subject}</span>
                                       <span className={cn(
                                          "text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest",
                                          ticket.status === 'RESOLVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                       )}>
                                          {ticket.status}
                                       </span>
                                    </div>
                                    <p className="text-[13px] font-bold text-slate-600 leading-snug line-clamp-2 italic opacity-90">"{ticket.message}"</p>
                                    {ticket.reply && (
                                       <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2.5 animate-in fade-in duration-500">
                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                                          <div className="space-y-1">
                                             <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest opacity-80">Admin Reply</p>
                                             <p className="text-[12px] font-bold text-emerald-800 italic leading-snug">{ticket.reply}</p>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : (
                        <div className="bg-slate-50/20 rounded-[1.5rem] p-10 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center h-full">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                              <History className="w-6 h-6" />
                           </div>
                           <p className="text-slate-400 text-xs font-bold">No recent activity.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Support;
