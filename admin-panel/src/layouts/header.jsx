import { ChevronsLeft, Search, LogOut, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 flex h-[70px] items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md transition-all">
            <div className="flex items-center gap-x-4">
                <button
                    className="group btn-ghost"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={cn("transition-transform duration-500 ease-in-out group-hover:text-red-600", collapsed && "rotate-180")} />
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

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};

