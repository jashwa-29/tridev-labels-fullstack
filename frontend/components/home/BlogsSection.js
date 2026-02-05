"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, User, Send } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { blogService } from '@/services/blog.service';
import SectionLoader from '@/components/common/SectionLoader';
import { format } from 'date-fns';
import { getImgUrl } from '@/utils/image-url';

gsap.registerPlugin(ScrollTrigger);

export default function BlogsSection() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs on mount
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const response = await blogService.getAll(1, 4); // Fetch 4 recent blogs
        // Standardized response handling: apiClient returns the whole JSON body
        const items = response?.data || [];
        setBlogs(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("BlogsSection: API Synchronization failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBlogs();
  }, []);

  // Animations (run only after loading is done and we have blogs)
  useEffect(() => {
    if (loading || blogs.length === 0) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(headerRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%"
        }
      });

      // Cards stagger reveal
      gsap.from(".blog-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".blog-grid",
          start: "top 85%"
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading, blogs]);

  if (loading) {
    return (
      <div className="py-20">
         <SectionLoader message="Syncing Editorial Content..." />
      </div>
    );
  }
  
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const secondaryBlogs = blogs.length > 1 ? blogs.slice(1, 4) : [];

  return (
    <section ref={containerRef} className="pb-16 md:pb-24 lg:pb-32 xl:pb-40 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 lg:px-20">
        
        {/* Trridev Signature Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto mb-16 md:mb-24 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#E32219]"></div>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">
              Industrial Insights
            </span>
            <div className="h-px w-8 bg-[#E32219]"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight tracking-tighter">
            Labeling <span className="font-medium text-[#E32219]">Expertise</span> & Trends
          </h2>
          
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Stay ahead with the latest innovations in industrial printing, 
            sustainable packaging, and supply chain technology.
          </p>
        </div>

        {/* Editorial Blog Grid */}
        <div className="blog-grid grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {blogs.length === 0 ? (
            <div className="col-span-full py-20 text-center border-t border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
                    Editorial Archive Unpopulated
                </p>
            </div>
          ) : (
            <>
              {/* Featured Post (Left) */}
              <Link href={`/blog/${featuredBlog.slug}`} className="blog-card lg:col-span-7 group cursor-pointer lg:sticky lg:top-32 block">
                <div className="relative h-full flex flex-col">
                  <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-gray-100 shadow-xl shadow-black/5">
                    <Image 
                      src={getImgUrl(featuredBlog.featuredImage) || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"} 
                      alt={featuredBlog.title}
                      fill
                      loading="lazy"
                      unoptimized={true}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#E32219] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm z-10">
                      {featuredBlog.category || 'Article'}
                    </div>
                  </div>
                  
                  <div className="pt-8 flex-1 flex flex-col justify-between">
                    <div>
                       <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-[#E32219]" /> 
                            {featuredBlog.publishedDate ? format(new Date(featuredBlog.publishedDate), 'MMM dd, yyyy') : 'Recently'}
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={12} className="text-[#E32219]" /> 
                            By {featuredBlog.author || 'Tridev Team'}
                          </div>
                       </div>
                       <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 group-hover:text-[#E32219] transition-colors duration-300 mb-6 leading-tight tracking-tight">
                          {featuredBlog.title}
                       </h3>
                       <p className="text-gray-500 font-light text-lg leading-relaxed max-w-xl mb-8 line-clamp-3">
                          {featuredBlog.summary || featuredBlog.excerpt || "Click to read full article..."}
                       </p>
                    </div>
                    
                    <div>
                       <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-900 group-hover:gap-5 transition-all duration-300 border-b border-gray-200 pb-2 w-fit">
                          Read Full Article <ArrowUpRight size={16} className="text-[#E32219]" />
                       </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Secondary Posts (Right Column) */}
              <div className="lg:col-span-5 flex flex-col gap-10">
                <div className="space-y-10">
                  {secondaryBlogs.map((blog) => (
                    <Link href={`/blog/${blog.slug}`} key={blog._id} className="blog-card group cursor-pointer border-b border-gray-100 pb-10 last:border-0 last:pb-0 block">
                      <div className="flex flex-col md:flex-row gap-6">
                         <div className="w-full md:w-44 aspect-square shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm relative">
                            <Image 
                              src={getImgUrl(blog.featuredImage) || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"} 
                              alt={blog.title}
                              fill
                              loading="lazy"
                              unoptimized={true}
                              sizes="(max-width: 768px) 100vw, 200px"
                              className="w-full h-full object-cover brightness-95 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
                            />
                         </div>
                         
                         <div className="flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-[#E32219] uppercase tracking-widest mb-2 block">{blog.category || 'Opinion'}</span>
                            <h3 className="text-xl lg:text-2xl font-medium text-gray-900 group-hover:text-[#E32219] transition-colors duration-300 mb-3 tracking-tight leading-snug line-clamp-2">
                               {blog.title}
                            </h3>
                            <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                               <Calendar size={12} /> {blog.publishedDate ? format(new Date(blog.publishedDate), 'MMM dd, yyyy') : 'Recently'}
                            </div>
                         </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All CTA - Strategic Placement */}
                <div className="mt-6">
                   <Link href="/blog">
                     <button className="relative px-8 sm:px-12 py-4 sm:py-5 bg-gray-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] rounded-sm group overflow-hidden shadow-xl transition-all duration-300 w-full md:w-auto">
                        <span className="relative z-10 flex items-center justify-center gap-4">
                          View All Insights
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </span>
                        <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                     </button>
                   </Link>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </section>
  );
}
