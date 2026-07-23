"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Gamepad2, Globe } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore, type Locale } from "@/store/language-store";
import { loginSchema, type LoginFormData } from "../types";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/use-translation";
import { ROLES } from "@/constants";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const success = await login(data.email, data.password);
    setIsLoading(false);
    if (success) {
      toast.success(t("auth.welcomeBack"));
      const user = useAuthStore.getState().user;
      if (user?.role === ROLES.WORKER) {
        router.push("/devices");
      } else {
        router.push("/dashboard");
      }
    } else {
      toast.error(t("auth.invalidCredentials"));
    }
  };

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-white px-4">
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 text-sm font-medium text-gray-600 hover:shadow-lg transition-all"
          >
            <Globe size={16} />
            <span>{locale === "ar" ? "🇸🇦 العربية" : "🇬🇧 English"}</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[140px] z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code);
                    setLangOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${locale === lang.code ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-sky-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200"
          >
            <Gamepad2 size={40} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800"
          >
            {t("auth.loginTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mt-2"
          >
            {t("auth.loginSubtitle")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  {t("auth.email")}
                </span>
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 z-50"
                />
                <input
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  className={`input input-bordered w-full pl-10 pr-4 py-3 rounded-xl bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${errors.email ? "input-error border-red-400" : ""}`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  {t("auth.password")}
                </span>
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 z-50"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.passwordPlaceholder")}
                  className={`input input-bordered w-full pl-10 pr-12 py-3 rounded-xl bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${errors.password ? "input-error border-red-400" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="btn w-full py-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white border-none rounded-xl text-base font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                t("auth.signIn")
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
