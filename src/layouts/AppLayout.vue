<script setup>
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import AppFooter from './AppFooter.vue'

const sidebarVisible = ref(false)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppTopbar @toggle-sidebar="sidebarVisible = true" />
    <AppSidebar :visible="sidebarVisible" @update:visible="sidebarVisible = $event" />
    <main class="flex-1 p-4">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>