import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, PenTool as Tool, Clock, ShieldAlert } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';

const Maintenance = () => {
    const { maintenanceMode, loading } = useConfig();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !maintenanceMode) {
            const target = user?.role === 'admin' ? '/admin' : '/dashboard';
            navigate(target, { replace: true });
        }
    }, [maintenanceMode, loading, user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-2xl w-full text-center space-y-10">
                <div className="relative inline-block">
                    <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-bounce">
                        <Settings className="w-12 h-12 text-white animate-[spin_4s_linear_infinite]" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100">
                        <Tool className="w-5 h-5 text-blue-600" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">
                        System <span className="text-blue-600">Evolution</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.3em] opacity-80">
                        Enhancing your professional intelligence engine
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-center gap-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                    <Clock className="w-6 h-6 text-slate-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time to Resume</span>
                                <span className="text-sm font-bold text-slate-800 tracking-tight">~ 20 Minutes</span>
                            </div>
                            <div className="w-px h-12 bg-slate-100" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                    <ShieldAlert className="w-6 h-6 text-slate-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strict Status</span>
                                <span className="text-sm font-bold text-slate-800 tracking-tight">Active Upgrade</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <p className="text-slate-600 font-medium leading-relaxed">
                                We are currently performing scheduled maintenance to deploy mission-critical updates to the AI analysis core. Access for standard users is temporarily suspended to ensure data integrity during migration.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                Backend Syncing in Progress
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <span>MBI Resume Analyzer</span>
                    <span>&copy; 2026 Enterprise Systems</span>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
