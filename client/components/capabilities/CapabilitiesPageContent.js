"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Cpu, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Maximize, 
  Settings, 
  CheckCircle2,
  Scan,
  Printer,
  FileCode,
  Combine,
  Scissors,
  ArrowUpRight,
  Activity,
  Crosshair
} from 'lucide-react';
import Image from 'next/image';
import { getImgUrl } from '@/utils/image-url';
import LazyRender from '../common/LazyRender';
import FinishesGallery from '../home/FinishesGallery';

gsap.registerPlugin(ScrollTrigger);

export default function CapabilitiesPageContent({ galleryItems = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1200ms Performant Buffer: Delay engine startup to secure LCP & TBT
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Strict Scroll-Aware Reveal Engine
        gsap.utils.toArray('.reveal').forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              toggleActions: "play none none none",
              fastScrollEnd: true,
              preventOverlaps: true,
            }
          });
        });

        // Technical Line Animations
        gsap.utils.toArray('.tech-line').forEach((line) => {
          gsap.from(line, {
            scaleX: 0,
            duration: 1.5,
            ease: "expo.inOut",
            scrollTrigger: {
              trigger: line,
              start: "top 95%",
              fastScrollEnd: true,
            }
          });
        });
      }, containerRef);

      window._capCtx = ctx;
      ScrollTrigger.refresh();
    }, 1200);
    
    return () => {
      clearTimeout(timer);
      if (window._capCtx) window._capCtx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-white">
      {/* 1. Introduction & Overview - Blueprint Design */}
      <section className="relative my-16 md:my-24 lg:my-32 xl:my-40 bg-white overflow-hidden">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "80px 80px" }}></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Section Header */}
          <div className="max-w-4xl mb-24 reveal">
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#E32219]"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">Operational DNA</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-light text-gray-900 tracking-tighter leading-[1.1]">
              The Blueprint of <br />
              <span className="font-normal text-[#E32219]">Industrial Excellence.</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:h-[650px]">
            {[
              {
                id: "01",
                title: "In-House",
                subtitle: "Production",
                desc: "Our fully integrated manufacturing ecosystem covers the entire lifecycle of a label—from initial blueprint conceptualization and material selection to high-precision flexographic printing and final automated converting. By housing every stage under a single roof, we eliminate third-party logistics variables, ensuring absolute quality control, rapid prototyping timelines, and a zero-compromise approach to industrial specifications.",
                features: ["Integrated Design Workflow", "Direct QA Protocol Control", "Zero-Latency Dispatch Logs", "Rapid Engineering Response"],
                image: "/capabilities-images/dna-inhouse-production.png",
                icon: Maximize,
                spec: "100% Controlled Manufacturing Environment",
                metrics: "Operational Status: High Precision"
              },
              {
                id: "02",
                title: "Advanced",
                subtitle: "Technology",
                desc: "We deploy a fleet of cutting-edge Nilpeter and Mark Andy multi-color flexographic lines, seamlessly integrated with digital variable data units for unmatched serial intelligence. Our facility is powered by high-frequency LED curing systems that provide instant polymerization, enabling us to print on complex synthetic substrates with perfect registration and consistent color depth across high-volume production runs.",
                features: ["Multi-Color Flexo Lines", "UV-LED High-Speed Curing", "Digital Hybrid Print Units", "Automated Vision Inspection"],
                image: "/capabilities-images/dna-advanced-technology.png",
                icon: Settings,
                spec: "Intelligent Multi-Platform Agility",
                metrics: "Registration Accuracy: ±0.05mm"
              },
              {
                id: "03",
                title: "Industrial",
                subtitle: "Durability",
                desc: "Engineered for the most unforgiving environments, our label solutions utilize tier-1 automotive-grade substrates and high-performance adhesives. These materials are rigorously tested to survive extreme temperature fluctuations, harsh chemical exposure (including solvents and fuels), and intense mechanical abrasion. We ensure that your critical identification data remains legible and intact through the entire surface lifecycle.",
                features: ["Automotive Tier-1 Standards", "Chemical & Solvent Resistance", "Extreme Thermal Stability", "Anti-Microbial Material Options"],
                image: "/capabilities-images/dna-industrial-durability.png",
                icon: Zap,
                spec: "High-Performance Engineered Materials",
                metrics: "Certified Standard: ISO 15378"
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="reveal group relative z-10 flex-1 min-h-[300px] hover:flex-[6] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.3,1)] overflow-hidden rounded-[2.5rem] border border-white/10 cursor-pointer"
              >
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Overlays - Lightened */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-700"></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Technical Scanner Ring */}
                <div className="absolute top-10 left-10 w-16 h-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 backdrop-blur-md bg-white/5 rounded-full border border-white/10">
                    <div className="absolute inset-0 border border-white/40 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-2 border border-[#E32219]/30 rounded-full animate-pulse"></div>
                    <item.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-10 lg:p-16 flex flex-col justify-end">
                   <div className="space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <span className="text-[14px] font-bold text-[#E32219] font-mono drop-shadow-md">{item.id}</span>
                           <div className="tech-line w-8 h-[1px] bg-white/30 origin-left group-hover:w-20 group-hover:bg-[#E32219] transition-all duration-700 shadow-[0_0_10px_#E32219]"></div>
                         </div>
                         <span className="text-[10px] font-mono text-white tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10 uppercase">
                            {item.metrics}
                         </span>
                      </div>
                      
                      <div className="transition-transform duration-700 group-hover:-translate-y-2">
                        <h3 className="text-3xl lg:text-5xl font-light text-white leading-tight drop-shadow-2xl flex flex-wrap gap-x-4 uppercase tracking-tighter">
                          <span>{item.title}</span>
                          <span className="font-normal text-[#E32219] drop-shadow-[0_2px_10px_rgba(227,34,25,0.4)]">{item.subtitle}</span>
                        </h3>
                      </div>

                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-700 opacity-0 group-hover:opacity-100 overflow-hidden">
                        <div className="overflow-hidden">
                           <p className="text-white/90 text-sm lg:text-lg font-light leading-relaxed max-w-5xl mb-10 drop-shadow-lg">
                             {item.desc}
                           </p>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 mb-12">
                              {item.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-4 group/feat">
                                   <div className="w-2.5 h-2.5 rounded-full bg-[#E32219] border-2 border-white/20 shadow-[0_0_15px_#E32219]"></div>
                                   <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white group-hover/feat:text-[#E32219] transition-colors drop-shadow-sm">{feature}</span>
                                </div>
                              ))}
                           </div>

                           <div className="inline-flex items-center gap-4 bg-black/60 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#E32219] animate-pulse shadow-[0_0_10px_#E32219]"></div>
                              <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-white leading-none">{item.spec}</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>


            ))}
          </div>



        </div>
      </section>


      {/* 2. Advanced Flexographic Printing - Cinematic Immersive Module */}
      <section className="relative min-h-screen py-20 md:py-24 mb-16 md:mb-24 lg:mb-32 xl:mb-40 flex items-center overflow-hidden bg-black">
        {/* Optimized Background Image - Synced with WhyChooseSection */}
        <div className="absolute inset-0">
          <Image 
            src="/capabilities-images/flexo-background.png" 
            alt="Flexo Industrial Background" 
            fill 
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Technical HUD Overlay - Subtle */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "100px 100px" }}></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Vision & Identity (Clean Panels) */}
            <div className="lg:col-span-5 space-y-8 reveal">
               <div className="p-10 lg:p-12 bg-white/5 border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#E32219]/5 rounded-full blur-3xl"></div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-4">
                      <div className="w-12 h-px bg-[#E32219]"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">Engineering Vision</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tighter leading-tight lg:leading-[1.1] drop-shadow-md">
                      Precision in <br />
                      <span className="font-normal text-[#E32219] relative">
                        Flexo Science.
                        <span className="absolute -bottom-4 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#E32219]/50 to-transparent"></span>
                      </span>
                    </h2>

                    <p className="text-white/80 font-light text-base md:text-lg leading-relaxed max-w-sm">
                      Our high-speed flexographic units combine micro-accurate mechanical engineering with advanced ink chemistry for uncompromising industrial performance. We focus on providing end-to-end consistency from the first roll to the multi-millionth label.
                    </p>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                       <div>
                          <div className="text-2xl font-bold text-white tracking-tighter mb-1">±0.05</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Micron Registration</div>
                       </div>
                       <div>
                          <div className="text-2xl font-bold text-[#E32219] tracking-tighter mb-1">98.4%</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">OEE Efficiency</div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Expanded Machinery Showcase (Synced with WhyChoose Styles) */}
            <div className="lg:col-span-7 space-y-6">
               {[
                 {
                   name: "Nilpeter FB-350",
                   tag: "10-C Servo Driven",
                   desc: "Engineered for maximum efficiency and print quality. This flagship unit features full servo integration, ensuring perfect registration for complex 10-color labels, cold foiling, and in-line die cutting at extreme production speeds.",
                   features: ["Precision Cold Foiling", "Dual UV-LED Stations", "Auto-Registration Sync"],
                   icon: Activity
                 },
                 {
                   name: "Mark Andy 2200",
                   tag: "Industrial Load",
                   desc: "The globally recognized benchmark for roll-to-roll consistency. Optimized for heavy-duty industrial substrates, it delivers uncompromising durability and high-pigment ink adhesion for harsh environments and long-run consistency.",
                   features: ["High-Volume Roll Handling", "Quick-Shift Inking", "Advanced Tension Control"],
                   icon: Zap
                 }
               ].map((unit, uIdx) => (
                 <div key={uIdx} className="reveal group relative p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500">
                   <div className="flex flex-col md:flex-row gap-8 items-start">
                       <div className="w-16 h-16 shrink-0 bg-[#E32219]/10 rounded-2xl flex items-center justify-center border border-[#E32219]/20 group-hover:scale-110 transition-transform">
                          <unit.icon className="w-6 h-6 text-[#E32219]" />
                       </div>
                       <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-[#E32219] uppercase tracking-[0.4em]">{unit.tag}</span>
                             <span className="text-[9px] font-mono text-white/20">MODULE // {uIdx+1}</span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tighter uppercase drop-shadow-sm">{unit.name}</h3>
                          <p className="text-white/80 font-light text-sm leading-relaxed">
                             {unit.desc}
                          </p>
                          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                             {unit.features.map((feat, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-[#E32219]"></div>
                                   <span className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest">{feat}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                       <div className="hidden md:flex w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/10 group-hover:bg-[#E32219] group-hover:border-[#E32219] transition-all cursor-pointer">
                          <ArrowUpRight className="w-5 h-5 text-white" />
                       </div>
                    </div>
                 </div>
               ))}

               {/* Integrated Stats Strip */}
               <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-around reveal">
                  {[
                    "Micro-Step Registration",
                    "UV-LED Hyper-Cure",
                    "Multi-Web Tension Unit",
                    "Intelligent Defect Scan"
                  ].map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#E32219]"></div>
                       <span className="text-[10px] md:text-xs font-bold text-gray-200 uppercase tracking-widest">{feat}</span>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>

        {/* Vertical Identifier Decor */}
        <div className="absolute left-8 bottom-12 hidden xl:block">
           <div className="flex flex-col gap-8 items-center">
              <div className="rotate-90 text-[8px] font-bold text-white/20 uppercase tracking-[0.5em] whitespace-nowrap origin-left translate-y-12">System Protocol Active</div>
              <div className="w-px h-16 bg-linear-to-b from-transparent via-white/10 to-transparent pt-4"></div>
           </div>
        </div>
      </section>






      {/* 3. LED Ink Curing & Digital Variable Data - Elegant Technical Masterclass */}
      <section className="relative min-h-screen mb-16 md:mb-24 lg:mb-32 xl:mb-40 bg-white overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          
          {/* Section Header - Professional & Centered */}
          <div className="max-w-4xl mx-auto text-center mb-24 reveal">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-gray-200"></div>
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#E32219]">Quality Engineering</span>
              <div className="w-12 h-px bg-gray-200"></div>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight leading-tight mb-8">
              Post-Press <span className="font-normal text-[#E32219]">Excellence.</span>
            </h2>
            <p className="text-gray-500 font-light text-xl md:text-2xl leading-relaxed">
              Precision-engineered systems that ensure every label meets the highest standards of durability and individualized intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* LED Curing Pillar */}
            <div className="reveal group">
               <div className="p-10 md:p-14 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 h-full flex flex-col">
                  <div className="flex items-center gap-6 mb-10">
                     <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#E32219]/5 group-hover:border-[#E32219]/20 transition-all">
                        <Zap className="w-8 h-8 text-gray-400 group-hover:text-[#E32219] transition-colors" />
                     </div>
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Module 01</span>
                  </div>
                  
                  <div className="space-y-6 mb-12 flex-1">
                     <h3 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase">High-Frequency <br /> LED Curing</h3>
                     <p className="text-gray-600 font-light text-lg leading-relaxed">
                        Our advanced UV-LED arrays provide targeted wavelengths for instantaneous molecular cross-linking. Unlike traditional curing, this system maintains a cold process—preserving the integrity of temperature-sensitive substrates while enabling maximum production speeds.
                     </p>
                  </div>

                  <div className="pt-10 border-t border-gray-100">
                     <div className="grid grid-cols-2 gap-8">
                        {[
                          { label: "Stability", value: "395nm Fixed", detail: "Spectral consistency" },
                          { label: "Substrates", value: "Synthetics", detail: "Universal adhesion" },
                          { label: "Efficiency", value: "98% Sync", detail: "Energy optimized" },
                          { label: "Integrity", value: "Zero Thermal", detail: "Heat protection" }
                        ].map((item, i) => (
                           <div key={i} className="space-y-1">
                              <div className="text-[10px] font-bold text-[#E32219] uppercase tracking-widest">{item.label}</div>
                              <div className="text-xl font-bold text-gray-900 tracking-tight">{item.value}</div>
                              <div className="text-[10px] text-gray-400 font-light italic">{item.detail}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Variable Data Pillar */}
            <div className="reveal group lg:mt-12">
               <div className="p-10 md:p-14 bg-[#050505] rounded-3xl border border-gray-900 shadow-2xl h-full flex flex-col">
                  <div className="flex items-center gap-6 mb-10">
                     <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Scan className="w-8 h-8 text-[#E32219]" />
                     </div>
                     <span className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-none">Module 02</span>
                  </div>
                  
                  <div className="space-y-6 mb-12 flex-1">
                     <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">Dynamic <br /> Variable Data</h3>
                     <p className="text-white/60 font-light text-lg leading-relaxed">
                        Secure serialization and micro-coding injected in real-time. We enable individual batch intelligence through encrypted barcodes and QR symbology, providing a robust digital fingerprint for global track-and-trace security.
                     </p>
                  </div>

                  <div className="space-y-4 pt-10 border-t border-white/10">
                     {[
                       { title: "Serialized Intelligence", icon: ShieldCheck },
                       { title: "Dynamic QR Symbology", icon: FileCode },
                       { title: "Track & Trace Encryption", icon: Combine }
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-[#E32219]/30 transition-all">
                           <item.icon className="w-5 h-5 text-[#E32219]" />
                           <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{item.title}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Professional Footer Detail */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#E32219]/20 to-transparent"></div>
      </section>







      {/* 4. Specialty & Security Labels - Premium Engineering Portfolio */}
      <LazyRender minHeight="800px">
        <section className="relative mb-16 md:mb-24 lg:mb-32 xl:mb-40 bg-white overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            
            {/* Section Header - Site Signature */}
            <div className="max-w-4xl mx-auto text-center mb-24 reveal">
               <div className="inline-flex items-center gap-4 mb-6">
                  <div className="w-12 h-px bg-[#E32219]"></div>
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#E32219]">Security Engineering</span>
                  <div className="w-12 h-px bg-[#E32219]"></div>
               </div>
               <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-gray-900 leading-none">
                  Specialty & <br />
                  <span className="font-normal text-[#E32219]">Security Solutions.</span>
               </h2>
               <p className="mt-8 text-gray-500 font-light text-xl md:text-2xl max-w-3xl mx-auto">
                  Engineered finishes and high-authentication units designed for specialized global sectors, ensuring brand protection and regulatory compliance.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
              {[
                {
                  id: "01",
                  title: "In-Mould Labels",
                  desc: "Our IML units allow for the permanent integration of branding into the structural polymer of the container. This eliminates label peeling, provides total moisture resistance, and ensures a seamless, premium finish that is fully recyclable with the container body.",
                  tag: "Industrial Grade",
                  img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
                  specs: { App: "Auto / Industrial", Life: "10+ Years", Resistance: "Total Fusion" }
                },
                {
                  id: "02",
                  title: "Cross Over Labels",
                  desc: "Designed for the global pharmaceutical sector, these multi-layer constructions provide up to 8 printable panels. Essential for multi-lingual regulatory compliance, they offer a compact solution that maximizes data density without increasing packaging size.",
                  tag: "High Information",
                  img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200",
                  specs: { Panels: "Up to 8 Views", App: "Pharma / Medical", Std: "GDP Compliance" }
                },
                {
                  id: "03",
                  title: "Adhesive Side Print",
                  desc: "A critical covert security measure where high-fidelity serialization is printed on the adhesive layer. This data remains invisible until the label is breached, serving as an irrefutable forensic indicator of product authenticity and tamper history.",
                  tag: "Covert Protection",
                  img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1200",
                  specs: { Type: "Tamper Evidence", View: "Adhesive Secret", Security: "Forensic" }
                },
                {
                  id: "04",
                  title: "Cold Foiling",
                  desc: "Achieve high-luster metallic effects without the thermal overhead of traditional stamping. Our cold-foiling process enables precision application of gold and silver at full production speed, delivering a luxury aesthetic with zero substrate distortion.",
                  tag: "Premium Finish",
                  img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200",
                  specs: { Colors: "Gold / Silver", Process: "Zero-Heat", Sector: "Luxury Brands" }
                },
                {
                  id: "05",
                  title: "Hologram Solutions",
                  desc: "Integrated optical variable devices (OVD) featuring multi-level security hierarchies. From overt color shifts for consumer verification to covert micro-text for forensic auditing, our holograms provide a universal defense against high-tier counterfeits.",
                  tag: "Anti-Counterfeit",
                  img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200",
                  specs: { Tech: "3-Level Auth", Verify: "Optical Sync", Std: "ISO 12931" }
                },
                {
                  id: "06",
                  title: "Technical Material",
                  desc: "Engineered substrates developed for extreme industrial and medical environments. These materials are certified for chemical solvent resistance, cryogenic storage, and high-pressure sterilization, ensuring data longevity under aggressive stressors.",
                  tag: "Compliance Core",
                  img: "https://images.unsplash.com/photo-1532187875605-2fe358a71e68?auto=format&fit=crop&q=80&w=1200",
                  specs: { Adhesion: "14N Precision", Certs: "GMP Certified", Temp: "Ex-Industrial" }
                }
              ].map((card, i) => (
                <div key={i} className="reveal group relative flex flex-col bg-gray-50/30 rounded-[3rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700">
                   
                   {/* Top Image Container - Focus on Zoom */}
                   <div className="h-64 relative overflow-hidden">
                      <Image src={card.img} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" alt={card.title} />
                      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent"></div>
                      <div className="absolute top-8 left-8">
                         <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-gray-900 uppercase tracking-widest border border-white/20">
                            {card.tag}
                         </span>
                      </div>
                   </div>

                   {/* Bottom Content Container - Focus on Visibility & Depth */}
                   <div className="flex-1 p-10 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-baseline mb-6">
                           <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                              {card.title.split(' ').map((word, idx) => (
                                <span key={idx} className={idx === card.title.split(' ').length - 1 ? "font-semibold italic text-[#E32219]" : ""}>{word} </span>
                              ))}
                           </h3>
                           <span className="text-lg font-black text-gray-100 uppercase leading-none">
                              {card.id}
                           </span>
                        </div>
                        
                        <p className="text-gray-500 font-light text-base leading-relaxed mb-10">
                           {card.desc}
                        </p>
                      </div>

                      {/* Technical Specification Bar */}
                      <div className="pt-8 border-t border-gray-100 grid grid-cols-1 gap-2">
                         {Object.entries(card.specs).map(([key, val], idx) => (
                           <div key={idx} className="flex justify-between items-center text-[10px]">
                              <span className="font-bold uppercase tracking-[0.2em] text-gray-400">{key}</span>
                              <span className="font-semibold text-gray-900">{val}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              ))}
            </div>

            {/* Sector Support Strip */}
            <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap justify-center items-center gap-12 reveal">
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">Target Sectors</span>
               {["Pharmaceutical", "Spirits", "Cosmetics", "Automotive", "Food & Dairy"].map((sector, i) => (
                 <div key={i} className="text-sm font-medium text-gray-400 hover:text-[#E32219] transition-colors cursor-default">
                    {sector}
                 </div>
               ))}
            </div>
          </div>
        </section>
      </LazyRender>

      {/* 5. Converting & Expertise - Dual Power Module */}
      <LazyRender minHeight="600px">
        <section className="relative py-20 md:py-24 mb-16 md:mb-24 lg:mb-32 xl:mb-40 bg-[#050505] overflow-hidden text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(227,34,25,0.05)_0%,_transparent_70%)]"></div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
              
              {/* Converting Unit */}
              <div className="reveal flex flex-col justify-center">
                 <div className="space-y-8 mb-16">
                    <div className="inline-flex items-center gap-4">
                       <div className="w-12 h-px bg-[#E32219]"></div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E32219]">Post-Print Excellence</span>
                    </div>
                    <h2 className="text-6xl md:text-7xl font-light tracking-tighter leading-none">
                       Precision <br />
                       <span className="font-semibold italic text-white leading-none">Converting</span>
                    </h2>
                    <p className="text-gray-400 font-light text-lg leading-relaxed max-w-md">
                       High-speed finish units engineered for dimensional absolute stability and clean material separation.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { label: "Die Cutting", value: "±0.1mm Tolerance", icon: Scissors },
                      { label: "Refining", value: "100% Optic Inspection", icon: ShieldCheck },
                      { label: "Slitting", value: "Down to 3mm Micro", icon: Activity },
                      { label: "Rewinding", value: "High-Tension Roll Units", icon: Layers }
                    ].map((item, i) => (
                      <div key={i} className="reveal group/item relative">
                         <div className="flex items-center gap-4 mb-2">
                            <item.icon className="w-5 h-5 text-[#E32219]/60 group-hover/item:text-[#E32219] transition-colors" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.label}</h4>
                         </div>
                         <div className="text-lg font-medium text-white group-hover/item:translate-x-2 transition-transform">{item.value}</div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Industrial Expertise Unit */}
              <div className="reveal">
                 <div className="relative p-12 md:p-16 bg-white/[0.03] border border-white/10 rounded-[4rem] group overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(227,34,25,0.08),_transparent_40%)]"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-12">
                         <div className="w-16 h-16 bg-white shadow-2xl rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Cpu className="w-8 h-8 text-[#E32219]" />
                         </div>
                         <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Standard</div>
                            <div className="text-xs font-bold text-[#E32219]">ASTM-D3330</div>
                         </div>
                      </div>

                      <h3 className="text-4xl lg:text-5xl font-light mb-12 tracking-tight">
                         Industrial <br />
                         <span className="font-semibold italic text-[#E32219]">Expertise</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                         {[
                           "Polyester (PET) Substrates",
                           "Polycarbonate Overlays",
                           "Vinyl & Synthetic Film",
                           "Barcode / QR Serialization",
                           "Tamper-Evident Units",
                           "Tier-1 Automotive Labels",
                           "Cryogenic Resistance",
                           "High-Temp Thermal Bonds"
                         ].map((item, i) => (
                           <div key={i} className="flex items-center gap-4 py-1">
                              <div className="w-2 h-2 rounded-full bg-[#E32219]/60 shadow-[0_0_8px_rgba(227,34,25,0.4)]"></div>
                              <span className="text-sm md:text-base font-medium text-gray-200 group-hover:text-white transition-colors">{item}</span>
                           </div>
                         ))}
                      </div>

                      <div className="mt-16 pt-10 border-t border-white/10 flex items-center justify-between">
                         <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-[#E32219]">✓</div>
                            ))}
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">ISO 15378 · GMP · FDA</span>
                      </div>
                    </div>
                 </div>
              </div>

            </div>

            {/* Bottom Capabilities Strip */}
            <div className=" pt-12 ">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Core competencies</span>
                  <div className="h-4 w-px bg-white/10"></div>
                  <span className="text-xs text-gray-400">24/7 production</span>
                  <span className="text-xs text-white/20">•</span>
                  <span className="text-xs text-gray-400">Just-in-time delivery</span>
                  <span className="text-xs text-white/20">•</span>
                  <span className="text-xs text-gray-400">Lot traceability</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#E32219] bg-[#E32219]/10 border border-[#E32219]/20 px-4 py-2 rounded-full">
                    Tolerance: ±0.1mm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazyRender>

      <LazyRender minHeight="500px">
        <FinishesGallery />
      </LazyRender>
      
      {/* 6. Why TRRIDEV LABELSS? - Modern Value Showcase */}
      <LazyRender minHeight="600px">
        <section className="relative mb-16 md:mb-24 lg:mb-32 xl:mb-40 bg-white overflow-hidden">
          {/* Decorative Watermark */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-gray-50/50 pointer-events-none select-none uppercase tracking-tighter">
            QUALITY
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-0 rounded-[64px] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50 bg-white items-stretch reveal">
              <div className="w-full lg:w-[40%] bg-[#050505] p-16 md:p-24 text-white relative flex flex-col justify-between">
                <div className="absolute top-10 right-10 opacity-20">
                   <ShieldCheck className="w-24 h-24 text-[#E32219]" />
                </div>
                <div className="space-y-8 relative z-10">
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E32219]">Legacy of Trust</span>
                   <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight italic">Why <br /><span className="text-[#E32219]">Trridev?</span></h2>
                </div>
                <p className="text-gray-400 font-light leading-relaxed mt-12 relative z-10 max-w-xs">
                  We don’t just print labels — we engineer reliable identification solutions that enhance brand value, ensure compliance, and deliver performance.
                </p>
              </div>
              
              <div className="w-full lg:w-[60%] p-16 md:p-24 bg-white flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {[
                    { title: "Complete Capability", desc: "Dual flexo & digital label printing unit." },
                    { title: "Advanced LED", desc: "State-of-the-art ink curing technology." },
                    { title: "Specialty Expertise", desc: "Security and premium label solutions." },
                    { title: "In-House Converting", desc: "Fully integrated finishing infrastructure." },
                    { title: "Flexible Production", desc: "Agile bulk and short-run production models." },
                    { title: "On-Time Commitment", desc: "Reliable production and on-time delivery." },
                    { title: "Technical Support", desc: "Dedicated engineering and technical consultation." }
                  ].map((item, i) => (
                    <div key={i} className="group flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                         <CheckCircle2 className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                         <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">{item.title}</h4>
                      </div>
                      <p className="text-gray-500 text-xs font-light leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-16 pt-10 border-t border-gray-100 italic font-medium text-gray-400 text-sm">
                  Everything you need. <span className="text-[#E32219] font-bold">All under one roof.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazyRender>
    </div>
  );
}
