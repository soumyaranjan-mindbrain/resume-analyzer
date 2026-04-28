import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Save, Plus, Trash2, Briefcase, AlertCircle, RefreshCw, ShieldAlert, Power, Database } from 'lucide-react';

import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { useAnalysis } from '../../context/AnalysisContext';
import apiClient from '../../services/api';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminConfig = () => {
    const { fetchDashboardData, fetchHistory, fetchJobs, fetchSkillInsights } = useAnalysis();
    const [activeTab, setActiveTab] = useState('tracks');
    const [tracks, setTracks] = useState([]);
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTrack, setNewTrack] = useState({ name: '', skills: '' });
    const [systemConfig, setSystemConfig] = useState({ maintenanceMode: false });
    const [purgeLoading, setPurgeLoading] = useState(false);
    const [showPurgeModal, setShowPurgeModal] = useState(false);
    const [purgeConfirmText, setPurgeConfirmText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [trackToDelete, setTrackToDelete] = useState(null);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);


    const fetchConfig = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [tracksRes, promptsRes, systemRes] = await Promise.all([
                apiClient.get('/config/tracks'),
                apiClient.get('/config/prompts'),
                apiClient.get('/config')
            ]);

            if (tracksRes.data.success) setTracks(tracksRes.data.tracks);
            if (promptsRes.data.success) setPrompts(promptsRes.data.prompts);
            if (systemRes.data.success) setSystemConfig(systemRes.data.config);
        } catch (error) {
            toast.error("Failed to load configuration");
        } finally {
            if (!silent) setLoading(false);
        }
    };


    useEffect(() => {
        fetchConfig();
    }, []);

    const handleUpdatePrompt = async (key, content) => {
        try {
            const res = await apiClient.put(`/config/prompts/${key}`, { content });
            if (res.data.success) {
                toast.success("Prompt updated successfully");
                fetchConfig(true);
            }
        } catch (error) {
            toast.error("Failed to update prompt");
        }
    };

    const handleCreateTrack = async () => {
        if (!newTrack.name || !newTrack.skills) return toast.error("Please fill all fields");
        try {
            const res = await apiClient.post('/config/tracks', {
                name: newTrack.name,
                skills: newTrack.skills.split(',').map(s => s.trim())
            });
            if (res.data.success) {
                toast.success("Track created");
                setNewTrack({ name: '', skills: '' });
                fetchConfig(true);
            }
        } catch (error) {
            toast.error("Failed to create track");
        }
    };

    const handleDeleteTrack = (id) => {
        setTrackToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteTrack = async () => {
        if (!trackToDelete) return;
        try {
            const res = await apiClient.delete(`/config/tracks/${trackToDelete}`);
            if (res.data.success) {
                toast.success("Track deactivated");
                fetchConfig(true);
            }
        } catch (error) {
            toast.error("Failed to delete track");
        } finally {
            setShowDeleteModal(false);
            setTrackToDelete(null);
        }
    };

    const handleToggleMaintenance = () => {
        setShowMaintenanceModal(true);
    };

    const confirmToggleMaintenance = async () => {
        try {
            const res = await apiClient.put('/config', { maintenanceMode: !systemConfig.maintenanceMode });
            if (res.data.success) {
                setSystemConfig(res.data.config);
                toast.success(`Maintenance mode ${res.data.config.maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
                fetchConfig(true);
            }
        } catch (error) {
            toast.error("Failed to update system status");
        } finally {
            setShowMaintenanceModal(false);
        }
    };

    const handlePurgePlatform = () => {
        setShowPurgeModal(true);
        setPurgeConfirmText('');
    };

    const handleConfirmPurge = async () => {
        if (purgeConfirmText !== 'DELETE ALL') return;

        setPurgeLoading(true);
        try {
            const res = await apiClient.post('/config/purge');
            if (res.data.success) {
                toast.success("Platform has been purged successfully");
                setShowPurgeModal(false);
                fetchConfig();
                // Sync all student-facing data after purge
                fetchDashboardData(true);
                fetchHistory(true);
                fetchJobs(true);
                fetchSkillInsights(true);
            }
        } catch (error) {
            toast.error("Failed to purge platform data");
        } finally {
            setPurgeLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Tab Navigation */}
            <div className="flex gap-4 p-1.5 bg-white/50 backdrop-blur-xl border border-white rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('tracks')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                        activeTab === 'tracks' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-white hover:text-slate-900"
                    )}
                >
                    Job Tracks
                </button>
                <button
                    onClick={() => setActiveTab('prompts')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                        activeTab === 'prompts' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-white hover:text-slate-900"
                    )}
                >
                    AI Prompts
                </button>
                <button
                    onClick={() => setActiveTab('system')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                        activeTab === 'system' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-white hover:text-slate-900"
                    )}
                >
                    System
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
                {activeTab === 'tracks' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Create New Track */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] sticky top-8">
                                <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight italic">
                                    Add <span className="text-blue-600">New Track</span>
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Role Name</label>
                                        <input
                                            type="text"
                                            value={newTrack.name}
                                            onChange={(e) => setNewTrack({ ...newTrack, name: e.target.value })}
                                            placeholder="e.g. Flutter Developer"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Required Skills (Comma separated)</label>
                                        <textarea
                                            rows={4}
                                            value={newTrack.skills}
                                            onChange={(e) => setNewTrack({ ...newTrack, skills: e.target.value })}
                                            placeholder="React, Firebase, Dart, UI/UX"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleCreateTrack}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                                    >
                                        <Plus className="w-4 h-4" /> Save Track
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tracks List */}
                        <div className="lg:col-span-2 space-y-4">
                            {tracks.map((track) => (
                                <div key={track.id} className="group bg-white/70 backdrop-blur-2xl border border-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors" />
                                    <div className="relative z-10 flex items-start justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <Briefcase className="w-4 h-4" />
                                                </div>
                                                <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight italic">{track.name}</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {track.skills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTrack(track.id)}
                                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'prompts' ? (
                    <div className="space-y-8">

                        {prompts.map((prompt) => (
                            <div key={prompt.id} className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                                            <RefreshCw className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight italic">{prompt.key}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AI Context Instruction Template</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUpdatePrompt(prompt.key, document.getElementById(`prompt-${prompt.key}`).value)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                    >
                                        <Save className="w-4 h-4" /> Save Template
                                    </button>
                                </div>
                                <textarea
                                    id={`prompt-${prompt.key}`}
                                    defaultValue={prompt.content}
                                    rows={6}
                                    className="w-full px-6 py-6 bg-slate-900/5 border border-slate-100 rounded-[2rem] text-sm font-mono text-slate-700 leading-relaxed focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
                                />
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest px-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Tip: Use plain text instruction. Variables will be injected automatically by the system.
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Maintenance Mode Card */}
                        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                                    <ShieldAlert className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-2xl uppercase tracking-tight italic">Maintenance <span className="text-amber-600">Mode</span></h4>
                                    <p className="text-sm font-medium text-slate-500 mt-2">When enabled, students and guests will be blocked from accessing the platform. Only admins can enter.</p>
                                </div>
                            </div>

                            <div className="mt-10 flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</span>
                                    <span className={cn(
                                        "text-sm font-black uppercase tracking-wider",
                                        systemConfig.maintenanceMode ? "text-amber-600" : "text-emerald-600"
                                    )}>
                                        {systemConfig.maintenanceMode ? "Platform Offline" : "Platform Live"}
                                    </span>
                                </div>
                                <button
                                    onClick={handleToggleMaintenance}
                                    className={cn(
                                        "flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                                        systemConfig.maintenanceMode
                                            ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700"
                                            : "bg-amber-600 text-white shadow-amber-600/20 hover:bg-amber-700"
                                    )}
                                >
                                    <Power className="w-4 h-4" />
                                    {systemConfig.maintenanceMode ? "Go Live" : "Shut Down"}
                                </button>
                            </div>
                        </div>

                        {/* Purge Platform Card */}
                        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                                    <Database className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-2xl uppercase tracking-tight italic">Purge <span className="text-red-600">Platform Data</span></h4>
                                    <p className="text-sm font-medium text-slate-500 mt-2">Permanently remove all student records, resumes, and analysis reports. Use with extreme caution during development staging.</p>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-slate-100">
                                <button
                                    onClick={handlePurgePlatform}
                                    disabled={purgeLoading}
                                    className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2rem] hover:bg-red-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 active:scale-95"
                                >
                                    {purgeLoading ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" /> Purge Everything
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Purge Confirmation Modal */}
                {showPurgeModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setShowPurgeModal(false)} />
                        <div className="bg-white rounded-[2.5rem] border border-white shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                            <div className="p-8 space-y-6">
                                <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-red-100">
                                    <ShieldAlert className="w-10 h-10" />
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Platform <span className="text-red-600">Purge</span></h3>
                                    <p className="text-sm font-bold text-slate-500">This action is <span className="text-red-600 underline">irreversible</span>. All non-admin data will be lost forever.</p>
                                </div>

                                <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100/50">
                                    <ul className="text-[10px] font-black text-red-700 uppercase tracking-widest space-y-2">
                                        <li className="flex items-center gap-2">• Deletes all student accounts</li>
                                        <li className="flex items-center gap-2">• Wipes all resume files</li>
                                        <li className="flex items-center gap-2">• Destroys all analysis reports</li>
                                        <li className="flex items-center gap-2">• Keeps admin dashboard settings</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-center">Type <span className="text-slate-900 underline">DELETE ALL</span> to confirm</label>
                                    <input
                                        type="text"
                                        value={purgeConfirmText}
                                        onChange={(e) => setPurgeConfirmText(e.target.value)}
                                        placeholder="DELETE ALL"
                                        className="w-full px-6 py-4 bg-red-50/50 border-2 border-red-500 rounded-2xl text-center font-black text-slate-900 placeholder:text-red-200 focus:bg-white transition-all outline-none shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowPurgeModal(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmPurge}
                                        disabled={purgeConfirmText !== 'DELETE ALL' || purgeLoading}
                                        className="flex-[1.5] py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale shadow-lg shadow-red-600/20"
                                    >
                                        {purgeLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "Confirm Purge"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDeleteTrack}
                    title="Deactivate Track?"
                    message="This role will no longer be visible to students during resume analysis. You can re-activate it later from the database."
                    confirmText="Deactivate"
                    type="danger"
                />

                <ConfirmModal
                    isOpen={showMaintenanceModal}
                    onClose={() => setShowMaintenanceModal(false)}
                    onConfirm={confirmToggleMaintenance}
                    title={systemConfig.maintenanceMode ? "Disable Maintenance?" : "Enable Maintenance?"}
                    message={systemConfig.maintenanceMode
                        ? "The platform will become accessible to all students again. Are you sure?"
                        : "All non-admin users will be blocked from accessing the platform. Use this for system updates."}
                    confirmText={systemConfig.maintenanceMode ? "Go Live" : "Shut Down"}
                    type={systemConfig.maintenanceMode ? "success" : "warning"}
                />
            </div>
        </div>
    );
};

export default AdminConfig;
