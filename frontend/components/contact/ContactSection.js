"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { quoteService } from '@/services/quote.service';

gsap.registerPlugin(ScrollTrigger);

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateIndianPhone = (phone) => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  // Indian phone numbers should be 10 digits, starting with 6-9
  return /^[6-9]\d{9}$/.test(digitsOnly);
};

const formatIndianPhone = (value) => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  const limitedDigits = digitsOnly.slice(0, 10);
  
  // Format as: +91 XXXXX XXXXX
  if (limitedDigits.length === 0) return '';
  if (limitedDigits.length <= 5) return limitedDigits;
  return `${limitedDigits.slice(0, 5)} ${limitedDigits.slice(5)}`;
};

export default function ContactSection() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(headerRef.current.children, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 90%"
          }
        }
      );

      // Info Cards Animation
      gsap.fromTo(".contact-card", 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 90%" // Triggers sooner
          }
        }
      );

      // Form Animation
      gsap.fromTo(formRef.current, 
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%"
          }
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const triggerVibrateAnimation = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.classList.add('animate-vibrate');
      setTimeout(() => {
        inputRef.current.classList.remove('animate-vibrate');
      }, 500);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      triggerVibrateAnimation(nameInputRef);
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      triggerVibrateAnimation(emailInputRef);
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      triggerVibrateAnimation(emailInputRef);
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      triggerVibrateAnimation(phoneInputRef);
    } else if (!validateIndianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
      triggerVibrateAnimation(phoneInputRef);
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      triggerVibrateAnimation(messageInputRef);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      setSubmitStatus('validation_error');
      return;
    }

    setIsSubmitting(true);

    try {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      await quoteService.submit({
        ...formData,
        phone: digitsOnly,
        company: formData.subject,
        source: 'contact'
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      console.error('Contact submission failed:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Talk to Us",
      value: "+91 91500 01103",
      sub: "Mon-Fri, 9am - 6pm IST",
      actionLabel: "Call Now",
      href: "tel:+919150001103"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email Support",
      value: "info@trridevlabels.com",
      sub: "Average response: 24h",
      actionLabel: "Send Email",
      href: "mailto:info@trridevlabels.com"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Visit HQ",
      value: "Chennai, Tamil Nadu",
      sub: "Industrial Estate, Nehru Nagar",
      actionLabel: "Get Directions",
      href: "https://maps.google.com"
    }
  ];

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-white overflow-hidden relative">
      {/* Subtle Grid Background from Home Page */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(45deg, #000 1px, transparent 1px),
                                 linear-gradient(-45deg, #000 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} 
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header - Styled like Home Page */}
        <div ref={headerRef} className="text-center max-w-4xl mx-auto mb-20 md:mb-24">
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="h-px w-12 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="mx-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gray-400">
              Get In Touch
            </div>
            <div className="h-px w-12 bg-linear-to-l from-transparent via-gray-300 to-transparent"></div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 tracking-tight leading-[1.1] mb-6">
            Let’s start a <br/>
            <span className="font-medium text-[#E32219] relative inline-block">
              Conversation.
              <span className="absolute bottom-1 left-0 w-full h-px bg-linear-to-r from-[#E32219]/0 via-[#E32219]/40 to-[#E32219]/0"></span>
            </span>
          </h2>
          
          <p className="text-gray-500 font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you have a complex labeling project or just need technical advice, our team is ready to engineer the perfect solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Contact Info Cards */}
          <div ref={infoRef} className="lg:col-span-5 flex flex-col gap-6 h-full">
            {contactDetails.map((item, idx) => (
              <a 
                key={idx} 
                href={item.href}
                className="contact-card group relative p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#E32219]/20 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500 cursor-pointer overflow-hidden flex-1 flex flex-col justify-center"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#E32219] group-hover:border-[#E32219]/20 transition-all duration-500 shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</h4>
                      <div className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight mb-2 group-hover:text-[#E32219] transition-colors">{item.value}</div>
                      <p className="text-sm text-gray-500 font-light">{item.sub}</p>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-gray-300 group-hover:bg-[#E32219] group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-1 group-hover:translate-x-1">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Right Column: Elegant Form */}
          <div ref={formRef} className="lg:col-span-7 h-full">
            <div className="bg-white p-8 md:p-12 lg:p-14 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/40 relative h-full flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10 w-full">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group relative">
                    <input 
                      type="text" 
                      id="name"
                      ref={nameInputRef}
                      required
                      value={formData.name}
                      onChange={e => {
                        setFormData({...formData, name: e.target.value});
                        if (errors.name) setErrors({...errors, name: ''});
                      }}
                      className={`peer w-full bg-transparent border-b py-4 text-gray-900 text-lg focus:outline-none transition-colors duration-300 placeholder-transparent ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#E32219]'
                      }`}
                      placeholder="Name"
                    />
                    <label 
                      htmlFor="name"
                      className={`absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest ${
                        errors.name ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-400 peer-focus:text-[#E32219]'
                      }`}
                    >
                      {errors.name || 'Your Name'}
                    </label>
                  </div>

                  <div className="group relative">
                    <input 
                      type="email" 
                      id="email"
                      ref={emailInputRef}
                      required
                      value={formData.email}
                      onChange={e => {
                        setFormData({...formData, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: ''});
                      }}
                      className={`peer w-full bg-transparent border-b py-4 text-gray-900 text-lg focus:outline-none transition-colors duration-300 placeholder-transparent ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#E32219]'
                      }`}
                      placeholder="Email"
                    />
                    <label 
                      htmlFor="email"
                      className={`absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest ${
                        errors.email ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-400 peer-focus:text-[#E32219]'
                      }`}
                    >
                      {errors.email || 'Email Address'}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group relative">
                    <input 
                      type="tel" 
                      id="phone"
                      ref={phoneInputRef}
                      required
                      value={formData.phone}
                      onChange={e => {
                        const formatted = formatIndianPhone(e.target.value);
                        setFormData({...formData, phone: formatted});
                        if (errors.phone) setErrors({...errors, phone: ''});
                      }}
                      className={`peer w-full bg-transparent border-b py-4 text-gray-900 text-lg focus:outline-none transition-colors duration-300 placeholder-transparent ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#E32219]'
                      }`}
                      placeholder="Phone"
                    />
                    <label 
                      htmlFor="phone"
                      className={`absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest ${
                        errors.phone ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-400 peer-focus:text-[#E32219]'
                      }`}
                    >
                      {errors.phone || 'Phone Number (10 digits)'}
                    </label>
                  </div>

                  <div className="group relative">
                    <input 
                      type="text" 
                      id="subject"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="peer w-full bg-transparent border-b border-gray-200 py-4 text-gray-900 text-lg focus:border-[#E32219] focus:outline-none transition-colors duration-300 placeholder-transparent"
                      placeholder="Subject"
                    />
                    <label 
                      htmlFor="subject"
                      className="absolute left-0 -top-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#E32219] peer-focus:font-bold peer-focus:tracking-widest"
                    >
                      Subject / Company
                    </label>
                  </div>
                </div>

                <div className="group relative">
                  <textarea 
                    id="message"
                    ref={messageInputRef}
                    rows="4"
                    required
                    value={formData.message}
                    onChange={e => {
                      setFormData({...formData, message: e.target.value});
                      if (errors.message) setErrors({...errors, message: ''});
                    }}
                    className={`peer w-full bg-transparent border-b py-4 text-gray-900 text-lg focus:outline-none transition-colors duration-300 placeholder-transparent resize-none ${
                      errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#E32219]'
                    }`}
                    placeholder="Message"
                  ></textarea>
                  <label 
                    htmlFor="message"
                    className={`absolute left-0 -top-3.5 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest ${
                      errors.message ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-400 peer-focus:text-[#E32219]'
                    }`}
                  >
                    {errors.message || 'Details about your project'}
                  </label>
                </div>

                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="text-sm font-medium">
                      {submitStatus === 'success' && <span className="text-green-600 flex items-center gap-2 animate-bounce">✓ Message Sent Successfully!</span>}
                      {submitStatus === 'error' && <span className="text-red-600 flex items-center gap-2">✕ Failed to send. Please try again.</span>}
                   </div>
                   <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl transition-all duration-500 shadow-xl overflow-hidden
                      ${submitStatus === 'success' ? 'bg-green-600' : 'bg-gray-900 hover:bg-[#E32219]'}`}
                   >
                     <span className="relative z-10 text-xs font-bold uppercase text-white tracking-[0.2em]">
                       {isSubmitting ? 'Processing...' : submitStatus === 'success' ? 'Thank You!' : 'Send Message'}
                     </span>
                     <Send className={`w-4 h-4 relative z-10 transform text-white transition-transform duration-300 ${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                     <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                   </button>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
