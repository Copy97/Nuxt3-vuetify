<script setup lang="ts">
import Header from "@/components/backendComponents/header/Header.vue";
import Sidebar from "@/components/backendComponents/sidebar/Sidebar.vue";
import { useDisplay, useTheme } from "vuetify";

const drawer = ref(undefined || true);
const { mdAndUp, mdAndDown } = useDisplay();

const theme: any = useTheme();
theme.global.name.value = localStorage.getItem("theme") || "lightTheme";
// Toggle Theme
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark
    ? "lightTheme"
    : "darkTheme";

  localStorage.setItem("theme", theme.global.name.value);
};
</script>

<template>
  <div>
    <v-app>
      <v-app-bar elevation="0" color="primary">
        <div class="pe-5">
          <nuxt-link to="/backend/dashboard" class="d-flex brand"
            >NuxtStrapi</nuxt-link
          >
        </div>
        <v-app-bar-nav-icon @click="drawer = !drawer"
          ><v-icon>mdi-menu</v-icon></v-app-bar-nav-icon
        >
        <v-spacer />
        <v-btn
          icon
          @click="toggleTheme()"
          v-if="!theme.global.current.value.dark"
          ><v-icon>mdi-white-balance-sunny</v-icon></v-btn
        >
        <v-btn
          icon
          @click="toggleTheme()"
          v-if="theme.global.current.value.dark"
          ><v-icon>mdi-moon-waning-crescent</v-icon></v-btn
        >

        <!-- User Profile -->
        <Header />
      </v-app-bar>
      <v-main>
        <!-- Sidebar -->
        <v-navigation-drawer
          left
          :permanent="mdAndUp"
          elevation="10"
          app
          :temporary="!mdAndDown"
          v-model="drawer"
          expand-on-hover
        >
          <Sidebar />
        </v-navigation-drawer>

        <v-container fluid class="page-wrapper"> <NuxtPage /> </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<style scoped>
.brand {
  font-size: 20px;
  color: #fff;
  padding-left: 20px;
  text-decoration: none;
  font-weight: bold;
}
</style>
