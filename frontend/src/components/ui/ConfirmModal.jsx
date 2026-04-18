import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const themes = {
        danger: {
            icon: AlertTriangle,
            iconBg: 'bg-red-50 text-red-600 border-red-100',
            button: 'bg-red-600 hover:bg-red-700 shadow-red-200',
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
            button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
        },
        success: {
            icon: CheckCircle2,
            iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
        }
    };

    const theme = themes[type] || themes.danger;
    const Icon = theme.icon;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 lg:p-10 space-y-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 mb-2 shadow-inner", theme.iconBg)}>
                            <Icon className="w-10 h-10 transition-transform group-hover:scale-110" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{title}</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed">{message}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={cn(
                                "w-full py-5 text-white rounded-[1.8rem] font-black text-base uppercase tracking-widest shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95",
                                theme.button
                            )}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-5 text-slate-400 bg-slate-50 hover:bg-slate-100 rounded-[1.8rem] font-black text-base uppercase tracking-widest transition-all duration-300"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
