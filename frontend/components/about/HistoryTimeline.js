"use client";

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, History } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    year: "2008",
    date: "August",
    title: "The Humble Beginning",
    description: "Started our factory with Two Letter Press Machines: the Iwasaki Strong Press and Semi Rotary FSK Press.",
    tag: "Incubate"
  },
  {
    year: "2010",
    date: "June",
    title: "Strategic Addition",
    description: "Expanded our printing capability with our third Letter Press Printing Machine, the Onda 250.",
    tag: "Expand"
  },
  {
    year: "2012",
    date: "December",
    title: "Post-Press Integration",
    description: "Added a dedicated Slitting Press Unit to our factory to handle growing demand for finished labels.",
    tag: "Integrate"
  },
  {
    year: "2014",
    date: "June",
    title: "Flexographic Leap",
    description: "Integrated the Mark Andy 2200 Flexographic Press to significantly boost our production capacity and speed.",
    tag: "Innovation"
  },
  {
    year: "2018",
    date: "February",
    title: "Refining Precision",
    description: "Added a Secondary Slitting Unit to our factory, further enhancing our finishing precision and quality control.",
    tag: "Refine"
  },
  {
    year: "2021",
    date: "August",
    title: "Advanced Automation",
    description: "Acquired our 4th Letterpress Machine with Repass facilities, Hot Foil, and a High Speed Servo Press system.",
    tag: "Automate"
  },
  {
    year: "2023",
    date: "January",
    title: "Major Infrastructure Shift",
    description: "Completed the move to our new 20,000 Sq Ft facility in Nehru Nagar, Kottivakkam, Chennai.",
    tag: "Ascend"
  }
];

export default function HistoryTimeline() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main timeline progress line
      gsap.from(".main-timeline-line", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: ".events-wrapper",
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });

      // Character-by-character reveal for Milestone Titles
      gsap.utils.toArray(".milestone-title").forEach((title) => {
        gsap.from(title, {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 95%",
          }
        });
      });

      // Node content entrance
      gsap.utils.toArray(".timeline-node").forEach((node, i) => {
        const isLeft = i % 2 === 0;
        
        gsap.from(node.querySelector(".node-inner-content"), {
          x: isLeft ? -40 : 40,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: node,
            start: "top 90%",
          }
        });

        // The central node dot rotation
        gsap.from(node.querySelector(".node-anchor"), {
          scale: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: node,
            start: "top 90%",
          }
        });
      });

      // Moving HUD Dot
      gsap.to(".hud-dot", {
        y: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".events-wrapper",
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return ( 
    <section ref={containerRef} className="pb-16 md:pb-24 lg:pb-32 xl:pb-40 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Centered Editorial Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="w-12 h-px bg-[#E32219]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">Chronicle // 16-Year Journey</span>
            <span className="w-12 h-px bg-[#E32219]"></span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight tracking-tighter">
            A Legacy of <br />
            <span className="font-medium text-[#E32219]">Engineering Trust.</span>
          </h2>
        </div>

        <div className="events-wrapper relative max-w-7xl mx-auto">
          
          {/* Main Kinetic Timeline Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-100 hidden md:block">
            <div className="main-timeline-line absolute top-0 left-0 w-full h-full bg-linear-to-b from-[#E32219] via-[#E32219] to-transparent origin-top"></div>
            <div className="hud-dot absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#E32219] z-50"></div>
          </div>

          <div className="space-y-24 md:space-y-36">
            {timelineData.map((item, i) => (
              <div 
                key={i} 
                className={`timeline-node relative flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Mid-sized Year Anchor */}
                <div className="node-anchor absolute left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-20 hidden md:block">
                  <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center relative shadow-lg">
                    <span className="text-sm font-bold text-gray-900 tracking-tighter">{item.year}</span>
                    <div className="absolute inset-1 rounded-full border border-[#E32219]/10 animate-pulse"></div>
                  </div>
                </div>

                {/* Content Block - Clean Typography */}
                <div className={`node-inner-content w-full md:w-[42%] ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] font-bold text-[#E32219] uppercase tracking-[0.4em]">{item.date} // {item.tag}</span>
                    </div>
                    
                    <h3 className="milestone-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tighter leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-500 font-light text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                      {item.description}
                    </p>

                    <div className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"} pt-4`}>
                      <div 
                        className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E32219] transition-colors cursor-pointer"
                        aria-label={`View details for ${item.year}`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background Shadow Text (The "Ghost Year") - Reduced scale for better visibility */}
                <div className={`absolute top-1/2 -translate-y-1/2 -z-10 text-[12vw] font-black text-gray-50/70 select-none pointer-events-none tracking-tighter ${
                   i % 2 === 0 ? "-left-12" : "-right-12"
                }`}>
                  {item.year}
                </div>

                {/* Symmetrical Spacing */}
                <div className="hidden md:block w-[42%]" />
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
