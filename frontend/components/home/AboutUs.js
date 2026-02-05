"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const containerRef = useRef(null);
  const imageGroupRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for images
      const images = imageGroupRef.current.querySelectorAll('.parallax-img');
      images.forEach((img, i) => {
        gsap.to(img, {
          y: (i + 1) * -30,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });

      // Staggered reveal for text
      gsap.from(textRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%"
        }
      });

      // Entrance animation for image gallery
      gsap.from(imageGroupRef.current.children, {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageGroupRef.current,
          start: "top 85%"
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 xl:gap-32 items-center">
          
          {/* Elegant 4-Image Mosaic Gallery */}
          <div ref={imageGroupRef} className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[550px] xl:h-[650px] order-2 lg:order-1 mt-8 lg:mt-0">
            
            {/* Main Image - Center Background */}
            <div className="absolute top-[10%] left-[10%] w-[70%] h-[70%] rounded-2xl overflow-hidden shadow-2xl z-10 parallax-img">
              <Image 
                src="https://i.pinimg.com/1200x/ea/9e/20/ea9e205b68c315a7a39cd685d1800d1d.jpg" 
                alt="Industrial Printing Press"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            {/* Image 2 - Top Right Overlay */}
            <div className="absolute top-0 right-0 w-[45%] h-[40%] rounded-2xl overflow-hidden shadow-2xl z-20 parallax-img border-4 sm:border-8 border-[#fafafa]">
              <Image 
                src="https://i.pinimg.com/1200x/14/d6/f3/14d6f3022120dcf6712edaa245e67653.jpg" 
                alt="Digital Label Concept"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 250px"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            {/* Image 3 - Bottom Left Overlay */}
            <div className="absolute bottom-[5%] left-0 w-[42%] h-[38%] rounded-2xl overflow-hidden shadow-2xl z-30 parallax-img border-4 sm:border-8 border-[#fafafa]">
              <Image 
                src="https://i.pinimg.com/1200x/04/28/b9/0428b900d699a1410449ae05ccb12aa4.jpg" 
                alt="Quality Labels"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 220px"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            {/* Image 4 - Floating Detail */}
            <div className="absolute bottom-0 right-[15%] w-[35%] h-[30%] rounded-2xl overflow-hidden shadow-2xl z-40 parallax-img border-4 sm:border-8 border-[#fafafa] hidden sm:block">
              <Image 
                src="https://i.pinimg.com/736x/64/cb/80/64cb8086e52ef8f1096f3d14e6e4194c.jpg" 
                alt="Detailed Texture"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 30vw, 180px"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            {/* Decorative Accents */}
            <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 bg-[#E32219]/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 sm:w-40 sm:h-40 bg-gray-200 rounded-full blur-3xl -z-10" />
          </div>

          {/* Clean Narrative Content */}
          <div ref={textRef} className="space-y-8 md:space-y-10 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-6 md:w-8 h-[2px] bg-[#E32219]"></span>
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-500 whitespace-nowrap">label printing specialists</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight md:leading-[1.1] tracking-tight">
                Crafting <span className="font-normal text-[#E32219]">Solutions</span> <br /> 
                <span className="relative inline-block mt-1 sm:mt-2 font-normal">
                   That Drive Growth
                   <span className="absolute -bottom-2 left-0 w-full h-px bg-linear-to-r from-transparent via-[#E32219]/50 to-transparent"></span>
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 font-light tracking-wide pt-1 md:pt-2">
                16+ Years of Innovation with a Personal Touch
              </p>
            </div>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed font-light tracking-wide max-w-xl">
              Since 2008, Trridev Labelss has been a trusted <span className="text-gray-900 font-normal">ISO 9001:2015 Certified</span> partner. 
              With over <span className="text-gray-900 font-normal">2 Billion labels printed</span>, we engineer high-performance solutions 
              that elevate your brand and drive business growth.
            </p>

            {/* Refined Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-gray-100">
              <div className="flex gap-4 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white shadow-sm shrink-0 flex items-center justify-center text-[#E32219] group-hover:scale-110 group-hover:bg-[#E32219] group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h3 className="text-gray-900 text-sm sm:text-base font-bold tracking-tight mb-1">Accredited Reliability</h3>
                  <p className="text-[11px] sm:text-sm text-gray-500 font-light leading-snug tracking-wide">ISO 9001:2015 Certified. No Minimum Order size.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white shadow-sm shrink-0 flex items-center justify-center text-[#E32219] group-hover:scale-110 group-hover:bg-[#E32219] group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-gray-900 text-sm sm:text-base font-bold tracking-tight mb-1">Fast Industrial Delivery</h3>
                  <p className="text-[11px] sm:text-sm text-gray-500 font-light leading-snug tracking-wide">Ships in 1–3 business days globally once approved.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <Link href="/contact" className="inline-block">
                <button className="relative px-8 sm:px-12 py-4 sm:py-5 bg-gray-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] rounded-sm group overflow-hidden shadow-xl transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-4">
                    Let's Talk Labels
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </span>
                  <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
