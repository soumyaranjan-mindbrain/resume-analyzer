import React from 'react';
import { cn } from '../../utils/cn';

const Logo = ({ className = '', size = 'md', onClick }) => {
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
    xl: 'h-32'
  };

  return (
    <div
      className={cn("flex items-center justify-center cursor-pointer group overflow-hidden relative", sizeClasses[size], className)}
      onClick={onClick}
    >
      <img
        src="/mindvista_logo_wide.png"
        alt="MindVista Logo"
        style={{
          imageRendering: '-webkit-optimize-contrast',
          mixBlendMode: 'multiply',
          objectFit: 'cover',
          objectPosition: 'center',
          height: '250%' // Super-fill crop
        }}
        className={cn(
          "w-auto transition-transform duration-500 group-hover:scale-[1.1] filter contrast-[1.1] saturate-[1.05] brightness-[1.1] drop-shadow-sm"
        )}
      />
    </div>
  );
};

export default Logo;
