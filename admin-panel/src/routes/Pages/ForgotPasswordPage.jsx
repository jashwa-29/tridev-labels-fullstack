import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle, KeyRound } from "lucide-react";
import { authService } from "@/services";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            await authService.sendOtp(email);
            setMessage("OTP sent! Check your email.");
            setStep(2);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const res = await authService.verifyOtp(email, otp);
            // Navigate to reset password page with token in state (hidden from URL)
            navigate("/reset-password", { state: { token: res.resetToken } });
        } catch (err) {
            setError(err.message || "Invalid OTP. Please try again.");
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
                    <h2 className="text-3xl font-black text-slate-900 mb-2 font-title">
                        {step === 1 ? "Forgot Password?" : "Enter OTP"}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {step === 1 ? "Enter your email to receive a code" : `Code sent to ${email}`}
                    </p>
                </div>

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

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-14 text-base shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="size-6 animate-spin mx-auto" />
                            ) : (
                                <div className="flex items-center justify-center gap-2 group">
                                    <span>Send OTP Code</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">One-Time Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                                    <KeyRound size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="input-field pl-12 h-14 w-full bg-slate-50 border-slate-200 focus:bg-white transition-all tracking-widest font-bold text-lg"
                                    required
                                    maxLength={6}
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
                                    <span>Verify & Continue</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => { setStep(1); setMessage(""); setError(""); }}
                            className="w-full text-center text-sm font-medium text-slate-400 hover:text-red-600 transition-colors mt-2"
                        >
                            Change Email Address
                        </button>
                    </form>
                )}
                
                <div className="text-center mt-4">
                    <Link to="/" className="text-sm font-bold text-slate-500 hover:text-black transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
