import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./messages/en.json";
import fr from "./messages/fr.json";
import ar from "./messages/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
    ar: {
      translation: ar,
    },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
