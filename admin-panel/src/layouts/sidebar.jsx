import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logoDark from "../../public/logo.png";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import { User, Settings, LogOut } from "lucide-react";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[280px] flex-col overflow-x-hidden border-r border-slate-100 bg-white shadow-sm transition-all duration-500 ease-in-out",
                collapsed ? "md:w-[80px] md:items-center" : "md:w-[280px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            {/* Header / Logo */}
            <div className="flex  shrink-0 items-center gap-x-3 p-6">
                <div className="./">
                    <img
                        src={logoDark}
                        alt="Logo"
                        className=""
                    />
                </div>
               
            </div>

            {/* Navigation Navigation */}
            <div className="flex w-full flex-col gap-y-8 overflow-y-auto overflow-x-hidden p-4 py-8 [scrollbar-width:_none]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        {!collapsed && (
                            <p className="sidebar-group-title mb-2 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
                                {navbarLink.title}
                            </p>
                        )}
                        <div className="flex flex-col gap-y-1">
                            {navbarLink.links.map((link) => (
                                <NavLink
                                    key={link.label}
                                    to={link.path}
                                    end
                                    className={cn(
                                        "sidebar-item hover:shadow-xs", 
                                        collapsed && "scale-90 md:w-12 md:px-0 md:justify-center"
                                    )}
                                >
                                    <link.icon
                                        size={20}
                                        className="flex-shrink-0 transition-transform group-hover:scale-110"
                                    />
                                    {!collapsed && <span className="truncate font-bold tracking-tight">{link.label}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </nav>
                ))}
            </div>

     
        </aside>
    );
});

Sidebar.displayName = "Sidebar";
Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};

