import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Key, 
  Bell, 
  User, 
  Globe, 
  Cpu, 
  Database,
  Lock,
  Mail,
  Zap,
  Power
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { id: 'General', icon: Globe },
    { id: 'Security', icon: Lock },
    { id: 'API Config', icon: Cpu },
    { id: 'Database', icon: Database },
    { id: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-8">
      

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         
         <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-sm text-left group",
                  activeTab === tab.id 
                    ? "bg-cyan-500 text-white shadow-xl shadow-cyan-500/10" 
                    : "text-slate-500 hover:bg-white hover:text-cyan-600"
                )}
              >
                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-blue-400" : "text-slate-300 group-hover:text-slate-900")} />
                {tab.id}
              </button>
            ))}
            
            <div className="pt-8 pb-4">
               <div className="bg-red-50 rounded-[2rem] p-6 border border-red-100 mt-8">
                  <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Power className="w-3 h-3" /> Danger Zone
                  </h5>
                  <p className="text-xs font-bold text-red-400 mb-4">Actions here are permanent and cannot be reversed.</p>
                  <button className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                     Reset Platform
                  </button>
               </div>
            </div>
         </div>

         
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 min-h-[550px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-bl-[8rem] -mr-20 -mt-20 opacity-50" />
            
            <div className="relative z-10 space-y-10">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab} Configuration</h3>
                  <p className="text-slate-400 font-bold text-sm">Overview of {activeTab.toLowerCase()} parameters for the platform.</p>
               </div>

               {activeTab === 'General' && (
                 <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Name</label>
                          <input type="text" defaultValue="Kredo AI Analyzer" className="w-full px-6 py-4 bg-cyan-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Support Email</label>
                          <input type="email" defaultValue="admin@kredo.ai" className="w-full px-6 py-4 bg-cyan-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-inner" />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h5 className="font-black text-slate-900 border-b border-slate-50 pb-4">Display Options</h5>
                       <div className="flex items-center justify-between p-6 bg-cyan-50/50 rounded-3xl border border-slate-100/50">
                          <div>
                             <p className="text-sm font-black text-slate-700">Dark Mode Enforcement</p>
                             <p className="text-xs font-bold text-slate-400">Force system-wide dark theme for all users.</p>
                          </div>
                          <button className="w-12 h-6 bg-slate-200 rounded-full relative transition-all">
                             <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                       </div>
                       <div className="flex items-center justify-between p-6 bg-cyan-50/50 rounded-3xl border border-slate-100/50">
                          <div>
                             <p className="text-sm font-black text-slate-700">Maintenance Mode</p>
                             <p className="text-xs font-bold text-slate-400">Lock the platform for scheduled maintenance.</p>
                          </div>
                          <button className="w-12 h-6 bg-slate-200 rounded-full relative transition-all">
                             <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'API Config' && (
                 <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex gap-4">
                       <Zap className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                       <div>
                          <p className="text-sm font-black text-amber-900">API Key Safety</p>
                          <p className="text-xs font-bold text-amber-700/70">Ensure your API keys are stored securely. Never share these snapshots publicly.</p>
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                       {[
                         { name: 'Gemini API Key', key: '••••••••••••••••••••••••' },
                          { name: 'Supabase URL', key: 'https://xxx-kredo.supabase.co' },
                         { name: 'Supabase Anon Key', key: '••••••••••••••••••••••••' }
                       ].map((item, i) => (
                         <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-blue-100 transition-all group">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-cyan-50 rounded-2xl group-hover:bg-blue-50 transition-all">
                                  <Shield className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</p>
                                  <p className="text-sm font-bold text-slate-600 font-mono mt-1">{item.key}</p>
                               </div>
                            </div>
                            <button className="px-5 py-2.5 bg-cyan-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                               Revoke Key
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-end gap-3 relative z-10">
               <button className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-cyan-50 transition-all">
                  Discard Changes
               </button>
               <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Save Changes
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;



