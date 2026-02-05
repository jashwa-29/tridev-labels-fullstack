"use client";

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { serviceService } from '@/services/service.service';
import SectionLoader from '@/components/common/SectionLoader';
import { Box } from 'lucide-react';
import { getImgUrl } from '@/utils/image-url';

gsap.registerPlugin(ScrollTrigger);

const DefaultIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function ReyndersCard({ service, isActive, isAnyActive, onHover }) {
  return (
    <Link 
      href={`/services/${service.slug}`}
      onMouseEnter={onHover}
      className={`relative h-[300px] md:h-[450px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group ${isActive ? 'md:flex-[3]' : 'md:flex-1'} ${
        isActive 
          ? 'shadow-2xl z-10' 
          : isAnyActive 
            ? 'grayscale-[0.3] hover:grayscale-0' 
            : 'grayscale-0'
      }`}
    >
      <div className={`absolute inset-0 transition-all duration-1000 ease-out transform origin-center ${
         isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-90'
      }`}>
         <Image 
           src={getImgUrl(service.cardImage) || getImgUrl(service.heroImage) || "https://i.pinimg.com/1200x/28/69/48/286948c062ac9bd2c97422fef9fa527c.jpg"} 
           alt={service.title}
           fill
           loading="lazy"
           unoptimized={true}
           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
           className="object-cover transition-opacity duration-500"
         />
      </div>

      <div className={`absolute inset-0 bg-[#E32219]/80 transition-all duration-700 ${
         isActive ? 'opacity-100' : 'opacity-0'
      }`} />

      <div className="relative h-full w-full p-8 md:p-10 flex flex-col justify-end z-20">
         <div className="transition-all duration-700 transform translate-y-2 group-hover:translate-y-0">
            <div className="mb-4 md:mb-6">
               <h3 className={`uppercase tracking-tighter font-bold leading-none mb-3 md:mb-4 transition-all duration-700 ${
                  isActive ? 'text-2xl md:text-5xl text-white' : 'text-xl md:text-3xl text-black'
               }`}>
                  {service.title}
               </h3>
               
               <div className="h-[4px] md:h-[6px] rounded-full transition-all duration-700 ease-out bg-white"
                    style={{ width: isActive ? '120px' : '40px' }} 
               />
            </div>

            <div className={`
              grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
              ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4 md:mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'}
            `}>
               <div className="overflow-hidden min-h-0">
                  <p className="text-white/95 text-sm md:text-lg leading-relaxed mb-6 md:mb-10 font-medium max-w-xl">
                     {service.subtitle || service.description}
                  </p>
                  
                  <div className="inline-flex items-center gap-3 text-xs md:text-sm font-black uppercase tracking-widest border-b-2 border-white pb-2 text-white hover:text-white/80 hover:border-white/80 transition-all">
                     Explore Solution
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </div>
               </div>
            </div>
         </div>
         
         <div className={`absolute top-6 md:top-10 right-6 md:right-10 p-3 md:p-4 rounded-[20px] bg-white/20 backdrop-blur-xl border border-white/30 transition-all duration-700 ${isActive ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}`}>
            <div className="text-white">
               <DefaultIcon />
            </div>
         </div>
      </div>
    </Link>
  );
}

export default function SolutionsSection() {
  const [dynamicSolutions, setDynamicSolutions] = useState([]);
  const [activeRow1, setActiveRow1] = useState(0); 
  const [activeRow2, setActiveRow2] = useState(null);
  const [activeRow3, setActiveRow3] = useState(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await serviceService.getAll();
        setDynamicSolutions(response.data || []);
      } catch (err) {
        console.error('Failed to fetch solutions:', err);
      }
    };
    fetchSolutions();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
       gsap.fromTo(containerRef.current, 
          { y: 50, opacity: 0 },
          {
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: "power4.out",
            scrollTrigger: {
               trigger: containerRef.current,
               start: "top 95%",
               toggleActions: "play none none none"
            },
            clearProps: "all"
          }
       );
       
       if(headerRef.current) {
         gsap.from(headerRef.current.children, {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%"
            }
         });
       }
    });
    return () => ctx.revert();
  }, []);

  // Split dynamic solutions into rows of 3
  const row1 = dynamicSolutions.slice(0, 3);
  const row2 = dynamicSolutions.slice(3, 6);
  const row3 = dynamicSolutions.slice(6, 9);

  return (
    <section id="services" className="relative  overflow-hidden pb-20 md:pb-40">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{
             backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }} 
      />

      <div ref={containerRef} className="container mx-auto px-6 relative z-10">
        
 <div ref={headerRef} className="text-center max-w-5xl mx-auto mb-12 md:mb-20">
          <div className="flex items-center justify-center mb-6 md:mb-10">
            <div className="h-px w-10 md:w-16 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="mx-3 md:mx-5 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 whitespace-nowrap">
              Tailored Solutions
            </div>
            <div className="h-px w-10 md:w-16 bg-linear-to-l from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="relative mb-6 md:mb-10 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight leading-tight md:leading-[0.95] text-center">
              <span className="font-normal block md:inline">Precision Label</span>
              <span className="font-normal relative block md:inline mt-2 md:mt-0">
                <span className="text-[#E32219] md:ml-4">Solutions</span>
                <span className="absolute -bottom-2 left-1/4 right-1/4 md:left-0 md:right-0 h-px bg-linear-to-r from-transparent via-[#E32219]/50 to-transparent"></span>
              </span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto mt-8 md:mt-12">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light tracking-wide px-4">
              Expertly crafted labels that elevate your brand through innovative 
              design and meticulous attention to detail.
            </p>
          </div>
        </div>


        {/* Dynamic Horizontal Accordion Layout */}
        <div className="space-y-6 md:space-y-8">
           {row1.length > 0 && (
             <div 
               className="flex flex-col md:flex-row gap-6 md:min-h-[450px]"
               onMouseLeave={() => setActiveRow1(null)}
             >
                {row1.map((s, idx) => (
                   <ReyndersCard 
                      key={s._id} 
                      service={s} 
                      isActive={activeRow1 === idx} 
                      isAnyActive={activeRow1 !== null}
                      onHover={() => setActiveRow1(idx)}
                   />
                ))}
             </div>
           )}

           {row2.length > 0 && (
             <div 
               className="flex flex-col md:flex-row gap-6 md:min-h-[450px]"
               onMouseLeave={() => setActiveRow2(null)}
             >
                {row2.map((s, idx) => (
                   <ReyndersCard 
                      key={s._id} 
                      service={s} 
                      isActive={activeRow2 === idx} 
                      isAnyActive={activeRow2 !== null}
                      onHover={() => setActiveRow2(idx)}
                   />
                ))}
             </div>
           )}

           {row3.length > 0 && (
             <div 
               className="flex flex-col md:flex-row gap-6 md:min-h-[450px]"
               onMouseLeave={() => setActiveRow3(null)}
             >
                {row3.map((s, idx) => (
                   <ReyndersCard 
                      key={s._id} 
                      service={s} 
                      isActive={activeRow3 === idx} 
                      isAnyActive={activeRow3 !== null}
                      onHover={() => setActiveRow3(idx)}
                   />
                ))}
             </div>
           )}

           {dynamicSolutions.length === 0 && (
             <div className="col-span-full">
                <SectionLoader message="Calibrating Production Lines..." />
             </div>
           )}
        </div>
      </div>
    </section>
  );
}
