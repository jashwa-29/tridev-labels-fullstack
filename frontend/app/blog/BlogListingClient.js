"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export default function BlogListingClient({ initialBlogs, initialPage, totalPages }) {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (initialBlogs.length > 0) {
      const ctx = gsap.context(() => {
        // Entrance animation matching home page rhythm
        gsap.from(".blog-card-item", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%"
          }
        });

        // Header entrance
        if (headerRef.current) {
          gsap.from(headerRef.current.children, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
          });
        }
      }, containerRef);
      return () => ctx.revert();
    }
  }, [initialBlogs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/blog?page=${newPage}`, { scroll: true });
    }
  };

  return (
    <section ref={containerRef} className="pb-32 relative z-10">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 py-20">
        
        {/* Tridev Signature Section Header */}
        {initialBlogs.length > 0 && (
          <div ref={headerRef} className="max-w-4xl mx-auto mb-20 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#E32219]"></div>
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-500">
                The Knowledge Base
              </span>
              <div className="h-px w-8 bg-[#E32219]"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight tracking-tighter">
              Explore Our <span className="font-medium text-[#E32219]">Latest</span> Thinking
            </h2>
          </div>
        )}

        {initialBlogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-light text-gray-500 tracking-tight">Archives unpopulated.</h3>
          </div>
        ) : (
          <>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
               {initialBlogs.map((blog) => (
                 <Link key={blog._id} href={`/blog/${blog.slug}`} className="blog-card-item group block cursor-pointer">
                   <article className="flex flex-col h-full">
                     {/* High-End Image Container */}
                     <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-gray-50 shadow-xl shadow-black/3 mb-8">
                        <Image 
                          src={blog.featuredImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0"} 
                          alt={blog.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover brightness-95 group-hover:brightness-105 group-hover:scale-110 transition-all duration-1000"
                        />
                       
                       {/* Category Badge */}
                       <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#E32219] text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                         {blog.category || 'Article'}
                       </div>
                     </div>

                     {/* Refined Content */}
                     <div className="flex-1 flex flex-col">
                       <div className="flex items-center gap-6 text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                         <div className="flex items-center gap-2">
                           <Calendar size={12} className="text-[#E32219]" />
                           <span>{blog.publishedDate ? format(new Date(blog.publishedDate), 'MMM dd, yyyy') : 'Recent'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <User size={12} className="text-[#E32219]" />
                           <span>{blog.author || 'Tridev Team'}</span>
                         </div>
                       </div>

                       <h3 className="text-2xl md:text-3xl font-light text-gray-900 group-hover:text-[#E32219] transition-colors duration-400 mb-6 leading-tight tracking-tight line-clamp-2">
                         {blog.title}
                       </h3>

                       <p className="text-gray-500 font-light leading-relaxed mb-8 line-clamp-3 text-base flex-1">
                         {blog.metaDescription || "Click to read full article exploration into the nuances of modern production and aesthetic precision."}
                       </p>

                       <div className="mt-auto">
                          <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-900 group-hover:gap-5 transition-all duration-300 border-b border-gray-100 group-hover:border-[#E32219]/30 pb-2 w-fit">
                             Read Full Article <ArrowUpRight size={14} className="text-[#E32219] transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                       </div>
                     </div>
                   </article>
                 </Link>
               ))}
             </div>

             {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-32 flex items-center justify-center gap-4">
                   <button 
                      onClick={() => handlePageChange(initialPage - 1)}
                      disabled={initialPage === 1}
                      aria-label="Previous page"
                      className="p-5 rounded-full border border-gray-100 hover:border-[#E32219] text-gray-500 hover:text-[#E32219] transition-all disabled:opacity-20 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
                   >
                      <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" />
                   </button>
                   
                   <div className="flex items-center gap-3">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                         <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            aria-label={`Go to page ${pageNum}`}
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                              ${initialPage === pageNum 
                                 ? 'bg-[#E32219] text-white shadow-xl shadow-[#E32219]/20' 
                                 : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 hover:border-gray-200'}`}
                         >
                            {String(pageNum).padStart(2, '0')}
                         </button>
                      ))}
                   </div>

                   <button 
                      onClick={() => handlePageChange(initialPage + 1)}
                      disabled={initialPage === totalPages}
                      aria-label="Next page"
                      className="p-5 rounded-full border border-gray-100 hover:border-[#E32219] text-gray-500 hover:text-[#E32219] transition-all disabled:opacity-20 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
                   >
                      <ChevronRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
                   </button>
                </div>
              )}
          </>
        )}
      </div>
    </section>
  );
}
