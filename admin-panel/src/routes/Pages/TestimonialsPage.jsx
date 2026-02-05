import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { testimonialService } from "../../services/testimonial.service";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  Trash2, 
  Pencil,
  Image as ImageIcon, 
  Plus, 
  X, 
  Check, 
  AlertCircle,
  Search,
  MessageSquare,
  Quote,
  Star,
  GripVertical,
  User,
  Building
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getImgUrl } from "../../utils/image-url";
import { Toast, DeleteModal, SuccessModal, Pagination } from '@/components';

const SortableTestimonialItem = React.memo(({ item, onEdit, onDelete, onToggleStatus }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.6 : 1,
    willChange: isDragging ? 'transform' : 'auto'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] border transition-all duration-300 ${
        item.isActive 
          ? 'bg-white border-slate-100 shadow-sm hover:shadow-xl' 
          : 'bg-slate-50 border-slate-200 opacity-75 grayscale-[0.5]'
      }`}
    >
      {/* Drag Handle - Visible on hover */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-4 top-4 z-20 cursor-grab rounded-xl bg-white/95 p-2 text-slate-400 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </div>

      <div className="absolute right-4 top-4 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(item)}
          className="size-10 rounded-xl bg-white/95 text-slate-400 shadow-sm backdrop-blur-sm transition-colors hover:text-black"
        >
          <Pencil size={18} className="mx-auto" />
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="size-10 rounded-xl bg-red-50/95 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white"
        >
          <Trash2 size={18} className="mx-auto" />
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-start justify-between">
           <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 relative">
                {item.image ? (
                  <img src={getImgUrl(item.image)} alt={item.author} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300">
                    <User size={24} />
                  </div>
                )}
              </div>
              <div>
                 <h4 className="text-lg font-black text-black leading-tight">{item.author}</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#E32219] mt-1 line-clamp-1">
                   {item.position}{item.company ? ` @ ${item.company}` : ''}
                 </p>
              </div>
           </div>
        </div>

        <div className="relative">
          <Quote className="absolute -top-4 -left-3 text-slate-50" size={48} />
          <p className="relative z-10 text-sm font-medium text-slate-500 leading-relaxed italic line-clamp-4">
            "{item.text}"
          </p>
        </div>

        {item.tag && (
          <div className="pt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-red-50 text-[10px] font-black uppercase tracking-wider text-red-600 rounded-lg">
              {item.tag}
            </span>
          </div>
        )}

        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
          <button 
            onClick={() => onToggleStatus(item._id, !item.isActive)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
              item.isActive ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`size-2 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            {item.isActive ? 'Active Protocol' : 'Offline'}
          </button>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Rank: {item.order + 1}</span>
        </div>
      </div>
    </div>
  );
});

