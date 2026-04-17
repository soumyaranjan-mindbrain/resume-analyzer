import React, { useEffect, useRef } from 'react';
import {
    Zap,
    ShieldCheck,
    Cpu,
    Activity,
    Loader2,
    CheckCircle2,
    FileSearch,
    BrainCircuit,
    Network
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { cn } from '../../utils/cn';
import gsap from 'gsap';

const NeuralAnalysisOverlay = () => {
    const { isAnalyzing, progress, status, file, error, cancelAnalysis } = useAnalysis();
    const overlayRef = useRef(null);
    const cardRef = useRef(null);
    const neuralContainerRef = useRef(null);

    useEffect(() => {
        if (isAnalyzing) {
            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
            gsap.fromTo(cardRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)', delay: 0.2 });

            // Background neural movement
            const particles = neuralContainerRef.current.querySelectorAll('.neural-particle');
            particles.forEach((p, i) => {
                gsap.to(p, {
                    x: `random(-100, 100)`,
                    y: `random(-100, 100)`,
                    duration: `random(3, 5)`,
                    repeat: -1,
                    yoyo: true,
                    ease: 'none'
                });
            });
        }
    }, [isAnalyzing]);

    if (!isAnalyzing) return null;

    const stages = [
        { id: 'uploading', label: 'Transmitting Data', icon: Network, phase: 'Phase 01' },
        { id: 'parsing', label: 'Deep Neural Parse', icon: BrainCircuit, phase: 'Phase 02' },
        { id: 'generating', label: 'Strategic Synthesis', icon: Cpu, phase: 'Phase 03' }
    ];

    const currentStageIndex = stages.findIndex(s => s.id === status);

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl transition-all">
            {/* Neural Background Decor */}
            <div ref={neuralContainerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="neural-particle absolute w-1 h-1 bg-blue-400/20 rounded-full blur-sm"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <div ref={cardRef} className="relative w-full max-w-xl bg-white/10 border border-white/20 rounded-[2.5rem] p-10 lg:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden">
                {/* Accent Gradients */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />

                <div className="relative z-10 space-y-10">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-400/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-2 animate-pulse">
                            <Activity className="w-3 h-3" /> System Status: Optimizing
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight leading-none">Neural Analysis <br /> in Progress</h2>
                        <p className="text-white/50 font-bold text-xs uppercase tracking-widest">{file?.name || 'resume_payload.pdf'}</p>
                    </div>

                    {/* Stage Indicators */}
                    <div className="grid grid-cols-3 gap-4">
                        {stages.map((stage, i) => {
                            const Icon = stage.icon;
                            const isActive = status === stage.id;
                            const isCompleted = currentStageIndex > i;

                            return (
                                <div key={stage.id} className="relative group text-center space-y-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl mx-auto flex items-center justify-center transition-all duration-500 border-2",
                                        isActive ? "bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110" :
                                            isCompleted ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" :
                                                "bg-white/5 border-white/10 text-white/20"
                                    )}>
                                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className={cn("w-6 h-6", isActive ? "text-white animate-pulse" : "")} />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className={cn("text-[8px] font-black uppercase tracking-widest", isActive ? "text-blue-400" : "text-white/30")}>{stage.phase}</p>
                                        <p className={cn("text-[10px] font-bold", isActive ? "text-white" : "text-white/40")}>{stage.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Engine */}
                    <div className="space-y-6 pt-4">
                        <div className="relative h-4 bg-white/5 rounded-full border border-white/10 overflow-hidden group">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                style={{ width: `${progress}%` }}
                            />
                            {/* Scanning Line */}
                            {isActive && (
                                <div className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[30deg] animate-shimmer" />
                            )}
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                                    {status === 'uploading' ? 'Syncing with cloud nodes...' :
                                        status === 'parsing' ? 'Extracting semantic metadata...' :
                                            'Calibrating strategic insights...'}
                                </span>
                            </div>
                            <span className="text-2xl font-black text-white leading-none tracking-tighter">{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="pt-8 text-center">
                        <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto mb-6">
                            Our neural engine is analyzing 240+ variables to ensure your resume is perfectly calibrated for human and ATS perception.
                        </p>
                        <button
                            onClick={cancelAnalysis}
                            className="text-white/40 hover:text-white/80 font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto py-2 px-4 border border-white/10 rounded-xl hover:bg-white/5"
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
