<script setup>
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import AppFooter from './AppFooter.vue'

const sidebarVisible = ref(false)
</script>

<template>
    <Toast />
    <ConfirmDialog />
  <div class="min-h-screen flex flex-col justify-center">
    <AppTopbar @toggle-sidebar="sidebarVisible = true" />
    <AppSidebar :visible="sidebarVisible" @update:visible="sidebarVisible = $event" />
    <main class="flex-1 p-4 flex-row justify-center">
      <router-view />
    </main>
  </div>
</template>