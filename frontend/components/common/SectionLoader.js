"use client";

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function SectionLoader({ 
  message = "Loading technical details...", 
  className = "min-h-[400px]",
  light = false 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 transition-all ${className} ${light ? 'bg-white' : 'bg-transparent'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          {/* Animated Glow Effect */}
          <div className="absolute inset-0 bg-[#E32219]/20 blur-xl rounded-full animate-pulse" />
          
          <Loader2 
            className="w-10 h-10 text-[#E32219] animate-spin stroke-[1.5px] relative z-10" 
          />
        </div>
        
        <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                Synchronizing
            </p>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">
                {message}
            </p>
        </div>

        {/* Technical Progress Line */}
        <div className="w-24 h-[1px] bg-gray-100 mt-4 relative overflow-hidden">
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[#E32219]"
            />
        </div>
      </motion.div>
    </div>
  );
}
