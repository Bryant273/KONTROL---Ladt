import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function Logo({ 
  className, 
  iconClassName, 
  textClassName, 
  showText = true 
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className={cn("relative flex items-center justify-center shrink-0", iconClassName)}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          <path 
            d="M20 4H8C5.79086 4 4 5.79086 4 8V20" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </svg>
      </motion.div>
      
      {showText && (
        <span className={cn(
          "font-black tracking-tighter text-2xl uppercase", 
          textClassName
        )}>
          UNIKORP
        </span>
      )}
    </div>
  );
}
