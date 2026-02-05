"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

import { testimonialService } from '@/services/testimonial.service';

const DEFAULT_TESTIMONIALS = [
  {
    quote: "Tridev doesn't just print labels; they engineer brand confidence. Their attention to microscopic detail in our security labeling was a game-changer for our global distribution.",
    author: "Elena Rodriguez",
    position: "Supply Chain Director",
    company: "Neo-Logistics International",
    tag: "High-Security Detail"
  },
  {
    quote: "The consistency across billion-label runs is statistically improbable, yet they achieve it every single time. A truly industrial partner for high-scale operations.",
    author: "Vikram Malhotra",
    position: "Packaging Lead",
    company: "Standard Bev-Co",
    tag: "Mass-Scale Precision"
  },
  {
    quote: "Switching to Tridev's sustainable substrate series reduced our carbon footprint by 22% without sacrificing the premium haptic feel of our luxury packaging.",
    author: "Sarah Whitfield",
    position: "Sustainability Head",
    company: "Lumina Consumer Labs",
    tag: "Sustainable Innovation"
  }
];

export default function AboutTestimonials() {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await testimonialService.getAll();
        if (res.data && res.data.length > 0) {
          // Map backend fields to frontend expected fields if necessary
          const mapped = res.data.map(t => ({
            quote: t.text,
            author: t.author,
            position: t.position,
            company: t.company,
            tag: t.tag || t.industry
          }));
          setTestimonials(mapped);
        }
      } catch (err) {
        console.error("Narrative retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-header > *", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-gray-50 overflow-hidden">
      {/* Background Architectural Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-white to-transparent pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Left: Branded Content */}
          <div className="w-full lg:w-1/2 space-y-12 testimonial-header">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-px bg-[#E32219]"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Institutional Feedback</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tighter text-gray-900 leading-[0.9]">
                The Weight of <br />
                <span className="text-[#E32219] font-medium">Industry Trust.</span>
              </h2>

              <p className="text-gray-500 text-lg font-light max-w-lg leading-relaxed">
                Our legacy is built on the success of the world's most demanding brands. 
                Hear from the leaders who trust our precision.
              </p>
            </div>

            <div className="flex items-center gap-8 pt-8">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                       <img 
                        src={`https://i.pravatar.cc/150?u=${i+10}`} 
                        alt="User" 
                        width={48} 
                        height={48} 
                        loading="lazy"
                       />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-[#E32219] flex items-center justify-center text-[10px] font-bold text-white">
                     500+
                  </div>
               </div>
               <div>
                  <div className="text-gray-900 font-bold tracking-tight text-xl">4.9 / 5.0</div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-medium">B2B Satisfaction Index</div>
               </div>
            </div>
          </div>

          {/* Right: The Testimonial Stage */}
          <div className="w-full lg:w-1/2 relative min-h-[450px] flex items-center">
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="relative z-10 w-full"
              >
                <div className="relative p-10 md:p-14 bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-black/5">
                  {/* Elegant Quote Icon */}
                  <Quote className="absolute -top-6 -left-6 text-[#E32219] w-12 h-12" />
                  
                  <div className="space-y-10">
                    <span className="inline-block px-4 py-1.5 border border-[#E32219]/30 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-[#d6201a] bg-[#E32219]/5">
                      {testimonials[activeIndex].tag}
                    </span>

                    <p className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed italic tracking-tight">
                      "{testimonials[activeIndex].quote}"
                    </p>

                    <div className="flex items-center gap-6 pt-10 border-t border-gray-50">
                      <div className="space-y-1">
                        <h3 className="text-gray-900 font-bold text-xl tracking-tighter leading-none">{testimonials[activeIndex].author}</h3>
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">
                          {testimonials[activeIndex].position} — <span className="text-[#E32219]">{testimonials[activeIndex].company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stage Controls */}
            <div className="absolute -bottom-16 left-0 flex items-center gap-4">
              <button 
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#E32219] hover:border-[#E32219]/30 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={next}
                aria-label="Next testimonial"
                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#E32219] transition-all shadow-2xl shadow-[#E32219]/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="ml-4 flex items-center gap-2">
                 <span className="text-gray-900 font-bold text-xs tracking-widest">0{activeIndex + 1}</span>
                 <div className="w-8 h-px bg-gray-400"></div>
                 <span className="text-gray-500 font-bold text-xs tracking-widest">0{testimonials.length}</span>
              </div>
            </div>

            {/* Background Kinetic Text */}
            <div className="absolute -bottom-10 -right-10 text-[10rem] font-black text-gray-100 select-none pointer-events-none transform translate-y-1/4">
               HQ
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
