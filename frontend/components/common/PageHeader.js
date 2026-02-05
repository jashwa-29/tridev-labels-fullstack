"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import { getImgUrl } from '@/utils/image-url';

export default function PageHeader({ 
  title, 
  subtitle, 
  highlightTitle = "",
  highlightSubtitle = "",
  description, 
  breadcrumb = "About Organization",
  image
}) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(contentRef.current.children, 
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all"
        }
      );

      // Parallax Background
      gsap.to(bgRef.current, {
        y: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative pt-20 pb-12 md:pt-32 md:pb-20 bg-[#050505] overflow-hidden">
      
      {/* Background with Image + Parallax + Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div ref={bgRef} className="absolute -top-[20%] left-0 w-full h-[140%]">
          <Image
            src={getImgUrl(image) || "https://peppy-moonbeam-9fe49c.netlify.app/images/background-img-1.jpeg"}
            alt={title || "Page Header Background"}
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            className="object-cover"
            unoptimized={true}
            sizes="100vw"
          />
        </div>
        
        {/* Dimming Overlay (Replaces opacity on elements) */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10"></div>
      </div>

      {/* Abstract Background Texture - Very Subtle */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-30">
        <div ref={contentRef} className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Executive Breadcrumb - Premium Badge Style */}
          <div className="mb-6 flex justify-center">
            <nav className="px-6 py-2 border border-[#E32219]/60 rounded-full text-[9px] md:text-[10px] font-medium uppercase tracking-[0.25em] text-white bg-[#E32219]/20 backdrop-blur-sm flex items-center gap-4">
              <Link href="/" className="hover:text-[#E32219] transition-colors">Home</Link>
              <div className="w-1 h-1 rounded-full bg-white/40"></div>
              <span className="hover:text-[#E32219] transition-colors">{breadcrumb}</span>
            </nav>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.1] tracking-tighter mb-6">
            {title} <span className="text-[#E32219]">{highlightTitle}</span> <br />
            <span className="font-light text-gray-200">{subtitle} <span className="text-[#E32219]">{highlightSubtitle}</span></span>
          </h1>
          
          {description && (
            <p className="text-sm md:text-base text-gray-300 font-light max-w-2xl leading-relaxed tracking-wide">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Signature Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-[#E32219]/0 via-[#E32219]/20 to-[#E32219]/0 z-30"></div>
    </section>
  );
}
