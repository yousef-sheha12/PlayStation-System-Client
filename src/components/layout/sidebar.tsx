"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Gamepad2,
  Package,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/hooks/use-translation";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { dir } = useLanguageStore();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = dir === "rtl";
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    ...(isAdmin
      ? [
          {
            href: "/dashboard",
            label: t("sidebar.dashboard"),
            icon: LayoutDashboard,
          },
        ]
      : []),
    { href: "/devices", label: t("sidebar.devices"), icon: Gamepad2 },
    ...(isAdmin
      ? [
          { href: "/products", label: t("sidebar.products"), icon: Package },
          { href: "/invoices", label: t("sidebar.invoices"), icon: FileText },
          { href: "/settings", label: t("sidebar.settings"), icon: Settings },
        ]
      : []),
  ];

  const SidebarContent = ({ collapsed }: { collapsed: boolean }) => (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center ${collapsed ? "justify-center px-2" : isRtl ? "pr-6 pl-4" : "pl-6 pr-4"} py-5 border-b border-white/10`}
      >
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center shadow-lg">
              <Gamepad2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                PlayStation
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">
                {t("sidebar.managementSystem")}
              </p>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center shadow-lg">
            <Gamepad2 size={22} className="text-white" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: isRtl ? -4 : 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className={isActive ? "text-white" : ""} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className={`px-3 py-4 border-t border-gray-100`}>
        {!collapsed && user && (
          <div className={`px-3 py-2 mb-2 ${isRtl ? "text-right" : ""}`}>
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}
        <motion.button
          whileHover={{ x: isRtl ? -4 : 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {!collapsed && (
            <span className="text-sm font-medium">{t("nav.logout")}</span>
          )}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-circle bg-white shadow-lg border border-gray-100"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: isRtl ? 280 : -280 }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? 280 : -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`lg:hidden fixed top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl z-50 shadow-2xl ${isRtl ? "right-0 border-l" : "left-0 border-r"} border-gray-100`}
          >
            <SidebarContent collapsed={false} />
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 bg-white/95 backdrop-blur-xl z-30 shadow-xl ${isRtl ? "right-0 border-l" : "left-0 border-r"} border-gray-100`}
      >
        <SidebarContent collapsed={!sidebarOpen} />
        <button
          onClick={toggleSidebar}
          className={`absolute top-20 w-6 h-6 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition-colors ${isRtl ? "-left-3" : "-right-3"}`}
        >
          <motion.div
            animate={{
              rotate: sidebarOpen ? (isRtl ? -180 : 0) : isRtl ? 0 : 180,
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={14} className="text-gray-500" />
          </motion.div>
        </button>
      </motion.aside>
    </>
  );
}
