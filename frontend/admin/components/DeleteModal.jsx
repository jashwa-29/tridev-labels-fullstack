import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Reusable Delete Confirmation Modal Component
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Close modal handler
 * @param {function} onConfirm - Confirm delete handler
 * @param {string} title - Modal title (default: "Delete Item?")
 * @param {string} message - Confirmation message
 * @param {string} itemName - Optional name of item being deleted
 * @param {boolean} isDeleting - Loading state during deletion
 */
export const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item?",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
        <div className="p-8 text-center">
          <div className="mx-auto size-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6">
            <Trash2 size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
          {itemName && (
            <p className="text-lg font-semibold text-slate-700 mb-2">"{itemName}"</p>
          )}
          <p className="text-slate-500 mb-8 leading-relaxed">
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 btn-secondary py-3 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all py-3 shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  <span>Deleting...</span>
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
