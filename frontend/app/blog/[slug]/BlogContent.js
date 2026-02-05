"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Share2,
  Bookmark,
  ChevronRight,
  Quote,
  Minus,
  User,
  Calendar,
  Tag,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImgUrl } from '@/utils/image-url';
import PageHeader from '@/components/common/PageHeader';

gsap.registerPlugin(ScrollTrigger);

export default function BlogContent({ blog }) {
  const containerRef = useRef(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-in', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });

      gsap.from('.hero-image', {
        scale: 1.1,
        duration: 1.5,
        ease: "power3.out"
      });

      // Parallax effect for hero image
      ScrollTrigger.create({
        trigger: '.hero-container',
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const y = self.progress * -100;
          gsap.to('.hero-image', { y: y * 0.5, ease: "none" });
        }
      });
    }, containerRef);

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!blog) return null;

  return (
    <div ref={containerRef} className={``}>
      
      {/* Sticky Navigation Header */}


      <PageHeader 
         title="Editorial"
         highlightTitle="Insights"
         subtitle=""
         highlightSubtitle="Engineering Archive"
         breadcrumb="Blog"
         description="Industry news, technical breakthroughs, and perspective from the Tridev innovation team."

      />

      <main className="pb-16">
        {/* Main Article Container - Centered and Aligned */}
        <article className="mx-auto px-6 md:px-12 lg:px-20 pt-6 md:pt-10">
          
          <div className="max-w-7xl mx-auto">
            {/* 1. Featured Hero Visual - Pure Presentation */}
            {blog.featuredImage && (
              <div className="mb-8 relative z-10">
                <div className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-[24px] md:rounded-[32px]">
                  <Image
                    src={getImgUrl(blog.featuredImage)}
                    alt={blog.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              </div>
            )}

            {/* 2. Article Title */}
            <div className="mb-8 fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 leading-[1.1] mb-6 tracking-tighter">
                {blog.title}
              </h1>
            </div>
            
            {/* 3. Metadata Row */}
            <div className="mb-8 fade-in">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-4">
                {blog.category && (
                  <span className="text-[9px] font-bold text-[#E32219] uppercase tracking-[0.2em] py-1 px-3 border border-[#E32219]/20 rounded-full bg-white shadow-sm">
                    {blog.category}
                  </span>
                )}
                {blog.publishedDate && (
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="size-1 rounded-full bg-gray-200"></div>
                    {format(new Date(blog.publishedDate), 'MMM dd, yyyy')}
                  </span>
                )}
                {blog.readingTime && (
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="size-1 rounded-full bg-gray-200"></div>
                    {blog.readingTime} read
                  </span>
                )}
              </div>
              
              {blog.author && (
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="size-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center">
                    <User size={14} className="text-[#E32219]" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">{blog.author}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Reading Column */}
            <div className="prose prose-lg md:prose-xl prose-gray max-w-none fade-in
              prose-headings:text-gray-900 prose-headings:font-medium prose-headings:tracking-tight
              prose-p:text-gray-700 prose-p:leading-[1.75] prose-p:mb-6 prose-p:font-light
              prose-strong:text-gray-950 prose-strong:font-medium
              prose-a:text-[#E32219] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-3xl prose-img:my-6"
            >
              {blog.excerpt && (
                <div className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed mb-8 border-l-4 border-[#E32219] pl-6 py-1">
                  {blog.excerpt}
                </div>
              )}

              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* 5. Highlight Module */}
            {blog.highlightBox && blog.highlightBox.title && (
              <div className="my-10 reveal-element">
                <div className="p-8 rounded-[24px] bg-[#f8f8f8] border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#E32219] rounded-full"></div>
                    {blog.highlightBox.title}
                  </h3>
                  
                  <div className="space-y-6">
                    {blog.highlightBox.intro && (
                      <p className="text-gray-600 text-sm leading-relaxed">{blog.highlightBox.intro}</p>
                    )}
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      {blog.highlightBox.points?.map((point, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="size-1.5 rounded-full bg-[#E32219] mt-2 shrink-0"></div>
                          <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Quote Section */}
            {blog.quote && (
              <div className="my-10 py-6 border-y border-gray-100 text-center reveal-element">
                <Quote className="size-8 text-gray-200 mx-auto mb-4" />
                <blockquote className="text-xl md:text-2xl font-light text-gray-800 italic leading-relaxed max-w-2xl mx-auto tracking-tight">
                  "{blog.quote}"
                </blockquote>
              </div>
            )}

            {/* 7. Dynamic Sections */}
            {blog.sections?.map((section, idx) => (
              <div key={idx} className="mb-10 reveal-element">
                <h2 className="text-2xl font-medium text-gray-900 mb-4 tracking-tight">{section.heading}</h2>
                <div 
                  className="prose prose-lg prose-gray max-w-none prose-p:leading-[1.75] prose-p:mb-6"
                  dangerouslySetInnerHTML={{ __html: section.content }} 
                />
              </div>
            ))}

            {/* 8. FAQs Section */}
            {blog.faqs?.length > 0 && (
              <div className="mt-12 pt-10 border-t border-gray-100 reveal-element">
                <h3 className="text-2xl font-medium text-gray-900 mb-6 tracking-tight">Frequently Asked Questions (FAQs)</h3>
                <div className="space-y-3">
                  {blog.faqs.map((faq, i) => (
                    <div key={i} className="p-5 bg-gray-50/50 border border-gray-100 rounded-xl">
                      <h4 className="text-base font-bold text-gray-950 mb-1">{faq.question}</h4>
                      <p className="text-sm text-gray-600 font-light leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Tags & Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2 fade-in">
              {blog.tags?.map((tag, idx) => (
                <span key={idx} className="px-3 py-1  text-[15px] font-bold uppercase tracking-widest text-[#E32219] rounded-full border border-[#E32219]">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between fade-in">
              <Link href="/blog" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#E32219] transition-colors">
                <ArrowLeft size={16} /> All Articles
              </Link>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-gray-900 transition-colors"><Share2 size={18} /></button>
                <button className="text-gray-400 hover:text-gray-900 transition-colors"><Bookmark size={18} /></button>
              </div>
            </div>
          </div>
        </article>
      </main>


    </div>
  );
}