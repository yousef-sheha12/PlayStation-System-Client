'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { useLanguageStore } from '@/store/language-store';
import { ROLES } from '@/constants';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, initialize } = useAuthStore();
  const { sidebarOpen } = useThemeStore();
  const { initialize: initLang, dir } = useLanguageStore();
  const router = useRouter();
  const isRtl = dir === 'rtl';

  useEffect(() => {
    initialize();
    initLang();
  }, [initialize, initLang]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role === ROLES.WORKER && window.location.pathname === '/dashboard') {
      router.push('/devices');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-sky-50/20 ${isRtl ? 'font-[\"Noto_Kufi_Arabic\",_\"Noto_Sans_Arabic\",_Tahoma,_Arial]':''}`}>
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? (isRtl ? 'lg:mr-[260px]' : 'lg:ml-[260px]') : (isRtl ? 'lg:mr-[80px]' : 'lg:ml-[80px]')}`}>
        <div className="sticky top-0 z-20">
          <Navbar />
        </div>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
