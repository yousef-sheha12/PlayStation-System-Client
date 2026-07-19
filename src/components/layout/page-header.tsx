'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/language-store';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { dir } = useLanguageStore();
  const isRtl = dir === 'rtl';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ${isRtl ? 'text-right' : ''}`}
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      {actions && <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>{actions}</div>}
    </motion.div>
  );
}
