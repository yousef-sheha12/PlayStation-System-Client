"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Globe,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore, type Locale } from "@/store/language-store";
import { useTranslation } from "@/hooks/use-translation";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
  ];

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        <div className="lg:hidden w-12" />

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={t("common.search")}
              className="input input-bordered w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border-gray-200 text-sm focus:bg-white focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-ghost btn-circle relative"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </motion.button> */}

          <div ref={langRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors text-sm font-medium text-gray-600"
            >
              <Globe size={16} />
              <span>{currentLang?.flag}</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </motion.button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[160px] z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        locale === lang.code
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {locale === lang.code && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={dropdownRef} className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full flex items-center justify-center shadow-md">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-gray-500">{t("nav.admin")}</p>
              </div>
              <ChevronDown
                size={14}
                className={`hidden md:block text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </motion.div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[200px] z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {user?.email || "admin@playstation.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                      <User size={16} className="text-gray-400" />
                      <span>{t("nav.profile")}</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                      <Settings size={16} className="text-gray-400" />
                      <span>{t("nav.settings")}</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>{t("nav.logout")}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
