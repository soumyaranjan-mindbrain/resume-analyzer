import React from 'react';
import { 
  Shield, 
  Globe, 
  Cpu, 
  Zap,
  Power
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
      
      {/* API Configuration Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
            <Cpu className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">API Configuration</h3>
            <p className="text-sm text-slate-500">Manage external service integrations and security keys.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Security Note</p>
                <p className="text-xs text-blue-700/70">API keys provide administrative access to AI services. Ensure they are kept confidential and rotated regularly if compromised.</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-md border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <Shield className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Groq API Key</p>
                  <p className="text-sm font-medium text-slate-600 font-mono mt-0.5">••••••••••••••••••••••••</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md font-semibold text-xs hover:bg-slate-50 transition-all">
                  Change Key
                </button>
                <button className="px-4 py-1.5 bg-white border border-slate-200 text-red-600 rounded-md font-semibold text-xs hover:bg-red-50 hover:text-red-200 transition-all">
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Controls Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
            <Globe className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Platform Control</h3>
            <p className="text-sm text-slate-500">Configure global behavior and display settings for all users.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-700">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Disable platform access for non-admin users during updates.</p>
            </div>
            <button className="w-10 h-5 bg-slate-200 rounded-full relative transition-all">
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 px-1">
        <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          Discard Changes
        </button>
        <button className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
          Save Settings
        </button>
      </div>

      <div className="border-t border-slate-200 pt-8">
        {/* Danger Zone Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <Power className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-700">Danger Zone</h3>
              <p className="text-sm text-slate-500">Critical actions that affect system-wide data integrity.</p>
            </div>
          </div>

          <div className="bg-red-50/30 rounded-xl border border-red-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-red-900">Reset Platform Data</p>
              <p className="text-xs text-red-700/70 mt-1 max-w-md">This will permanently delete all student resumes, analysis history, and generated reports. This action cannot be undone.</p>
            </div>
            <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap">
              Clear All Data
            </button>
          </div>
        </section>
      </div>

    </div>
  );
};

export default Settings;
