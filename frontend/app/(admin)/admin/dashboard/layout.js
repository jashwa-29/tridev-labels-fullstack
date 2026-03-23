"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useClickOutside } from '@/components/admin/hooks/use-click-outside';
import { AdminSidebar } from '@/components/admin/layouts/Sidebar';
import { AdminHeader } from '@/components/admin/layouts/Header';
import { cn } from '@/components/admin/utils/cn';

function useMediaQuerySafe(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isDesktopDevice = useMediaQuerySafe("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/admin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed) {
        setCollapsed(true);
    }
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-600">
        <div
            className={cn(
                "pointer-events-none fixed inset-0 -z-10 bg-black/40 opacity-0 transition-opacity duration-300",
                !collapsed && "max-md:pointer-events-auto max-md:z-[90] max-md:opacity-100",
            )}
        />
        <AdminSidebar
            ref={sidebarRef}
            collapsed={collapsed}
        />
        <div className={cn("transition-all duration-500 ease-in-out", collapsed ? "md:ml-[80px]" : "md:ml-[280px]")}>
            <AdminHeader
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <main className="min-h-[calc(100vh-70px)] bg-slate-50/40 p-6 md:p-10 lg:p-12">
                <div className="mx-auto max-w-(--breakpoint-2xl)">
                    {children}
                </div>
            </main>
        </div>
    </div>
  );
}