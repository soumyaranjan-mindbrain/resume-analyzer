import React from 'react';

const SlimFooter = () => {
    return (
        <div className="w-full py-2.5 bg-white/50 backdrop-blur-md border-t border-slate-100/50 flex items-center justify-center shrink-0 relative z-20">
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span>made by</span>
                <a
                    href="https://mindbrain.co.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-all hover:tracking-[0.25em] duration-500 italic"
                >
                    MindBrain Innovation Pvt ltd
                </a>
            </p>
        </div>
    );
};

export default SlimFooter;
