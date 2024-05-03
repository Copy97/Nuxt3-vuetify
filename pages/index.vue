<script setup lang="ts">
const { locale, setLocale } = useI18n()


// ຮັບຄ່າຈາກຟອມ
const email = ref("");
const password = ref("");

// Sweet alert
const { $swal } = useNuxtApp();

// useCookies
const token = useCookie("token", {
  maxAge: 60 * 60, // 1 hour
});

// useRouter ປ່ຽນໜ້າ
const router = useRouter();

// userRules ສຳລັບກວດສອບຄວາມຖືກຕ້ອງຂອງຂໍ້ມູນ
const { ruleEmail, rulePassLen, ruleRequired } = useFormRules();

// submit ຟອມ

const submit = async () => {
  if (ruleEmail(email.value) == true && rulePassLen(password.value) == true) {
    // useRuntimeConfig() for get evn
    const config = useRuntimeConfig();
    const STRAPI_URL: string = config.public.strapi.url;

    // login strapi with useFetch
    useFetch(`${STRAPI_URL}/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: email.value,
        password: password.value,
      }),
      onResponse({ request, response, options }) {
        if (response.status === 200) {
          // set token to cookie
          token.value = response._data.jwt;
          let timerInterval: any;
          $swal
            .fire({
              title: "Login success!",
              html: "Loading <b></b> seconds.",
              timer: 3000,
              timerProgressBar: true,
              didOpen: () => {
                $swal.showLoading();
                timerInterval = setInterval(() => {
                  const content = $swal.getHtmlContainer();
                  if (content) {
                    const b = content.querySelector("b");
                    if (b) {
                      b.textContent = $swal.getTimerLeft() / 1000;
                    }
                  }
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            })
            .then(() => {
              // Redirect to dashboard
              router.push("/backend/dashboard");
            });
        } else {
          $swal.fire({
            title: "Login failed!",
            text: "Email or password is incorrect. Please try again.",
            icon: "error",
            confirmButtonText: "Close",
          });
        }
      },
    });
  }
};

useHead({
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Login Page",
    },
  ],
});
</script>

<template>
  <vContainer fluid class="fill-height pa-0">
    <vRow align="center" justify="center" class="fill-height" no-gutters>
      <vCol md="6" lg="6" class="hidden-sm-and-down fill-height">
        <vImg
          src="https://wallpaper.dog/large/5557744.jpg"
          cover
          class="h-100 rounded-xl rounded-ts-0 rounded-bs-0 d-flex align-center justify-center"
        >
          <div class="text-center text-white">
            <div class="mx-auto max-w-md w-50">
              
              <h1 class="mb-4">Welcome back.</h1>
              <p class="mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
                ad neque sequi, aliquid maxime harum laudantium reiciendis iure,
                voluptate error minus totam delectus magni corporis commodi odio
                ipsa illum similique.
              </p>
            </div>
          </div>
        </vImg>
      </vCol>
      <VCol clos="12" md="6" lg="6" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" md="6" class="pa-3">
            <h1>Login</h1>
            <p class="text-medium-emphasis">Input your email and password</p>
            <VForm @submit.prevent="submit" class="mt-7">
              <div class="mt-1">
                <VTextField
                  prepend-inner-icon="mdi-email-outline"
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  v-model="email"
                  :rules="[ruleRequired, ruleEmail]"
                />
              </div>
              <div class="mt-1">
                <VTextField
                  prepend-inner-icon="mdi-lock-outline"
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  variant="outlined"
                  v-model="password"
                  :rules="[ruleRequired, rulePassLen]"
                />
              </div>
              <div>
                <VBtn
                  type="submit"
                  block
                  min-height="44"
                  class="gradient primary"
                  >Login</VBtn
                >
              </div>
            </VForm>
            <p class="text-center mt-10">
              <span>Don't have an account?</span>
              <nuxt-link to="/register" class="text-primary"
                >Register</nuxt-link
              >
            </p>
          </VCol>
          <VCol>
            <div>
        <button @click="setLocale('en')">EN</button>
        <button @click="setLocale('la')">LA</button>
        <p>{{ $t("Hello") }}</p>
      </div>
          </VCol>
        </VRow>
      </VCol>
    </vRow>
  </vContainer>
</template>

<style scoped></style>
