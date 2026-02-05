
"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from '../layout/Preloader';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const videoRef = useRef(null);
  
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  // Preloader completion handler
  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  useEffect(() => {
    // Robust video loading check - only start loading when needed
    if (videoRef.current) {
      if (videoRef.current.readyState >= 3) {
        setIsVideoLoaded(true);
      }
    }
    
    // Safety timeout to ensure video shows eventually if network is slow
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showPreloader) return;

    const ctx = gsap.context(() => {
      // Sophisticated Parallax
      gsap.to(bgRef.current, {
        yPercent: 15,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Text Parallax
      gsap.to(textRef.current, {
        yPercent: -20,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Entrance - Optimized for LCP and smooth reveal
      const tl = gsap.timeline();
      tl.to(bgRef.current, { scale: 1, opacity: 1, duration: 1, ease: "power2.out" })
        .to(".hero-line", 
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "power4.out",
            clearProps: "all" 
          }, 
          "-=0.6"
        );

    }, containerRef);

    return () => ctx.revert();
  }, [showPreloader]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#050505]">
      
      {/* High-End Cinematic Preloader */}
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} isReady={isVideoLoaded} />}

      {/* Background Layer (LCP) */}
      <div ref={bgRef} className="absolute inset-0 z-0 h-[120%] -top-[10%] w-full">
        {/* Optimized Poster Image - This is our LCP image */}
        <Image
          src="/hero-bg-bright.png"
          alt="Tridev Labels Background"
          fill
          priority
          fetchPriority="high"
          decoding="sync"
          sizes="100vw"
          className={`object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
        />

        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover contrast-[1.1] saturate-[0.8] z-0 pointer-events-none transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/herosectionbgvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Main Content - Centered & Clean */}
      <div ref={textRef} className="relative z-10 text-center max-w-5xl px-6">
        
        <div className="hero-line mb-6 flex justify-center will-change-transform" style={{ opacity: 0, transform: 'translateY(20px)' }}>
          <span className="px-4 py-1.5 border border-[#E32219]/60 rounded-full text-[9px] md:text-[10px] font-medium uppercase tracking-[0.25em] text-white bg-[#E32219]/20 backdrop-blur-sm">
            Est. 2024 • Excellence in Print
          </span>
        </div>

        <h1 className="hero-line text-4xl md:text-5xl lg:text-8xl font-medium tracking-tighter text-white mb-6 leading-none will-change-transform" style={{ opacity: 0, transform: 'translateY(20px)' }}>
          Precision Labeling <br />
          <span className="text-[#E32219] font-light">Defined.</span>
        </h1>

        <p className="hero-line text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed mb-10 will-change-transform" style={{ opacity: 0, transform: 'translateY(20px)' }}>
          We partner with brands to create exceptional packaging solutions through sustainable innovation and uncompromising quality.
        </p>

        <div className="hero-line flex flex-col md:flex-row items-center justify-center gap-6 will-change-transform" style={{ opacity: 0, transform: 'translateY(20px)' }}>
          <Link 
            href="/about"
            className="px-10 py-4 bg-[#E32219] text-white hover:bg-white hover:text-[#E32219] transition-colors duration-300 rounded-sm font-medium uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(227,34,25,0.4)] hover:shadow-none"
          >
            Discover More
          </Link>
          <Link 
            href="/contact"
            className="px-10 py-4 border border-[#E32219]/50 text-white hover:bg-[#E32219] hover:text-white transition-colors duration-300 rounded-sm font-medium uppercase tracking-[0.2em] text-xs"
          >
            Get in Touch
          </Link>
        </div>

      </div>

      {/* Elegant Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
         <div className="w-px h-12 bg-white/50"></div>
         <span className="text-[9px] uppercase tracking-[0.3em] text-white">Scroll</span>
      </div>

    </div>
  );
}
