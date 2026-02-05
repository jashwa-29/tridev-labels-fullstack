import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { galleryService } from "../../services/gallery.service";
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
  Filter,
  Search,
  Grid,
  Sparkles,
  Layers,
  Cpu,
  Recycle,
  Shield,
  Zap,
  Star,
  Eye,
  EyeOff,
  GripVertical
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


const CATEGORY_OPTIONS = [
  "Specialized Finishes",
  "Industrial",
  "Pharmaceutical",
  "Food & Beverage",
  "Luxury",
  "Sustainability",
  "Smart Labels"
];

const ICON_OPTIONS = [
  { label: "Sparkles", value: "Sparkles", component: Sparkles },
  { label: "Layers", value: "Layers", component: Layers },
  { label: "Cpu", value: "Cpu", component: Cpu },
  { label: "Recycle", value: "Recycle", component: Recycle },
  { label: "Shield", value: "Shield", component: Shield },
  { label: "Zap", value: "Zap", component: Zap },
  { label: "Star", value: "Star", component: Star },
];

const SortableGalleryItem = React.memo(({ item, onEdit, onDelete, onToggleStatus }) => {
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
        item.isActive 
          ? 'bg-white border-slate-100 shadow-sm hover:shadow-md' 
          : 'bg-slate-50 border-slate-200 opacity-75 grayscale-[0.5]'
      }`}
    >
      {/* Drag Handle - Visible on hover */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-3 top-3 z-20 cursor-grab rounded-xl bg-white/90 p-2 text-slate-400 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </div>

      {/* Image Reveal */}
      <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
        <img 
          src={getImgUrl(item.image)} 
          alt={item.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {!item.isActive && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[px] flex items-center justify-center">
            <EyeOff size={24} className="text-white" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute right-3 top-3 z-10">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
            item.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
          }`}>
            {item.isActive ? 'Live' : 'Hidden'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
          {item.benefit && (
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
              {item.benefit}
            </span>
          )}
        </div>
        
        <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">{item.name}</h4>
        <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>

        {/* Action Bar */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex gap-1">
             <button
                onClick={() => onToggleStatus(item._id, !item.isActive)}
                className={`size-8 flex items-center justify-center rounded-lg transition-all ${
                  item.isActive ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-red-600 bg-red-50'
                }`}
                title={item.isActive ? "Deactivate" : "Activate"}
              >
                {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => onEdit(item)}
                className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
          </div>
          <button
            onClick={() => onDelete(item._id)}
            className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

const GalleryPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    benefit: "",
    description: "",
    category: "Specialized Finishes",
    icon: "Sparkles",
    isActive: true,
    image: null,
    imagePreview: null
  });
  
  const [editingId, setEditingId] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

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

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 12;

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAll(true);
      setGalleryItems(data.data || []);
    } catch (err) {
      console.error("GalleryPage: API Sync failed:", err);
      setError(err.message || "Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  }, []); // Added empty dependency array for useCallback

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchGallery();
  }, [token, navigate, fetchGallery]); // Added fetchGallery to dependencies

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    setError("");
    setSuccess("");

    if (!editingId && !formData.image) {
      return setError("Image is required for new items.");
    }

    const submission = new FormData();
    submission.append("name", formData.name);
    submission.append("benefit", formData.benefit);
    submission.append("description", formData.description);
    submission.append("category", formData.category);
    submission.append("icon", formData.icon);
    submission.append("isActive", formData.isActive);
    if (formData.image) {
      submission.append("image", formData.image);
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await galleryService.update(editingId, submission);
        setSuccessMessage("Gallery item updated successfully!");
      } else {
        await galleryService.create(submission);
        setSuccessMessage("Gallery item created successfully!");
      }
      
      handleReset();
      fetchGallery();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      benefit: item.benefit || "",
      description: item.description || "",
      category: item.category || "Specialized Finishes",
      icon: item.icon || "Sparkles",
      isActive: item.isActive !== undefined ? item.isActive : true,
      image: null,
      imagePreview: item.image
    });
    setEditingId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      benefit: "",
      description: "",
      category: "Specialized Finishes",
      icon: "Sparkles",
      isActive: true,
      image: null,
      imagePreview: null
    });
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleToggleStatus = async (id, status) => {
    try {
      await galleryService.update(id, { isActive: status });
      setGalleryItems(prev => prev.map(item => 
        item._id === id ? { ...item, isActive: status } : item
      ));
    } catch (err) {
      console.error("GalleryPage: Status update failed:", err);
      setError(err.message || "Failed to update status.");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await galleryService.delete(deleteId);
      setGalleryItems(prev => prev.filter(item => item._id !== deleteId));
      setDeleteId(null);
      setShowDeleteModal(false);
      setSuccessMessage("Gallery item deleted successfully!");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("GalleryPage: Delete failed:", err);
      setError(err.message || "Delete failed.");
      setShowDeleteModal(false);
    }
  };

  // Filtering logic
  const filteredItems = useMemo(() => {
    if (!searchQuery) return galleryItems;
    return galleryItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.benefit?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [galleryItems, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Find the actual indices in the filtered list
    const oldIndexFiltered = filteredItems.findIndex(item => item._id === active.id);
    const newIndexFiltered = filteredItems.findIndex(item => item._id === over.id);

    // If items are not found in the filtered list (shouldn't happen if DND is only on paginated)
    if (oldIndexFiltered === -1 || newIndexFiltered === -1) return;

    // Create a new array with the reordered filtered items
    const reorderedFiltered = arrayMove(filteredItems, oldIndexFiltered, newIndexFiltered);

    // Update the original galleryItems based on the new order of filtered items
    // This is the most complex part: we need to merge the reordered filtered items back into the original list
    const newGalleryItems = [...galleryItems];
    let filteredItemCounter = 0;
    for (let i = 0; i < newGalleryItems.length; i++) {
      const originalItem = newGalleryItems[i];
      // Check if the original item is part of the current filtered set
      const isFiltered = filteredItems.some(fItem => fItem._id === originalItem._id);
      if (isFiltered) {
        // Replace the original item with the next item from the reordered filtered list
        newGalleryItems[i] = reorderedFiltered[filteredItemCounter];
        filteredItemCounter++;
      }
    }

    // Assign new 'order' values based on the new overall sequence
    const withOrders = newGalleryItems.map((item, index) => ({ ...item, order: index }));
    setGalleryItems(withOrders);

    try {
      await galleryService.reorder(withOrders.map(item => ({ id: item._id, order: item.order })));
    } catch (err) {
      console.error("GalleryPage: Reorder failed:", err);
      setError(err.message || "Failed to save order.");
      fetchGallery(); // Re-fetch to revert if API call fails
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Toast type="error" message={error} onClose={() => setError("")} />

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">Gallery Engine</h1>
          <p className="mt-2 text-slate-500 font-medium">Manage specialized tactile finishes and labels portfolio entries.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search finishes..." 
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
              <span>New Finish</span>
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
                 <div className="flex size-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg">
                   {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-black">{editingId ? "Edit Item" : "Create Item"}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Finish Technical Details</p>
                 </div>
               </div>
               <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Architectural Spot UV"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Benefit Badge</label>
                    <input
                      type="text"
                      name="benefit"
                      value={formData.benefit}
                      onChange={handleInputChange}
                      placeholder="e.g., Tactile Depth"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Detailed Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the aesthetic and technical properties..."
                    className="input-field min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Status</label>
                    <label className="flex items-center gap-3 cursor-pointer select-none group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                      </div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-black">{formData.isActive ? 'Visible to Clients' : 'Hidden from Site'}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1 block mb-2">High Resolution Media</label>
                 <div 
                   onClick={() => fileInputRef.current.click()}
                   className={`relative aspect-[16/9] max-h-[300px] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-2
                     ${formData.imagePreview ? 'border-red-600/30 bg-red-50/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                 >
                   {formData.imagePreview ? (
                     <img src={getImgUrl(formData.imagePreview)} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                   ) : (
                     <div className="text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm mb-3">
                          <ImageIcon size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Visual</p>
                        <p className="mt-1 text-xs text-slate-400 tracking-tight">Portrait 4:5 ratio recommended</p>
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
                 
                 <div className="grid grid-cols-2 gap-4">
                   <button
                     type="button"
                     onClick={handleReset}
                     className="btn-secondary w-full py-4 rounded-2xl"
                   >
                     Discard
                   </button>
                   <button
                     type="submit"
                     disabled={submitting}
                     className="btn-primary w-full py-4 rounded-2xl"
                   >
                     {submitting ? (
                       <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                     ) : (
                       <span>{editingId ? "Update Portfolio" : "Add to Portfolio"}</span>
                     )}
                   </button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery List Section */}
      <div className="space-y-10 mt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl"><Grid size={24} /></div>
            <div>
              <h2 className="text-2xl font-black text-black leading-none">Active Matrix</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Manipulation Protocol</p>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
            Drag items to reorder priority
          </div>
        </div>

        {loading && galleryItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[4/3] w-full rounded-[2rem] bg-slate-50 animate-pulse ring-1 ring-slate-100 shadow-sm" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-12">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={paginatedItems.map(i => i._id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {paginatedItems.map((item) => (
                    <SortableGalleryItem 
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
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-[4rem] border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mb-6 flex size-24 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-200">
               <ImageIcon size={48} />
            </div>
            <h3 className="text-2xl font-black text-black">Repository Empty</h3>
            <p className="mt-2 text-base font-medium text-slate-500">No finishes matches your current protocol parameters.</p>
            {!showForm && <button onClick={() => setShowForm(true)} className="mt-8 btn-primary h-12 px-8">Initialize First Finish</button>}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Erase Portfolio Entry?"
        message="This will permanently delete this finish from the technical repository. This action cannot be reversed."
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

export default GalleryPage;
