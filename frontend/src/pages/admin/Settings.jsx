import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Database, 
  Globe, 
  Shield, 
  Zap, 
  Bell, 
  CreditCard, 
  Key, 
  Cpu, 
  Maximize2,
  Trash2,
  Save
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-12 gap-10">
        {/* Navigation */}
        <div className="col-span-3 bg-[#0D1117] border border-white/[0.04] rounded-[2.5rem] p-10 space-y-6">
          <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.2em] mb-10">Admin Settings</h4>
          {[
            { icon: User, label: 'Manage Accounts' },
            { icon: Cpu, label: 'AI Configuration' },
            { icon: Globe, label: 'Platform Settings' },
            { icon: Shield, label: 'Data & Privacy' },
            { icon: Key, label: 'API Management' },
            { icon: Bell, label: 'Notifications' },
          ].map((item, i) => (
             <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 group ${i === 0 ? 'bg-[#00D2FF]/5 border border-[#00D2FF]/10 text-[#00D2FF]' : 'text-gray-600 hover:text-white hover:bg-white/[0.02]'}`}>
                <item.icon className="w-5 h-5 text-gray-700 group-hover:text-[#00D2FF] transition-colors" />
                <span className="text-[13px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="col-span-9 space-y-10">
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D1117] border border-white/[0.04] rounded-[3rem] p-12"
           >
              <div className="flex justify-between items-center mb-16 px-2">
                 <div>
                    <h3 className="text-xl font-black text-white tracking-tight text-[22px]">AI Model Configuration</h3>
                    <p className="text-[13px] text-gray-600 font-bold mt-1 uppercase tracking-widest">Connect and tune AI service providers.</p>
                 </div>
                 <button className="flex items-center gap-3 px-8 py-4 bg-[#00D2FF] text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all">
                    <Save className="w-4 h-4" /> Save Changes
                 </button>
              </div>

              <div className="space-y-12 max-w-2xl">
                 <div className="grid grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] px-1">Selected Model Provider</p>
                      <div className="relative group">
                        <select className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-black text-white appearance-none focus:outline-none focus:border-[#00D2FF]/20">
                          <option>Gemini 1.5 Pro</option>
                          <option>GPT-4o Turbo</option>
                          <option>Claude 3.5 Sonnet</option>
                        </select>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] px-1">Analysis Precision Level</p>
                      <div className="relative group">
                        <select className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-black text-white appearance-none focus:outline-none focus:border-[#00D2FF]/20">
                          <option>Balanced (Default)</option>
                          <option>Extra Strict (Deep Scan)</option>
                          <option>Fast (Surface Level)</option>
                        </select>
                      </div>
                   </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                       <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">API Key Authorization</p>
                       <span className="text-[11px] font-black text-[#00D2FF] bg-[#00D2FF]/10 px-3 py-1 rounded-lg">SB_PUBLISHABLE_...</span>
                    </div>
                    <div className="relative group">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-[#00D2FF]" />
                       <input type="password" value="****************************************" className="w-full bg-black/20 border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-[14px] text-white focus:outline-none focus:border-[#00D2FF]/20" readOnly />
                       <button className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#00D2FF] uppercase hover:underline">Reveal Key</button>
                    </div>
                 </div>

                 <div className="space-y-6 pt-10 border-t border-white/[0.04]">
                     <div className="flex items-center justify-between px-2">
                        <div>
                           <p className="text-[14px] font-black text-white mb-0.5 tracking-tight">Anomalous Activity Shield</p>
                           <p className="text-[12px] text-gray-600 font-bold italic">Auto-detect and block suspicious crawler activity.</p>
                        </div>
                        <div className="w-14 h-7 bg-[#00D2FF]/10 rounded-full p-1 cursor-pointer border border-[#00D2FF]/20 flex items-center shadow-lg shadow-black/40">
                           <div className="w-5 h-5 bg-[#00D2FF] rounded-full ml-auto shadow-[0_0_10px_rgba(0,210,255,0.4)]" />
                        </div>
                     </div>
                      <div className="flex items-center justify-between px-2">
                        <div>
                           <p className="text-[14px] font-black text-white mb-0.5 tracking-tight">Public Result Sharing</p>
                           <p className="text-[12px] text-gray-600 font-bold italic">Allow students to share analysis links externally.</p>
                        </div>
                        <div className="w-14 h-7 bg-white/[0.03] rounded-full p-1 cursor-pointer border border-white/5 flex items-center shadow-lg shadow-black/40">
                           <div className="w-5 h-5 bg-gray-700/50 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
                        </div>
                     </div>
                 </div>
              </div>

               <div className="mt-20 pt-10 border-t border-red-500/10 space-y-6">
                 <h4 className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] px-2 italic">DANGER ZONE</h4>
                 <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 flex items-center justify-between">
                    <div>
                        <p className="text-[14px] font-black text-white tracking-tight">Purge System Cache & Logs</p>
                        <p className="text-[12px] text-gray-600 font-bold">This will permanently delete all temporary system files.</p>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all">
                       <Trash2 className="w-4 h-4" /> Purge Now
                    </button>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