const TestimonialsPage = () => {
  const [formData, setFormData] = useState({
    author: "",
    position: "",
    company: "",
    text: "",
    impact: "",
    industry: "",
    tag: "",
    image: null,
    imagePreview: null,
    isActive: true
  });
  
  const [editingId, setEditingId] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await testimonialService.getAll(true);
      setTestimonials(res.data || []);
    } catch (err) {
      console.error("Sync Protocol Failure:", err);
      setError("Failed to sync testimonials archive.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchTestimonials();
  }, [navigate, token, fetchTestimonials]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFormData({
      author: "",
      position: "",
      company: "",
      text: "",
      impact: "",
      industry: "",
      tag: "",
      image: null,
      imagePreview: null,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    setError("");

    if (!formData.author || !formData.text) {
        return setError("Lead Author and Narrative are mandatory protocols.");
    }

    const submission = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image') {
        if (value) submission.append(key, value);
      } else if (key !== 'imagePreview') {
        submission.append(key, value);
      }
    });

    try {
      setSubmitting(true);
      if (editingId) {
        await testimonialService.update(editingId, submission);
        setSuccessMessage("Testimonial parameters successfully updated.");
      } else {
        await testimonialService.create(submission);
        setSuccessMessage("New testimonial integrated into the archive.");
      }
      
      handleReset();
      fetchTestimonials();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Protocol execution failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      author: item.author,
      position: item.position || "",
      company: item.company || "",
      text: item.text,
      impact: item.impact || "",
      industry: item.industry || "",
      tag: item.tag || "",
      image: null,
      imagePreview: item.image,
      isActive: item.isActive
    });
    setEditingId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await testimonialService.delete(deleteId);
      setSuccessMessage("Testimonial erased from the repository.");
      setShowDeleteModal(false);
      fetchTestimonials();
      setShowSuccessModal(true);
    } catch (err) {
      setError("Failed to erase record.");
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await testimonialService.update(id, { isActive });
      setTestimonials(prev => prev.map(item => item._id === id ? { ...item, isActive } : item));
    } catch (err) {
      setError("Status update failed.");
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = testimonials.findIndex(i => i._id === active.id);
      const newIndex = testimonials.findIndex(i => i._id === over.id);
      
      const newOrder = arrayMove(testimonials, oldIndex, newIndex);
      setTestimonials(newOrder);

      try {
        const orders = newOrder.map((item, index) => ({
          id: item._id,
          order: index
        }));
        await testimonialService.reorder(orders);
      } catch (err) {
        setError("Archive reorganization failed.");
        fetchTestimonials();
      }
    }
  };

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(item => 
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [testimonials, searchQuery]);

  const paginatedTestimonials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTestimonials.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTestimonials, currentPage, itemsPerPage]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Toast type="error" message={error} onClose={() => setError("")} />

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">Voices Engine</h1>
          <p className="mt-2 text-slate-500 font-medium">Coordinate and deploy industrial success narratives.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search narrative..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field !h-12 pl-12 w-64 !bg-white" 
            />
          </div>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary h-12 px-8 shadow-xl shadow-red-200"
            >
              <Plus size={20} />
              <span>New Voice</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Form Section */}
      {showForm && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
          <div className="relative w-full rounded-[2.5rem] border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <div className="border-b border-slate-50 p-6 bg-slate-50/50 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="flex size-10 items-center justify-center rounded-xl bg-[#E32219] text-white shadow-lg">
                   {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-black">{editingId ? "Refine Narrative" : "Initialize Narrative"}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Feedback Protocol</p>
                 </div>
               </div>
               <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Lead Author *</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="e.g., Dr. Elena Rodriguez"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Institutional Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="e.g., Supply Chain Director"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Company Entity</label>
                    <div className="relative">
                       <Building size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Neo-Logistics Int."
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Protocol Tag</label>
                    <input
                      type="text"
                      name="tag"
                      value={formData.tag}
                      onChange={handleInputChange}
                      placeholder="e.g., Sustainable Innovation"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Full Narrative Narrative *</label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="Input the industrial feedback here..."
                    className="input-field min-h-[150px] italic"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Primary Impact</label>
                        <input
                            type="text"
                            name="impact"
                            value={formData.impact}
                            onChange={handleInputChange}
                            placeholder="e.g., Unmatched Precision"
                            className="input-field"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Industry Sector</label>
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            placeholder="e.g., Pharmaceuticals"
                            className="input-field"
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-6">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 block mb-2">Author Identification Portrait</label>
                 <div 
                   onClick={() => fileInputRef.current.click()}
                   className={`relative aspect-square max-h-[250px] mx-auto cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-2
                     ${formData.imagePreview ? 'border-red-600/30 bg-red-50/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                 >
                   {formData.imagePreview ? (
                     <img src={getImgUrl(formData.imagePreview)} alt="Author Preview" className="h-full w-full object-cover rounded-[2rem]" />
                   ) : (
                     <div className="text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm mb-4">
                          <User size={28} />
                        </div>
                        <p className="text-sm font-black text-black uppercase tracking-widest">Select Portrait</p>
                        <p className="mt-1 text-[10px] text-slate-400 uppercase font-bold tracking-widest">Square 1:1 Recommended</p>
                     </div>
                   )}
                   <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="hidden"
                   />
                 </div>

                 <div className="pt-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <p className="text-xs font-black text-black uppercase tracking-widest">Visibility Protocol</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status on live website</p>
                        </div>
                        <label className="relative inline-flex h-6 w-11 items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn-secondary w-full py-4 rounded-2xl"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full py-4 rounded-2xl shadow-xl shadow-red-200"
                    >
                        {submitting ? (
                        <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        ) : (
                        <span>{editingId ? "Update Narrative" : "Authorize Narrative"}</span>
                        )}
                    </button>
                    </div>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials List Section */}
      <div className="space-y-10 mt-12 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl"><MessageSquare size={24} /></div>
            <div>
              <h2 className="text-2xl font-black text-black leading-none uppercase">Voices Archive</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sequencing Management Panel</p>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
            Drag to prioritize narratives
          </div>
        </div>

        {loading && testimonials.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[350px] w-full rounded-[2.5rem] bg-slate-50 animate-pulse ring-1 ring-slate-100 shadow-sm" />
            ))}
          </div>
        ) : filteredTestimonials.length > 0 ? (
          <div className="space-y-12">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={paginatedTestimonials.map(i => i._id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedTestimonials.map((item) => (
                    <SortableTestimonialItem 
                      key={item._id} 
                      item={item} 
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <Pagination 
              totalItems={filteredTestimonials.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-[4rem] border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mb-6 flex size-24 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-200">
               <Quote size={48} />
            </div>
            <h3 className="text-2xl font-black text-black uppercase">Archive Empty</h3>
            <p className="mt-2 text-base font-medium text-slate-500">No testimonials matched your search parameters.</p>
            {!showForm && <button onClick={() => setShowForm(true)} className="mt-8 btn-primary h-12 px-8">Initialize First Voice</button>}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Erase Narrative?"
        message="This will permanently delete this voice from the industrial repository. This action cannot be reversed."
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Protocol Success"
        message={successMessage}
      />
    </div>
  );
};

export default TestimonialsPage;
