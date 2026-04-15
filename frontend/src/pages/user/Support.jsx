import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronRight, 
  Plus, 
  Send,
  LifeBuoy,
  BookOpen,
  MessageSquare,
  Globe
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Support = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { q: 'How does the AI analysis work?', a: 'Our engine uses advanced NLP to compare your resume against millions of job descriptions, highlighting keyword gaps and semantic alignment.' },
    { q: 'Is my data secure?', a: 'Yes, we use enterprise-grade encryption for all uploads. Your data is never shared with third parties without your explicit consent.' },
    { q: 'Which file formats are supported?', a: 'We currently support PDF, DOCX, and TXT formats for resume uploads.' },
    { q: 'Can I integrate with LinkedIn?', a: 'Absolutely. You can import your LinkedIn profile directly or export our generated keywords to your profile.' }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4">
      
      
      <div className="text-center mb-16 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-[11px] mb-6 border border-blue-100">
           <LifeBuoy className="w-4 h-4" /> HELP CENTER
        </div>
        <h1 className="text-5xl font-bold text-slate-800 tracking-tight mb-6">How can we help you today?</h1>
        <p className="text-slate-600 font-normal text-xl max-w-2xl mx-auto mb-10">Search our knowledge base or get in touch with our expert team for personalized assistance.</p>
        
        <div className="max-w-xl mx-auto relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
           <input 
              type="text" 
              placeholder="Search for articles, guides, or keywords..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-medium text-slate-600 transition-all text-lg placeholder:text-slate-400"
           />
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         
         
         <div>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#4b7bff]/10 rounded-xl flex items-center justify-center text-[#4b7bff]">
                   <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Popular Queries</h2>
            </div>
            
            <div className="space-y-4">
               {faqs.map((faq, i) => (
                 <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:border-blue-500/20 transition-all">
                    <button 
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-medium text-slate-600 pr-8 text-sm">{faq.q}</span>
                        <div className={cn("w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform", activeFaq === i ? "rotate-45 text-amber-500 border-amber-200 bg-amber-50" : "text-slate-400")}>
                           <Plus className="w-4 h-4" />
                        </div>
                     </button>
                      {activeFaq === i && (
                        <div className="px-6 pb-6 text-slate-500 font-medium text-sm leading-relaxed border-t border-slate-50 pt-4">
                          {faq.a}
                        </div>
                      )}
                 </div>
               ))}
            </div>
         </div>

         
         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <MessageSquare className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Submit a Support Ticket</h3>
                      <p className="text-slate-600 font-normal text-sm">We'll get back to you very soon.</p>
                   </div>
               </div>

               <form className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">First Name</label>
                         <input className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500/30 transition-all font-medium text-slate-700" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Email Address</label>
                         <input className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500/30 transition-all font-medium text-slate-700" placeholder="john@example.com" />
                      </div>
                   </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Subject</label>
                     <select className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500/30 transition-all font-medium text-slate-700 appearance-none">
                        <option>General Inquiry</option>
                        <option>Billing Question</option>
                        <option>Feature Request</option>
                        <option>Other</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Your Message</label>
                     <textarea className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500/30 transition-all font-medium text-slate-700 min-h-[150px] resize-none" placeholder="Describe your issue in detail..." />
                  </div>
                  
                  <button className="w-full py-5 bg-[#4b7bff] text-white rounded-[1.5rem] font-bold tracking-tight text-lg shadow-2xl shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                     Send Message <Send className="w-5 h-5" />
                  </button>
               </form>
            </div>
         </div>

      </div>

      
      <div className="mt-24 pt-10 border-t border-white/40 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-8 text-slate-400 font-semibold text-sm">
            <div className="flex items-center gap-2">
               <Globe className="w-4 h-4" />
               Global Support 24/7
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               Secure SSL Encrypted
            </div>
         </div>
         <p className="text-slate-400 font-semibold text-sm">© 2026 Kredo AI Help Center</p>
      </div>
    </div>
  );
};


const ShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default Support;

