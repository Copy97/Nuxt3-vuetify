// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from "vite-plugin-vuetify";
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  routeRules: {
    "/backend/**": { ssr: false },
  },
  css: ["@/assets/scss/style.scss", "@/assets/backend/style.scss"],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    define: {
      "process.env.DEBUG": false,
    },
  },
  modules: [
    "nuxt-icon",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    [
      "@nuxtjs/robots",
      {
        UserAgent: "*",
        Disallow: "",
      },
    ],

    // this adds the vuetify vite plugin
    // also produces type errors in the current beta release
    async (options, nuxt) => {
      // @ts-ignore
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        config.plugins.push(vuetify())
      );
    },
  ],
  i18n: {
    vueI18n: './i18n.config.ts' // if you are using custom path, default
  },
  // i18n: {
  //   locales: [
  //     {
  //       code: "en",
  //       file: "./locales/en.json",
  //     },
  //     {
  //       code: "la",
  //       file: "./locales/la.json",
  //     },
  //   ],
  //   defaultLocate: "en",
  //   vueI18n: {
  //     fallbackLocate: "en",
  //   },
  //   detectBrowserLanguage: {
  //     useCookie: true,
  //   },
  // },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      bodyAttrs: {
        class: "demo",
      },
      charset: "utf-8",
      titleTemplate: "%s - Nuxt 3 Vuetify",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@200;300;400;500;600;700&family=Inter:wght@200;300;400;500;600;700;800;900&display=swap",
        },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=5",
        },
        {
          name: "author",
          content: "IT Genius Engineering Ltd., Thailand",
        },
      ],
    },
  },
  // runtime config
  runtimeConfig: {
    public: {
      strapi: {
        url: process.env.STRAPI_URL || "http://localhost:1337/api",
      },
      urlroot: {
        url: process.env.STRAPI_URL_ROOT || "http://localhost:1337",
      },
    },
  },
});