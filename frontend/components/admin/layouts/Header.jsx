"use client";

import { ChevronsLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/components/admin/utils/cn";

export const AdminHeader = ({ collapsed, setCollapsed }) => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin");
    };

    return (
        <header className="sticky top-0 z-50 flex h-[70px] items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md transition-all">
            <div className="flex items-center gap-x-4">
                <button
                    className="admin-btn-ghost"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={cn("transition-transform duration-500 ease-in-out hover:text-red-600", collapsed && "rotate-180")} />
                </button>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-x-2 rounded-xl px-4 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-50 active:scale-95"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Sign Out</span>
                </button>
            </div>
        </header>
    );
};







