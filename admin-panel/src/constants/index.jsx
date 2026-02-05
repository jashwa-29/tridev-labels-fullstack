import { Image, Zap, BookOpen, Layers, Mail, FileText, MessageSquare, Settings } from "lucide-react";

export const navbarLinks = [
  {
    title: "Portfolio",
    links: [
      {
        label: "Dashboard",
        icon: Layers,
        path: "/dashboard",
      },
      {
        label: "Gallery",
        icon: Image,
        path: "/dashboard/gallery",
      },
      {
        label: "Services",
        icon: Layers,
        path: "/dashboard/services",
      },
    ],
  },
  {
    title: "Inquiries",
    links: [
      {
        label: "Contact",
        icon: Mail,
        path: "/dashboard/contact",
      },
      {
        label: "Quotes",
        icon: FileText,
        path: "/dashboard/quotes",
      },
    ],
  },
  {
    title: "Marketing",
    links: [
      {
        label: "Blog Posts",
        icon: BookOpen,
        path: "/dashboard/blogs",
      },
      {
        label: "Testimonials",
        icon: MessageSquare,
        path: "/dashboard/testimonials",
      },
    ],
  },
  {
    title: "System",
    links: [
      {
        label: "Settings",
        icon: Settings,
        path: "/dashboard/settings",
      },
    ],
  },
];

