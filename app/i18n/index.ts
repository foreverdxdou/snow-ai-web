import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh-CN.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: typeof window !== 'undefined' ? window.localStorage.getItem('language') || 'zh' : 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 