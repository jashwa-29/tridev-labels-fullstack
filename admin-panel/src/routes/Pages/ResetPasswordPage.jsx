import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { authService } from "@/services";

function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Get token from state passed by navigate()
    const resetToken = location.state?.token;

    // Redirect to login if no token is present (accessing page directly)
    if (!resetToken) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                 <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">Invalid Access</h2>
                    <button onClick={() => navigate("/")} className="btn-primary px-6 py-2">Go to Login</button>
                 </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await authService.resetPassword(resetToken, password);
            navigate("/"); // Redirect to login
        } catch (err) {
            setError(err.message || "Invalid or expired token");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
             <div className="absolute inset-0 z-0">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 sm:p-12 relative z-10 border border-slate-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 mb-2 font-title">Reset Password</h2>
                    <p className="text-slate-500 font-medium">Enter your new password below</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="size-5 text-red-600 shrink-0" />
                        <p className="text-sm font-bold text-red-900 tracking-tight">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">New Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12 h-14 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field pl-12 h-14 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full h-14 text-base shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="size-6 animate-spin mx-auto" />
                        ) : (
                            <div className="flex items-center justify-center gap-2 group">
                                <span>Reset Password</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
