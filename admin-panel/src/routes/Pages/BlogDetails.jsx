import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Tag as TagIcon, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Share2,
  FileText
} from "lucide-react";
import { Toast } from '@/components';

import { blogService } from "@/services/blog.service";

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await blogService.getBySlug(slug);
        setBlog(res.data); // blogService/apiClient returns res.data directly, so res.data is the blog object or {success, data}
        // Wait, apiClient.js returns response.data. 
        // blogController returns { success: true, data: blog }
        // So response.data is { success: true, data: blog }
        // res will be { success: true, data: blog }
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message || "Archive retrieval failed.");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSuccessMessage("Preview link copied to clipboard");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
        <div className="size-12 rounded-full border-4 border-slate-100 border-t-red-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Previewing Archive...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="size-20 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
          <ArrowLeft size={40} />
        </div>
        <h2 className="text-2xl font-black text-black mb-2">Article Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm">The article you're looking for might have been moved or deleted from the system.</p>
        <Link to="/dashboard/blogs" className="btn-primary">
          <ArrowLeft size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  let tags = [];
  if (blog.tags) {
    if (typeof blog.tags === "string") {
      try { tags = JSON.parse(blog.tags); } catch { tags = []; }
    } else if (Array.isArray(blog.tags)) {
      tags = blog.tags;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Toast type="success" message={successMessage} />
      <Toast type="error" message={error} />
      <Helmet>
        <title>{`${blog.title} | Admin Preview`}</title>
        <meta name="description" content={blog.metaDescription || ""} />
      </Helmet>

      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-12">
        <Link to="/dashboard/blogs" className="group flex items-center gap-3 text-slate-400 hover:text-black transition-colors">
          <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-black group-hover:text-white transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Back to List</span>
        </Link>
        <div className="flex items-center gap-2">
           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${blog.isPublished ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
            {blog.isPublished ? 'Live on Site' : 'Draft Mode'}
          </span>
        </div>
      </div>

      <article className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100">
        {/* Hero Section */}
        {blog.featuredImage && (
          <div className="relative aspect-[21/9] overflow-hidden grayscale-[30%] hover:grayscale-0 transition-all duration-700">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-10 left-10">
              <span className="inline-block bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg mb-4 shadow-xl">
                {blog.category || 'Industry Insights'}
              </span>
            </div>
          </div>
        )}

        <div className="p-10 md:p-16">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Written By</p>
                <p className="text-sm font-bold text-black">{blog.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Published On</p>
                <p className="text-sm font-bold text-black">{new Date(blog.publishedDate || blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-black mb-10 leading-[1.1] tracking-tight">
            {blog.title}
          </h1>

          {/* Main Content */}
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-red-600 mb-16">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Sections */}
          {Array.isArray(blog.sections) && blog.sections.length > 0 && (
            <div className="space-y-12 mb-16">
              {blog.sections.map((section, idx) => (
                <div key={idx} className="group border-l-4 border-red-600 pl-8 transition-all hover:pl-10">
                  <h2 className="text-3xl font-black text-black mb-6 tracking-tight group-hover:text-red-600 transition-colors">{section.heading}</h2>
                  <div 
                    className="text-lg text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Highlight Box */}
          {blog.highlightBox?.title && (
            <div className="bg-black rounded-[2.5rem] p-10 md:p-14 mb-16 text-white overflow-hidden relative shadow-2xl ring-1 ring-white/10">
              <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                <CheckCircle2 size={160} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-2xl font-black">{blog.highlightBox.title}</h3>
                </div>
                <p className="text-slate-300 text-lg mb-10 border-l-2 border-white/10 pl-6" style={{ whiteSpace: "pre-line" }}>
                  {blog.highlightBox.intro}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {blog.highlightBox.points?.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="size-2 rounded-full bg-red-600" />
                      <span className="text-sm font-bold text-slate-200">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQs */}
          {Array.isArray(blog.faqs) && blog.faqs.length > 0 && (
            <div className="bg-slate-50 rounded-[2.5rem] p-10 md:p-14 mb-16 shadow-inner ring-1 ring-slate-100">
              <div className="flex items-center gap-3 mb-10">
                <div className="size-12 rounded-2xl bg-black text-white flex items-center justify-center">
                  <HelpCircle size={24} />
                </div>
                <h2 className="text-3xl font-black text-black tracking-tight">Frequently Asked Questions (FAQs)</h2>
              </div>
              <div className="space-y-6">
                {blog.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-black text-black mb-4 flex items-start gap-3">
                      <span className="text-red-600">Q.</span>
                      {faq.question}
                    </h4>
                    <p className="text-slate-600 leading-relaxed pl-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="pt-12 border-t border-slate-50">
              <div className="flex items-center gap-3 mb-6">
                <TagIcon size={20} className="text-slate-400" />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Content Classification</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full border border-slate-200 hover:border-red-600 hover:text-red-600 transition-all cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Footer Banner */}
      <div className="mt-12 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Article Preview Ends Here</p>
        <div className="flex justify-center gap-4">
          <Link to="/dashboard/blogs" className="btn-secondary h-12">
            Return to Management
          </Link>
          <button onClick={handleCopyLink} className="btn-primary h-12 px-8">
            <Share2 size={18} />
            <span>Copy Preview Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
