import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'de', 'pt', 'hi', 'ja'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;
