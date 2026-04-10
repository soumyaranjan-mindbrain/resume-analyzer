import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';


const TwitterIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Resources: ['Blog', 'Success Stories', 'Documentation', 'API'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Settings'],
  };

  return (
    <footer className="bg-[var(--neutral-100)] border-t border-white pt-20 pb-10 overflow-hidden relative">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8 mb-20">
          
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <img 
                src="/Kredo_logo_with_educational_theme-removebg-preview.png" 
                alt="Kredo Logo" 
                className="h-10 w-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-[var(--neutral-500)] font-medium leading-relaxed max-w-xs">
              AI-driven career acceleration for the modern professional. Built for depth, clarity, and results.
            </p>
            <div className="flex gap-4">
              {[
                { icon: TwitterIcon, label: 'Twitter' },
                { icon: GithubIcon, label: 'Github' },
                { icon: LinkedinIcon, label: 'Linkedin' },
                { icon: Mail, label: 'Mail' }
              ].map(({ icon: Icon, label }, i) => (
                <button 
                  key={i} 
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white border border-white flex items-center justify-center text-[var(--neutral-400)] hover:text-[var(--primary-600)] shadow-[4px_4px_10px_rgba(0,0,0,0.04)] transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
                <h4 className="text-xs font-black text-[var(--neutral-900)] uppercase tracking-widest">{title}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-sm text-[var(--neutral-500)] font-bold hover:text-[var(--primary-600)] transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
            </div>
          ))}
        </div>

        
        <div className="pt-10 border-t border-white/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] text-[var(--neutral-400)] font-black uppercase tracking-widest">
            © {currentYear} Kredo AI Technologies.
          </p>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 border border-white shadow-[inset_2px_2px_6px_rgba(0,0,0,0.02)]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] text-[var(--neutral-500)] font-black uppercase tracking-widest">
              Engine Pulse: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;

