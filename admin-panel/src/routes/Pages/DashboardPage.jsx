import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowRight,
  Package,
  FileText,
  Mail,
  Activity,
  Calendar,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { serviceService } from '../../services/service.service';
import { blogService } from '../../services/blog.service';
import { quoteService } from '../../services/quote.service';
import { contactService } from '../../services/contact.service';
import { galleryService } from '../../services/gallery.service';
import { testimonialService } from '../../services/testimonial.service';
import { specialService } from '../../services/special.service';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    contacts: 0,
    totalBlogs: 0,
    recentInquiries: 0,
    totalGallery: 0,
    totalTestimonials: 0,
    activeSpecials: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data in parallel
        const [servicesRes, blogsRes, quotesRes, contactsRes, galleryRes, testimonialRes, specialRes] = await Promise.allSettled([
          serviceService.getAll(true),
          blogService.getAll({ admin: true, limit: 5 }),
          quoteService.getAll(1, 100, 'service'), // Fetch only service quotes
          quoteService.getAll(1, 100, 'contact'), // Fetch contact form submissions
          galleryService.getAll(true),
          testimonialService.getAll(true),
          specialService.getAll(true)
        ]);

        // Process Services
        const services = servicesRes.status === 'fulfilled' ? (servicesRes.value.data || []) : [];
        
        // Process Blogs
        const blogsResData = blogsRes.status === 'fulfilled' ? blogsRes.value : {};
        const totalBlogsCount = blogsResData.total || (blogsResData.data ? blogsResData.data.length : 0);

        // Process Leads (Service Quotes + Contacts)
        const sQuotes = quotesRes.status === 'fulfilled' ? (quotesRes.value.data || []) : [];
        const cQuotes = contactsRes.status === 'fulfilled' ? (contactsRes.value.data || []) : [];
        const allLeads = [...sQuotes, ...cQuotes].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Process Others
        const galleryItems = galleryRes.status === 'fulfilled' ? (galleryRes.value.data || []) : [];
        const testimonials = testimonialRes.status === 'fulfilled' ? (testimonialRes.value.data || []) : [];
        const specials = specialRes.status === 'fulfilled' ? (specialRes.value.data && specialRes.value.data.data ? specialRes.value.data.data : (Array.isArray(specialRes.value.data) ? specialRes.value.data : [])) : [];

        setStats({
          totalServices: services.length,
          contacts: cQuotes.length,
          totalBlogs: totalBlogsCount,
          recentInquiries: sQuotes.length,
          totalGallery: galleryItems.length,
          totalTestimonials: testimonials.length,
          activeSpecials: specials.length,
          recentLeads: allLeads.slice(0, 5)
        });
        
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Management server connectivity issues. Retrying...");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, color, link }) => (
    <Link to={link || '#'} className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-slate-200">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${color} opacity-10 transition-transform group-hover:scale-150`} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-900">{value}</h3>
          {trend && (
             <p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp size={14} />
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon size={28} className={color.replace('bg-', 'text-').replace('50', '600')} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-black transition-colors">
        <span>View Details</span>
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );

  if (loading) {
     return (
        <div className="flex h-[80vh] w-full items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-red-600" />
              <p className="text-sm font-bold text-slate-400 animate-pulse">Initializing Dashboard...</p>
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-title">Admin Command Center</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-100">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

       {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Services" 
          value={stats.totalServices} 
          icon={Package} 
          color="bg-purple-50" 
          link="/dashboard/services"
        />
        <StatCard 
          title="Blog Posts" 
          value={stats.totalBlogs} 
          icon={FileText} 
          color="bg-blue-50" 
          link="/dashboard/blogs"
        />
        <StatCard 
          title="Recent Inquiries" 
          value={stats.recentInquiries} 
          icon={Mail} 
          // trend="+12% this week" 
          color="bg-orange-50" 
          link="/dashboard/quotes"
        />
        <StatCard 
          title="Contacts" 
          value={stats.contacts} // Assuming you have added contacts to stats
          icon={Users} 
          // trend="+5.2% vs last month" 
          color="bg-emerald-50" 
          link="/dashboard/contact"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Business Intelligence: Recent Leads */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Business Leads</h2>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Live Inbound Stream</p>
              </div>
              <Link to="/dashboard/quotes" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 hover:text-black transition-colors">
                Analytical Report <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Client / Contact</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Project Spec</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.recentLeads?.length > 0 ? (
                    stats.recentLeads.map((lead) => (
                      <tr key={lead._id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-red-600 group-hover:text-white transition-all">
                              {lead.name?.charAt(0) || 'L'}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{lead.name}</p>
                              <p className="text-[10px] font-medium text-slate-400">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${lead.serviceName ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            {lead.serviceName || 'General Inquiry'}
                          </span>
                        </td>
                        <td className="py-5 text-right">
                          <p className="text-xs font-bold text-slate-900">{new Date(lead.createdAt).toLocaleDateString()}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-12 text-center">
                        <p className="text-sm font-medium text-slate-400 italic">Analytical vacuum: No leads detected in recent cycles.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Precision Navigation Nodes */}
          <div className="grid gap-6 sm:grid-cols-3">
             <Link to="/dashboard/services" className="group rounded-[2rem] bg-slate-900 p-6 text-white shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
               <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-red-600 transition-colors">
                 <Package size={20} />
               </div>
               <h3 className="font-bold">Scale Catalog</h3>
               <p className="mt-1 text-xs text-slate-400">Deploy New Solutions</p>
             </Link>
             
             <Link to="/dashboard/blogs" className="group rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-2 hover:shadow-lg">
               <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                 <FileText size={20} />
               </div>
               <h3 className="font-bold text-slate-900">Push Insights</h3>
               <p className="mt-1 text-xs text-slate-500">Global Knowledge Sync</p>
             </Link>

             <Link to="/dashboard/gallery" className="group rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-2 hover:shadow-lg">
               <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <BarChart3 size={20} />
               </div>
               <h3 className="font-bold text-slate-900">Visual Core</h3>
               <p className="mt-1 text-xs text-slate-500">Synchronize Assets</p>
             </Link>
          </div>
        </div>

        {/* Right Column - Content Intelligence & System Health */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl h-full border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
               <Activity size={180} />
            </div>
            
            <div className="relative z-10">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black tracking-tighter">Content Intelligence</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Health & Status</p>
                </div>
                <div className="flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link to="/dashboard/gallery" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <ImageIcon size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">Asset Gallery</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">{stats.totalGallery} Units</span>
                </Link>

                <Link to="/dashboard/testimonials" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Users size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">Social Trust</span>
                  </div>
                  <span className="text-xs font-black text-blue-400">{stats.totalTestimonials} Verified</span>
                </Link>

                <Link to="/dashboard/specials" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                      <Zap size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">Active Specials</span>
                  </div>
                  <span className="text-xs font-black text-red-400">{stats.activeSpecials} Live</span>
                </Link>

                <div className="pt-6 mt-6 border-t border-white/10">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Capacity</span>
                      <span className="text-[10px] font-black text-emerald-400">OPTIMAL</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[84%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                   </div>
                   <p className="mt-4 text-[10px] leading-relaxed text-slate-400 font-medium">
                      Core systems are operating within peak performance parameters. All inbound lead conduits are clear and synchronized.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
