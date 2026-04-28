import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

const PremiumSelect = ({
    options,
    value,
    onChange,
    icon: Icon,
    className,
    placeholder = "Select option"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={cn("relative min-w-[240px]", className)} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-3 px-4 py-2.5 bg-white border rounded-xl shadow-sm transition-all duration-300 w-full group",
                    isOpen ? "border-blue-500 ring-4 ring-blue-500/5 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                )}
            >
                {Icon && <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />}
                <span className="text-[13px] font-black text-slate-700 flex-1 text-left tracking-tight">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 opacity-50 transition-transform duration-500", isOpen && "rotate-180 opacity-100 text-blue-500")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] py-2 z-[60] animate-in fade-in slide-in-from-top-4 duration-500 zoom-in-95">
                    <div className="max-h-72 overflow-y-auto custom-scrollbar">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-5 py-3 text-xs font-black transition-all duration-300",
                                    opt.value === value
                                        ? "text-blue-600 bg-blue-50/50"
                                        : "text-slate-500 hover:bg-slate-50 hover:pl-6"
                                )}
                            >
                                <span className="uppercase tracking-widest leading-none">{opt.label}</span>
                                {opt.value === value && (
                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 animate-in zoom-in duration-300">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumSelect;
