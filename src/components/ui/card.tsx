'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export default function Card({ children, className = '', hover = true, padding = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)' } : {}}
      className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
