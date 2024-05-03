<script setup lang="ts"></script>

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
            <VForm @submit.prevent="" class="mt-7">
              <div class="mt-1">
                <VTextField
                  prepend-inner-icon="mdi-account-outline"
                  id="username"
                  name="username"
                  type="username"
                  label="Username"
                  variant="outlined"
                />
              </div>
              <div class="mt-1">
                <VTextField
                prepend-inner-icon="mdi-email-outline"
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
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
              <span>Allready have an account?</span>
              <nuxt-link to="/" class="text-primary"
                >Login</nuxt-link
              >
            </p>
          </VCol>
        </VRow>
      </VCol>
    </vRow>
  </vContainer>
</template>

<style scoped></style>
