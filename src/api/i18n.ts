import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locale/en.locale.json';
import ruTranslation from '../locale/ru.locale.json';
import Cookies from 'universal-cookie';
import {COOKIES_NAMES_ENUM} from '../types/consts/cookies.consts';

const resources = {
  en: {
    translation: enTranslation
  },
  ru: {
    translation: ruTranslation
  }
};

const browserLanguage = navigator.language;
const cookies = new Cookies();
const defaultLanguage = browserLanguage.match(/ru/gmi) ? 'ru' : 'en';
const cachedLanguage = cookies.get(COOKIES_NAMES_ENUM.LANGUAGE);
const appLanguage = cachedLanguage || defaultLanguage;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: appLanguage,

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
