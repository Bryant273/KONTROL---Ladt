import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export function SplashScreen() {
  const [loadingText, setLoadingText] = useState('Démarrage du système...');
  
  useEffect(() => {
    const texts = [
      'Analyse des bases de données...',
      'Synchronisation du noyau UNIKORP...',
      'Initialisation des couches graphiques...',
      'Chargement de l\'environnement...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999] overflow-hidden">
      {/* Main Content Group */}
      <div className="flex flex-col items-center">
        {/* Logo and Wordmark Side-by-Side */}
        <motion.div 
          animate={{ 
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center gap-6 mb-32"
        >
          {/* Logo Unit */}
          <div className="w-20 h-20 text-brand flex items-center justify-center">
            <Logo showText={false} className="w-full h-full" />
          </div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[32px] font-medium tracking-[0.16em] text-brand uppercase">
              UNIKORP
            </h1>
          </motion.div>
        </motion.div>

        {/* Loading Section */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex flex-col items-center gap-5"
        >
          {/* Track and Fill */}
          <div className="w-[220px] h-[3px] bg-[#f5ede5] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                delay: 0.85,
                duration: 2.6,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          </div>

          {/* Pulsing Dots */}
          <div className="flex gap-2">
            {[0, 0.18, 0.36].map((delay, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  opacity: [0.35, 1, 0.35],
                  scale: [0.85, 1, 0.85]
                }}
                transition={{
                  delay,
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-[6px] h-[6px] rounded-full bg-brand"
              />
            ))}
          </div>

          {/* Status Text */}
          <AnimatePresence mode="wait">
            <motion.p 
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-4"
            >
              {loadingText}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
         <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
         <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
