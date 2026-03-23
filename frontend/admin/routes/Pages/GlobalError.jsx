import { useRouteError, Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RotateCcw, ArrowLeft } from "lucide-react";

export default function GlobalError() {
    const error = useRouteError();
    const navigate = useNavigate();
    
    console.error("Management System Fault:", error);

    const is404 = error?.status === 404;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 p-12 bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-12 h-12 text-[#E32219]" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                        {is404 ? "Industrial Path Missing" : "System Error Detected"}
                    </h1>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        {is404 
                            ? "The administrative resource you are looking for has been moved or does not exist." 
                            : "An unexpected technical fault occurred in the management dashboard logic."}
                    </p>
                    {error?.statusText || error?.message && (
                        <div className="bg-slate-50 p-3 rounded-xl text-[10px] font-mono text-slate-400 mt-4">
                            Log: {error.statusText || error.message}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Restart Application
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="h-14 bg-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                        <Link 
                            to="/"
                            className="h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                        >
                            <Home className="w-4 h-4" />
                            Security Login
                        </Link>
                    </div>
                </div>

                <div className="pt-8 opacity-40">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
                        Trridev Labelss Management Core
                    </p>
                </div>
            </div>
        </div>
    );
}
