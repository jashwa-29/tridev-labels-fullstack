"use client";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function Preloader({ onComplete, isReady = true }) {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const [isCounterDone, setIsCounterDone] = useState(false);
  const exitTriggered = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter Animation
      const tl = gsap.timeline({
        onComplete: () => {
          setIsCounterDone(true);
        }
      });

      // Animate counter - Faster
      tl.to(counterRef.current, {
        innerText: 100,
        duration: 0.4, 
        snap: { innerText: 1 },
        ease: "none",
        onUpdate: function() {
          if (counterRef.current) {
            counterRef.current.innerHTML = Math.round(this.targets()[0].innerText) + "%";
          }
        }
      });

      // Logo Reveal - Synchronized
      tl.fromTo(logoRef.current, 
        { scale: 0.98, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, 
        0
      );

      // Text Reveal
      if (textRef.current) {
        tl.from(textRef.current, {
          y: 10,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out"
        }, "-=0.3");
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle Exit Animation when both counter is done AND video is ready
  useEffect(() => {
    if (isCounterDone && isReady && !exitTriggered.current) {
      exitTriggered.current = true;
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 0.5,
        ease: "expo.inOut",
        onComplete: onComplete
      });
    }
  }, [isCounterDone, isReady, onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center text-white"
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo Image - Optimized */}
        <div ref={logoRef} className="relative w-48 md:w-64 aspect-3/1 flex items-center justify-center">
           <Image 
             src="/tridev-logo.png" 
             alt="Tridev Labels Logo" 
             width={256}
             height={85}
             priority
             fetchPriority="high"
             sizes="(max-width: 768px) 192px, 256px"
             className="w-full h-auto object-contain"
           />
        </div>

        {/* Counter */}
        <div className="absolute -bottom-24 font-mono text-xs md:text-sm text-gray-500 tracking-widest">
           <span ref={counterRef}>0%</span>
        </div>
      </div>
    </div>
  );
}
