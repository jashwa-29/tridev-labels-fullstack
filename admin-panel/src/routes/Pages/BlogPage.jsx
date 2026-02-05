import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Pencil, 
  Plus, 
  X, 
  Check, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  Tag,
  Calendar,
  User,
  Eye,
  Settings,
  HelpCircle,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertCircle,
  Search,
  MessageSquare,
  Save,
  Clock,
  ExternalLink,
  ArrowLeft,
  ListRestart,
  Zap
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Toast, DeleteModal, SuccessModal, Pagination } from '@/components';
import { blogService } from "@/services/blog.service";

// Helper components
const CollapsibleSection = ({ title, icon: Icon, isExpanded, onToggle, children, badge }) => (
  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-300">
    <button
      type="button"
      onClick={onToggle}
      className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl ${isExpanded ? 'bg-black text-white shadow-lg shadow-slate-200' : 'bg-slate-100 text-slate-500'}`}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-black text-black uppercase tracking-widest">{title}</h3>
          {!isExpanded && badge && <span className="text-[10px] font-bold text-red-600 mt-1 block">{badge}</span>}
        </div>
      </div>
      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
        <ChevronDown size={20} className="text-slate-400" />
      </div>
    </button>
    {isExpanded && (
      <div className="p-8 border-t border-slate-50 bg-white animate-in slide-in-from-top-4 duration-300">
        {children}
      </div>
    )}
  </div>
);

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    slug: "",
    content: "",
    sections: [{ heading: "", content: "" }],
    highlightBox: { title: "", intro: "", points: [""] },
    faqs: [{ question: "", answer: "" }],
    category: "",
    tags: [],
    newTag: "",
    metaDescription: "",
    publishedDate: "",
    featuredImage: null,
    featuredImagePreview: null,
    author: "",
    isPublished: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    content: false,
    additional: false,
    faqs: false,
    highlights: false,
    settings: false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await blogService.getAll({ admin: true, limit: 1000 });
      setBlogs(res.data || []);
    } catch (err) {
      setError("System failure: Unable to sync with the archive.");
    } finally {
      setIsLoading(false);
    }
  }, [blogService]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchBlogs();
  }, [navigate, fetchBlogs]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "title") {
      const slug = value.toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      setNewBlog(prev => ({ ...prev, title: value, slug }));
    } else {
      setNewBlog(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const clearForm = () => {
    setNewBlog({
      title: "", slug: "", content: "",
      sections: [{ heading: "", content: "" }], highlightBox: { title: "", intro: "", points: [""] },
      faqs: [{ question: "", answer: "" }], category: "", tags: [], newTag: "",
      metaDescription: "", publishedDate: "", featuredImage: null,
      featuredImagePreview: null, author: "", isPublished: false,
    });
    setEditingId(null);
    setError("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBlog.title.trim()) return setError("Title is strictly mandatory.");
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(newBlog).forEach(([key, value]) => {
        if (["sections", "faqs", "highlightBox", "tags"].includes(key)) {
          formData.append(key, key === "tags" ? value : JSON.stringify(value));
        } else if (!["featuredImagePreview", "newTag", "featuredImage"].includes(key)) {
          formData.append(key, value);
        }
      });
      if (newBlog.featuredImage) formData.append("featuredImage", newBlog.featuredImage);

      if (editingId) {
        await blogService.update(editingId, formData);
      } else {
        await blogService.create(formData);
      }

      setSuccessMessage(editingId ? "Article successfully reformulated." : "New research published.");
      fetchBlogs();
      clearForm();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Protocol error: Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setNewBlog({
      ...blog,
      sections: blog.sections?.length ? blog.sections : [{ heading: "", content: "" }],
      faqs: blog.faqs?.length ? blog.faqs : [{ question: "", answer: "" }],
      highlightBox: blog.highlightBox || { title: "", intro: "", points: [""] },
      tags: blog.tags || [],
      newTag: "",
      publishedDate: blog.publishedDate ? new Date(blog.publishedDate).toISOString().split("T")[0] : "",
      featuredImagePreview: blog.featuredImage || null,
      featuredImage: null
    });
    setEditingId(blog._id);
    setShowForm(true);
  };

  const addTag = () => {
    if (newBlog.newTag.trim() && !newBlog.tags.includes(newBlog.newTag.trim())) {
      setNewBlog(prev => ({ ...prev, tags: [...prev.tags, prev.newTag.trim()], newTag: "" }));
    }
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await blogService.delete(blogToDelete);
      fetchBlogs();
      if (editingId === blogToDelete) clearForm();
      setShowDeleteModal(false);
      setBlogToDelete(null);
      setSuccessMessage("Blog article deleted successfully!");
      setShowSuccessModal(true);
    } catch (err) {
      setError("Failed to delete blog.");
      setShowDeleteModal(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blogs, searchQuery]);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Toast type="error" message={error} onClose={() => setError("")} />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Erase Entry?"
        message="This will permanently remove the manifest from the archive. This action is irreversible."
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message={successMessage}
      />

      {showForm ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-10 mb-10">
            <div className="flex items-center gap-6">
              <button 
                onClick={clearForm} 
                className="group flex items-center gap-3 text-slate-400 hover:text-black transition-colors"
                title="Back to Archive"
              >
                <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <ArrowLeft size={20} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Return to</p>
                  <p className="text-sm font-black text-black leading-none mt-1">Archive</p>
                </div>
              </button>
              <div className="h-10 w-px bg-slate-100 hidden sm:block" />
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-tight leading-none">{editingId ? 'Refining Manifest' : 'New Publication'}</h2>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-red-600 animate-pulse" />
                  ID: {editingId || 'Pending Assignment'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={clearForm} className="btn-secondary h-12">Discard Changes</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary h-12 min-w-[200px] shadow-xl shadow-red-200">
                {isSubmitting ? (
                  <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Secure & Publish Manifest</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-sm ring-1 ring-slate-100">
            
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 space-y-6">
                  <CollapsibleSection title="Foundation & Identity" icon={FileText} isExpanded={expandedSections.basic} onToggle={() => toggleSection('basic')} badge={newBlog.title || "Requires input"}>
                    <div className="grid gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Publication Title</label>
                        <input type="text" name="title" value={newBlog.title} onChange={handleInputChange} placeholder="Unleashing industrial potential..." className="input-field text-xl font-bold py-4" required />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Author Identity</label>
                          <input type="text" name="author" value={newBlog.author} onChange={handleInputChange} className="input-field" placeholder="Lead Researcher" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Content Category</label>
                          <input type="text" name="category" value={newBlog.category} onChange={handleInputChange} className="input-field" placeholder="Technical/Market/Factory" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Permanent URL (Slug)</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                            <ArrowRight size={14} />
                          </div>
                          <input type="text" name="slug" value={newBlog.slug} onChange={handleInputChange} className="input-field pl-10 text-xs font-mono text-slate-500" placeholder="auto-generated-slug" />
                        </div>
                        <p className="text-[9px] text-slate-400 px-1 italic">This identifier is used in the article's URL architecture.</p>
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Manifest Core" icon={ImageIcon} isExpanded={expandedSections.content} onToggle={() => toggleSection('content')}>
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Immersive Media (Featured Image)</label>
                        <div onClick={() => document.getElementById('featuredImage').click()} className="group relative aspect-[21/9] cursor-pointer overflow-hidden rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 hover:border-red-600/30 transition-all flex items-center justify-center">
                          {newBlog.featuredImagePreview ? (
                            <div className="relative w-full h-full">
                              <img src={newBlog.featuredImagePreview} alt="Preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-bold text-xs ring-1 ring-white/20">Replace Archive</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center group-hover:scale-110 transition-transform duration-500">
                              <div className="size-20 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-200 mx-auto mb-4 group-hover:text-red-600 transition-colors">
                                <Upload size={32} />
                              </div>
                              <p className="text-sm font-black text-black uppercase tracking-widest">Deploy Visual Asset</p>
                              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Recommended: 2000 x 850px</p>
                            </div>
                          )}
                          <input type="file" id="featuredImage" accept="image/*" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setNewBlog(p => ({ ...p, featuredImage: file, featuredImagePreview: reader.result }));
                              reader.readAsDataURL(file);
                            }
                          }} className="hidden" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Technical Content</label>
                        <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-inner ring-1 ring-slate-100">
                          <ReactQuill value={newBlog.content} onChange={(v) => setNewBlog(p => ({ ...p, content: v }))} modules={quillModules} className="bg-white min-h-[400px]" />
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Technical Insights (Highlight Box)" icon={Zap} isExpanded={expandedSections.highlights} onToggle={() => toggleSection('highlights')}>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Box Headline</label>
                          <input type="text" value={newBlog.highlightBox.title} onChange={(e) => setNewBlog(p => ({ ...p, highlightBox: { ...p.highlightBox, title: e.target.value } }))} className="input-field" placeholder="Core Intelligence" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Short Introduction</label>
                          <input type="text" value={newBlog.highlightBox.intro} onChange={(e) => setNewBlog(p => ({ ...p, highlightBox: { ...p.highlightBox, intro: e.target.value } }))} className="input-field" placeholder="Brief executive summary..." />
                        </div>
                      </div>
                      <div className="space-y-4 pt-4 border-t border-slate-50">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Key Objectives (Points)</label>
                        <div className="grid gap-3">
                          {newBlog.highlightBox.points.map((point, idx) => (
                            <div key={idx} className="flex gap-3">
                              <input type="text" value={point} onChange={(e) => {
                                const points = [...newBlog.highlightBox.points];
                                points[idx] = e.target.value;
                                setNewBlog(prev => ({ ...prev, highlightBox: { ...prev.highlightBox, points } }));
                              }} className="input-field bg-slate-50 border-transparent focus:bg-white" placeholder={`Point ${idx + 1}`} />
                              <button type="button" onClick={() => {
                                const points = newBlog.highlightBox.points.filter((_, i) => i !== idx);
                                setNewBlog(prev => ({ ...prev, highlightBox: { ...prev.highlightBox, points: points.length ? points : [""] } }));
                              }} className="size-12 rounded-2xl bg-slate-50 text-slate-300 hover:text-red-600 transition-colors flex items-center justify-center shrink-0 border border-slate-100"><Trash2 size={18} /></button>
                            </div>
                          ))}
                          <button type="button" onClick={() => setNewBlog(prev => ({ ...prev, highlightBox: { ...prev.highlightBox, points: [...prev.highlightBox.points, ""] } }))} className="btn-secondary w-full py-3 border-dashed"><Plus size={16} /><span>Add Critical Point</span></button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Content Modules (Extra Sections)" icon={LayoutGrid} isExpanded={expandedSections.additional} onToggle={() => toggleSection('additional')}>
                    <div className="space-y-6">
                      {newBlog.sections.map((section, index) => (
                        <div key={index} className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 relative group">
                          <button type="button" onClick={() => {
                            const updated = newBlog.sections.filter((_, i) => i !== index);
                            setNewBlog(prev => ({ ...prev, sections: updated.length ? updated : [{heading: "", content: ""}] }));
                          }} className="absolute top-6 right-6 size-10 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-sm"><Trash2 size={18} /></button>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Module Heading</label>
                              <input type="text" value={section.heading} onChange={(e) => {
                                const updated = [...newBlog.sections];
                                updated[index].heading = e.target.value;
                                setNewBlog(prev => ({ ...prev, sections: updated }));
                              }} className="input-field bg-white" placeholder="Section Title" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Module Content</label>
                              <ReactQuill value={section.content} onChange={(v) => {
                                const updated = [...newBlog.sections];
                                updated[index].content = v;
                                setNewBlog(prev => ({ ...prev, sections: updated }));
                              }} modules={quillModules} className="bg-white rounded-2xl overflow-hidden border border-slate-100" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => setNewBlog(prev => ({ ...prev, sections: [...prev.sections, {heading: "", content: ""}] }))} className="btn-secondary w-full py-4 border-dashed border-2 bg-white"><Plus size={18} /><span>Integrate Content Module</span></button>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Frequently Asked Questions (FAQs)" icon={HelpCircle} isExpanded={expandedSections.faqs} onToggle={() => toggleSection('faqs')}>
                    <div className="space-y-4">
                      {newBlog.faqs.map((faq, index) => (
                        <div key={index} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex gap-4 group">
                          <div className="flex-1 space-y-4">
                             <input type="text" value={faq.question} onChange={(e) => {
                               const updated = [...newBlog.faqs];
                               updated[index].question = e.target.value;
                               setNewBlog(prev => ({ ...prev, faqs: updated }));
                             }} placeholder="Crucial Inquiry..." className="input-field bg-white" />
                             <textarea value={faq.answer} onChange={(e) => {
                               const updated = [...newBlog.faqs];
                               updated[index].answer = e.target.value;
                               setNewBlog(prev => ({ ...prev, faqs: updated }));
                             }} placeholder="Authoritative clarification..." className="input-field bg-white min-h-[100px]" />
                          </div>
                          <button onClick={() => {
                            const updated = newBlog.faqs.filter((_, i) => i !== index);
                            setNewBlog(p => ({ ...p, faqs: updated.length ? updated : [{question: "", answer: ""}] }));
                          }} className="size-10 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-red-600 transition-colors flex items-center justify-center shrink-0"><Trash2 size={18} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setNewBlog(p => ({ ...p, faqs: [...p.faqs, {question: "", answer: ""}] }))} className="btn-secondary w-full py-4 border-dashed border-2 hover:border-red-600/30 hover:bg-red-50/5"><Plus size={18} /><span>Add FAQ Module</span></button>
                    </div>
                  </CollapsibleSection>
                </div>

                <div className="xl:col-span-4 space-y-6">
                  <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl ring-1 ring-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none rotate-12"><Settings size={120} /></div>
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20"><Search size={20} /></div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Global Settings</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SEO Manifest</label>
                           <textarea name="metaDescription" value={newBlog.metaDescription} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-300 outline-none focus:border-red-600 transition-all min-h-[120px] placeholder:text-slate-600" placeholder="Condensed insight for search protocols..." />
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/5">
                          <label className="flex items-center justify-between cursor-pointer group">
                            <div>
                              <p className="text-sm font-black text-white group-hover:text-red-600 transition-colors">Immediate Deployment</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live visibility status</p>
                            </div>
                            <div className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ring-1 ring-white/10">
                              <input type="checkbox" name="isPublished" checked={newBlog.isPublished} onChange={handleInputChange} className="absolute opacity-0 w-full h-full cursor-pointer z-10" />
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newBlog.isPublished ? 'translate-x-7 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'translate-x-1 bg-slate-500'}`} />
                            </div>
                          </label>
                          <div className="pt-4">
                             <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3"><Calendar size={18} className="text-red-600" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Schedule Status</span></div>
                                  <span className="text-[10px] font-black uppercase text-emerald-500">Manual Entry</span>
                                </div>
                                <input type="date" name="publishedDate" value={newBlog.publishedDate} onChange={handleInputChange} className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-600 transition-all [color-scheme:dark]" />
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl ring-1 ring-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500"><Tag size={20} /></div>
                       <h3 className="text-sm font-black uppercase tracking-widest text-black">Tags & Taxonomy</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {newBlog.tags.map((tag, i) => (
                        <span key={i} className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-red-100 flex items-center gap-2 group">
                          #{tag}<button onClick={() => setNewBlog(p => ({ ...p, tags: p.tags.filter((_, idx) => idx !== i) }))} className="hover:text-black"><X size={12} /></button>
                        </span>
                      ))}
                      {newBlog.tags.length === 0 && <p className="text-xs font-medium text-slate-400 italic">No taxonomies applied.</p>}
                    </div>
                    <div className="relative">
                      <input type="text" value={newBlog.newTag} onChange={(e) => setNewBlog(p => ({ ...p, newTag: e.target.value }))} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add taxonomy entry..." className="input-field pr-12" />
                      <button onClick={addTag} className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !h-8 !px-3 !rounded-lg !text-[10px]">Add</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">Blog Engine</h1>
              <p className="mt-2 text-slate-500 font-medium">Control the narrative of Tridev Labels' industrial presence.</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn-primary h-14 px-8 shadow-xl shadow-red-200">
              <Plus size={20} />
              <span>Create New Article</span>
            </button>
          </div>

          <div className="space-y-10 mt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl"><LayoutGrid size={24} /></div>
                <div>
                  <h2 className="text-2xl font-black text-black leading-none">Archived Material</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Articles: {blogs.length}</p>
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Filter archive..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input-field !h-11 pl-12 w-64 !bg-white" 
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (<div key={i} className="h-[460px] animate-pulse rounded-[3rem] bg-slate-50 ring-1 ring-slate-100" />))}
              </div>
            ) : blogs.length > 0 ? (
              <div className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedBlogs.map(blog => (
                    <div key={blog._id} className="group relative flex flex-col overflow-hidden rounded-[3rem] bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {blog.featuredImage ? (<img src={blog.featuredImage} alt={blog.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />) : (<div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-200"><ImageIcon size={64} /></div>)}
                        <div className="absolute top-6 left-6"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md ring-1 ring-white/20 ${blog.isPublished ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>{blog.isPublished ? 'Live' : 'Draft'}</span></div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4"><Clock size={14} className="text-red-600" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{new Date(blog.createdAt).toLocaleDateString()}</span></div>
                        <h3 className="text-xl font-black text-black mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-red-600 transition-colors">{blog.title}</h3>
                        <p className="text-sm font-medium text-slate-500 mb-8 line-clamp-3 leading-relaxed">{blog.metaDescription || "No overview provided for this entry."}</p>
                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                          <Link to={`/dashboard/blogs/${blog.slug}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"><Eye size={16} />Preview</Link>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(blog)} className="size-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center border border-slate-100"><Pencil size={18} /></button>
                            <button onClick={() => { setBlogToDelete(blog._id); setShowDeleteModal(true); }} className="size-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center border border-red-100"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination 
                  totalItems={filteredBlogs.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-[4rem] border-2 border-dashed border-slate-100 bg-white p-12 text-center">
                <div className="mb-8 flex size-28 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-200"><MessageSquare size={54} /></div>
                <h3 className="text-2xl font-black text-black">Archive Empty</h3>
                <p className="mt-4 max-w-sm text-base font-medium text-slate-500">The knowledge base is currently offline. No articles found in the repository.</p>
                <button onClick={() => setShowForm(true)} className="mt-10 btn-primary h-14 px-10">Start First Publication</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPage;