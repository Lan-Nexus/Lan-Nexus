<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useNotificationStore } from "@/stores/notification";

const notificationStore = useNotificationStore();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-se">
    <nav class="navbar sticky top-0 z-50 bg-secondary">
      <div class="flex-1">
        <RouterLink :to="{ name: 'home' }" class="btn btn-ghost text-xl"
          >Lan Launcher</RouterLink
        >
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <details>
              <summary class="bg-base-100">Create Game</summary>
              <ul class="bg-base-300 rounded-t-none p-2">
                <li>
                  <router-link :to="{ name: 'findGame' }">Find Game</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'createGameSteam' }"
                    >From Steam</router-link
                  >
                </li>
                <li>
                  <router-link :to="{ name: 'createGame' }"
                    >Create Game</router-link
                  >
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </nav>
    <main class="container mx-auto flex-1 p-6 bg-base-100">
      <RouterView />
    </main>
    <template v-if="notificationStore.hasNotifications">
      <div class="toast">
        <div
          :class="'alert-' + notificationStore.drawNotifications.type"
          class="alert"
        >
          <span>{{ notificationStore.drawNotifications.message }}</span>
        </div>
      </div>
    </template>

    <!-- force load in toast colors. -->
    <div class="toast hidden">
      <div class="alert-success alert-info alert-error alert-warning">
        <span></span>
      </div>
    </div>
  </div>
</template>
