import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiUri = import.meta.env.VITE_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(`${apiUri}/api/auth/login`, { email, password });
            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 sm:p-12 relative z-10 border border-slate-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 mb-2 font-title">Admin Access</h2>
                    <p className="text-slate-500 font-medium">Enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="size-5 text-red-600 shrink-0" />
                        <p className="text-sm font-bold text-red-900 tracking-tight">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-12 h-14 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Password</label>
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

                    <div className="flex items-center justify-between pt-2">
                        <Link to="/forgot-password" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                            Forgot password?
                        </Link>
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
                                <span>Sign In</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 pt-8">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                        Secure Admin Portal
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

