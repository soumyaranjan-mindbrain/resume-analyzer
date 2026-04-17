import React, { useEffect, useRef } from 'react';
import {
    Activity,
    Loader2,
    CheckCircle2,
    Cpu,
    BrainCircuit,
    Network
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { cn } from '../../utils/cn';
import gsap from 'gsap';

const NeuralAnalysisOverlay = () => {
    const { isAnalyzing, progress, status, file, cancelAnalysis } = useAnalysis();
    const overlayRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        if (isAnalyzing) {
            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
            gsap.fromTo(cardRef.current, { scale: 0.95, opacity: 0, y: 10 }, { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });
        }
    }, [isAnalyzing]);

    if (!isAnalyzing) return null;

    const stages = [
        { id: 'uploading', label: 'Transmitting', icon: Network },
        { id: 'parsing', label: 'Processing', icon: BrainCircuit },
        { id: 'generating', label: 'Calibrating', icon: Cpu }
    ];

    const currentStageIndex = stages.findIndex(s => s.id === status);

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-500/10 backdrop-blur-sm transition-all">
            <div ref={cardRef} className="relative w-full max-w-lg bg-white border border-white rounded-[2.5rem] p-10 lg:p-14 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden">

                {/* Surface Gradients */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-50/50 blur-[100px] rounded-full" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-50/50 blur-[100px] rounded-full" />

                <div className="relative z-10 space-y-10">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-[0.3em] mb-2">
                            <Activity className="w-3 h-3 animate-pulse" /> Neural Calibration
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-none">Analyzing Profile</h2>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{file?.name || 'resume_payload.pdf'}</p>
                    </div>

                    {/* Progress Engine */}
                    <div className="space-y-6">
                        <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                            {isAnalyzing && (
                                <div className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[30deg] animate-shimmer" />
                            )}
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {status === 'uploading' ? 'Transmitting Data...' :
                                        status === 'parsing' ? 'Deep Parse Active...' :
                                            'Strategic Synthesis...'}
                                </span>
                            </div>
                            <span className="text-xl font-black text-slate-800 leading-none tracking-tighter">{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* Simple Stages */}
                    <div className="grid grid-cols-3 gap-6 pt-2 border-t border-slate-50">
                        {stages.map((stage, i) => {
                            const isActive = status === stage.id;
                            const isCompleted = currentStageIndex > i;

                            return (
                                <div key={stage.id} className="text-center space-y-2">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl mx-auto flex items-center justify-center transition-all duration-300 border",
                                        isActive ? "bg-white border-blue-500 text-blue-600 shadow-md scale-110" :
                                            isCompleted ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                                                "bg-slate-50 border-slate-100 text-slate-300"
                                    )}>
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <stage.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />}
                                    </div>
                                    <p className={cn("text-[9px] font-bold uppercase tracking-wider", isActive ? "text-slate-800" : "text-slate-300")}>{stage.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                        <button
                            onClick={cancelAnalysis}
                            className="w-full py-4 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-colors bg-slate-50 hover:bg-slate-100 rounded-2xl"
                        >
                            Cancel Analysis
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-200%) skewX(-30deg); }
                    100% { transform: translateX(500%) skewX(-30deg); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                }
            `}} />
        </div>
    );
};

export default NeuralAnalysisOverlay;
