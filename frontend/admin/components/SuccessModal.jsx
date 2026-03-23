import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Reusable Success Modal Component
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Close modal handler
 * @param {string} title - Modal title
 * @param {string} message - Success message
 * @param {string} type - 'success', 'error', or 'info'
 */
export const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title = "Success!",
  message = "Operation completed successfully.",
  type = "success"
}) => {
  if (!isOpen) return null;

  const config = {
    success: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      icon: CheckCircle
    },
    error: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      icon: AlertCircle
    },
    info: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      icon: CheckCircle
    }
  };

  const { bgColor, textColor, buttonColor, icon: Icon } = config[type] || config.success;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
        <div className="p-8 text-center">
          <div className={`mx-auto size-16 rounded-2xl ${bgColor} flex items-center justify-center ${textColor} mb-6`}>
            <Icon size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {message}
          </p>
          <button
            onClick={onClose}
            className={`w-full ${buttonColor} text-white rounded-xl font-bold transition-all py-3 shadow-lg`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
