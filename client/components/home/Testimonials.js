"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImgUrl, isLocalImage } from '@/utils/image-url';

gsap.registerPlugin(ScrollTrigger);

import { testimonialService } from '@/services/testimonial.service';

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    industry: "Pharmaceuticals",
    text: "The precision in their micro-labeling is unmatched. In an industry where compliance is everything, Tridev delivers the reliability our supply chain depends on.",
    author: "Dr. Arvind Mehta",
    company: "Apex Pharma Group",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200",
  },
  {
    id: 2,
    industry: "Industrial Engineering",
    text: "We needed labels that could withstand extreme heat and chemical exposure. Tridev's substrate engineering provided a solution that far exceeded our durability requirements.",
    author: "Johnathan Ross",
    company: "Lumina Industrial",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200",
  },
  {
    id: 3,
    industry: "Luxury Consumer Goods",
    text: "Their finishing techniques—spot UV and holographic foiling—transformed our product packaging. They truly understand how to make a brand 'pop' on the shelf.",
    author: "Sarah Jenkins",
    company: "Velvet Retail FMCG",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200",
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await testimonialService.getAll();
        if (res.data && res.data.length > 0) {
          // Map backend 'company' to ensure consistency if it differs
          const mappedData = res.data.map(item => ({
            ...item,
            brand: item.company || item.brand || "Industrial Partner"
          }));
          setTestimonials(mappedData);
        }
      } catch (err) {
        console.error("Narrative retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Viewport-based lazy initialization for elite TBT
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const ctx = gsap.context(() => {
          // Elegant Fade Up for headers
          gsap.from(".testimonial-reveal", {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%"
            }
          });
        }, containerRef);
        
        window._testimonialCtx = ctx;
        observer.disconnect();
      }
    }, { rootMargin: "200px" });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (window._testimonialCtx) window._testimonialCtx.revert();
      observer.disconnect();
    };
  }, [loading]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };


  if (loading) return null;

  return (
    <section ref={containerRef} className="relative py-16 md:py-24 lg:py-32 xl:py-40 overflow-hidden bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
        
        {/* Project Standard Centered Header */}
        <div className="text-center max-w-5xl mx-auto mb-16 md:mb-24">
          <div className="flex items-center justify-center mb-6 md:mb-10 testimonial-reveal">
            <div className="h-[2px] w-8 md:w-12 bg-[#E32219]"></div>
            <div className="mx-3 md:mx-5 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 whitespace-nowrap">
              Client Chronicles
            </div>
            <div className="h-[2px] w-8 md:w-12 bg-[#E32219]"></div>
          </div>

          <div className="relative mb-6 md:mb-10 flex flex-col items-center testimonial-reveal">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight leading-tight md:leading-[0.95] text-center">
              Our Clients Love <br className="hidden md:block" />
              <span className="font-normal relative inline-block mt-2 md:mt-0">
                To Talk <span className="text-[#E32219]">About Us</span>
                <span className="absolute -bottom-2 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#E32219]/50 to-transparent"></span>
              </span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto mt-8 md:mt-12 testimonial-reveal">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light tracking-wide px-4">
              Hear from our satisfied partners about how we've transformed 
              their industrial identity with precision engineering.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Main Testimonial Card */}
          <div className="relative bg-[#fafafa] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] flex flex-col md:flex-row min-h-[500px]">
            <div className="flex flex-col md:flex-row w-full">
              
              {/* Content Side (Left) */}
              <div className="p-8 md:p-14 lg:p-20 flex flex-col justify-center flex-1 order-2 md:order-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="space-y-12"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-[1.5px] bg-[#E32219]"></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E32219]">Industrial Impact</span>
                      </div>
                      <p className="text-xl md:text-xl lg:text-xl text-gray-800 leading-[1.4] font-light italic">
                        "{testimonials[current].text}"
                      </p>
                    </div>

                    <div className="flex flex-col gap-6 pt-10 border-t border-gray-200/60">
                      <div className="flex items-center gap-5">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md bg-gray-100">
                          <Image 
                            src={getImgUrl(testimonials[current].image)} 
                            alt={testimonials[current].author || "Client Testimonial"}
                            fill
                            unoptimized={isLocalImage(getImgUrl(testimonials[current].image))}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-normal text-gray-900 leading-none mb-1.5">{testimonials[current].author}</h4>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">{testimonials[current].company || testimonials[current].brand}</p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-[#E32219] text-[#E32219]" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Image Side (Right) */}
              <div className="relative flex-1 min-h-[350px] md:min-h-full order-1 md:order-2 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={getImgUrl(testimonials[current].image)} 
                      alt={testimonials[current].author || "Client Testimonial"}
                      fill
                      unoptimized={isLocalImage(getImgUrl(testimonials[current].image))}
                      className="object-cover"
                    />
                    {/* Industrial Tint Overlay */}
                    <div className="absolute inset-0 bg-gray-900/10" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation Controls - Minimal Industrial Style */}
          <div className="absolute top-1/2 -left-4 md:-left-8 lg:-left-12 -translate-y-1/2 z-20">
            <button 
              onClick={() => paginate(-1)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-[#E32219] shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-300 active:scale-95 group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 md:-right-8 lg:-right-12 -translate-y-1/2 z-20">
            <button 
              onClick={() => paginate(1)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-[#E32219] shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-300 active:scale-95 group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
