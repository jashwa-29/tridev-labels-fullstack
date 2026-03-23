import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Toast Notification Component
 * @param {string} type - 'success' or 'error'
 * @param {string} message - Message to display
 * @param {function} onClose - Optional close handler
 */
export const Toast = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  
  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 rounded-2xl px-6 py-4 text-white shadow-2xl animate-in fade-in slide-in-from-right-8 duration-300 ${
      isSuccess ? 'bg-black' : 'bg-red-600'
    }`}>
      {isSuccess ? (
        <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <X size={18} />
      )}
      <span className="text-sm font-bold tracking-tight">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Toast;
