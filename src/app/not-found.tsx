'use client';

import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent mb-4"
        >
          {t('notFound.title')}
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('notFound.heading')}</h1>
        <p className="text-gray-500 mb-8">{t('notFound.message')}</p>
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="btn btn-ghost gap-2"
          >
            <ArrowLeft size={18} /> {t('notFound.goBack')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="btn bg-gradient-to-r from-blue-500 to-sky-400 text-white border-none gap-2 rounded-xl px-6 shadow-lg"
          >
            <Home size={18} /> {t('notFound.dashboard')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
