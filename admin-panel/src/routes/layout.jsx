import { Outlet } from "react-router-dom";

import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";

import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);

    const sidebarRef = useRef(null);

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-600">
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black/40 opacity-0 transition-opacity duration-300",
                    !collapsed && "max-md:pointer-events-auto max-md:z-[90] max-md:opacity-100",
                )}
            />
            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
            />
            <div className={cn("transition-all duration-500 ease-in-out", collapsed ? "md:ml-[80px]" : "md:ml-[280px]")}>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <main className="min-h-[calc(100vh-70px)] bg-slate-50/40 p-6 md:p-10 lg:p-12">
                    <div className="mx-auto max-w-(--breakpoint-2xl)">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};



export default Layout;
