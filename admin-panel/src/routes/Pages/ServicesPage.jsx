import React, { useState, useEffect, useCallback } from "react";
import { serviceService } from "../../services/service.service";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Pencil, 
  Plus, 
  X, 
  Check, 
  Upload,
  ChevronDown, 
  ChevronUp,
  Eye,
  EyeOff,
  Save,
  Image as ImageIcon,
  FileText,
  Settings,
  HelpCircle,
  Tag,
  LayoutGrid,
  ArrowLeft
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/utils/cn";
import { getImgUrl } from "../../utils/image-url";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";
import { Toast, DeleteModal, SuccessModal } from '@/components';

// Rich text editor configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "link", "image",
];

// Helper functions
const getEmptySubProduct = () => ({ title: "", desc: "", image: "", imageFile: null, imagePreview: null });
const getEmptySpec = () => ({ label: "", value: "" });
const getEmptySection = () => ({ heading: "", content: "", image: "", imageFile: null, imagePreview: null, imageAlt: "" });
const getEmptyFAQ = () => ({ question: "", answer: "" });

// Collapsible Section Component - Memoized to prevent re-renders
const CollapsibleSection = React.memo(({ title, icon: Icon, isExpanded, onToggle, children }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100 transition-all">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          <Icon size={18} />
        </div>
        <h3 className="text-sm font-bold text-black">{title}</h3>
      </div>
      <div className={cn("transition-transform duration-200", isExpanded ? "rotate-180" : "")}>
        <ChevronDown className="h-5 w-5 text-slate-400" />
      </div>
    </button>
    {isExpanded && (
      <div className="border-t border-slate-50 p-6">
        {children}
      </div>
    )}
  </div>
));

CollapsibleSection.displayName = 'CollapsibleSection';

