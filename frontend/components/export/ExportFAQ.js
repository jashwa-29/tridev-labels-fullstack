"use client";
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Plus, Minus, ShieldCheck, CreditCard, Headphones } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Why should we source from India?",
    a: "The biggest reason is the cost advantage. India offers high-quality manufacturing at a significantly lower cost. Our workforce is efficient, highly skilled, and English-speaking, making communication simple and clear."
  },
  {
    q: "Can we get sample labels before orders?",
    a: "Yes! We provide free printing for samples. You only cover minimal processing and courier costs. Samples typically reach any part of the world within 12 working days of artwork approval."
  },
  {
    q: "What are your payment terms for international orders?",
    a: "We accept either 100% advance after sample approval or we can open an LC (Letter of Credit) at the buyer's cost. This ensures security for both parties."
  },
  {
    q: "How do you handle shipping and documentation?",
    a: "We provide scanned and original copies of Air way Bill (AWB) / Bill of Lading (BL), Custom Invoice, and Packing List immediately upon dispatch from Chennai."
  }
];

export default function ExportFAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal support cards
      gsap.fromTo(".support-card", 
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true
          }
        }
      );

      // Reveal FAQs
      gsap.fromTo(".faq-item", 
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true
          }
        }
      );

      setTimeout(() => ScrollTrigger.refresh(), 1000);

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          <div className="space-y-12 sticky top-32">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="w-10 h-px bg-[#E32219]"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E32219]">Institutional Support</span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-gray-900 tracking-tighter leading-none">
                Addressing <br />
                <span className="text-[#E32219] font-medium italic">Global Queries.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: <CreditCard />, title: "Secure Shopping", desc: "Digital encryption on all cross-border transactions." },
                { icon: <ShieldCheck />, title: "Guaranteed Quality", desc: "Fully insured shipments with 100% correction policy." },
                { icon: <Headphones />, title: "Fast Response", desc: "Dedicated global department for instant clarity." }
              ].map((item, i) => (
                <div key={i} className="support-card p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-6 group hover:bg-white hover:shadow-xl transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#E32219] shadow-sm group-hover:bg-[#E32219] group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E32219] transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 font-light mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`faq-item border-b border-gray-100 overflow-hidden transition-all duration-700 ${openIndex === i ? "bg-gray-50/70 rounded-[32px] mb-6" : "mb-0"}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full py-8 px-8 flex items-center justify-between text-left group"
                >
                  <span className={`text-xl md:text-2xl tracking-tighter transition-all duration-300 font-medium max-w-[85%] ${openIndex === i ? "text-[#E32219] translate-x-2" : "text-gray-900 group-hover:text-[#E32219]"}`}>
                    {faq.q}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === i ? "bg-[#E32219] text-white rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"}`}>
                    {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${openIndex === i ? "max-h-[500px] opacity-100 pb-12" : "max-h-0 opacity-0"}`}>
                  <div className="px-10 text-gray-500 font-light leading-relaxed text-lg lg:text-xl max-w-2xl">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
