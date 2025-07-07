<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full p-8 bg-base-100 shadow-xl rounded-lg">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div class="form-control">
          <label class="label" for="username">
            <span class="label-text">Username</span>
          </label>
          <input id="username" v-model="username" type="text" required class="input input-bordered w-full" />
        </div>
        <div class="form-control">
          <label class="label" for="password">
            <span class="label-text">Password</span>
          </label>
          <input id="password" v-model="password" type="password" required class="input input-bordered w-full" />
        </div>
        <div v-if="error" class="text-error text-center">{{ error }}</div>
        <div class="flex justify-center">
          <button type="submit" class="btn btn-primary w-full">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../utls/api';

import { useRouter, useRoute } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const route = useRoute();

const login = async () => {
  try {
    error.value = '';
    const res = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    });
    const token = res.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('token_expires', res.data.expires);
    localStorage.setItem('token_role', res.data.role);
    router.push((route.query.redirect as string) || '/');
  } catch (e: any) {
    if (e.response && e.response.data && e.response.data.error) {
      error.value = e.response.data.error;
    } else {
      error.value = 'Invalid credentials';
    }
  }
};
</script>
