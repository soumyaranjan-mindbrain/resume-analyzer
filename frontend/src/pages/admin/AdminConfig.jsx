import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Briefcase, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import apiClient from '../../services/api';

const AdminConfig = () => {
    const [activeTab, setActiveTab] = useState('tracks');
    const [tracks, setTracks] = useState([]);
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTrack, setNewTrack] = useState({ name: '', skills: '' });

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const [tracksRes, promptsRes] = await Promise.all([
                apiClient.get('/config/tracks'),
                apiClient.get('/config/prompts')
            ]);

            if (tracksRes.data.success) setTracks(tracksRes.data.tracks);
            if (promptsRes.data.success) setPrompts(promptsRes.data.prompts);
        } catch (error) {
            toast.error("Failed to load configuration");
        } finally {
            setLoading(false);
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
                fetchConfig();
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
                fetchConfig();
            }
        } catch (error) {
            toast.error("Failed to create track");
        }
    };

    const handleDeleteTrack = async (id) => {
        if (!window.confirm("Are you sure you want to deactivate this track?")) return;
        try {
            const res = await apiClient.delete(`/config/tracks/${id}`);
            if (res.data.success) {
                toast.success("Track deactivated");
                fetchConfig();
            }
        } catch (error) {
            toast.error("Failed to delete track");
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
            </div>

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
            ) : (
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
            )}
        </div>
    );
};

export default AdminConfig;
