"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check if device has a fine pointer (mouse) and is desktop size
    const checkDevice = () => {
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      const isDesktopSize = window.innerWidth >= 768;
      setIsDesktop(hasFinePointer && isDesktopSize);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      document.body.style.cursor = "auto";
      return;
    }

    // Hide default cursor on body
    document.body.style.cursor = "none";

    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHovering(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, isDesktop]);

  if (!isVisible || !isDesktop) return null;

  return (
    <>
      {/* Outer ring */}
      <div 
        className={`fixed pointer-events-none z-[9999] rounded-full border border-white mix-blend-difference transition-all duration-300 ease-out hidden md:block ${isHovering ? 'w-16 h-16 bg-white/20' : 'w-8 h-8'}`}
        style={{ 
          transform: `translate3d(${position.x - (isHovering ? 32 : 16)}px, ${position.y - (isHovering ? 32 : 16)}px, 0)`,
        }}
      ></div>
      {/* Inner dot */}
      <div 
        className={`fixed pointer-events-none z-[9999] rounded-full bg-white mix-blend-difference transition-transform duration-100 hidden md:block ${isHovering ? 'w-1 h-1' : 'w-2 h-2'}`}
        style={{ 
          transform: `translate3d(${position.x - (isHovering ? 2 : 4)}px, ${position.y - (isHovering ? 2 : 4)}px, 0)`,
        }}
      ></div>
    </>
  );
}
