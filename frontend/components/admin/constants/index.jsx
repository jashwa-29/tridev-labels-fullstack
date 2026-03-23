import { Image, Zap, BookOpen, Layers, Mail, FileText, MessageSquare, Settings, History } from "lucide-react";

export const navbarLinks = [
  {
    title: "Portfolio",
    links: [
      { label: "Dashboard", icon: Layers, path: "/admin/dashboard" },
      { label: "Gallery", icon: Image, path: "/admin/dashboard/gallery" },
      { label: "Services", icon: Layers, path: "/admin/dashboard/services" },
    ],
  },
  {
    title: "Inquiries",
    links: [
      { label: "Contact", icon: Mail, path: "/admin/dashboard/contact" },
      { label: "Live Chat", icon: MessageSquare, path: "/admin/dashboard/chat" },
      { label: "Chat History", icon: History, path: "/admin/dashboard/chat/history" },
      { label: "Chat Settings", icon: Settings, path: "/admin/dashboard/chat/settings" },
      { label: "Quotes", icon: FileText, path: "/admin/dashboard/quotes" },
    ],
  },
  {
    title: "Marketing",
    links: [
      { label: "Blog Posts", icon: BookOpen, path: "/admin/dashboard/blogs" },
      { label: "Testimonials", icon: MessageSquare, path: "/admin/dashboard/testimonials" },
    ],
  },
  {
    title: "System",
    links: [
      { label: "Audit Logs", icon: History, path: "/admin/dashboard/history" },
      { label: "Settings", icon: Settings, path: "/admin/dashboard/settings" },
    ],
  },
];







