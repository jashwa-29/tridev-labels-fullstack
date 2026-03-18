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
const getEmptySubProduct = () => ({ 
  title: "", 
  slug: "",
  subtitle: "",
  desc: "", 
  fullDescription: "",
  metaTitle: "",
  metaDescription: "",
  features: [""],
  specifications: [{ label: "", value: "" }],
  applications: [""],
  benefits: [""],
  faqs: [{ question: "", answer: "" }],
  image: "", 
  imageAlt: "", // Alt text for sub-product image
  imageFile: null, 
  imagePreview: null,
  gallery: [], // Existing paths
  galleryFiles: [] // { file, preview } entries
});
const getEmptySpec = () => ({ label: "", value: "" });
const getEmptySection = () => ({ heading: "", content: "", image: "", imageFile: null, imagePreview: null, imageAlt: "" });
const getEmptyFAQ = () => ({ question: "", answer: "" });



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
    slug: "",
    subtitle: "",
    description: "",
    heroImage: null,
    heroImageAlt: "", // Alt text for hero image
    heroImagePreview: null,
    cardImage: null,
    cardImageAlt: "", // Alt text for card image
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
      showFAQs: true,
      showSolutionsDetails: true
    },
    sections: [getEmptySection()],
    faqs: [getEmptyFAQ()],
    category: "",
    tags: [],
    extraContent: [],
    metaTitle: "",
    metaDescription: "",
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
  const [expandedSubProduct, setExpandedSubProduct] = useState(null); // index of sub-product being edited in detail
  const [showEmptyWarnings, setShowEmptyWarnings] = useState(false); // Show visual warnings for empty fields
  


  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General Info", icon: FileText },
    { id: "media", label: "Media Gallery", icon: ImageIcon },
    { id: "products", label: "Product Catalog", icon: LayoutGrid },
    { id: "content", label: "Content & Specs", icon: Settings },
    { id: "seo", label: "SEO & Metadata", icon: Tag },
    { id: "review", label: "Review & Publish", icon: Eye },
  ];

  // Helper function to get input className with empty warning
  const getInputClassName = (value, isRequired = false) => {
    const baseClass = "input-field";
    if (isRequired) return baseClass; // Required fields use default validation
    if (showEmptyWarnings && (!value || value.trim() === "")) {
      return `${baseClass} border-yellow-300 bg-yellow-50/30 focus:border-yellow-400 focus:ring-yellow-200`;
    }
    return baseClass;
  };
  
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



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setNewService(prev => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };
      
      // Auto-generate slug from title
      if (name === "title") {
        updated.slug = value.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      }
      
      return updated;
    });
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
    
    // Auto-generate slug from title if title is changed
    if (field === "title") {
      updated[index].slug = value.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }
    
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

  // Sub-product Nested Handlers
  const handleSubProductNestedChange = (subIndex, field, nestedIndex, nestedField, value) => {
    const updated = [...newService.subProducts];
    // Deep clone the sub-product and the nested array
    const subProduct = { ...updated[subIndex] };
    const nestedArray = [...(subProduct[field] || [])];
    
    if (nestedField === null) {
      nestedArray[nestedIndex] = value;
    } else {
      nestedArray[nestedIndex] = { ...nestedArray[nestedIndex], [nestedField]: value };
    }
    
    subProduct[field] = nestedArray;
    updated[subIndex] = subProduct;
    
    setNewService(prev => ({ ...prev, subProducts: updated }));
  };

  const addSubProductNestedItem = (subIndex, field, emptyItem) => {
    const updated = [...newService.subProducts];
    updated[subIndex][field] = [...updated[subIndex][field], emptyItem];
    setNewService(prev => ({ ...prev, subProducts: updated }));
  };

  const removeSubProductNestedItem = (subIndex, field, nestedIndex) => {
    const updated = [...newService.subProducts];
    updated[subIndex][field] = updated[subIndex][field].filter((_, i) => i !== nestedIndex);
    setNewService(prev => ({ ...prev, subProducts: updated }));
  };

  const handleSubProductGalleryChange = (subIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const updated = Array.from(newService.subProducts);
      const newGalleryFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        alt: ""
      }));
      updated[subIndex].galleryFiles = [...(updated[subIndex].galleryFiles || []), ...newGalleryFiles];
      setNewService(prev => ({ ...prev, subProducts: updated }));
    }
  };

  const handleSubProductGalleryItemAltChange = (subIndex, imgIndex, alt, isExisting = false) => {
    const updated = [...newService.subProducts];
    if (isExisting) {
      const gallery = [...updated[subIndex].gallery];
      gallery[imgIndex] = { ...gallery[imgIndex], alt };
      updated[subIndex].gallery = gallery;
    } else {
      const galleryFiles = [...updated[subIndex].galleryFiles];
      galleryFiles[imgIndex] = { ...galleryFiles[imgIndex], alt };
      updated[subIndex].galleryFiles = galleryFiles;
    }
    setNewService(prev => ({ ...prev, subProducts: updated }));
  };

  const removeSubProductGalleryItem = (subIndex, imgIndex, isExisting = false) => {
    const updated = [...newService.subProducts];
    if (isExisting) {
      updated[subIndex].gallery = updated[subIndex].gallery.filter((_, i) => i !== imgIndex);
    } else {
      updated[subIndex].galleryFiles = updated[subIndex].galleryFiles.filter((_, i) => i !== imgIndex);
    }
    setNewService(prev => ({ ...prev, subProducts: updated }));
  };

  const clearForm = () => {
    setNewService({
      title: "",
      slug: "",
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
      metaTitle: "",
      metaDescription: "",
      isActive: true,
    });
    setEditingId(null);
    setError("");
    setSuccessMessage("");
    setSuccessMessage("");
    setShowForm(false);
    setActiveTab("general");
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
    setShowEmptyWarnings(true);
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

      const validMainSections = newService.sections.filter(s => s.heading.trim() !== "" || s.content.trim() !== "");
      const cleanMainSections = validMainSections.map(({ imageFile, imagePreview, ...rest }) => rest);

      const cleanedSubProducts = newService.subProducts
        .filter(sub => sub.title.trim() !== "")
        .map(({ imageFile, imagePreview, galleryFiles, ...rest }) => {
          const cleanFeatures = (rest.features || []).filter(f => f && f.trim() !== "");
          const cleanSpecs = (rest.specifications || []).filter(s => s && s.label && s.label.trim() !== "" && s.value && s.value.trim() !== "");
          const cleanApps = (rest.applications || []).filter(a => a && a.trim() !== "");
          const cleanBenefits = (rest.benefits || []).filter(b => b && b.trim() !== "");
          const cleanSubFAQs = (rest.faqs || []).filter(f => f && (f.question.trim() !== "" || f.answer.trim() !== ""));
          const cleanSubSections = (rest.sections || []).map(s => {
            const { imageFile, imagePreview, ...sRest } = s;
            return sRest;
          });

          return {
            ...rest,
            features: cleanFeatures,
            specifications: cleanSpecs,
            applications: cleanApps,
            benefits: cleanBenefits,
            faqs: cleanSubFAQs,
            sections: cleanSubSections
          };
        });

      const cleanSpecs = newService.specs.filter(s => s.label.trim() && s.value.trim());
      const cleanApplications = newService.applications.filter((a) => a.trim() !== "");
      const cleanFAQs = newService.faqs.filter((f) => f.question.trim() !== "" || f.answer.trim() !== "");

      formData.append("title", newService.title);
      formData.append("slug", newService.slug);
      formData.append("subtitle", newService.subtitle);
      formData.append("description", newService.description);
      formData.append("metaTitle", newService.metaTitle || "");
      formData.append("metaDescription", newService.metaDescription || "");
      formData.append("subProducts", JSON.stringify(cleanedSubProducts));
      formData.append("specs", JSON.stringify(cleanSpecs));
      formData.append("applications", JSON.stringify(cleanApplications));
      formData.append("sections", JSON.stringify(cleanMainSections));
      formData.append("faqs", JSON.stringify(cleanFAQs));
      formData.append("category", newService.category);
      formData.append("tags", JSON.stringify(newService.tags));
      formData.append("layout", JSON.stringify(newService.layout));
      formData.append("extraContent", JSON.stringify(newService.extraContent));

      if (newService.heroImage) formData.append("heroImage", newService.heroImage);
      if (newService.cardImage) formData.append("cardImage", newService.cardImage);
      formData.append("heroImageAlt", newService.heroImageAlt || "");
      formData.append("cardImageAlt", newService.cardImageAlt || "");

      newService.subProducts.forEach((sub, index) => {
        if (sub.imageFile) formData.append(`subProductImage_${index}`, sub.imageFile);
        if (sub.galleryFiles && sub.galleryFiles.length > 0) {
          sub.galleryFiles.forEach((gf, imgIndex) => {
            if (gf.file) formData.append(`subProductGallery_${index}_${imgIndex}`, gf.file);
          });
        }
      });

      validMainSections.forEach((sec, index) => {
        if (sec.imageFile) formData.append(`sectionImage_${index}`, sec.imageFile);
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
      slug: service.slug || "",
      subtitle: service.subtitle || "",
      description: service.description || "",
      heroImage: null,
      heroImageAlt: service.heroImageAlt || "",
      heroImagePreview: service.heroImage || null,
      cardImage: null,
      cardImageAlt: service.cardImageAlt || "",
      cardImagePreview: service.cardImage || null,
      subProducts: service.subProducts?.length 
          ? service.subProducts.map(sp => ({ 
            ...sp, 
            imagePreview: null,
            gallery: sp.gallery || [],
            galleryFiles: [],
            features: sp.features?.length ? sp.features : [""],
            specifications: sp.specifications?.length ? sp.specifications : [{ label: "", value: "" }],
            applications: sp.applications?.length ? sp.applications : [""],
            benefits: sp.benefits?.length ? sp.benefits : [""],
            faqs: sp.faqs?.length ? sp.faqs : [{ question: "", answer: "" }],
            subtitle: sp.subtitle || "",
            fullDescription: sp.fullDescription || "",
            metaTitle: sp.metaTitle || "",
            metaDescription: sp.metaDescription || ""
          })) 
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
            imagePreview: null,
            imageAlt: sec.imageAlt || ""
          })) 
        : [getEmptySection()],
      faqs: service.faqs?.length ? service.faqs : [getEmptyFAQ()],
      category: service.category || "",
      tags: service.tags || [],
      extraContent: service.extraContent || [],
      metaTitle: service.metaTitle || "",
      metaDescription: service.metaDescription || "",
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Sidebar Navigation */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="sticky top-8 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                      <div className="mb-4 px-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Navigation</h3>
                      </div>
                      <div className="space-y-1">
                      {tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold transition-all rounded-2xl border text-left group relative overflow-hidden",
                              isActive 
                                ? "bg-black text-white border-black shadow-lg shadow-black/20 scale-[1.02]" 
                                : "bg-transparent text-slate-500 border-transparent hover:bg-slate-50 hover:text-black"
                            )}
                          >
                            <div className={cn(
                              "relative z-10 flex items-center justify-center size-8 rounded-lg transition-all",
                              isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm"
                            )}>
                              <TabIcon size={16} />
                            </div>
                            <span className="relative z-10">{tab.label}</span>
                            {isActive && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />}
                          </button>
                        );
                      })}
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="lg:col-span-9 space-y-6 min-h-[600px]">
                    {/* 1. General Info */}
                    {activeTab === "general" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                           <div>
                             <h2 className="text-2xl font-bold text-black tracking-tight">General Information</h2>
                             <p className="text-slate-500 text-sm mt-1">Configure the core details of your service page.</p>
                           </div>
                        </div>

                        {/* Title & Category Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/50 space-y-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <FileText size={120} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3">
                              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Service Title</label>
                              <div className="relative group">
                                <input
                                  type="text"
                                  name="title"
                                  value={newService.title}
                                  onChange={handleInputChange}
                                  className={cn(
                                    "w-full bg-slate-50/50 border-0 rounded-2xl px-5 py-4 text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 focus:bg-white transition-all",
                                    getInputClassName(newService.title, true)
                                  )}
                                  placeholder="e.g. Industrial Labeling"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left rounded-full" />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Category</label>
                              <div className="relative group">
                                <input
                                  type="text"
                                  name="category"
                                  value={newService.category}
                                  onChange={handleInputChange}
                                  className="w-full bg-slate-50/50 border-0 rounded-2xl px-5 py-4 text-lg font-medium text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                                  placeholder="e.g. Manufacturing"
                                />
                                 <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left rounded-full" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 relative z-10">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">URL Slug</label>
                            <input
                              type="text"
                              name="slug"
                              value={newService.slug}
                              disabled
                              className={cn(
                                "w-full bg-slate-100/80 border-0 rounded-2xl px-5 py-4 text-sm font-mono text-slate-500 cursor-not-allowed transition-all",
                                getInputClassName(newService.slug, true)
                              )}
                              placeholder="e.g. industrial-labeling (auto-generated from title)"
                            />
                          </div>

                          <div className="space-y-3 relative z-10">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Subtitle / Tagline</label>
                            <input
                              type="text"
                              name="subtitle"
                              value={newService.subtitle}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full bg-slate-50/50 border-0 rounded-2xl px-5 py-4 text-base font-medium text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 focus:bg-white transition-all",
                                getInputClassName(newService.subtitle, true)
                              )}
                              placeholder="A short, catchy description of the service..."
                            />
                          </div>

                          <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-end">
                              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Description</label>
                            </div>
                            <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/30 focus-within:ring-2 focus-within:ring-black/5 focus-within:bg-white transition-all">
                               <textarea
                                name="description"
                                value={newService.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full bg-transparent border-0 p-5 text-slate-600 placeholder:text-slate-300 resize-none focus:ring-0"
                                placeholder="Detailed overview of the service..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* 2. Media Gallery */}
                    {activeTab === "media" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-black tracking-tight">Visual Assets</h2>
                                <p className="text-slate-500 text-sm mt-1">Manage the hero and card images for this service.</p>
                            </div>
                             <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100 flex items-center gap-2">
                                <ImageIcon size={14} />
                                <span>High Resolution Recommended</span>
                             </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Hero Image Field */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Desktop Hero Banner</label>
                                <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded-md">1200 × 800px</span>
                              </div>
                              
                              <div className="relative group perspective-1000">
                                <input type="file" id="heroImage" accept="image/*" onChange={(e) => handleFileChange(e, "heroImage")} className="hidden" />
                                <label 
                                    htmlFor="heroImage" 
                                    className={cn(
                                        "block aspect-video rounded-3xl cursor-pointer overflow-hidden relative transition-all duration-500",
                                        newService.heroImagePreview 
                                            ? "ring-4 ring-white shadow-2xl shadow-slate-200 rotate-y-2 group-hover:rotate-y-0 group-hover:scale-[1.02]" 
                                            : "bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-100/50"
                                    )}
                                >
                                  {newService.heroImagePreview ? (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-6">
                                            <p className="text-white font-bold text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">Click to Replace</p>
                                        </div>
                                        <img src={getImgUrl(newService.heroImagePreview)} className="w-full h-full object-cover" />
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 group-hover:scale-110 transition-transform duration-300">
                                        <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" /></div>
                                        <span className="text-xs font-bold uppercase tracking-widest">Upload Banner</span>
                                    </div>
                                  )}
                                </label>
                              </div>

                              <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Tag className="w-4 h-4 text-slate-300" />
                                </div>
                                <input
                                  type="text"
                                  name="heroImageAlt"
                                  value={newService.heroImageAlt || ""}
                                  onChange={handleInputChange}
                                  placeholder="Describe this image for SEO..."
                                  className="w-full bg-slate-50 border-0 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 bg-white transition-all shadow-sm"
                                />
                              </div>
                            </div>

                            {/* Card Image Field */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Grid Card Image</label>
                                <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded-md">800 × 600px</span>
                              </div>
                              
                              <div className="relative group perspective-1000">
                                <input type="file" id="cardImage" accept="image/*" onChange={(e) => handleFileChange(e, "cardImage")} className="hidden" />
                                <label 
                                    htmlFor="cardImage" 
                                    className={cn(
                                        "block aspect-[4/3] rounded-3xl cursor-pointer overflow-hidden relative transition-all duration-500",
                                        newService.cardImagePreview 
                                            ? "ring-4 ring-white shadow-2xl shadow-slate-200 rotate-y-2 group-hover:rotate-y-0 group-hover:scale-[1.02]" 
                                            : "bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-100/50"
                                    )}
                                >
                                  {newService.cardImagePreview ? (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-6">
                                            <p className="text-white font-bold text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">Click to Replace</p>
                                        </div>
                                        <img src={getImgUrl(newService.cardImagePreview)} className="w-full h-full object-cover" />
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 group-hover:scale-110 transition-transform duration-300">
                                        <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" /></div>
                                        <span className="text-xs font-bold uppercase tracking-widest">Upload Thumbnail</span>
                                    </div>
                                  )}
                                </label>
                              </div>

                              <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Tag className="w-4 h-4 text-slate-300" />
                                </div>
                                <input
                                  type="text"
                                  name="cardImageAlt"
                                  value={newService.cardImageAlt || ""}
                                  onChange={handleInputChange}
                                  placeholder="Describe this image for SEO..."
                                  className="w-full bg-slate-50 border-0 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 bg-white transition-all shadow-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Product Catalog */}
                    {activeTab === "products" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-black tracking-tight">Product Catalog</h2>
                                <p className="text-slate-500 text-sm mt-1">Manage sub-products and variants linked to this service.</p>
                            </div>
                           <button type="button" onClick={addSubProduct} className="group flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95">
                             <div className="flex items-center justify-center size-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors"><Plus size={14} /></div>
                             <span>Add Product</span>
                           </button>
                         </div>

                        <div className="grid gap-4">
                           {newService.subProducts.map((sub, i) => (
                             <div key={i} className="group relative bg-white rounded-3xl p-2 pr-6 border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-200">
                               <div className="flex items-center gap-6">
                                 {/* Image Thumbnail */}
                                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                                     {sub.imagePreview || sub.image ? (
                                        <img src={getImgUrl(sub.imagePreview) || getImgUrl(sub.image)} className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                     ) : (
                                        <div className="flex items-center justify-center size-full text-slate-300"><ImageIcon size={24} /></div>
                                     )}
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button 
                                          type="button"
                                          onClick={() => document.getElementById(`subProduct-${i}`).click()}
                                          className="text-white hover:text-red-400 transition-colors"
                                        >
                                           <Pencil size={18} />
                                        </button>
                                     </div>
                                      <input type="file" id={`subProduct-${i}`} accept="image/*" onChange={(e) => handleSubProductFileChange(i, e)} className="hidden" />
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0 py-2">
                                     <div className="flex items-center gap-3 mb-1">
                                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Product #{i + 1}</span>
                                        {(!sub.title || sub.title.trim() === "") && <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><span className="size-1.5 rounded-full bg-amber-500 animate-pulse"/> Incomplete</span>}
                                     </div>
                                     <div className="flex flex-col gap-1">
                                        <input 
                                            type="text" 
                                            placeholder="Product Name..." 
                                            value={sub.title} 
                                            onChange={(e) => handleSubProductChange(i, "title", e.target.value)} 
                                            className="text-lg font-bold text-slate-900 bg-transparent border-0 p-0 placeholder:text-slate-300 focus:ring-0 w-full" 
                                        />
                                         <input 
                                             type="text" 
                                             placeholder="Brief description for card summary..." 
                                             value={sub.desc} 
                                             onChange={(e) => handleSubProductChange(i, "desc", e.target.value)} 
                                             className="text-sm font-medium text-slate-500 bg-transparent border-0 p-0 placeholder:text-slate-300 focus:ring-0 w-full" 
                                         />
                                         <div className="flex items-center gap-2 mt-1">
                                            <Tag size={10} className="text-slate-300" />
                                            <input 
                                                type="text" 
                                                placeholder="Image Alt Text (SEO)..." 
                                                value={sub.imageAlt || ""} 
                                                onChange={(e) => handleSubProductChange(i, "imageAlt", e.target.value)} 
                                                className="text-[10px] font-bold text-indigo-400 bg-transparent border-0 p-0 placeholder:text-slate-300 focus:ring-0 w-full uppercase tracking-tighter" 
                                            />
                                         </div>
                                      </div>
                                   </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-2 border-l border-slate-100 pl-6 py-2">
                                     <button 
                                        type="button" 
                                        onClick={() => setExpandedSubProduct(i)}
                                        className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-black hover:text-white hover:shadow-lg hover:shadow-slate-900/20 transition-all font-medium"
                                        title="Edit Full Details"
                                     >
                                        <Settings size={18} />
                                     </button>
                                     {newService.subProducts.length > 1 && (
                                       <button 
                                            type="button" 
                                            onClick={() => removeSubProduct(i)} 
                                            className="size-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/30 transition-all"
                                            title="Remove Product"
                                       >
                                          <Trash2 size={18} />
                                       </button>
                                     )}
                                     
                                  </div>
                               </div>
                             </div>
                           ))}
                        </div>

                          {/* Detail Overlay */}
                          {expandedSubProduct !== null && (() => {
                            const i = expandedSubProduct;
                            const sub = newService.subProducts[i];
                            if (!sub) return null;
                            
                            return (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md p-6">
                                  <div>
                                    <h3 className="text-xl font-bold text-black">{sub.title || "Product Page Configuration"}</h3>
                                    <p className="text-xs font-medium text-slate-400">Manage detailed content for this specific product</p>
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={() => setExpandedSubProduct(null)} 
                                    className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                                
                                <div className="p-8 space-y-10">
                                  {/* 1. Brand Context */}
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><FileText size={16} /></div>
                                        <h4 className="font-bold text-black uppercase text-xs tracking-widest">Product Title (H1)</h4>
                                      </div>
                                      <input 
                                        type="text" 
                                        value={sub.title} 
                                        onChange={(e) => handleSubProductChange(i, "title", e.target.value)} 
                                        className={getInputClassName(sub.title)}
                                        placeholder="e.g., Ultra-High Gloss Barcode"
                                      />
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><ImageIcon size={16} /></div>
                                        <h4 className="font-bold text-black uppercase text-xs tracking-widest">Main Product Image</h4>
                                      </div>
                                      <div className="flex gap-4 items-start">
                                        <label className={`size-32 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${sub.imagePreview || sub.image ? 'border-orange-500 bg-orange-50/10' : 'border-slate-200 hover:border-orange-400'}`}>
                                          <input type="file" onChange={(e) => handleSubProductFileChange(i, e)} className="hidden" accept="image/*" />
                                          {sub.imagePreview || sub.image ? (
                                            <img src={getImgUrl(sub.imagePreview) || getImgUrl(sub.image)} className="w-full h-full object-cover rounded-[1.2rem]" />
                                          ) : (
                                            <>
                                              <Upload size={24} className="text-slate-300 mb-2" />
                                              <span className="text-[10px] font-bold text-slate-400 uppercase">Upload</span>
                                            </>
                                          )}
                                        </label>
                                        <div className="flex-1 space-y-3">
                                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Image Alt Text (SEO)</label>
                                          <input 
                                            type="text" 
                                            value={sub.imageAlt} 
                                            onChange={(e) => handleSubProductChange(i, "imageAlt", e.target.value)} 
                                            className={getInputClassName(sub.imageAlt)}
                                            placeholder="e.g., Industrial Heat Resistant Label Main View"
                                          />
                                          <p className="text-[9px] text-slate-400 leading-relaxed">Describe the image for search engines and visually impaired users.</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Tag size={16} /></div>
                                        <h4 className="font-bold text-black uppercase text-xs tracking-widest">URL Slug</h4>
                                      </div>
                                      <input 
                                        type="text" 
                                        value={sub.slug} 
                                        disabled
                                        className={cn(getInputClassName(sub.slug), "font-mono text-sm bg-slate-100/80 text-slate-500 cursor-not-allowed px-4 py-2 rounded-xl")}
                                        placeholder="e.g. ultra-high-gloss-barcode"
                                      />
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Tag size={16} /></div>
                                        <h4 className="font-bold text-black uppercase text-xs tracking-widest">Product Subtitle / Tagline</h4>
                                      </div>
                                      <input 
                                        type="text" 
                                        value={sub.subtitle} 
                                        onChange={(e) => handleSubProductChange(i, "subtitle", e.target.value)} 
                                        className={getInputClassName(sub.subtitle)}
                                        placeholder="e.g., Engineered for Extreme Durability"
                                      />
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Tag size={16} /></div>
                                        <h4 className="font-bold text-black uppercase text-xs tracking-widest">SEO Meta Title</h4>
                                      </div>
                                      <input 
                                        type="text" 
                                        value={sub.metaTitle} 
                                        onChange={(e) => handleSubProductChange(i, "metaTitle", e.target.value)} 
                                        className={getInputClassName(sub.metaTitle)}
                                        placeholder="SEO Title (e.g., Best Heat Resistant Labels)"
                                      />
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Tag size={16} /></div>
                                        <h4 className="font-bold text-black uppercase text-xs tracking-widest">SEO Meta Description</h4>
                                      </div>
                                      <textarea 
                                        value={sub.metaDescription} 
                                        onChange={(e) => handleSubProductChange(i, "metaDescription", e.target.value)} 
                                        className={`${getInputClassName(sub.metaDescription)} resize-none`}
                                        rows={2}
                                        placeholder="SEO Description (150-160 chars)..."
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <div className="size-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center"><FileText size={16} /></div>
                                      <h4 className="font-bold text-black uppercase text-xs tracking-widest">Detailed Analysis (Rich Text Article)</h4>
                                    </div>
                                    <ReactQuill 
                                      value={sub.fullDescription} 
                                      onChange={(v) => handleSubProductChange(i, "fullDescription", v)} 
                                      modules={quillModules} 
                                      placeholder="Write the full deep-dive article here..."
                                      className={`bg-white rounded-xl overflow-hidden min-h-[200px] ${showEmptyWarnings && (!sub.fullDescription || sub.fullDescription === '<p><br></p>') ? 'ring-2 ring-yellow-300' : ''}`} 
                                    />
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-10">
                                    {/* 2. Features */}
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Tag size={16} /></div>
                                          <h4 className="font-bold text-black uppercase text-xs tracking-widest">Product Features (List)</h4>
                                        </div>
                                        <button type="button" onClick={() => addSubProductNestedItem(i, "features", "")} className="text-[10px] font-bold text-red-600 hover:underline">+ ADD FEATURE</button>
                                      </div>
                                      <div className="space-y-2">
                                        {sub.features.map((feature, fIndex) => (
                                          <div key={fIndex} className="flex gap-2">
                                            <input 
                                              type="text" 
                                              value={feature} 
                                              onChange={(e) => handleSubProductNestedChange(i, "features", fIndex, null, e.target.value)} 
                                              className={`${getInputClassName(feature)} h-9 text-xs`} 
                                              placeholder="Feature point..."
                                            />
                                            <button type="button" onClick={() => removeSubProductNestedItem(i, "features", fIndex)} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* 3. Specs */}
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="size-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Settings size={16} /></div>
                                          <h4 className="font-bold text-black uppercase text-xs tracking-widest">Technical Data (Matrix)</h4>
                                        </div>
                                        <button type="button" onClick={() => addSubProductNestedItem(i, "specifications", { label: "", value: "" })} className="text-[10px] font-bold text-red-600 hover:underline">+ ADD SPEC</button>
                                      </div>
                                      <div className="space-y-2">
                                        {sub.specifications.map((spec, sIndex) => (
                                          <div key={sIndex} className="flex gap-2">
                                            <input 
                                              type="text" 
                                              value={spec.label} 
                                              onChange={(e) => handleSubProductNestedChange(i, "specifications", sIndex, "label", e.target.value)} 
                                              className={`${getInputClassName(spec.label)} h-9 text-[10px]`} 
                                              placeholder="Label (e.g., Temp)"
                                            />
                                            <input 
                                              type="text" 
                                              value={spec.value} 
                                              onChange={(e) => handleSubProductNestedChange(i, "specifications", sIndex, "value", e.target.value)} 
                                              className={`${getInputClassName(spec.value)} h-9 text-[10px]`} 
                                              placeholder="Value (e.g., 80C)"
                                            />
                                            <button type="button" onClick={() => removeSubProductNestedItem(i, "specifications", sIndex)} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-10">
                                    {/* 4. Applications */}
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="size-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><LayoutGrid size={16} /></div>
                                          <h4 className="font-bold text-black uppercase text-xs tracking-widest">Applications Grid</h4>
                                        </div>
                                        <button type="button" onClick={() => addSubProductNestedItem(i, "applications", "")} className="text-[10px] font-bold text-red-600 hover:underline">+ ADD USAGE</button>
                                      </div>
                                      <div className="space-y-2">
                                        {sub.applications?.map((app, aIndex) => (
                                          <div key={aIndex} className="flex gap-2">
                                            <input 
                                              type="text" 
                                              value={app} 
                                              onChange={(e) => handleSubProductNestedChange(i, "applications", aIndex, null, e.target.value)} 
                                              className={`${getInputClassName(app)} h-9 text-xs`} 
                                              placeholder="Usage scenario..."
                                            />
                                            <button type="button" onClick={() => removeSubProductNestedItem(i, "applications", aIndex)} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* 5. Benefits */}
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="size-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center"><Check size={16} /></div>
                                          <h4 className="font-bold text-black uppercase text-xs tracking-widest">Key Advantages (Benefits)</h4>
                                        </div>
                                        <button type="button" onClick={() => addSubProductNestedItem(i, "benefits", "")} className="text-[10px] font-bold text-red-600 hover:underline">+ ADD BENEFIT</button>
                                      </div>
                                      <div className="space-y-2">
                                        {sub.benefits?.map((benefit, bIndex) => (
                                          <div key={bIndex} className="flex gap-2">
                                            <input 
                                              type="text" 
                                              value={benefit} 
                                              onChange={(e) => handleSubProductNestedChange(i, "benefits", bIndex, null, e.target.value)} 
                                              className={`${getInputClassName(benefit)} h-9 text-xs`} 
                                              placeholder="Benefit point..."
                                            />
                                            <button type="button" onClick={() => removeSubProductNestedItem(i, "benefits", bIndex)} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 6. Sub-Product FAQs */}
                                  <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><HelpCircle size={16} /></div>
                                        <h4 className="font-bold text-black uppercase text-xs tracking-widest">Product Specific FAQs</h4>
                                      </div>
                                      <button type="button" onClick={() => addSubProductNestedItem(i, "faqs", { question: "", answer: "" })} className="text-[10px] font-bold text-red-600 hover:underline">+ ADD FAQ</button>
                                    </div>
                                    <div className="grid gap-4">
                                      {sub.faqs?.map((faq, fIndex) => (
                                        <div key={fIndex} className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 relative group/faq">
                                          <button type="button" onClick={() => removeSubProductNestedItem(i, "faqs", fIndex)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover/faq:opacity-100 transition-opacity"><X size={16} /></button>
                                          <input 
                                            type="text" 
                                            value={faq.question} 
                                            onChange={(e) => handleSubProductNestedChange(i, "faqs", fIndex, "question", e.target.value)} 
                                            className={`${getInputClassName(faq.question)} h-10 font-bold text-xs`} 
                                            placeholder="Question"
                                          />
                                          <textarea 
                                            value={faq.answer} 
                                            onChange={(e) => handleSubProductNestedChange(i, "faqs", fIndex, "answer", e.target.value)} 
                                            className={`${getInputClassName(faq.answer)} text-xs resize-none`} 
                                            rows={2}
                                            placeholder="Answer"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 4. Gallery */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><ImageIcon size={16} /></div>
                                        <h4 className="font-bold text-black uppercase text-xs tracking-widest">Product Gallery (Carousel)</h4>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
                                          <p className="text-[10px] font-bold text-purple-600">Hero: 2100×900px | Gallery: 800×800px</p>
                                        </div>
                                        <div className="group/tip relative">
                                          <div className="size-5 rounded-full bg-slate-100 flex items-center justify-center cursor-help">
                                            <span className="text-[10px] font-bold text-slate-400">?</span>
                                          </div>
                                          <div className="absolute right-0 top-8 z-50 w-72 p-4 bg-slate-900 text-white rounded-xl shadow-2xl opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-200">
                                            <p className="text-[11px] font-bold mb-3">📐 Image Size Guide:</p>
                                            <div className="space-y-2">
                                              <div className="p-2 bg-white/10 rounded-lg">
                                                <p className="text-[10px] font-bold text-purple-300 mb-1">Hero Image (First Upload)</p>
                                                <p className="text-[9px] leading-relaxed">2100×900px (21:9 ratio)</p>
                                                <p className="text-[8px] text-white/60 mt-1">Ultra-wide format, no stretching</p>
                                              </div>
                                              <div className="p-2 bg-white/10 rounded-lg">
                                                <p className="text-[10px] font-bold text-purple-300 mb-1">Gallery Thumbnails</p>
                                                <p className="text-[9px] leading-relaxed">800×800px (1:1 ratio)</p>
                                                <p className="text-[8px] text-white/60 mt-1">Square format for carousel</p>
                                              </div>
                                            </div>
                                            <div className="w-3 h-3 bg-slate-900 rotate-45 absolute -top-1.5 right-4"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {/* Existing images */}
                                      {sub.gallery?.map((imgObj, imgIndex) => (
                                        <div key={`existing-${imgIndex}`} className="p-3 bg-white rounded-2xl border border-slate-100 space-y-3 group/gal">
                                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                                            <img src={getImgUrl(imgObj.url)} className="w-full h-full object-cover" />
                                            <button 
                                              type="button" 
                                              onClick={() => removeSubProductGalleryItem(i, imgIndex, true)}
                                              className="absolute top-2 right-2 size-8 bg-red-600 text-white rounded-xl shadow-lg flex items-center justify-center opacity-0 group-hover/gal:opacity-100 transition-all hover:scale-110"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                          <input 
                                            type="text" 
                                            placeholder="SEO Alt Text..." 
                                            value={imgObj.alt || ""} 
                                            onChange={(e) => handleSubProductGalleryItemAltChange(i, imgIndex, e.target.value, true)}
                                            className="w-full text-[10px] font-medium bg-slate-50 border-0 rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-500"
                                          />
                                        </div>
                                      ))}
                                      {/* New images */}
                                      {sub.galleryFiles?.map((gf, imgIndex) => (
                                        <div key={`new-${imgIndex}`} className="p-3 bg-white rounded-2xl border border-indigo-100 border-dashed space-y-3 group/gal">
                                          <div className="relative aspect-video rounded-xl overflow-hidden bg-indigo-50/30 border border-indigo-50">
                                            <img src={gf.preview} className="w-full h-full object-cover" />
                                            <button 
                                              type="button" 
                                              onClick={() => removeSubProductGalleryItem(i, imgIndex, false)}
                                              className="absolute top-2 right-2 size-8 bg-red-600 text-white rounded-xl shadow-lg flex items-center justify-center opacity-0 group-hover/gal:opacity-100 transition-all hover:scale-110"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                          <input 
                                            type="text" 
                                            placeholder="SEO Alt Text..." 
                                            value={gf.alt || ""} 
                                            onChange={(e) => handleSubProductGalleryItemAltChange(i, imgIndex, e.target.value, false)}
                                            className="w-full text-[10px] font-medium bg-indigo-50/50 border-0 rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-500"
                                          />
                                        </div>
                                      ))}
                                      {/* Upload button */}
                                      <label className={`aspect-video flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/10 transition-all ${showEmptyWarnings && (!sub.gallery?.length && !sub.galleryFiles?.length) ? 'border-yellow-300 bg-yellow-50/10' : 'border-slate-200'}`}>
                                        <input type="file" multiple accept="image/*" onChange={(e) => handleSubProductGalleryChange(i, e)} className="hidden" />
                                        <Plus size={24} className="text-slate-300 mb-2" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Gallery Images</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md p-6 flex justify-end">
                                  <button 
                                    type="button" 
                                    onClick={() => setExpandedSubProduct(null)} 
                                    className="btn-primary h-11 px-8 rounded-xl shadow-lg"
                                  >
                                    Finish Editing Product
                                  </button>
                                </div>
                              </div>
                            </div>
                            );
                          })()}

                        <button type="button" onClick={addSubProduct} className="group w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-[10px] font-bold sm:text-xs uppercase tracking-widest text-slate-400 hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center gap-2">
                          <Plus className="group-hover:rotate-90 transition-transform" size={16} />
                          Add New Product to Catalog
                        </button>
                      </div>
                    )}

                    {/* 4. Content & Specs */}
                    {activeTab === "content" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="size-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center"><Settings size={20} /></div>
                          <div>
                            <h3 className="text-lg font-bold text-black">Content & Specifications</h3>
                            <p className="text-xs text-slate-500 font-medium">Technical details and editorial content</p>
                          </div>
                        </div>

                        <div className="grid gap-6">
                          {/* Editorial Content */}
                          <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                             <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-black">Rich Editorial Content</h4>
                                <button type="button" onClick={addSection} className="text-xs font-bold text-red-600 hover:underline">+ Add Section</button>
                             </div>
                             <div className="space-y-6">
                               {newService.sections.map((section, i) => (
                                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200">
                                  <div className="flex justify-between mb-4 text-slate-400"><span className="text-[10px] font-bold uppercase tracking-widest">Section #{i + 1}</span>{newService.sections.length > 1 && <button type="button" onClick={() => removeSection(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>}</div>
                                  <div className="space-y-4">
                                    <input type="text" placeholder="Section Heading" value={section.heading} onChange={(e) => handleSectionChange(i, "heading", e.target.value)} className="input-field text-base font-bold" />
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                      <div className="md:col-span-3"><ReactQuill value={section.content} onChange={(v) => handleSectionChange(i, "content", v)} modules={quillModules} className="bg-slate-50 rounded-xl overflow-hidden" theme="snow" /></div>
                                      <div className="space-y-4">
                                        <input type="file" id={`section-${i}`} accept="image/*" onChange={(e) => handleSectionFileChange(i, e)} className="hidden" />
                                        <label htmlFor={`section-${i}`} className="block aspect-square bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer overflow-hidden">{section.imagePreview || section.image ? <img src={getImgUrl(section.imagePreview) || getImgUrl(section.image)} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Upload className="w-8 h-8 text-slate-300" /></div>}</label>
                                        <input type="text" placeholder="Media Alt Text" value={section.imageAlt} onChange={(e) => handleSectionChange(i, "imageAlt", e.target.value)} className="input-field text-[10px]" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                             </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Specs */}
                            <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                               <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-bold text-black">Performance Specs</h4>
                                  <button type="button" onClick={addSpec} className="text-xs font-bold text-red-600 hover:underline">+ Add Spec</button>
                               </div>
                               <div className="space-y-3">
                                {newService.specs.map((spec, i) => (
                                  <div key={i} className="flex gap-3">
                                    <input type="text" placeholder="Label" value={spec.label} onChange={(e) => handleSpecChange(i, "label", e.target.value)} className="flex-1 input-field h-9 text-xs" />
                                    <input type="text" placeholder="Value" value={spec.value} onChange={(e) => handleSpecChange(i, "value", e.target.value)} className="flex-1 input-field h-9 text-xs" />
                                    {newService.specs.length > 1 && <button type="button" onClick={() => removeSpec(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Applications */}
                            <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                               <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-bold text-black">Sidebar Applications</h4>
                                  <button type="button" onClick={addApplication} className="text-xs font-bold text-red-600 hover:underline">+ Add App</button>
                               </div>
                               <div className="space-y-3">
                                {newService.applications.map((app, i) => (
                                  <div key={i} className="flex gap-3">
                                    <input type="text" placeholder="Application" value={app} onChange={(e) => handleApplicationChange(i, e.target.value)} className="flex-1 input-field h-9 text-xs" />
                                    {newService.applications.length > 1 && <button type="button" onClick={() => removeApplication(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* FAQs */}
                          <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                             <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-black">Service FAQs</h4>
                                <button type="button" onClick={addFAQ} className="text-xs font-bold text-red-600 hover:underline">+ Add FAQ</button>
                             </div>
                             <div className="space-y-4">
                               {newService.faqs.map((faq, i) => (
                                <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 relative">
                                  <button type="button" onClick={() => removeFAQ(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                  <input type="text" placeholder="Question" value={faq.question} onChange={(e) => handleFAQChange(i, "question", e.target.value)} className="input-field font-bold text-xs" />
                                  <textarea placeholder="Answer" value={faq.answer} onChange={(e) => handleFAQChange(i, "answer", e.target.value)} rows={2} className="input-field resize-none text-xs" />
                                </div>
                              ))}
                             </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. SEO */}
                    {activeTab === "seo" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="size-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center"><Tag size={20} /></div>
                          <div>
                            <h3 className="text-lg font-bold text-black">SEO Metadata</h3>
                            <p className="text-xs text-slate-500 font-medium">Search engine optimization settings</p>
                          </div>
                        </div>
                        <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 space-y-6">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Meta Title</label>
                            <input
                              type="text"
                              name="metaTitle"
                              value={newService.metaTitle}
                              onChange={handleInputChange}
                              placeholder="SEO Title (e.g., Best Industrial Labeling Services)..."
                              className="input-field"
                            />
                            <p className="text-[10px] text-slate-400 px-1">This title will override the default service title for search engines.</p>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Meta Description</label>
                            <textarea
                              name="metaDescription"
                              value={newService.metaDescription}
                              onChange={handleInputChange}
                              rows={3}
                              placeholder="Concise summary for search engines (150-160 chars recommended)..."
                              className="input-field resize-none"
                            />
                            <p className="text-[10px] text-slate-400 px-1">This description will appear in search engine results.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 6. Review */}
                    {activeTab === "review" && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="size-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center"><Eye size={20} /></div>
                          <div>
                            <h3 className="text-lg font-bold text-black">Review & Publish</h3>
                            <p className="text-xs text-slate-500 font-medium">Finalize and publish your service</p>
                          </div>
                        </div>
                        <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 space-y-8">
                           <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                              <div>
                                <h4 className="font-bold text-black text-sm">Public Visibility</h4>
                                <p className="text-xs text-slate-500">Synchronize this module with the live client environment</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={newService.isActive} onChange={(e) => setNewService(prev => ({ ...prev, isActive: e.target.checked }))} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                              </label>
                           </div>
                           
                           <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                              <h4 className="text-blue-900 font-bold text-sm mb-2">Ready to Publish?</h4>
                              <p className="text-xs text-blue-700/80 mb-4">Ensure all required fields (marked with *) are filled before saving.</p>
                              <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary w-full justify-center">
                                {isSubmitting ? "Saving..." : "Save Service Changes"}
                              </button>
                           </div>
                        </div>
                      </div>
                    )}

                  </div>
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
