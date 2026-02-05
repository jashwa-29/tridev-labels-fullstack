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
    <section ref={sectionRef} className="py-20 md:py-32 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {stats.map((s, i) => (
            <div key={i} className="space-y-6">
              <div className="text-[#E32219] w-12 h-12 mx-auto mb-8 opacity-50">
                {s.icon}
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="stat-num text-7xl md:text-8xl font-black tracking-tighter text-white" data-value={s.value}>0</span>
                <span className="text-[#E32219] text-3xl font-light">+</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-200 uppercase tracking-[0.3em]">{s.label}</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
