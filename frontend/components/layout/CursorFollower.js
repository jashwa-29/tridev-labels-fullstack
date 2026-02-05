"use client";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CursorFollower() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Initial set
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(followerRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xSetCursor = gsap.quickSetter(cursorRef.current, "x", "px");
    const ySetCursor = gsap.quickSetter(cursorRef.current, "y", "px");
    const xSetFollower = gsap.quickSetter(followerRef.current, "x", "px");
    const ySetFollower = gsap.quickSetter(followerRef.current, "y", "px");

    const moveCursor = (e) => {
      // Direct move for dot (opacity once)
      if (cursorRef.current.style.opacity === '0') {
        gsap.to([cursorRef.current, followerRef.current], { opacity: 1, duration: 0.3 });
      }
      
      xSetCursor(e.clientX);
      ySetCursor(e.clientY);

      // Laggy move for ring - use gsap.to for the lag effect
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });
    };
    
    // Handle Hover States
    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'A' || 
        e.target.tagName === 'BUTTON' || 
        e.target.closest('a') || 
        e.target.closest('button') ||
        e.target.classList.contains('cursor-hover')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, []);

  useEffect(() => {
    if (isHovering) {
      gsap.to(cursorRef.current, { scale: 0.5, duration: 0.3 });
      gsap.to(followerRef.current, { 
        scale: 3, 
        backgroundColor: "rgba(227, 34, 25, 0.1)", // Red tint on hover
        borderColor: "rgba(227, 34, 25, 0.5)",
        duration: 0.3 
      });
    } else {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
      gsap.to(followerRef.current, { 
        scale: 1, 
        backgroundColor: "transparent",
        borderColor: "rgba(255, 255, 255, 0.3)",
        duration: 0.3 
      });
    }
  }, [isHovering]);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-[#E32219] rounded-full pointer-events-none z-9999 mix-blend-difference"
      ></div>
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-9998 transition-colors duration-300"
      ></div>
    </>
  );
}
