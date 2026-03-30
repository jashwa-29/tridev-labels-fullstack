// components/about/HistoryTimeline.jsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const timelineData = [
  {
    year: "2008",
    title: "Where It All Started",
    description:
      "Trridev Labelss Mfg Co was founded in Chennai with a simple goal — to deliver dependable label printing with honesty and care. We started with letterpress machines and a small but determined team.",
    color: "#E32219",
    image: "/label-printing-approach.png",
  },
  {
    year: "June 2010",
    title: "Taking Our First Step Forward",
    description:
      "As customer demand increased, we added the Onda 250 machine to strengthen our production capacity and serve our clients more efficiently.",
    color: "#E32219",
    image: "/capabilities/flexo-press.png",
  },
  {
    year: "June 2014",
    title: "Moving into Advanced Flexo Printing",
    description:
      "With the installation of the Mark Andy 2200 Flexographic Press, we entered a new phase of printing technology, improving quality and expanding our capabilities.",
    color: "#E32219",
    image: "/capabilities/led-curing.png",
  },
  {
    year: "August 2021",
    title: "Adding More Precision",
    description:
      "We installed a high-speed servo letterpress machine with repass printing and hot foil features. This allowed us to offer better finishing, sharper detail, and greater value to our customers.",
    color: "#E32219",
    image: "/industries/pharma.png",
  },
  {
    year: "June 2023",
    title: "Improving Our Finishing Strength",
    description:
      "A high-speed 3-turret slitting machine was added to enhance finishing accuracy, reduce downtime, and improve overall production flow.",
    color: "#E32219",
    image: "/industries/auto.png",
  },
  {
    year: "December 2023",
    title: "A New Space for Bigger Goals",
    description:
      "We moved into a larger and more modern facility. This was more than a relocation — it was a step towards the future, giving us the space and environment to grow stronger as a team.",
    color: "#E32219",
    image: "/hero-bg-bright.png",
  },
  {
    year: "October 2025",
    title: "Raising Our Technology Standards",
    description:
      "The installation of the 9-colour Nilpeter FB350 with crossover marked a major milestone. This advanced machine strengthened our multi-colour printing capabilities and improved consistency and turnaround time.",
    color: "#E32219",
    image: "/capabilities/security-labels.png",
  },
  {
    year: "Today",
    title: "Moving Forward with Purpose",
    description:
      "Our growth has always been steady and thoughtful. We continue to invest in technology, strengthen our team, and build long-term partnerships. Because for us, success is not only about expansion — it is about earning trust, maintaining quality, and keeping the promises we make.",
    color: "#E32219",
    image: "/industries/electronics.png",
  },
];

