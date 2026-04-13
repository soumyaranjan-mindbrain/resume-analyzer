import React, { useState } from 'react';
import { 
  Shield, 
  Globe, 
  Cpu, 
  Zap,
  Power,
  Download,
  Upload,
  RefreshCw,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { exportData, importData, resetSettings, deleteAllData } from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState({
    export: false,
    import: false,
    reset: false,
    delete: false
  });

  const handleExport = async () => {
    setLoading(prev => ({ ...prev, export: true }));
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `platform-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Platform data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(prev => ({ ...prev, export: false }));
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(prev => ({ ...prev, import: true }));
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = JSON.parse(event.target.result);
          await importData(content);
          toast.success('Platform data imported successfully');
        } catch (err) {
          toast.error('Invalid backup file format');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error('Failed to import data');
    } finally {
      setLoading(prev => ({ ...prev, import: false }));
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all platform configurations to default?')) return;
    
    setLoading(prev => ({ ...prev, reset: true }));
    try {
      await resetSettings();
      toast.success('Platform settings reset successfully');
    } catch (error) {
      toast.error('Failed to reset settings');
    } finally {
      setLoading(prev => ({ ...prev, reset: false }));
    }
  };

  const handleDeleteAll = async () => {
    const userInput = window.prompt('DANGER: This will permanently delete ALL platform data (Users, Resumes, Reports). This cannot be undone. Type "DELETE ALL" to confirm:');
    
    if (userInput !== 'DELETE ALL') {
      if (userInput !== null) toast.error('Confirmation text mismatch. Deletion cancelled.');
      return;
    }

    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await deleteAllData();
      toast.success('All platform data has been purged');
    } catch (error) {
      toast.error('Failed to delete platform data');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">Data Management</p>
                <p className="text-xs text-slate-500">Backup or restore entire platform database state.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleExport}
                  disabled={loading.export}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  title="Export Data"
                >
                  {loading.export ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                </button>
                <label className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                  {loading.import ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <input type="file" className="hidden" onChange={handleImport} accept=".json" />
                </label>
              </div>
            </div>
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

          <div className="bg-red-50/30 rounded-xl border border-red-100 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-red-900">Reset Platform Configurations</p>
                <p className="text-xs text-red-700/70 mt-1 max-w-md">Restore all system settings, API configurations, and platform defaults. Student data will remain intact.</p>
              </div>
              <button 
                onClick={handleReset}
                disabled={loading.reset}
                className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
              >
                {loading.reset && <Loader2 className="w-3 h-3 animate-spin" />}
                Reset Defaults
              </button>
            </div>

            <div className="pt-6 border-t border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-red-900">Purge All Data</p>
                <p className="text-xs text-red-700/70 mt-1 max-w-md">This will permanently delete all student resumes, analysis history, and generated reports. This action cannot be undone.</p>
              </div>
              <button 
                onClick={handleDeleteAll}
                disabled={loading.delete}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
              >
                {loading.delete && <Loader2 className="w-3 h-3 animate-spin" />}
                Clear All Data
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default Settings;
