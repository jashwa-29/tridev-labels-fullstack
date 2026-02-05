"use client";

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function WhyChooseSection() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const stats = [
    { value: "16+", label: "Years of Excellence" },
    { value: "3,725+", label: "Satisfied Customers" },
    { value: "2B+", label: "Labels Printed" },
    { value: "1-3", label: "Days Delivery" }
  ];



  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content fade in
      gsap.from(contentRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%"
        }
      });

      // Stats animation
      gsap.from(".stat-item", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 80%"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative py-20 md:py-24 mb-16 md:mb-24 lg:mb-32 xl:mb-40 overflow-hidden"
    >
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://peppy-moonbeam-9fe49c.netlify.app/images/background-img-1.jpeg"
          alt="Why Choose Us Background"
          fill
          loading="lazy"
          sizes="(max-width: 1200px) 100vw, 1920px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div ref={contentRef} className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Elegant Header */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#E32219]"></div>
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-gray-300">
              Why Choose Trridev Labelss
            </span>
            <div className="h-px w-8 bg-[#E32219]"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
            Excellence in <span className="font-medium text-[#E32219]">Every Label</span>
          </h2>
          
          {/* Why Choose Us Paragraph */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-gray-200 font-light leading-relaxed mb-6">
              Our thousands of customers keep choosing Trridev Labelss for our commitment 
              to reliability and engineering precision. We combine 16+ years of heritage with 
              modern tech to create the perfect label for any occasion.
            </p>
          </div>
        </div>



        {/* Stats Row */}
        <div className="stats-container max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-item group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-light mb-2 transition-all duration-300 group-hover:text-[#E32219] text-white">
                    {stat.value}
                  </div>
                  <div className="h-px w-8 mb-3 group-hover:w-12 transition-all duration-300 bg-white/40 group-hover:bg-[#E32219]"></div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}