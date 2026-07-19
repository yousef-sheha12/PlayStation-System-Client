import { create } from 'zustand';

export type Locale = 'en' | 'ar';

interface LanguageState {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  initialize: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  locale: 'en',
  dir: 'ltr',

  setLocale: (locale) => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('ps_locale', locale);
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    set({ locale, dir });
  },

  toggleLocale: () => {
    const newLocale = get().locale === 'en' ? 'ar' : 'en';
    get().setLocale(newLocale);
  },

  initialize: () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('ps_locale') as Locale | null;
    const locale = saved || 'en';
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    set({ locale, dir });
  },
}));