// Liquid Glass Card Component
const LiquidGlassCard = ({ children, isActive, color, index, isLeft }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Printing Machine Lead Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px] bg-[#E32219] shadow-[0_0_20px_#E32219] z-40 pointer-events-none"
        initial={{ top: 0, opacity: 0 }}
        whileInView={{ top: "100%", opacity: [0, 1, 1, 0] }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1.5, ease: "linear" }}
      />

      {/* Pure Glassy Background - Revealed via Printer clip-path */}
      <motion.div
        className="absolute inset-0 rounded-[32px] overflow-hidden bg-white/[0.04] border border-white/10"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.5, ease: "linear" }}
        animate={{
          borderColor: isHovered ? "rgba(227,34,25,0.4)" : "rgba(255,255,255,0.08)",
          background: isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
        }}
      />
      
      {/* Content wrapper with proper breathable padding */}
      <motion.div 
        className="relative z-10 p-6 md:p-10 h-full flex flex-col overflow-visible"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {children}
      </motion.div>
      
      {/* Floating Particles on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isMounted && [...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${color}, transparent)`,
                  left: `${(i * 137.5) % 100}%`,
                  top: `${(i * 7.5) % 100}%`,
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100],
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function HistoryTimeline() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const itemsRef = useRef([]);
  const parallaxRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState({ x: 0, y: 0 });

  // Framer Motion scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  const backgroundY = useTransform(smoothProgress, [0, 1], [0, 200]);
  const backgroundScale = useTransform(smoothProgress, [0, 1], [1, 1.05]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
    ScrollTrigger.refresh();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const allTrue = {};
      timelineData.forEach((_, i) => allTrue[i] = true);
      setLoadedImages(prev => ({ ...allTrue, ...prev }));
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const triggerExplosion = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setExplosionPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setShowExplosion(true);
    setTimeout(() => setShowExplosion(false), 800);
    
    if (typeof window !== "undefined" && window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ['#E32219', '#ffffff', '#ff6b6b', '#ffa500'],
        startVelocity: 25,
        decay: 0.9,
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !window.confetti) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1';
      script.async = true;
      document.body.appendChild(script);
    }

    // 1200ms Performant Buffer: Delay engine startup to secure LCP
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Animate timeline markers
        itemsRef.current.forEach((item, index) => {
          if (item) {
            const marker = item.querySelector(".timeline-marker-glow");
            if (marker) {
              gsap.to(marker, {
                scale: 1.2,
                opacity: 0.6,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.2,
              });
            }
          }
        });
      }, sectionRef);
      window._historyCtx = ctx;
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (window._historyCtx) window._historyCtx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen pb-24 pt-0 px-4 bg-[url('/about-images/dark-section-bg.png')] bg-cover bg-center bg-fixed overflow-x-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]/70 z-0 pointer-events-none" />
      {/* Explosion Effect */}
      <AnimatePresence>
        {showExplosion && (
          <motion.div
            className="fixed pointer-events-none z-[200]"
            style={{
              left: explosionPosition.x - 100,
              top: explosionPosition.y - 100,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute w-48 h-48">
              {isMounted && [...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#E32219]"
                  initial={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    rotate: Math.random() * 720,
                    scale: 0,
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(227,34,25,0.08), transparent)",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent)",
          }}
          animate={{
            x: [0, -40, 50, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Multi-layered particle field with Viewport-Aware Mounting to free CPU */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                background: i % 3 === 0 ? '#E32219' : '#ffffff',
                left: `${((i * 13) % 100)}%`,
                top: `${((i * 7) % 100)}%`,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ 
                opacity: [0, 0.5, 0],
                y: [0, -100, -200],
                x: [0, (Math.random() - 0.5) * 100],
              }}
              viewport={{ rootMargin: "200px" }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with Liquid Glass Effect */}
        <motion.div
          className="timeline-header text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="relative inline-block mb-10"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 bg-[#E32219]/20 blur-2xl rounded-full" />
            <span className="relative px-6 py-2 border border-[#E32219]/60 rounded-full text-[10px] font-medium uppercase tracking-[0.25em] text-white bg-[#E32219]/20 backdrop-blur-sm">
              CHRONOLOGY OF EXCELLENCE
            </span>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.1] tracking-tighter mb-8 max-w-5xl mx-auto"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Built on <span className="text-[#E32219]">Trust</span>,<br />
            <span className="font-light text-gray-400">Grown with <span className="text-[#E32219]">Commitment</span></span>
          </motion.h1>
          
          <motion.p
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            What began in 2008 as a small vision has grown step by step through
            hard work, learning, and the continued trust of our customers.
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            className="mt-16 flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-500 text-[10px] tracking-wider">SCROLL TO EXPLORE</span>
              <div className="w-5 h-8 border border-gray-500/50 rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-2 bg-gray-500 rounded-full mt-1"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative">
          {/* Central Timeline Line with Liquid Flow */}
          <div className="absolute left-[30px] md:left-1/2 transform md:-translate-x-1/2 w-[2px] h-full">
            <motion.div
              className="timeline-line w-full h-full bg-gradient-to-b from-transparent via-[#E32219] to-transparent origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#E32219] to-transparent"
              animate={{
                y: ["0%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ filter: "blur(8px)" }}
            />
          </div>

          {/* Timeline Items */}
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;
            const isActive = activeIndex === index;
            
            return (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 mb-20 md:mb-32 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Marker with Liquid Effect */}
                <div className="absolute left-[26px] md:left-1/2 transform md:-translate-x-1/2 z-20">
                  <motion.div
                    className="cursor-pointer relative"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => triggerExplosion(e, index)}
                  >
                    <motion.div
                      className="timeline-marker w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 15px ${item.color}` }}
                      animate={{
                        scale: isActive ? [1, 1.3, 1] : 1,
                        boxShadow: isActive ? [`0 0 15px ${item.color}`, `0 0 30px ${item.color}`, `0 0 15px ${item.color}`] : `0 0 15px ${item.color}`,
                      }}
                      transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                    />
                    <motion.div
                      className="timeline-marker-glow absolute inset-0 w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>

                {/* Liquid Glass Card */}
                <div className="w-full md:w-[calc(50%-2rem)] ml-[52px] md:ml-0">
                  <LiquidGlassCard
                    isActive={isActive}
                    color={item.color}
                    index={index}
                    isLeft={isLeft}
                  >
                    <div className="relative">
                      {/* Image Container with Liquid Reveal */}
                      <motion.div
                        className="relative rounded-xl overflow-hidden mb-6 h-48 md:h-56"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.4 }}
                      >
                        {!loadedImages[index] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <motion.div
                              className="w-6 h-6 border-2 border-[#E32219] border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                        )}
                        <div className={`w-full h-full relative transition-all duration-700 ${
                          loadedImages[index] ? 'opacity-100' : 'opacity-40'
                        }`}>
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            onLoad={() => handleImageLoad(index)}
                          />
                        </div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                          initial={{ opacity: 0.5 }}
                          whileHover={{ opacity: 0.8 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Liquid Shine Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 2,
                          }}
                        />
                      </motion.div>

                      {/* Content */}
                      <div className="relative">
                        {/* Massive Flying Watermark Year - Accelerated Punchy Reveal */}
                        <div className={`absolute inset-x-0 bottom-0 top-0 flex items-center justify-center pointer-events-none z-[-1] overflow-visible ${
                          isLeft ? "md:justify-start md:pl-12" : "md:justify-end md:pr-12"
                        }`}>
                          <motion.div 
                            className="text-white font-black text-[12rem] md:text-[18rem] leading-none select-none group-hover:text-[#E32219] transition-all duration-1000 whitespace-nowrap overflow-visible"
                            initial={{ opacity: 0, scale: 0.8, x: isLeft ? -150 : 150, rotate: isLeft ? -10 : 10 }}
                            whileInView={{ opacity: 0.1, scale: 1.3, x: 0, rotate: 0 }}
                            viewport={{ once: false, amount: 0.1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          >
                             {item.year.split(' ').pop()}
                          </motion.div>
                        </div>

                        <motion.div
                          className="inline-block text-xs font-medium mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10"
                          style={{ color: item.color }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.year}
                        </motion.div>
                        
                        <div className="flex items-center gap-4 mb-4">
                          {/* Restored Vertical Indicator */}
                          <div className="w-1 h-8 bg-[#E32219] rounded-full" />
                          <motion.h3
                            className="text-xl md:text-2xl font-medium text-white tracking-tight"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            {item.title}
                          </motion.h3>
                        </div>
                        
                        <motion.p
                          className="text-white text-sm md:text-base leading-relaxed font-normal mb-6 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        >
                          {item.description}
                        </motion.p>

                        {/* Decorative Liquid Line */}
                        <motion.div
                          className="mt-6 pt-4 border-t border-white/5"
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ delay: index * 0.1 + 0.6, duration: 0.8 }}
                        >
                          <motion.div
                            className="w-12 h-px bg-gradient-to-r from-[#E32219] to-transparent"
                            animate={{ width: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </div>

                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>

        {/* Footer with Liquid Glass Effect */}
        <motion.div
          className="mt-32 pt-12 text-center relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#E32219] to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative max-w-3xl mx-auto">
            <motion.div
              className="relative bg-black/40 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/5 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#E32219]/0 via-[#E32219]/10 to-[#E32219]/0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="relative">
                <motion.div
                  className="text-6xl text-[#E32219]/20 mb-2 font-serif"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  “
                </motion.div>
                <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                  "Success is not only about expansion — it is about earning trust,
                  maintaining quality, and keeping the promises we make."
                </p>
                <div className="mt-6 flex justify-center items-center gap-3">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#E32219]" />
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[#E32219]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#E32219]" />
                </div>
                <p className="text-[#E32219] mt-4 font-medium tracking-wider text-sm">
                  TRRIDEV LABELSS MFG CO
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        
        .timeline-card {
          transform-style: preserve-3d;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}