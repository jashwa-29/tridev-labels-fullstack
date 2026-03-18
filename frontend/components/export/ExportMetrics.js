"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ThumbsUp, Medal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: <Medal />, label: "Google Reviews", value: 140, sub: "Verified Global Feedback" },
  { icon: <ThumbsUp />, label: "Facebook Likes", value: 1202, sub: "Loyal Brand Followers" },
  { icon: <Star />, label: "B2B Ratings", value: 440, sub: "Institutional Trust Index" }
];

export default function ExportMetrics() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal blocks
      gsap.fromTo(".stat-block", 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true
          }
        }
      );

      setTimeout(() => ScrollTrigger.refresh(), 1000);

      // Float icons
      gsap.to(".stat-icon", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });

      // Counters
      gsap.utils.toArray(".stat-num").forEach((num) => {
        const val = parseInt(num.getAttribute("data-value"));
        gsap.to(num, {
          innerText: val,
          duration: 3,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: num,
            start: "top 90%",
            once: true
          }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {stats.map((s, i) => (
            <div key={i} className="stat-block space-y-6">
              <div className="stat-icon text-[#E32219] w-12 h-12 mx-auto mb-8 opacity-60">
                {s.icon}
              </div>
              <div className="flex items-center justify-center gap-1 group">
                <span className="stat-num text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white group-hover:text-[#E32219] transition-colors duration-500" data-value={s.value}>0</span>
                <span className="text-[#E32219] text-3xl font-light">+</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.3em]">{s.label}</h3>
                <div className="w-8 h-px bg-[#E32219] mx-auto opacity-30"></div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
