import React from 'react';
import { cn } from '../../utils/cn';

const Logo = ({ className = '', size = 'md', onClick }) => {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14',
    xl: 'h-18'
  };

  return (
    <div 
      className={cn("flex items-center cursor-pointer group", className)}
      onClick={onClick}
    >
      <img 
        src="/Kredo_logo_with_educational_theme-removebg-preview.png" 
        alt="Kredo Logo" 
        style={{ imageRendering: '-webkit-optimize-contrast' }}
        className={cn(
          "w-auto transition-transform duration-500 group-hover:scale-105 filter contrast-[1.08] saturate-[1.02] brightness-[1.01] drop-shadow-sm", 
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export default Logo;
