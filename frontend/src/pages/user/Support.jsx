import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  FileText, 
  Search, 
  ChevronRight, 
  Plus, 
  Send,
  LifeBuoy,
  BookOpen,
  MessageSquare,
  Globe,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Support = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const contactMethods = [
    { 
      title: 'Live Chat', 
      desc: 'Typical response under 5 mins', 
      icon: <MessageCircle className="w-6 h-6" />, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      title: 'Email Support', 
      desc: 'Send us a detailed request', 
      icon: <Mail className="w-6 h-6" />, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
    { 
      title: 'Documentation', 
      desc: 'Detailed guides & API docs', 
      icon: <FileText className="w-6 h-6" />, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10' 
    }
  ];

  const faqs = [
    { q: 'How does the AI analysis work?', a: 'Our engine uses advanced NLP to compare your resume against millions of job descriptions, highlighting keyword gaps and semantic alignment.' },
    { q: 'Is my data secure?', a: 'Yes, we use enterprise-grade encryption for all uploads. Your data is never shared with third parties without your explicit consent.' },
    { q: 'Which file formats are supported?', a: 'We currently support PDF, DOCX, and TXT formats for resume uploads.' },
    { q: 'Can I integrate with LinkedIn?', a: 'Absolutely. You can import your LinkedIn profile directly or export our generated keywords to your profile.' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4">
      
      
      <div className="text-center mb-16 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-[#4b7bff] font-black text-xs mb-6 border border-blue-500/20">
           <LifeBuoy className="w-4 h-4" /> HELP CENTER
        </div>
        <h1 className="text-5xl font-black text-[#1e293b] tracking-tight mb-6">How can we help you today?</h1>
        <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto mb-10">Search our knowledge base or get in touch with our expert team for personalized assistance.</p>
        
        
        <div className="max-w-xl mx-auto relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#4b7bff] transition-colors" />
           <input 
              type="text" 
              placeholder="Search for articles, guides, or keywords..." 
              className="w-full pl-14 pr-6 py-5 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-xl shadow-slate-200/50 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 font-bold text-slate-700 transition-all text-lg placeholder:text-slate-400"
           />
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
         {contactMethods.map((method, i) => (
           <div key={i} className="bg-white/30 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/70 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.2)] hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-900/[0.03] pointer-events-none" />
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/40 shadow-inner", method.bg, method.color)}>
                 {method.icon}
              </div>
              <h3 className="text-2xl font-black text-[#1e293b] mb-2">{method.title}</h3>
              <p className="text-slate-500 font-bold text-sm mb-6 leading-relaxed">{method.desc}</p>
              <div className="flex items-center gap-2 text-[#4b7bff] font-black text-sm group-hover:translate-x-1 transition-transform">
                 Contact Us <ArrowRight className="w-4 h-4" />
              </div>
           </div>
         ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         
         
         <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-[#4b7bff]/10 rounded-xl flex items-center justify-center text-[#4b7bff]">
                  <BookOpen className="w-6 h-6" />
               </div>
               <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">Popular Questions</h2>
            </div>
            
            <div className="space-y-4">
               {faqs.map((faq, i) => (
                 <div key={i} className="bg-white/25 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden shadow-sm hover:border-blue-500/20 transition-all">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                       <span className="font-bold text-[#334155] pr-8">{faq.q}</span>
                       <div className={cn("w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform", activeFaq === i ? "rotate-45 text-orange-500 border-orange-200 bg-orange-50" : "text-slate-400")}>
                          <Plus className="w-4 h-4" />
                       </div>
                    </button>
                    {activeFaq === i && (
                      <div className="px-6 pb-6 text-slate-500 font-bold text-sm leading-relaxed border-t border-white/40 pt-4">
                        {faq.a}
                      </div>
                    )}
                 </div>
               ))}
            </div>
         </div>

         
         <div className="bg-white/30 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/70 shadow-[0_60px_100px_-20px_rgba(15,23,42,0.3),inset_0_1px_4px_rgba(255,255,255,0.6)] relative overflow-hidden">
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                     <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-[#1e293b] tracking-tight">Submit a Ticket</h3>
                     <p className="text-slate-400 font-bold text-sm">We'll get back to you within 24 hours.</p>
                  </div>
               </div>

               <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">First Name</label>
                        <input className="w-full px-5 py-4 bg-white/50 border border-white/60 rounded-2xl outline-none focus:border-blue-500/30 transition-all font-bold text-slate-700" placeholder="John" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Email Address</label>
                        <input className="w-full px-5 py-4 bg-white/50 border border-white/60 rounded-2xl outline-none focus:border-blue-500/30 transition-all font-bold text-slate-700" placeholder="john@example.com" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Subject</label>
                     <select className="w-full px-5 py-4 bg-white/50 border border-white/60 rounded-2xl outline-none focus:border-blue-500/30 transition-all font-bold text-slate-700 appearance-none">
                        <option>Technical Issue</option>
                        <option>Billing Question</option>
                        <option>Feature Request</option>
                        <option>Other</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Your Message</label>
                     <textarea className="w-full px-5 py-4 bg-white/50 border border-white/60 rounded-3xl outline-none focus:border-blue-500/30 transition-all font-bold text-slate-700 h-32" placeholder="Tell us more about your issue..." />
                  </div>
                  
                  <button className="w-full py-5 bg-[#4b7bff] text-white rounded-[1.5rem] font-black tracking-tight text-lg shadow-2xl shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                     Send Message <Send className="w-5 h-5" />
                  </button>
               </form>
            </div>
         </div>

      </div>

      
      <div className="mt-24 pt-10 border-t border-white/40 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-8 text-slate-400 font-bold text-sm">
            <div className="flex items-center gap-2">
               <Globe className="w-4 h-4" />
               Global Support 24/7
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               Secure SSL Encrypted
            </div>
         </div>
         <p className="text-slate-400 font-bold text-sm">© 2026 Kredo AI Help Center</p>
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

