import { useState, useEffect } from "react";
import { User, Mail, Plus, Trash2, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Toast from "@/components/Toast";
import apiClient from '@/lib/api-client';

const ManageAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/auth/admins");
      if (res.success) {
        setAdmins(res.data);
      }
    } catch (error) {
      showToast(error.message || "Failed to fetch admins", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handeCreateAdmin = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    // Basic validation
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
        showToast("All fields are required", "error");
        setCreating(false);
        return;
    }

    try {
      const res = await apiClient.post("/auth/create-admin", newAdmin);
      if (res.success) {
        showToast("Admin created successfully!", "success");
        setNewAdmin({ name: "", email: "", password: "" });
        fetchAdmins(); // Refresh list
      }
    } catch (error) {
      showToast(error.message || "Failed to create admin", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) return;

    try {
      const res = await apiClient.delete(`/auth/admin/${id}`);
      if (res.success) {
        showToast("Admin removed successfully", "success");
        // Optimistic update
        setAdmins(prev => prev.filter(admin => admin._id !== id));
      }
    } catch (error) {
       showToast(error.message || "Failed to delete admin", "error");
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ ...toast, show: false })} 
          />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-title">Manage Admins</h1>
          <p className="text-slate-500 font-medium mt-2">Create and manage administrative accounts with dashboard access.</p>
        </div>
      </div>

     <div className="grid lg:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Plus size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Add New Admin</h3>
                        <p className="text-xs text-slate-500 font-medium">Create a new dashboard user</p>
                    </div>
                </div>

                <form onSubmit={handeCreateAdmin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                        <input 
                            type="text" 
                            className="input-field w-full"
                            placeholder="John Doe"
                            value={newAdmin.name}
                            onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                        <input 
                            type="email" 
                            className="input-field w-full"
                            placeholder="admin@example.com"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Initial Password</label>
                        <input 
                            type="password" 
                            className="input-field w-full"
                             placeholder="••••••••"
                             value={newAdmin.password}
                             onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={creating}
                        className="btn-primary w-full justify-center mt-4"
                    >
                         {creating ? <Loader2 className="animate-spin" /> : "Create Admin Access"}
                    </button>
                </form>
            </div>
        </div>

        {/* List */}
        <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-slate-400" size={20} />
                        <h3 className="font-bold text-slate-900">Active Administrators</h3>
                        <span className="badge badge-red ml-2">{admins.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400">
                        <Loader2 className="animate-spin size-8 mx-auto mb-2" />
                        <p>Loading admins...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {admins.map((admin) => (
                            <div key={admin._id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900">{admin.name}</h4>
                                            {admin.role === 'superadmin' && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Super Admin</span>}
                                            {admin._id === currentUser._id && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                            <Mail size={14} />
                                            <span>{admin.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {admin.role !== 'superadmin' && (
                                    <button 
                                        onClick={() => handleDeleteAdmin(admin._id)}
                                        className="size-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                                        title="Revoke Access"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {admins.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                <p>No other admins found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
     </div>
    </div>
  );
};

export default ManageAdminsPage;
