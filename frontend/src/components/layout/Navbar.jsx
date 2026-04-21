import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import Logo from '../common/Logo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [];

  const isLandingPage = location.pathname === '/';

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[var(--neutral-50)]/80 backdrop-blur-xl py-1 shadow-md border-b border-white/40"
          : "bg-transparent py-1.5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        <Logo size="sm" onClick={() => navigate('/')} />


        {isLandingPage && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-[var(--neutral-600)] hover:text-[var(--primary-600)] transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-gradient)] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>
        )}


        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('/auth?mode=login')}
            className="text-sm font-bold text-[var(--neutral-600)] hover:text-[var(--neutral-900)] transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="btn-mindvista !py-2.5 !px-6 !text-xs !rounded-xl"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>


        <div className="md:hidden flex items-center justify-center">
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="btn-mindvista !py-1.5 !px-4 !text-[9px] !rounded-lg"
          >
            Get Started
          </button>
        </div>
      </div>



      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white border-b border-[var(--neutral-200)] shadow-lg overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {isLandingPage && navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-bold text-neutral-600 hover:text-[var(--primary-600)] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-4">
                <button
                  onClick={() => { navigate('/auth?mode=login'); setMobileOpen(false); }}
                  className="w-full py-4 rounded-2xl border border-[var(--neutral-200)] text-neutral-600 font-bold"
                >
                  Log in
                </button>
                <button
                  onClick={() => { navigate('/auth?mode=signup'); setMobileOpen(false); }}
                  className="btn-mindvista w-full"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

