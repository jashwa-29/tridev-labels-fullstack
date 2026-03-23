import { useState } from "react";
import { Lock, Mail, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { authService } from "@/services";

function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await authService.updateCredentials({ 
                currentPassword, 
                newEmail, 
                newPassword 
            });
            
            setMessage("Credentials updated successfully!");
            
            // Optionally update user in local storage if email changed
             if (res.user) {
                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({ ...currentUser, ...res.user }));
            }
            // Clear sensitive fields
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError(err.message || "Failed to update credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-900 font-title">Settings</h1>
            <p className="text-slate-500 font-medium">Manage your admin account credentials.</p>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm max-w-2xl">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="size-5 text-red-600 shrink-0" />
                        <p className="text-sm font-bold text-red-900 tracking-tight">{error}</p>
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle className="size-5 text-green-600 shrink-0" />
                        <p className="text-sm font-bold text-green-900 tracking-tight">{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Current Password (Required)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                                <Lock size={18} />
                            </div>
                             <input
                                type="password"
                                placeholder="Enter current password to verify"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input-field pl-12 h-14 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="space-y-2 mb-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">New Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Leave blank to keep current"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="input-field pl-12 h-14 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">New Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="input-field pl-12 h-14 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-14 text-base shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="size-6 animate-spin mx-auto" />
                            ) : (
                                <div className="flex items-center justify-center gap-2 group">
                                    <Save size={20} />
                                    <span>Update Credentials</span>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SettingsPage;
