"use client";
import { useState } from 'react';
import { ChevronDown, Plus, Minus, ShieldCheck, CreditCard, Headphones } from 'lucide-react';

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

  return (
    <section className="py-24 md:py-36 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E32219]">Institutional Support</span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 tracking-tighter leading-tight">
                Addressing <br />
                <span className="text-[#E32219] font-medium italic">Global Queries.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-6 group hover:bg-white hover:shadow-xl transition-all">
                <CreditCard className="w-10 h-10 text-[#E32219]" />
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#E32219] transition-colors">Secure Shopping</h3>
                  <p className="text-sm text-gray-500 font-light mt-1">Credit card safety is assured through high-level encryption.</p>
                </div>
              </div>
              <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-6 group hover:bg-white hover:shadow-xl transition-all">
                <ShieldCheck className="w-10 h-10 text-[#E32219]" />
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#E32219] transition-colors">Guaranteed Quality</h3>
                  <p className="text-sm text-gray-500 font-light mt-1">Mistakes are corrected at no charge. Fully insured shipments.</p>
                </div>
              </div>
              <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-6 group hover:bg-white hover:shadow-xl transition-all">
                <Headphones className="w-10 h-10 text-[#E32219]" />
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#E32219] transition-colors">Fast Response</h3>
                  <p className="text-sm text-gray-500 font-light mt-1">Our international department answers emails quickly and accurately.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`border-b border-gray-100 overflow-hidden transition-all duration-500 ${openIndex === i ? "bg-gray-50/50 rounded-2xl md:rounded-3xl" : ""}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full py-8 px-8 flex items-center justify-between text-left group"
                >
                  <span className={`text-xl md:text-2xl tracking-tighter transition-colors duration-300 font-medium ${openIndex === i ? "text-[#E32219]" : "text-gray-900 group-hover:text-[#E32219]"}`}>
                    {faq.q}
                  </span>
                  {openIndex === i ? <Minus className="w-5 h-5 text-[#E32219]" /> : <Plus className="w-5 h-5 text-gray-400" />}
                </button>
                
                <div className={`transition-all duration-500 ease-in-out ${openIndex === i ? "max-h-[500px] opacity-100 pb-10" : "max-h-0 opacity-0"}`}>
                  <div className="px-8 text-gray-500 font-light leading-relaxed text-lg max-w-xl">
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
