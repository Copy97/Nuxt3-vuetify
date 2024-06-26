// import createVuetify from "vuetify"
import { createVuetify } from "vuetify";

// import custom icons from helpers
import { aliases, custom } from "@/helpers/customIcons";

// import theme from "@/helpers/themes"
import {
  LIGHT_THEME,
  lightTheme,
  DARK_THEME,
  darkTheme,
} from "@/helpers/themes";

// import defaults from "@/helpers/defaults"
import { defaults } from "@/helpers/defaults";

import { mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  // Create a new Vuetify instance
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    theme: {
      defaultTheme: LIGHT_THEME,
      themes: {
        lightTheme,
        darkTheme,
      },
      // add color variations
      variations: {
        colors: ["primary", "secondary"],
        lighten: 3,
        darken: 3,
      },
    },
    // Add the custom iconset
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        custom,
        mdi,
      },
    },
  });

  // Inject it to nuxtApp
  nuxtApp.vueApp.use(vuetify);
});