// Sortable Service Card Component
const SortableServiceCard = React.memo(({ service, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service._id });

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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md"
    >
      {/* Drag Handle - Visible on hover */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-3 top-3 z-20 cursor-grab rounded-xl bg-white/90 p-2 text-slate-400 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </div>

      <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
        {service.cardImage && (
          <img
            src={getImgUrl(service.cardImage)}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute right-3 top-3 z-10">
          <span className={cn(
            "badge px-3 py-1 text-[10px]",
            service.isActive ? "badge-green" : "bg-slate-200 text-slate-600"
          )}>
            {service.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">{service.category || "General"}</p>
          <h3 className="mt-1 text-lg font-bold text-black">{service.title}</h3>
        </div>
        <p className="mb-4 line-clamp-2 text-sm font-medium text-slate-500">{service.subtitle}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-red-600"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pos: {service.order + 1}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(service)}
              className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-black"
              title="Edit Service"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(service._id)}
              className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:shadow-sm"
              title="Delete Service"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

SortableServiceCard.displayName = 'SortableServiceCard';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    subtitle: "",
    description: "",
    heroImage: null,
    heroImagePreview: null,
    cardImage: null,
    cardImagePreview: null,
    subProducts: [getEmptySubProduct()],
    specs: [getEmptySpec()],
    applications: [""],
    layout: {
      showIntro: true,
      showShowcase: true,
      showSolutions: true,
      showSpecs: true,
      showApplications: true,
      showRichContent: true,
      showFAQs: true
    },
    sections: [getEmptySection()],
    faqs: [getEmptyFAQ()],
    category: "",
    tags: [],
    extraContent: [],
    isActive: true,
  });
  
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    images: true,
    solutions: false,
    specs: false,
    applications: false,
    content: false,
    faqs: false,
    settings: false
  });
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await serviceService.getAll(true);
      setServices(data.data || []);
    } catch (err) {
      console.error("ServicesPage: API Sync failed:", err);
      setError(err.message || "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and drop sensors
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = services.findIndex((s) => s._id === active.id);
      const newIndex = services.findIndex((s) => s._id === over.id);

      const reorderedServices = arrayMove(services, oldIndex, newIndex);
      
      // Update order property for each service to reflect new positions
      const servicesWithUpdatedOrder = reorderedServices.map((service, index) => ({
        ...service,
        order: index
      }));
      
      // Update local state immediately for smooth UX
      setServices(servicesWithUpdatedOrder);

      // Prepare order updates for backend
      const orders = servicesWithUpdatedOrder.map((service, index) => ({
        id: service._id,
        order: index
      }));

      // Send to backend
      try {
        await serviceService.reorder(orders);
        setSuccessMessage("Services reordered successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } catch (err) {
        console.error("ServicesPage: Reorder failed:", err);
        setError(err.message || "Failed to save new order");
        // Revert on error
        fetchServices();
      }
    }
  };

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewService(prev => ({
          ...prev,
          [fieldName]: file,
          [`${fieldName}Preview`]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubProductChange = (index, field, value) => {
    const updated = [...newService.subProducts];
    updated[index] = { ...updated[index], [field]: value };
    setNewService(prev => ({ ...prev, subProducts: updated }));
  };

  const handleSubProductFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...newService.subProducts];
        updated[index] = {
          ...updated[index],
          imageFile: file,
          imagePreview: reader.result
        };
        setNewService(prev => ({ ...prev, subProducts: updated }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSubProduct = () => {
    setNewService(prev => ({
      ...prev,
      subProducts: [...prev.subProducts, getEmptySubProduct()]
    }));
  };

  const removeSubProduct = (index) => {
    const updated = newService.subProducts.filter((_, i) => i !== index);
    setNewService(prev => ({
      ...prev,
      subProducts: updated.length ? updated : [getEmptySubProduct()]
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...newService.specs];
    updated[index] = { ...updated[index], [field]: value };
    setNewService(prev => ({ ...prev, specs: updated }));
  };

  const addSpec = () => {
    setNewService(prev => ({
      ...prev,
      specs: [...prev.specs, getEmptySpec()]
    }));
  };

  const removeSpec = (index) => {
    const updated = newService.specs.filter((_, i) => i !== index);
    setNewService(prev => ({
      ...prev,
      specs: updated.length ? updated : [getEmptySpec()]
    }));
  };

  const handleApplicationChange = (index, value) => {
    const updated = [...newService.applications];
    updated[index] = value;
    setNewService(prev => ({ ...prev, applications: updated }));
  };

  const addApplication = () => {
    setNewService(prev => ({
      ...prev,
      applications: [...prev.applications, ""]
    }));
  };

  const removeApplication = (index) => {
    const updated = newService.applications.filter((_, i) => i !== index);
    setNewService(prev => ({
      ...prev,
      applications: updated.length ? updated : [""]
    }));
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...newService.sections];
    updated[index] = { ...updated[index], [field]: value };
    setNewService(prev => ({ ...prev, sections: updated }));
  };

  const handleSectionFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...newService.sections];
        updated[index] = {
          ...updated[index],
          imageFile: file,
          imagePreview: reader.result
        };
        setNewService(prev => ({ ...prev, sections: updated }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSection = () => {
    setNewService(prev => ({
      ...prev,
      sections: [...prev.sections, getEmptySection()]
    }));
  };

  const removeSection = (index) => {
    const updated = newService.sections.filter((_, i) => i !== index);
    setNewService(prev => ({
      ...prev,
      sections: updated.length ? updated : [getEmptySection()]
    }));
  };

  const handleFAQChange = (index, field, value) => {
    const updated = [...newService.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setNewService(prev => ({ ...prev, faqs: updated }));
  };

  const addFAQ = () => {
    setNewService(prev => ({
      ...prev,
      faqs: [...prev.faqs, getEmptyFAQ()]
    }));
  };

  const removeFAQ = (index) => {
    const updated = newService.faqs.filter((_, i) => i !== index);
    setNewService(prev => ({
      ...prev,
      faqs: updated.length ? updated : [getEmptyFAQ()]
    }));
  };

  const clearForm = () => {
    setNewService({
      title: "",
      subtitle: "",
      description: "",
      heroImage: null,
      heroImagePreview: null,
      cardImage: null,
      cardImagePreview: null,
      subProducts: [getEmptySubProduct()],
      specs: [getEmptySpec()],
      applications: [""],
      layout: {
        showIntro: true,
        showShowcase: true,
        showSolutions: true,
        showSpecs: true,
        showApplications: true,
        showRichContent: true,
        showFAQs: true
      },
      sections: [getEmptySection()],
      faqs: [getEmptyFAQ()],
      category: "",
      tags: [],
      extraContent: [],
      isActive: true,
    });
    setEditingId(null);
    setError("");
    setSuccessMessage("");
    setShowForm(false);
  };

  const validateForm = () => {
    if (!newService.title.trim()) return "Title is required";
    if (!newService.subtitle.trim()) return "Subtitle is required";
    if (!editingId && !newService.heroImage) return "Hero image is required";
    if (!editingId && !newService.cardImage) return "Card image is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("isActive", newService.isActive);
      
      const validSections = newService.sections.filter(s => s.heading.trim() !== "" || s.content.trim() !== "");
      const cleanSections = validSections.map(({ imageFile, imagePreview, ...rest }) => rest);
      
      const cleanSubProducts = newService.subProducts
        .filter(sub => sub.title.trim() !== "")
        .map(({ imageFile, imagePreview, ...rest }) => rest);
      const cleanSpecs = newService.specs.filter(s => s.label.trim() && s.value.trim());
      const cleanApplications = newService.applications.filter((a) => a.trim() !== "");
      const cleanFAQs = newService.faqs.filter((f) => f.question.trim() !== "" || f.answer.trim() !== "");

      formData.append("title", newService.title);
      formData.append("subtitle", newService.subtitle);
      formData.append("description", newService.description);
      formData.append("subProducts", JSON.stringify(cleanSubProducts));
      formData.append("specs", JSON.stringify(cleanSpecs));
      formData.append("applications", JSON.stringify(cleanApplications));
      formData.append("sections", JSON.stringify(cleanSections));
      formData.append("faqs", JSON.stringify(cleanFAQs));
      formData.append("category", newService.category);
      formData.append("tags", JSON.stringify(newService.tags));
      formData.append("layout", JSON.stringify(newService.layout));
      formData.append("extraContent", JSON.stringify(newService.extraContent));

      if (newService.heroImage) {
        formData.append("heroImage", newService.heroImage);
      }
      if (newService.cardImage) {
        formData.append("cardImage", newService.cardImage);
      }

      newService.subProducts.forEach((sub, index) => {
        if (sub.imageFile) {
          formData.append(`subProductImage_${index}`, sub.imageFile);
        }
      });

      validSections.forEach((sec, index) => {
        if (sec.imageFile) {
          formData.append(`sectionImage_${index}`, sec.imageFile);
        }
      });

      if (editingId) {
        await serviceService.update(editingId, formData);
      } else {
        await serviceService.create(formData);
      }

      setSuccessMessage(editingId ? "Service updated successfully!" : "Service created successfully!");
      fetchServices();
      clearForm();
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error saving service:", err);
      setError(err.response?.data?.message || "Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setNewService({
      title: service.title || "",
      subtitle: service.subtitle || "",
      description: service.description || "",
      heroImage: null,
      heroImagePreview: service.heroImage || null,
      cardImage: null,
      cardImagePreview: service.cardImage || null,
      subProducts: service.subProducts?.length 
        ? service.subProducts.map(sp => ({ ...sp, imagePreview: sp.image })) 
        : [getEmptySubProduct()],
      specs: service.specs?.length ? service.specs : [getEmptySpec()],
      applications: service.applications?.length ? service.applications : [""],
      layout: service.layout || {
        showIntro: true,
        showShowcase: true,
        showSolutions: true,
        showSpecs: true,
        showApplications: true,
        showRichContent: true,
        showFAQs: true
      },
      sections: service.sections?.length 
        ? service.sections.map(sec => ({ 
            ...sec, 
            imagePreview: sec.image,
            imageAlt: sec.imageAlt || ""
          })) 
        : [getEmptySection()],
      faqs: service.faqs?.length ? service.faqs : [getEmptyFAQ()],
      category: service.category || "",
      tags: service.tags || [],
      extraContent: service.extraContent || [],
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setEditingId(service._id);
    setShowForm(true);
    setError("");
  };

  const confirmDelete = (id) => {
    setServiceToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await serviceService.delete(serviceToDelete);
      fetchServices();
      if (editingId === serviceToDelete) clearForm();
      setShowDeleteModal(false);
      setServiceToDelete(null);
      setSuccessMessage("Service deleted successfully!");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("ServicesPage: Delete failed:", err);
      setError(err.message || "Failed to delete service");
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* Notifications */}
      <Toast type="error" message={error} onClose={() => setError("")} />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${services.find(s => s._id === serviceToDelete)?.title}"? This action cannot be undone.`}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message={successMessage}
      />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="title">Services Management</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Create, edit, and organize your service offerings with ease.</p>
          </div>
        </div>

        {!showForm && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                clearForm();
                setShowForm(true);
              }}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>Add New Service</span>
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-4 animate-in fade-in duration-200">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <X size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-900 tracking-tight">Something went wrong</p>
              <p className="text-xs font-medium text-red-700/80">{error}</p>
            </div>
          </div>
        )}

        {/* Inline Form Section */}
        {showForm && (
          <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
            <div className="relative w-full rounded-[2.5rem] border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-50 bg-slate-50/50 p-8 md:p-10">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={clearForm} 
                    className="group flex items-center gap-3 text-slate-400 hover:text-black transition-colors"
                    title="Close"
                  >
                    <div className="size-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm border border-slate-100">
                      <ArrowLeft size={20} />
                    </div>
                  </button>
                  <div className="h-10 w-px bg-slate-200 hidden sm:block" />
                  <div>
                    <h2 className="text-xl font-bold text-black font-title leading-none">
                      {editingId ? "Refine Service" : "New Service Offering"}
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1.5 flex items-center gap-2">
                       <div className="size-1.5 rounded-full bg-red-600 animate-pulse" />
                       {editingId ? `Editing ID: ${editingId}` : "Protocol: New Entry"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={clearForm} className="btn-secondary h-12 rounded-xl">Discard</button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary h-12 min-w-[160px] rounded-xl">
                    {isSubmitting ? (
                      <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                      <><Save size={18} /><span>Secure & Publish</span></>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Form Content ... (Existing collapsible sections) */}
                  
                  {/* 1. Basic Information */}
                  <CollapsibleSection
                    title="Basic Information"
                    icon={FileText}
                    isExpanded={expandedSections.basic}
                    onToggle={() => toggleSection('basic')}
                  >
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Service Title *</label>
                          <input
                            type="text"
                            name="title"
                            value={newService.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Premium Label Solutions"
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Subtitle *</label>
                          <input
                            type="text"
                            name="subtitle"
                            value={newService.subtitle}
                            onChange={handleInputChange}
                            placeholder="Brief tagline"
                            className="input-field"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Category</label>
                        <input
                          type="text"
                          name="category"
                          value={newService.category}
                          onChange={handleInputChange}
                          placeholder="e.g., Industrial"
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Description</label>
                        <textarea
                          name="description"
                          value={newService.description}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Describe the service..."
                          className="input-field resize-none"
                        />
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* 2. Images */}
                  <CollapsibleSection
                    title="Images"
                    icon={ImageIcon}
                    isExpanded={expandedSections.images}
                    onToggle={() => toggleSection('images')}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image *</label>
                        <div className="relative">
                          <input type="file" id="heroImage" accept="image/*" onChange={(e) => handleFileChange(e, "heroImage")} className="hidden" />
                          <label htmlFor="heroImage" className="block aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-red-600 transition-colors overflow-hidden">
                            {newService.heroImagePreview ? <img src={getImgUrl(newService.heroImagePreview)} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-slate-400"><Upload className="w-8 h-8 mb-2" /><span className="text-sm">Upload Hero</span></div>}
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Image *</label>
                        <div className="relative">
                          <input type="file" id="cardImage" accept="image/*" onChange={(e) => handleFileChange(e, "cardImage")} className="hidden" />
                          <label htmlFor="cardImage" className="block aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-red-600 transition-colors overflow-hidden">
                            {newService.cardImagePreview ? <img src={getImgUrl(newService.cardImagePreview)} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-slate-400"><Upload className="w-8 h-8 mb-2" /><span className="text-sm">Upload Card</span></div>}
                          </label>
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* 3. Solutions */}
                  <CollapsibleSection
                    title={`Specialized Solutions (${newService.subProducts.length})`}
                    icon={LayoutGrid}
                    isExpanded={expandedSections.solutions}
                    onToggle={() => toggleSection('solutions')}
                  >
                     <div className="space-y-4">
                      {newService.subProducts.map((sub, i) => (
                        <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <div className="flex items-start justify-between mb-3 text-slate-400"><span className="text-[10px] font-bold uppercase tracking-widest">Solution #{i + 1}</span>{newService.subProducts.length > 1 && <button type="button" onClick={() => removeSubProduct(i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>}</div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-3">
                              <input type="text" placeholder="Title" value={sub.title} onChange={(e) => handleSubProductChange(i, "title", e.target.value)} className="input-field" />
                              <textarea placeholder="Description" value={sub.desc} onChange={(e) => handleSubProductChange(i, "desc", e.target.value)} rows={2} className="input-field resize-none" />
                            </div>
                            <div>
                              <input type="file" id={`subProduct-${i}`} accept="image/*" onChange={(e) => handleSubProductFileChange(i, e)} className="hidden" />
                              <label htmlFor={`subProduct-${i}`} className="block aspect-square bg-white border border-slate-200 rounded-xl cursor-pointer overflow-hidden">{sub.imagePreview || sub.image ? <img src={getImgUrl(sub.imagePreview) || getImgUrl(sub.image)} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Upload className="w-6 h-6 text-slate-300" /></div>}</label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addSubProduct} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-red-600 hover:text-red-600 transition-all">
                        + Add Solution Module
                      </button>
                    </div>
                  </CollapsibleSection>

                  {/* 4. Specs */}
                  <CollapsibleSection
                    title={`Technical Specs (${newService.specs.filter(s => s.label && s.value).length})`}
                    icon={Settings}
                    isExpanded={expandedSections.specs}
                    onToggle={() => toggleSection('specs')}
                  >
                    <div className="space-y-3">
                      {newService.specs.map((spec, i) => (
                        <div key={i} className="flex gap-3">
                          <input type="text" placeholder="Spec Label" value={spec.label} onChange={(e) => handleSpecChange(i, "label", e.target.value)} className="flex-1 input-field" />
                          <input type="text" placeholder="Spec Value" value={spec.value} onChange={(e) => handleSpecChange(i, "value", e.target.value)} className="flex-1 input-field" />
                          {newService.specs.length > 1 && <button type="button" onClick={() => removeSpec(i)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>}
                        </div>
                      ))}
                      <button type="button" onClick={addSpec} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-red-600 hover:text-red-600 transition-all">+ Add Technical Spec</button>
                    </div>
                  </CollapsibleSection>

                  {/* Key Applications */}
                  <CollapsibleSection
                    title={`Key Applications (${newService.applications.filter(a => a.trim()).length})`}
                    icon={Tag}
                    isExpanded={expandedSections.applications}
                    onToggle={() => toggleSection('applications')}
                  >
                    <div className="space-y-3">
                      {newService.applications.map((app, i) => (
                        <div key={i} className="flex gap-3">
                          <input 
                            type="text" 
                            placeholder="Application (e.g., Logistics, Retail)" 
                            value={app} 
                            onChange={(e) => handleApplicationChange(i, e.target.value)} 
                            className="flex-1 input-field" 
                          />
                          {newService.applications.length > 1 && (
                            <button type="button" onClick={() => removeApplication(i)} className="text-red-500 hover:text-red-700">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={addApplication} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-red-600 hover:text-red-600 transition-all">
                        + Add Application
                      </button>
                    </div>
                  </CollapsibleSection>

                  {/* 5. Rich Content */}
                  <CollapsibleSection
                    title="Rich Editorial Content"
                    icon={FileText}
                    isExpanded={expandedSections.content}
                    onToggle={() => toggleSection('content')}
                  >
                    <div className="space-y-6">
                      {newService.sections.map((section, i) => (
                        <div key={i} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                          <div className="flex justify-between mb-6 text-slate-400"><span className="text-[10px] font-bold uppercase tracking-widest">Editorial Section #{i + 1}</span>{newService.sections.length > 1 && <button type="button" onClick={() => removeSection(i)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>}</div>
                          <div className="space-y-4">
                            <input type="text" placeholder="Heading" value={section.heading} onChange={(e) => handleSectionChange(i, "heading", e.target.value)} className="input-field text-lg font-bold" />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                              <div className="md:col-span-3"><ReactQuill value={section.content} onChange={(v) => handleSectionChange(i, "content", v)} modules={quillModules} className="bg-white rounded-xl overflow-hidden" /></div>
                              <div className="space-y-4">
                                <input type="file" id={`section-${i}`} accept="image/*" onChange={(e) => handleSectionFileChange(i, e)} className="hidden" />
                                <label htmlFor={`section-${i}`} className="block aspect-square bg-white border border-slate-200 rounded-2xl cursor-pointer overflow-hidden">{section.imagePreview || section.image ? <img src={getImgUrl(section.imagePreview) || getImgUrl(section.image)} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Upload className="w-8 h-8 text-slate-300" /></div>}</label>
                                <input type="text" placeholder="Media Alt Text" value={section.imageAlt} onChange={(e) => handleSectionChange(i, "imageAlt", e.target.value)} className="input-field text-[10px]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addSection} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-sm font-bold uppercase tracking-widest text-slate-400 hover:border-red-600 hover:text-red-600 transition-all">+ Append Editorial Module</button>
                    </div>
                  </CollapsibleSection>

                  {/* 6. FAQs */}
                  <CollapsibleSection
                    title="Frequently Asked Questions"
                    icon={HelpCircle}
                    isExpanded={expandedSections.faqs}
                    onToggle={() => toggleSection('faqs')}
                  >
                    <div className="space-y-4">
                      {newService.faqs.map((faq, i) => (
                        <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                          <div className="flex justify-between items-center"><span className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">FAQ {i+1}</span><button type="button" onClick={() => removeFAQ(i)} className="text-red-500"><Trash2 size={16} /></button></div>
                          <input type="text" placeholder="Question" value={faq.question} onChange={(e) => handleFAQChange(i, "question", e.target.value)} className="input-field" />
                          <textarea placeholder="Expert Answer" value={faq.answer} onChange={(e) => handleFAQChange(i, "answer", e.target.value)} rows={2} className="input-field resize-none" />
                        </div>
                      ))}
                      <button type="button" onClick={addFAQ} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-red-600 hover:text-red-600 transition-all">+ Add Insight FAQ</button>
                    </div>
                  </CollapsibleSection>

                  {/* 7. Settings */}
                  <CollapsibleSection
                    title="Visibility Protocol"
                    icon={Eye}
                    isExpanded={expandedSections.settings}
                    onToggle={() => toggleSection('settings')}
                  >
                    <div className="flex items-center gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                       <input type="checkbox" checked={newService.isActive} onChange={(e) => setNewService(prev => ({ ...prev, isActive: e.target.checked }))} className="size-6 accent-red-600 cursor-pointer" />
                       <div><p className="font-bold text-black text-sm">Public Visibility</p><p className="text-xs text-slate-500 font-medium tracking-tight">Synchronize this module with the live client environment</p></div>
                    </div>
                  </CollapsibleSection>

                </form>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          {!showForm && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={20} className="text-red-600" />
                  <h2 className="text-xl font-bold text-black font-title">Active Services</h2>
                  <span className="badge badge-red ml-2">{services.length}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Drag to reorder items</p>
              </div>

              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-[280px] animate-pulse rounded-3xl bg-white ring-1 ring-slate-100" />
                  ))}
                </div>
              ) : services.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={services.map(s => s._id)} strategy={rectSortingStrategy}>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {services.map(service => (
                        <SortableServiceCard key={service._id} service={service} onEdit={handleEdit} onDelete={confirmDelete} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="flex h-80 flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white p-12 text-center">
                  <div className="mb-4 flex size-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
                    <LayoutGrid size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-black">No Services Found</h3>
                  <p className="mt-2 text-sm font-medium text-slate-500">Get started by creating your first service offering.</p>
                  <button onClick={() => setShowForm(true)} className="mt-6 btn-primary">
                    <Plus size={18} />
                    <span>Create Your First Service</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
