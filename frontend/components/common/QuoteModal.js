"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Send, Store, User, Mail, Phone, FileText } from 'lucide-react';
import { quoteService } from '@/services/quote.service';

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateIndianPhone = (phone) => {
  const digitsOnly = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(digitsOnly);
};

const formatIndianPhone = (value) => {
  const digitsOnly = value.replace(/\D/g, '');
  const limitedDigits = digitsOnly.slice(0, 10);
  if (limitedDigits.length === 0) return '';
  if (limitedDigits.length <= 5) return limitedDigits;
  return `${limitedDigits.slice(0, 5)} ${limitedDigits.slice(5)}`;
};

export default function QuoteModal({ isOpen, onClose, serviceTitle }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const detailsInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    details: `I'm interested in a quote for ${serviceTitle || 'your services'}.`
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Reset details when serviceTitle changes
  useEffect(() => {
    if (serviceTitle) {
       setFormData(prev => ({...prev, details: `I'm interested in a quote for ${serviceTitle}.`}));
    }
  }, [serviceTitle]);

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
      newErrors.email = 'Invalid email format';
      triggerVibrateAnimation(emailInputRef);
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      triggerVibrateAnimation(phoneInputRef);
    } else if (!validateIndianPhone(formData.phone)) {
      newErrors.phone = 'Invalid 10-digit phone number';
      triggerVibrateAnimation(phoneInputRef);
    }

    if (!formData.details.trim()) {
      newErrors.details = 'Project details are required';
      triggerVibrateAnimation(detailsInputRef);
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
        service: serviceTitle,
        source: 'service'
      });
      setSubmitStatus('success');
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        details: `I'm interested in a quote for ${serviceTitle || 'your services'}.`
      });
      setErrors({});
      // Optionally close modal after slight delay
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2500);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Entrance Animation
      document.body.style.overflow = 'hidden'; // Lock scroll
      
      const ctx = gsap.context(() => {
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });
        
        gsap.fromTo(contentRef.current,
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)", delay: 0.1 }
        );

        gsap.from(".form-item", {
           y: 20,
           opacity: 0,
           duration: 0.4,
           stagger: 0.1,
           delay: 0.3,
           ease: "power2.out"
        });

      }, modalRef);
      return () => ctx.revert();
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-9999 flex items-center justify-center px-4 sm:px-6">
      
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md opacity-0 cursor-pointer"
      ></div>

      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] transition-all duration-300"
      >
         {/* Decorative Top Bar */}
         <div className="h-2 w-full bg-[#E32219]"></div>
         
         <button 
           onClick={onClose}
           className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
         >
           <X className="w-5 h-5 text-gray-400 hover:text-gray-900" />
         </button>

         <div className="p-8 md:p-10">
            <div className="mb-8 text-center">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E32219] mb-3 block">Start Your Project</span>
               <h3 className="text-2xl md:text-3xl font-light text-gray-900">Request a Quote</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="relative group">
                        <User className={`absolute left-3 top-3.5 w-4 h-4 transition-colors ${errors.name ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#E32219]'}`} />
                        <input 
                           ref={nameInputRef}
                           type="text" 
                           placeholder="Name" 
                           required
                           className={`w-full bg-gray-50 border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:bg-white transition-all text-gray-900 ${
                             errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-[#E32219]'
                           }`}
                           value={formData.name}
                           onChange={e => {
                             setFormData({...formData, name: e.target.value});
                             if (errors.name) setErrors({...errors, name: ''});
                           }}
                        />
                        {errors.name && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.name}</p>}
                     </div>
                     <div className="relative group">
                        <Store className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#E32219] transition-colors" />
                        <input 
                           type="text" 
                           placeholder="Company" 
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#E32219] focus:bg-white transition-all"
                           value={formData.company}
                           onChange={e => setFormData({...formData, company: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="relative group">
                     <Mail className={`absolute left-3 top-3.5 w-4 h-4 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#E32219]'}`} />
                     <input 
                        ref={emailInputRef}
                        type="email" 
                        placeholder="Work Email" 
                        required
                        className={`w-full bg-gray-50 border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:bg-white transition-all text-gray-900 ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-[#E32219]'
                        }`}
                        value={formData.email}
                        onChange={e => {
                          setFormData({...formData, email: e.target.value});
                          if (errors.email) setErrors({...errors, email: ''});
                        }}
                     />
                     {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.email}</p>}
                  </div>

                  <div className="relative group">
                     <Phone className={`absolute left-3 top-3.5 w-4 h-4 transition-colors ${errors.phone ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#E32219]'}`} />
                     <input 
                        ref={phoneInputRef}
                        type="tel" 
                        placeholder="Phone Number (10 digits)" 
                        required
                        className={`w-full bg-gray-50 border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:bg-white transition-all text-gray-900 ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-[#E32219]'
                        }`}
                        value={formData.phone}
                        onChange={e => {
                          const formatted = formatIndianPhone(e.target.value);
                          setFormData({...formData, phone: formatted});
                          if (errors.phone) setErrors({...errors, phone: ''});
                        }}
                     />
                     {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.phone}</p>}
                  </div>
                  
                  <div className="relative group">
                     <FileText className={`absolute left-3 top-3.5 w-4 h-4 transition-colors ${errors.details ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#E32219]'}`} />
                     <textarea 
                        ref={detailsInputRef}
                        rows="3"
                        placeholder="Project Details..." 
                        required
                        className={`w-full bg-gray-50 border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:bg-white transition-all resize-none text-gray-900 ${
                          errors.details ? 'border-red-500 focus:border-red-500' : 'border-gray-100 focus:border-[#E32219]'
                        }`}
                        value={formData.details}
                        onChange={e => {
                          setFormData({...formData, details: e.target.value});
                          if (errors.details) setErrors({...errors, details: ''});
                        }}
                     ></textarea>
                     {errors.details && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.details}</p>}
                  </div>
               </div>

               <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 group relative overflow-hidden shadow-xl
                  ${submitStatus === 'success' ? 'bg-green-600' : 
                    submitStatus === 'error' ? 'bg-red-700' : 
                    'bg-[#E32219] hover:bg-black'} text-white`}
               >
                  <span className="relative z-10 flex items-center gap-3">
                    {isSubmitting ? 'Sending Request...' : 
                     submitStatus === 'success' ? 'Request Sent!' : 
                     submitStatus === 'error' ? 'Failed to Send' : 
                     'Submit Request'}
                    <Send className={`w-4 h-4 transition-transform ${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                  </span>
                  <div className="absolute inset-0 bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
               </button>
            </form>
            
            <p className="mt-6 text-center text-[10px] text-gray-400">
               {submitStatus === 'success' ? 'Thank you! We will contact you shortly.' : 
                submitStatus === 'error' ? 'Something went wrong. Please try again later.' : 
                'Protected by secure encryption and our Privacy Policy.'}
            </p>
         </div>
      </div>
    </div>
  );
}
