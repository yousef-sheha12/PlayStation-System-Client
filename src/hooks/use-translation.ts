import { useLanguageStore, type Locale } from '@/store/language-store';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

type NestedMessages = { [key: string]: string | NestedMessages };
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;
type DotNestedKeys<T> = (T extends object
  ? { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : '') extends infer D
  ? Extract<D, string>
  : never;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return path;
  }, obj) as string;
}

export type TranslationKey = DotNestedKeys<typeof en>;

export function useTranslation() {
  const { locale, dir, toggleLocale, setLocale } = useLanguageStore();
  const messages = locale === 'ar' ? ar : en;

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let value = getNestedValue(messages as Record<string, unknown>, key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }
    return value;
  };

  return { t, locale, dir, toggleLocale, setLocale };
}
