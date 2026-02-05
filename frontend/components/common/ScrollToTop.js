"use client";

import { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef(null);
  const circleRef = useRef(null);
  const arrowRef = useRef(null);

  // Robust Automatic Scroll to Top on Route Change
  useEffect(() => {
    // 1. Immediate scroll reset
    window.scrollTo(0, 0);
    
    // 2. Clear GSAP ScrollTrigger states to prevent ghost pins
    if (typeof window !== 'undefined') {
      ScrollTrigger.getAll().forEach(t => t.kill());
      ScrollTrigger.refresh();
    }

    // 3. Delayed safety scroll (handles Next.js hydration jumps)
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      ScrollTrigger.refresh();
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Toggle visibility based on scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Entrance/Exit Animation
  useEffect(() => {
    if (isVisible) {
      gsap.to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        scale: 1,
      });
    } else {
      gsap.to(buttonRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        scale: 0.8,
      });
    }
  }, [isVisible]);

  // Hover Effect Animation
  const handleMouseEnter = () => {
    gsap.to(circleRef.current, { scale: 1.1, duration: 0.3, ease: "power2.out" });
    gsap.to(arrowRef.current, { y: -5, duration: 0.3, ease: "power2.out", color: "#E32219" });
  };

  const handleMouseLeave = () => {
    gsap.to(circleRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(arrowRef.current, { y: 0, duration: 0.3, ease: "power2.out", color: "#1a1a1a" });
  };

  const scrollToTop = () => {
    // Animate click
    gsap.to(buttonRef.current, {
      y: -20,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
      onComplete: () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-8 right-8 z-90 flex items-center justify-center pointer-events-auto opacity-0 translate-y-24`}
      aria-label="Scroll to top"
    >
      <div 
        ref={circleRef}
        className="w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center border border-gray-100 relative overflow-hidden"
      >
        {/* Progress Border or Decor */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E32219] opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700"></div>
        
        <ArrowUp ref={arrowRef} className="w-6 h-6 text-gray-900 transition-colors" />
      </div>
    </button>
  );
}
