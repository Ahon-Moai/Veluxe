import { motion } from 'motion/react';

export function LoadingText() {
  return (
    <div className="w-full py-32 flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 left-0 h-[1px] bg-luxury-gold"
        />
        <motion.h2 
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="text-4xl md:text-6xl font-serif italic tracking-wider text-luxury-black"
        >
          Loading all Products
        </motion.h2>
      </div>
      <div className="flex items-center space-x-4">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          className="w-1.5 h-1.5 bg-luxury-gold rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          className="w-1.5 h-1.5 bg-luxury-gold rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          className="w-1.5 h-1.5 bg-luxury-gold rounded-full"
        />
      </div>
      <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-medium">
        Curating Excellence
      </p>
    </div>
  );
}
