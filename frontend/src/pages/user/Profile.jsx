import React from 'react';
import {
  User,
  Mail,
  MapPin,
  Camera,
  ChevronRight,
} from 'lucide-react';


const TwitterIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

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

const profileFields = [
  { label: "First Name", value: "James" },
  { label: "Last Name", value: "Anderson" },
  { label: "Email Address", value: "james.a@kredo.ai" },
  { label: "Location", value: "San Francisco, CA" },
  { label: "Phone Number", value: "+1 (555) 000-0000" },
  { label: "Job Title", value: "Senior Product Designer" }
];

const Profile = () => {
  return (
    <div className="flex-1 p-6 lg:p-1 overflow-y-auto custom-scrollbar">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        
        <div className="lg:col-span-1 bg-white/30 backdrop-blur-3xl rounded-[2.8rem] p-8 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] border border-white/70 relative overflow-hidden flex flex-col items-center h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-[#4b7bff]/5 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden ring-4 ring-white shadow-2xl">
                <img src="https://i.pravatar.cc/150?img=11" alt="James Anderson" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#4b7bff] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-4 border-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight mb-1">James Anderson</h2>
            <p className="text-[#64748b] font-bold text-sm uppercase tracking-widest mb-6">Senior Product Designer</p>

            <div className="flex gap-3 mb-8">
              {[GithubIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                <button key={i} className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center border border-white hover:bg-[#4b7bff] hover:text-white transition-all shadow-sm">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <div className="w-full space-y-4">
              <div className="bg-white/50 p-4 rounded-2xl border border-white flex items-center gap-4 group hover:bg-white transition-all shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-[#4b7bff] rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-[#334155]">james.a@kredo.ai</p>
                </div>
              </div>
              <div className="bg-white/50 p-4 rounded-2xl border border-white flex items-center gap-4 group hover:bg-white transition-all shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-[#334155]">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-2 bg-white/30 backdrop-blur-3xl rounded-[2.8rem] p-8 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] border border-white/70 relative flex flex-col h-full">
          <h3 className="text-xl font-black text-[#1e293b] mb-8 tracking-tight">Account Settings</h3>
            
          <div className="grid sm:grid-cols-2 gap-6 flex-1">
            {profileFields.map((field, i) => (
              <div key={i} className="space-y-2">
                <label className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest px-1">{field.label}</label>
                <input 
                  type="text" 
                  defaultValue={field.value}
                  className="w-full bg-white/50 border border-white rounded-2xl px-5 py-4 text-sm font-bold text-[#334155] focus:outline-none focus:ring-4 focus:ring-[#4b7bff]/10 focus:bg-white focus:border-[#4b7bff]/30 transition-all shadow-sm"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end pt-6 border-t border-white/40">
            <button className="px-8 py-4 bg-[#4b7bff] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#4b7bff]/20 hover:scale-105 active:scale-95 transition-all">
              Update Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

