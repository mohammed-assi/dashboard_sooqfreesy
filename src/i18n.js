// // // src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome",
      },
    },
    ar: {
      translation: {
        welcome: "مرحبا",
      },
    },
  },
  lng: localStorage.getItem("lang") || "en", // load saved or default
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// 🔹 update direction when language changes
i18n.on("languageChanged", (lng) => {
  if (lng === "ar") {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }
});

export default i18n;
