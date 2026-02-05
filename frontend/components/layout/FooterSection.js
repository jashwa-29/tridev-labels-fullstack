"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, ArrowUp, Send, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { serviceService } from '@/services/service.service';

export default function FooterSection() {
  const [dynamicServices, setDynamicServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAll();
        if (response.success) {
          setDynamicServices(response.data.map(s => ({
            name: s.title,
            href: `/services/${s.slug}`
          })));
        }
      } catch (err) {
        console.error('Failed to fetch services for footer:', err);
      }
    };
    fetchServices();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    solutions: dynamicServices,
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Process', href: '/process' },
      { name: 'Latest Insights', href: '/blog' },
      { name: 'Exports', href: '/export' },
      { name: 'Careers', href: '/careers' },
    ],
    social: [
      { name: 'Instagram', icon: <Instagram size={18} />, href: '#' },
      { name: 'LinkedIn', icon: <Linkedin size={18} />, href: '#' },
      { name: 'Twitter', icon: <Twitter size={18} />, href: '#' },
    ]
  };

  return (
    <footer className="relative bg-[#050505] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        
        {/* Top Section - Brand Vision CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 pb-20 border-b border-white/10 mb-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tighter">
              Let's Define Your <br/>
              <span className="text-[#E32219] font-medium italic">Brand's Physical Identity.</span>
            </h2>
          </div>
          
          <Link 
            href="/contact"
            className="group relative px-10 py-5 bg-[#E32219] text-white rounded-sm transition-all duration-300 hover:bg-white hover:text-[#E32219] w-fit shadow-[0_0_20px_rgba(227,34,25,0.4)] hover:shadow-none overflow-hidden"
          >
            <span className="relative z-10 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-4">
              Start Your Project
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-900 transform group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight size={14} />
              </div>
            </span>
          </Link>
        </div>

        {/* Primary 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Column 1: Brand Identity */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <Image 
                src="/tridev-logo.png" 
                alt="Trridev Logo" 
                width={240}
                height={64}
                sizes="(max-width: 768px) 180px, 240px"
                className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs">
              Specializing in premium industrial labeling solutions across FMCG, Pharma, and Automotive sectors since 17+ years.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => (
                <Link 
                  key={social.name} 
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#E32219] hover:bg-[#E32219]/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-8">Industrial Solutions</h3>
            <ul className="space-y-4">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 font-light text-sm hover:text-[#E32219] hover:pl-2 transition-all duration-300 flex items-center gap-2">
                    <span className="h-px w-0 bg-[#E32219] transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-8">Trridev Group</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 font-light text-sm hover:text-[#E32219] hover:pl-2 transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Engineering */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-8">Contact Engineering</h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start group">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-[#E32219] group-hover:bg-[#E32219]/20 transition-all duration-300">
                  <MapPin size={18} />
                </div>
                <div className="pt-1">
                  <span className="block text-white text-xs font-bold uppercase tracking-widest mb-1">Chennai, India</span>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    A115, Nehru Nagar 2nd Main Road, <br/> 
                    7th Link Street, Kottivakkam, <br/> 
                    Chennai - 600041
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-center group">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-[#E32219] group-hover:bg-[#E32219]/20 transition-all duration-300">
                  <Mail size={18} />
                </div>
                <div>
                   <span className="block text-white text-xs font-bold uppercase tracking-widest mb-0.5">Corporate Email</span>
                   <Link href="mailto:kiruba@trridevlabelss.com" className="text-gray-400 font-light text-sm hover:text-[#E32219] transition-colors lowercase">
                     kiruba@trridevlabelss.com
                   </Link>
                </div>
              </li>
              <li className="flex gap-4 items-center group">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-[#E32219] group-hover:bg-[#E32219]/20 transition-all duration-300">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col gap-1">
                   <span className="block text-white text-xs font-bold uppercase tracking-widest">Support Lines</span>
                   <Link href="tel:+919600007995" className="text-gray-400 font-light text-sm hover:text-[#E32219] transition-colors">
                     +91 96000 07995
                   </Link>
                   <Link href="tel:04447839627" className="text-gray-400 font-light text-sm hover:text-[#E32219] transition-colors">
                     044-47839627
                   </Link>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Ledger */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em]">
            <p>&copy; {currentYear} Trridev Labelss Pvt Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em] hidden sm:block">Sustainable • Precise • Professional</span>
            {/* <button 
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#E32219] hover:bg-[#E32219] transition-all duration-500 group"
            >
              <ArrowUp size={20} className="transform group-hover:-translate-y-1 transition-transform" />
            </button> */}
          </div>
        </div>

      </div>
    </footer>
  );
}
