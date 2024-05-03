import en from "@/locales/en.json";
import la from "@/locales/la.json";

// You can use defineI18nConfig to get type inferences for options to pass to vue-i18n.
export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: "en",
    messages: {
      en,
      la,
    },
    vueI18n: {
      fallBackLocale: "en",
    },
    detectBrowserLanguage: {
      useCokie: true,
    },
  };
});