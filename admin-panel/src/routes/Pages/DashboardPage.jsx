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
  Loader2
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
  const [recentLeads, setRecentLeads] = useState([]);
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
          blogService.getAll({ admin: true, limit: 1 }),
          quoteService.getAll(1, 10, 'service'), 
          quoteService.getAll(1, 10, 'contact'), 
          galleryService.getAll(true),
          testimonialService.getAll(true),
          specialService.getAll(true)
        ]);

        // Process Services
        const services = servicesRes.status === 'fulfilled' ? (servicesRes.value.data || []) : [];
        
        // Process Blogs
        const blogsResData = blogsRes.status === 'fulfilled' ? blogsRes.value : {};
        const totalBlogsCount = blogsResData.count || (blogsResData.data ? blogsResData.data.length : 0);

        // Process Quotes & Contacts for Leads Table
        const sQuotes = quotesRes.status === 'fulfilled' ? (quotesRes.value.data || []) : [];
        const cMessages = contactsRes.status === 'fulfilled' ? (contactsRes.value.data || []) : [];
        
        const combinedLeads = [...sQuotes, ...cMessages]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        setRecentLeads(combinedLeads);

        // Process Stats
        const recentQuotesCount = (quotesRes.status === 'fulfilled' ? (quotesRes.value.pagination?.total || quotesRes.value.total || quotesRes.value.data?.length) : 0) || 0;
        const contactsCount = (contactsRes.status === 'fulfilled' ? (contactsRes.value.pagination?.total || contactsRes.value.total || contactsRes.value.data?.length) : 0) || 0;

        const galleryItems = galleryRes.status === 'fulfilled' ? (galleryRes.value.data || []) : [];
        const testimonials = testimonialRes.status === 'fulfilled' ? (testimonialRes.value.data || []) : [];
        const specials = specialRes.status === 'fulfilled' ? (specialRes.value.data && specialRes.value.data.data ? specialRes.value.data.data : (Array.isArray(specialRes.value.data) ? specialRes.value.data : [])) : [];

        setStats({
          totalServices: services.length,
          contacts: contactsCount,
          totalBlogs: totalBlogsCount,
          recentInquiries: recentQuotesCount,
          totalGallery: galleryItems.length,
          totalTestimonials: testimonials.length,
          activeSpecials: specials.length
        });

        // Activity Feed logic preserved for potential future use or debugging
        // Removed setRecentActivities as it was causing ReferenceError
        
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Could not load dashboard data. Please try refreshing.");
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
          <h1 className="text-3xl font-black text-slate-900 font-title">Management Protocol</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Strategic overview of your label manufacturing ecosystem.</p>
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
          title="Blog Engagement" 
          value={stats.totalBlogs} 
          icon={FileText} 
          color="bg-blue-50" 
          link="/dashboard/blogs"
        />
        <StatCard 
          title="Recent Leads" 
          value={stats.recentInquiries} 
          icon={Mail} 
          color="bg-orange-50" 
          link="/dashboard/quotes"
        />
        <StatCard 
          title="Direct Contacts" 
          value={stats.contacts} 
          icon={Users} 
          color="bg-emerald-50" 
          link="/dashboard/contact"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Business Leads Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Business Intelligence: Recent Leads</h2>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Live synchronisation with web forms</p>
              </div>
              <Link to="/dashboard/quotes" className="text-xs font-bold uppercase tracking-widest text-[#E32219] hover:underline">Lead Center</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-4 pb-2">Client Identity</th>
                    <th className="px-4 pb-2">Interest Point</th>
                    <th className="px-4 pb-2 text-right">Acquisition Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-20 text-center">
                        <div className="flex flex-col items-center opacity-30">
                          <Activity size={40} className="mb-4" />
                          <p className="text-sm font-bold uppercase tracking-widest">Awaiting New Market Entries</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentLeads.map((lead) => (
                      <tr key={lead._id} className="group transition-all">
                        <td className="px-4 py-4 bg-slate-50/50 rounded-l-2xl border-y border-l border-slate-100">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-none">{lead.name || "Anonymous Visitor"}</span>
                            <span className="text-[10px] text-slate-400 mt-1.5 font-medium">{lead.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 bg-slate-50/50 border-y border-slate-100">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${lead.serviceTitle ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                            {lead.serviceTitle || "Direct Message"}
                          </span>
                        </td>
                        <td className="px-4 py-4 bg-slate-50/50 rounded-r-2xl border-y border-r border-slate-100 text-right">
                          <span className="text-xs font-bold text-slate-900">{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Health Metrics */}
          <div className="grid gap-6 sm:grid-cols-2">
             <div className="group rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
               <div className="mb-6 flex items-center justify-between">
                 <div className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                   <Package size={20} className="text-white" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Operational</span>
               </div>
               <h3 className="text-2xl font-black">Content Portfolio</h3>
               <p className="mt-2 text-xs font-medium text-slate-400 leading-relaxed">
                 You have <span className="text-white">{stats.totalServices}</span> live service protocols and <span className="text-white">{stats.totalGallery}</span> visual portfolio assets active.
               </p>
               <div className="mt-8 flex gap-3">
                  <Link to="/dashboard/services" className="h-10 px-4 flex items-center justify-center rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Manage Services</Link>
                  <Link to="/dashboard/gallery" className="h-10 px-4 flex items-center justify-center rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors">Portfolio Hub</Link>
               </div>
             </div>
             
             <div className="group rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-100">
               <div className="mb-6 flex items-center justify-between">
                 <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                   <TrendingUp size={20} />
                 </div>
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
               </div>
               <h3 className="text-2xl font-black text-slate-900">Social Trust</h3>
               <p className="mt-2 text-xs font-medium text-slate-500 leading-relaxed">
                 Client feedback system is healthy with <span className="text-slate-900 font-bold">{stats.totalTestimonials}</span> verified reviews circulating.
               </p>
               <div className="mt-8">
                  <Link to="/dashboard/testimonials" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E32219] group-hover:gap-4 transition-all">
                    Verification Center <ArrowRight size={14} />
                  </Link>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column - Status Overview */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 h-full">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Asset Velocity</h2>
              <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Activity size={18} />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Gallery Utilization</span>
                  <span>{Math.min(100, (stats.totalGallery / 20) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (stats.totalGallery / 20) * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Market Buzz (Blogs)</span>
                  <span>{Math.min(100, (stats.totalBlogs / 10) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (stats.totalBlogs / 10) * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Inquiry Velocity</span>
                  <span>{Math.min(100, (stats.recentInquiries / 15) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (stats.recentInquiries / 15) * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="mt-12 rounded-3xl bg-slate-50 p-6 border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100">
                    <Activity size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">Security Status</h4>
                    <p className="mt-2 text-[10px] font-medium text-slate-500 leading-relaxed">
                      All systems operational. End-to-end encryption active on management protocols.
                    </p>
                  </div>
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
