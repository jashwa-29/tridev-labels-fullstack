"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

export default function OurProcessSection() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "The Blueprint",
      subtitle: "Discovery & Analysis",
      description: "Every masterpiece begins with understanding. We analyze your product's DNA—from surface tensions to environmental stressors—to engineer a label that doesn't just stick, but performs.",
      image: "https://i.pinimg.com/1200x/ca/2f/39/ca2f393d4beeb659a5de54ba0d76d1b4.jpg",
      details: ["Substrate Chemistry", "Lifecycle Mapping", "Compliance Matrix"]
    },
    {
      number: "02",
      title: "The Craft",
      subtitle: "Precision Engineering",
      description: "Complexity made simple. Through high-frequency flexographic printing and microscopic color calibration, we translate your brand's vision into tangible, high-resolution reality.",
      image: "https://i.pinimg.com/736x/ed/5e/6a/ed5e6adf3824febf05cbbea5290abd22.jpg",
      details: ["Pantone Accuracy", "Material Durability", "In-line Finishing"]
    },
    {
      number: "03",
      title: "The Seal",
      subtitle: "Quality Mastery",
      description: "The final safeguard. Each batch undergoes automated vision inspection and stress testing, ensuring that only perfection enters your supply chain.",
      image: "https://i.pinimg.com/1200x/1d/03/88/1d03881315a20e55d2e35d69c2aafe27.jpg",
      details: ["Automated QC", "Batch Traceability", "Strategic Logistics"]
    }
  ];

  const handleMobileScroll = useCallback((e) => {
    const scrollPosition = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const itemWidth = width * 0.85 + 24; 
    const newIndex = Math.round(scrollPosition / itemWidth);
    if (newIndex !== activeMobileIndex && newIndex >= 0 && newIndex < steps.length) {
      setActiveMobileIndex(newIndex);
    }
  }, [activeMobileIndex, steps.length]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Framer Motion Scroll Logic for Desktop
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track active step for debugging/indicators
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      if (value < 0.25) setActiveStep(0);
      else if (value < 0.6) setActiveStep(1);
      else setActiveStep(2);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress]);

  // For 3 slides, we only want to move 2 slides worth (66.66%)
  // The last slide should stay in view
  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1], // Input progress
    ["0%", "-33.33%", "-66.66%", "-66.66%"] // Output positions - last slide stays
  );
  
  const springX = useSpring(x, { 
    stiffness: 60,
    damping: 30,
    mass: 0.7,
    restDelta: 0.001
  });

  // Animation variants
  const slideVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section 
      ref={containerRef} 
      className={`relative bg-white ${isMobile ? 'mb-16' : 'h-[400vh]'}`}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,#000_1px,transparent_0)] bg-[length:24px_24px]"></div>
      </div>

      <div className={`${isMobile ? 'relative' : 'sticky top-0 overflow-hidden flex flex-col justify-center h-screen'}`}>
        
        {/* Header Section */}
        <div className="relative px-4 md:px-8 z-20 mb-4 md:mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="h-px w-6 md:w-8 bg-[#E32219]"></div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-400">Our Strategic Path</span>
              <div className="h-px w-6 md:w-8 bg-[#E32219]"></div>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-900 tracking-tighter leading-[1.1]">
              How We Define <span className="font-normal text-[#E32219]">Excellence.</span>
            </h2>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        {isMobile && (
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 py-8 gap-6 relative z-30"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleMobileScroll}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="snap-center shrink-0 w-[85vw] relative bg-white border border-gray-100 rounded-3xl p-6 shadow-xl"
              >
                <div className="absolute -top-4 -left-2 bg-[#E32219] text-white text-sm font-bold px-4 py-2 rounded-full z-40 shadow-lg">
                  {step.number}
                </div>
                
                <div className="space-y-2 pt-2">
                  <span className="text-[#E32219] text-[10px] font-bold uppercase tracking-[0.2em] block">
                    {step.subtitle}
                  </span>
                  <h3 className="text-2xl font-medium text-gray-900 tracking-tight uppercase">
                    {step.title}
                  </h3>
                </div>
                
                <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden my-4">
                  <Image 
                    src={step.image} 
                    alt={step.title}
                    fill
                    loading="lazy"
                    sizes="85vw"
                    className="object-cover"
                  />
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  {step.description}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-4">
                  {step.details.map((detail, idx) => (
                    <span 
                      key={idx}
                      className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-gray-500"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Desktop Layout */}
        {!isMobile && (
          <div className="hidden md:block relative overflow-visible h-full">
            <motion.div 
              style={{ x: springX }}
              className="flex flex-row w-fit h-full items-center"
            >
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="w-screen shrink-0 flex items-center justify-center px-8 lg:px-24"
                >
                  <motion.div 
                    variants={slideVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.4 }}
                    className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                  >
                    {/* Background Number */}
                    <div className="absolute -top-20 -left-10 text-[300px] font-black text-gray-50/50 select-none z-0 tracking-tighter leading-none">
                      {step.number}
                    </div>

                    {/* Left Side: Image */}
                    <div className="relative z-10 flex justify-center">
                      <div className="relative w-full max-w-md aspect-square">
                        <div className="relative w-full h-full bg-white border border-gray-100 shadow-xl rounded-3xl overflow-hidden">
                          <Image 
                            src={step.image} 
                            alt={step.title}
                            fill
                            loading="lazy"
                            sizes="(max-width: 1024px) 50vw, 450px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="relative z-10 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[#E32219] text-xs font-bold uppercase tracking-[0.3em]">{step.subtitle}</span>
                        <h3 className="text-4xl lg:text-6xl font-medium text-gray-900 tracking-tight leading-none uppercase">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-lg lg:text-xl text-gray-500 font-light leading-relaxed max-w-xl">
                        {step.description}
                      </p>

                      <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-gray-100">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E32219]"></div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>


    </section>
  );
}