import React, { useState, useEffect } from 'react';
import {
  Globe,
  Power,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { deleteAllData, getConfig, updateConfig } from '../../services/api';
import { useConfig } from '../../context/ConfigContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { refreshConfig } = useConfig();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');
  const [loading, setLoading] = useState({
    delete: false,
    config: true,
    toggle: false
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        setIsMaintenance(data.config?.maintenanceMode || false);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      } finally {
        setLoading(prev => ({ ...prev, config: false }));
      }
    };
    fetchConfig();
  }, []);

  const handleToggleMaintenance = async () => {
    setLoading(prev => ({ ...prev, toggle: true }));
    try {
      const newStatus = !isMaintenance;
      await updateConfig({ maintenanceMode: newStatus });
      setIsMaintenance(newStatus);
      await refreshConfig(); // Immediate sync
      toast.success(`Maintenance mode ${newStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update maintenance mode');
    } finally {
      setLoading(prev => ({ ...prev, toggle: false }));
    }
  };


  const handleDeleteAll = async () => {
    if (purgeConfirmText !== 'DELETE ALL') {
      toast.error('Confirmation text mismatch');
      return;
    }

    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await deleteAllData();
      toast.success('All platform data has been purged');
      setShowPurgeModal(false);
      setPurgeConfirmText('');
    } catch (error) {
      toast.error('Failed to delete platform data');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">

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
              <p className="text-sm font-bold text-slate-700">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Disable platform access for non-admin users during updates.</p>
            </div>
            <button
              onClick={handleToggleMaintenance}
              disabled={loading.toggle || loading.config}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isMaintenance ? 'bg-blue-600 shadow-inner' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${isMaintenance ? 'left-7' : 'left-1'}`} />
              {loading.toggle && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-full">
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                </div>
              )}
            </button>
          </div>
        </div>
      </section>

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
                <p className="text-sm font-bold text-red-900">Purge All Data</p>
                <p className="text-xs text-red-700/70 mt-1 max-w-md">This will permanently delete all student resumes, analysis history, and generated reports. This action cannot be undone.</p>
              </div>
              {!showPurgeModal ? (
                <button
                  onClick={() => setShowPurgeModal(true)}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
                >
                  Clear All Data
                </button>
              ) : (
                <button
                  onClick={() => { setShowPurgeModal(false); setPurgeConfirmText(''); }}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
              )}
            </div>

            {showPurgeModal && (
              <div className="mt-4 p-6 bg-white border-2 border-red-100 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-50 rounded-lg shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Are you absolutely sure?</p>
                    <p className="text-xs text-slate-500 mt-1">This action is irreversible. Please type <span className="font-mono font-bold text-red-600 bg-red-50 px-1 rounded">DELETE ALL</span> to confirm and proceed with the platform purge.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder='Type "DELETE ALL" here'
                    value={purgeConfirmText}
                    onChange={(e) => setPurgeConfirmText(e.target.value)}
                    className="flex-1 h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all outline-none"
                  />
                  <button
                    onClick={handleDeleteAll}
                    disabled={loading.delete || purgeConfirmText !== 'DELETE ALL'}
                    className="h-11 px-8 bg-red-600 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] hover:bg-red-700 disabled:opacity-30 disabled:grayscale transition-all shadow-md shadow-red-600/10 flex items-center justify-center gap-2"
                  >
                    {loading.delete ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Purge'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

    </div >
  );
};

export default Settings;
