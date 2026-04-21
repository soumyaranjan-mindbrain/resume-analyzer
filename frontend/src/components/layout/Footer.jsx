import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Logo from '../common/Logo';


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

  const footerLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ];

  return (
    <footer className="relative bg-[#f8fafc] border-t border-slate-200 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Legal Link Hybrid */}
          <div className="flex items-center gap-8">
            <Logo
              size="sm"
              className="grayscale hover:grayscale-0 transition-all duration-700"
              onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
            />
            <div className="hidden sm:flex items-center gap-6">
              {footerLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    if (link.path !== '#') navigate(link.path);
                    window.scrollTo(0, 0);
                  }}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Copyright */}
          <div className="px-5 py-1.5 bg-white/50 backdrop-blur-xl border border-white rounded-full shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
              © {currentYear} MindVista
            </p>
          </div>

          {/* Mobile Links */}
          <div className="flex sm:hidden items-center gap-6">
            {footerLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  if (link.path !== '#') navigate(link.path);
                  window.scrollTo(0, 0);
                }}
                className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

