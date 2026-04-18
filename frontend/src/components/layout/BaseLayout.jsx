import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SlimFooter from './SlimFooter';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const BaseLayout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-transparent text-[var(--neutral-900)] selection:bg-[var(--primary-100)] selection:text-[var(--neutral-900)] flex flex-col">
      {!isAuthPage && <Navbar />}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn("flex-grow flex flex-col", (!isLandingPage && !isAuthPage) && "pt-24")}
      >
        {children}
      </motion.main>
      {!isAuthPage && <Footer />}
      <SlimFooter />
    </div>
  );
};

export default BaseLayout;

