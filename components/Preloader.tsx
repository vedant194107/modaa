"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          document.body.style.overflow = "auto";
          setTimeout(() => setIsRemoved(true), 1000); // Wait for transition to finish
        }, 300);
      }
      setProgress(currentProgress);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (isRemoved) return null;

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black text-white transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="font-display-xl text-4xl md:text-6xl tracking-widest text-transparent [-webkit-text-stroke:1px_#ffffff] uppercase animate-pulse">
          MODAA ARCHIVE
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="font-label-bold text-sm uppercase tracking-[0.3em] text-white/70">
            System Initializing
          </div>
          <div className="w-12 h-[1px] bg-white/30 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-milano-red transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="font-headline-md text-2xl w-16 text-right">
            {progress}%
          </div>
        </div>
      </div>
      
      {/* Brutalist accents */}
      <div className="absolute top-8 left-8 font-label-bold text-[10px] text-white/30 tracking-widest">
        SYS.REQ.001
      </div>
      <div className="absolute bottom-8 right-8 font-label-bold text-[10px] text-white/30 tracking-widest">
        EST. 2026
      </div>
    </div>
  );
}
