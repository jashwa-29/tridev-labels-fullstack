import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/routes/layout";
import DashboardPage from "./routes/Pages/DashboardPage";
import GalleryPage from "./routes/Pages/GalleryPage";
import SpecialsPromotionPage from "./routes/Pages/SpecialsPromotionPage";
import LoginPage from "./routes/Pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import BlogPage from "./routes/Pages/BlogPage";
import BlogDetails from './routes/Pages/BlogDetails';
import ServicesPage from "./routes/Pages/ServicesPage";
import ContactPage from "./routes/Pages/ContactPage";
import QuotesPage from "./routes/Pages/QuotesPage";
import TestimonialsPage from "./routes/Pages/TestimonialsPage";
import ForgotPasswordPage from "./routes/Pages/ForgotPasswordPage";
import ResetPasswordPage from "./routes/Pages/ResetPasswordPage";
import SettingsPage from "./routes/Pages/SettingsPage";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <LoginPage />, // default root is login
        },
     
        {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
        },
        {
            path: "/reset-password",
            element: <ResetPasswordPage />,
        },
      {
  element: <ProtectedRoute />,
  children: [
    {
      path: "/dashboard",
      element: <Layout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "gallery", element: <GalleryPage /> },
        { path: "specials-promotion", element: <SpecialsPromotionPage /> },
        { path: "blogs", element: <BlogPage /> },
        { path: "blogs/:slug", element: <BlogDetails /> },
        { path: "services", element: <ServicesPage /> },
        { path: "contact", element: <ContactPage /> },
        { path: "quotes", element: <QuotesPage /> },
        { path: "testimonials", element: <TestimonialsPage /> },
        { path: "settings", element: <SettingsPage /> },
      ],
    },
  ],
}

    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
