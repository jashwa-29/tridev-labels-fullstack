"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { testimonialService } from '@/services/testimonial.service';

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    impact: "Unmatched Precision",
    industry: "Pharmaceuticals",
    text: "The precision in their micro-labeling is unmatched. In an industry where compliance is everything, Tridev delivers the reliability our supply chain depends on.",
    author: "Dr. Arvind Mehta",
    brand: "Apex Pharma Group",
    image: "https://i.pinimg.com/736x/af/b9/a7/afb9a719829272fa7eb9f4b1db80f62d.jpg",
  },
  {
    id: 2,
    impact: "Extreme Durability",
    industry: "Industrial",
    text: "We needed labels that could withstand extreme heat and chemical exposure. Tridev's substrate engineering provided a solution that far exceeded our durability requirements.",
    author: "Johnathan Ross",
    brand: "Lumina Industrial",
    image: "https://i.pinimg.com/1200x/02/1c/3b/021c3b98fb684406201aadcfc23de95d.jpg",
  },
  {
    id: 3,
    impact: "Finishing Excellence",
    industry: "Consumer Goods",
    text: "Their finishing techniques—spot UV and holographic foiling—transformed our product packaging. They truly understand how to make a brand 'pop' on the shelf.",
    author: "Sarah Jenkins",
    brand: "Velvet Retail FMCG",
    image: "https://i.pinimg.com/736x/53/70/39/5370396de4cd92fb0a2a5accd823d480.jpg",
  },
  {
    id: 4,
    impact: "Smart Innovation",
    industry: "Tech & Logistics",
    text: "Bridging physical packaging with digital experiences through smart, interactive label technologies. Tridev is truly a next-gen labeling partner.",
    author: "Michael Chen",
    brand: "Global Logistics Co.",
    image: "https://i.pinimg.com/1200x/dc/97/36/dc97368c7bf44f6e429d64fa64f449ab.jpg",
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await testimonialService.getAll();
        if (res.data && res.data.length > 0) {
          setTestimonials(res.data);
        }
      } catch (err) {
        console.error("Narrative retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children, {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%"
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <section 
      ref={containerRef}
      className="relative  pb-16 md:pb-24 lg:pb-32 xl:pb-40 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Sidebar - Branded Reveal */}
          <div className="w-full lg:w-[35%] flex flex-col justify-between py-4">
            <div className="space-y-16">
              
              {/* Progress Timeline Indicator */}
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-900">
                  {String(current + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 h-px bg-gray-200 relative">
                  <motion.div 
                    animate={{ width: `${((current + 1) / testimonials.length) * 100}%` }}
                    className="absolute inset-0 bg-[#E32219]"
                  />
                </div>
                <div className="flex gap-4 text-gray-500 text-xs font-bold uppercase tracking-widest pl-2">
                  {testimonials.map((_, i) => (
                    <span key={i} className={`transition-colors duration-300 ${current === i ? "text-gray-900" : ""}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trridev Style Header */}
              <div ref={headerRef} className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-[#E32219]"></div>
                  <span className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">
                    Trusted Voices
                  </span>
                  <div className="h-px w-8 bg-[#E32219]"></div>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-tighter">
                  Voices of<br/>
                  <span className="font-medium text-[#E32219]">Quality</span> & Industrial Trust
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed font-light max-w-sm">
                  Thousands of global manufacturers rely on Trridev and it's consistency, 
                  and engineering precision to define their brand's physical identity.
                </p>
              </div>

       

                      <button className="relative px-8 sm:px-12 py-4 sm:py-5 bg-gray-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] rounded-sm group overflow-hidden shadow-xl transition-all duration-300">
                <span className="relative z-10 flex items-center gap-4">
                  Explore Success Stories
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
                <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Right Stage - Editorial Carousel */}
          <div className="w-full lg:w-[65%] relative">
            <div className="relative h-[480px] md:h-[550px] -mx-4 px-4 lg:mx-0 lg:px-0">
               <div className="flex gap-6 h-full">
                  <AnimatePresence mode="popLayout">
                    <motion.div 
                      key={current}
                      initial={{ x: 60, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -60, opacity: 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-6 w-full"
                    >
                      {/* Active Testimonial Card */}
                      <div className="w-full md:w-[70%] h-full shrink-0 relative rounded-4xl overflow-hidden group shadow-2xl bg-gray-900 border border-gray-100/10">
                        <Image 
                          src={testimonials[current].image} 
                          alt={testimonials[current].brand || testimonials[current].company}
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 600px"
                          className="absolute inset-0 w-full h-full object-cover brightness-75 transition-transform duration-[3s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
                        
                        <div className="relative h-full p-10 md:p-14 flex flex-col justify-between z-10">
                           <div className="space-y-4">
                              <span className="text-[10px] font-bold text-[#E32219] uppercase tracking-[0.4em]">Impact / {testimonials[current].industry}</span>
                              <h3 className="text-3xl md:text-5xl font-medium text-white tracking-tighter leading-tight">
                                {testimonials[current].impact}
                              </h3>
                           </div>

                           <div className="space-y-10">
                             <div className="relative">
                                <Quote className="absolute -top-10 -left-6 text-white/5" size={80} />
                                <p className="text-white/80 font-light text-lg md:text-xl leading-relaxed italic relative z-10 pr-4">
                                   "{testimonials[current].text}"
                                </p>
                             </div>

                             <div className="flex items-center gap-5 pt-6 border-t border-white/10">
                                <div className="flex-1">
                                   <h4 className="text-xl font-bold text-white tracking-tight">{testimonials[current].author}</h4>
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">{testimonials[current].brand || testimonials[current].company}{testimonials[current].position ? ` — ${testimonials[current].position}` : ''}</p>
                                </div>
                             
                             </div>
                           </div>

                           <div className="absolute bottom-8 right-12 pointer-events-none opacity-[0.03]">
                              <span className="text-[14rem] font-bold text-white tracking-widest">0{testimonials[current].id || current + 1}</span>
                           </div>
                        </div>
                      </div>

                      {/* Peek Next Card */}
                      <div className="hidden md:block w-full md:w-[30%] h-full shrink-0 relative rounded-4xl overflow-hidden group/peek opacity-40 hover:opacity-60 transition-all duration-500 cursor-pointer bg-gray-200" onClick={next}>
                        <Image 
                          src={testimonials[(current + 1) % testimonials.length].image} 
                          alt="Next Success"
                          fill
                          loading="lazy"
                          sizes="300px"
                          className="absolute inset-0 w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="relative h-full p-10 flex flex-col justify-between text-white z-10">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Next Story</span>
                          <h3 className="text-2xl font-medium tracking-tight opacity-90 leading-tight">
                            {testimonials[(current + 1) % testimonials.length].impact}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
               </div>

               {/* Carousel Controls */}
               <div className="absolute -bottom-8 right-0 lg:right-10 flex gap-4 z-40">
                  <button 
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E32219] hover:border-[#E32219] transition-all duration-300 shadow-lg"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <button 
                    onClick={next}
                    aria-label="Next testimonial"
                    className="w-14 h-14 rounded-full bg-gray-900 shadow-[0_0_15px_rgba(227,34,25,0.3)] text-white flex items-center justify-center hover:bg-[#E32219] transition-all duration-300"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
