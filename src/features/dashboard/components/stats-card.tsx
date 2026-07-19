'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  gradient: string;
  index?: number;
}

export default function StatsCard({ title, value, icon: Icon, gradient, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.12)' }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon size={24} className="text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}
