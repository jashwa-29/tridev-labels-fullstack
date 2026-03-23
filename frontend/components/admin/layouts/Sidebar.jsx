"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navbarLinks } from "@/components/admin/constants";
import { cn } from "@/components/admin/utils/cn";
import { User } from "lucide-react";

export const AdminSidebar = forwardRef(({ collapsed }, ref) => {
    const pathname = usePathname();

    // Determine the most specific active path to prevent multiple active items
    const allPaths = navbarLinks.flatMap(group => group.links.map(l => l.path));
    allPaths.push('/admin/dashboard/admins');
    const sortedPaths = allPaths.sort((a, b) => b.length - a.length);
    const activePath = sortedPaths.find(path => pathname === path || (path !== "/admin/dashboard" && pathname.startsWith(path + '/'))) || "/admin/dashboard";

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
            <div className="flex shrink-0 items-center gap-x-3 p-6">
                <div>
                    <img
                        src="/tridev-logo.png"
                        alt="Tridev Labels Logo"
                        className="h-10 object-contain"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex w-full flex-col gap-y-8 overflow-y-auto overflow-x-hidden p-4 py-8 [scrollbar-width:_none]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("admin-sidebar-group", collapsed && "md:items-center")}
                    >
                        {!collapsed && (
                            <p className="admin-sidebar-group-title mb-2">
                                {navbarLink.title}
                            </p>
                        )}
                        <div className="flex flex-col gap-y-1">
                            {navbarLink.links.map((link) => {
                                const isActive = link.path === activePath;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.path}
                                        className={cn(
                                            "admin-sidebar-item",
                                            isActive && "active",
                                            collapsed && "scale-90 md:w-12 md:px-0 md:justify-center"
                                        )}
                                    >
                                        <link.icon
                                            size={20}
                                            className="flex-shrink-0 transition-transform group-hover:scale-110"
                                        />
                                        {!collapsed && <span className="truncate font-bold tracking-tight">{link.label}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                ))}

                {/* Super Admin Section */}
                {(() => {
                    try {
                        if (typeof window === 'undefined') return null;
                        const user = JSON.parse((typeof window !== "undefined" ? (typeof window !== "undefined" ? localStorage.getItem("user") : null) : null));
                        if (user && user.role === 'superadmin') {
                            const isActive = activePath === '/admin/dashboard/admins';
                            return (
                                <nav className={cn("admin-sidebar-group", collapsed && "md:items-center")}>
                                    {!collapsed && (
                                        <p className="admin-sidebar-group-title mb-2 text-red-300">
                                            Super Admin
                                        </p>
                                    )}
                                    <div className="flex flex-col gap-y-1">
                                        <Link
                                            href="/admin/dashboard/admins"
                                            className={cn(
                                                "admin-sidebar-item text-red-600 hover:!bg-red-50",
                                                isActive && "active",
                                                collapsed && "scale-90 md:w-12 md:px-0 md:justify-center"
                                            )}
                                        >
                                            <User size={20} className="flex-shrink-0" />
                                            {!collapsed && <span className="truncate font-bold tracking-tight">Manage Admins</span>}
                                        </Link>
                                    </div>
                                </nav>
                            );
                        }
                    } catch (e) {
                        return null;
                    }
                })()}
            </div>

            {/* User Profile Section */}
            <div className="mt-auto border-t border-slate-100 p-4">
                {(() => {
                    try {
                        if (typeof window === 'undefined') return null;
                        const user = JSON.parse((typeof window !== "undefined" ? (typeof window !== "undefined" ? localStorage.getItem("user") : null) : null) || "{}");
                        if (!user.name) return null;
                        return (
                            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                {!collapsed && (
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="truncate text-sm font-bold text-slate-900">{user.name}</span>
                                        <span className="truncate text-xs font-medium text-slate-500">{user.email}</span>
                                    </div>
                                )}
                            </div>
                        );
                    } catch (e) {
                        return null;
                    }
                })()}
            </div>
        </aside>
    );
});

AdminSidebar.displayName = "AdminSidebar";







