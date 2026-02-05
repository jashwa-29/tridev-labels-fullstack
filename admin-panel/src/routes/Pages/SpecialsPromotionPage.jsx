import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { 
  Trash2, 
  Calendar, 
  Upload, 
  Plus, 
  Tag, 
  AlertCircle,
  Zap,
  Image as ImageIcon,
  X
} from "lucide-react";
import { Toast, DeleteModal, SuccessModal } from '@/components';

const SpecialsPromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [month, setMonth] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);
  const apiUri = import.meta.env.VITE_API_BASE_URL;

  const fetchPromotions = useCallback(async () => {
    try {
      const res = await axios.get(`${apiUri}/api/specials`);
      setPromotions(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch promotions.");
    }
  }, [apiUri]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size exceeds 5MB limit.");
        return;
      }
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!month || !featuredImage) {
      setError("Please provide both a title and a campaign graphic.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("month", month);
    formData.append("featuredImage", featuredImage);

    try {
      await axios.post(`${apiUri}/api/specials`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchPromotions();
      setFeaturedImage(null);
      setImagePreview(null);
      setSuccessMessage("Campaign launched successfully!");
      setShowSuccessModal(true);
      setShowForm(false);
      setMonth("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to launch campaign.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setPromotionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!promotionToDelete) return;
    try {
      await axios.delete(`${apiUri}/api/specials/${promotionToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPromotions();
      setShowDeleteModal(false);
      setPromotionToDelete(null);
      setSuccessMessage("Promotion removed from live archive.");
      setShowSuccessModal(true);
    } catch (err) {
      setError("Failed to end campaign.");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Toast type="error" message={error} onClose={() => setError("")} />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="End Campaign?"
        message="Are you sure you want to remove this promotion? This will take down the promotion from your website."
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message={successMessage}
      />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">Specials & Promotions</h1>
          <p className="mt-2 text-slate-500 font-medium">Coordinate and deploy limited-time industrial offers.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary h-14 px-8 shadow-xl shadow-red-200">
            <Plus size={20} />
            <span>Launch New Campaign</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-xl overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-2xl ring-1 ring-slate-100 animate-in fade-in zoom-in-95 duration-500">
            <div className="border-b border-slate-50 p-8 md:p-10 bg-white/80 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200">
                  <Tag size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black font-title leading-none">New Campaign</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1.5 flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-red-600 animate-pulse" />
                    Protocol: Promotion Deploy
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowForm(false)} 
                className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Campaign Title / Month</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                    <Calendar size={20} />
                  </div>
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="e.g. October Specials 2024"
                    className="input-field pl-14 h-14 text-lg font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Promotion Creative (Banner)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-[16/10] cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-4
                    ${imagePreview ? 'border-red-600/30 bg-red-50/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-red-600/30'}`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-2xl" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-bold px-6 py-3 bg-black/20 backdrop-blur-md rounded-2xl ring-1 ring-white/20">Replace Creative</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center group transition-transform duration-500 hover:scale-105">
                      <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-white text-slate-200 shadow-xl shadow-slate-200/50 mb-4 group-hover:text-red-600 transition-colors">
                        <Upload size={32} />
                      </div>
                      <p className="text-sm font-black text-black uppercase tracking-widest">Upload Graphic Asset</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">PNG, JPG or WebP</p>
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
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary h-14 flex-1">Discard</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary h-14 flex-[2] shadow-xl shadow-red-200"
                >
                  {loading ? (
                    <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    <>
                      <Zap size={20} />
                      <span>Launch Campaign</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-black leading-none">Active Campaigns</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Updates: {promotions.length}</p>
            </div>
          </div>
        </div>

        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo) => (
              <div key={promo._id} className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={promo.featuredImage} alt={promo.month} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-black leading-none">{promo.month}</h3>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-emerald-600" />
                        Active Status
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(promo._id)}
                      className="size-12 rounded-2xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center border border-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-80 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white p-12 text-center">
             <div className="mb-4 flex size-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
               <ImageIcon size={40} />
             </div>
             <h3 className="text-xl font-black text-black">No Active Campaigns</h3>
             <p className="mt-2 text-sm font-medium text-slate-500">Your marketplace is currently quiet. Launch a new promotion to drive engagement.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialsPromotionPage;
