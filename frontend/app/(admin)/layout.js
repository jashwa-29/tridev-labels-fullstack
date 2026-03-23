"use client";

import { ThemeProvider } from "@/components/admin/contexts/ThemeContext";
import "@/components/admin/admin.css";

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider storageKey="admin-theme">
      {children}
    </ThemeProvider>
  );
}
