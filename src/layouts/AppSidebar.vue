<template>
  <Sidebar
    v-model:visible="visible"
    position="left"
    :showCloseIcon="true"
    style="width: 16rem;"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #container="{ closeCallback }">
      <div class="flex flex-column h-full">
        <div class="flex align-items-center justify-content-center py-6">
          <img :src="logo" alt="Logo" class="h-10" />
        </div>
        <ul class="list-none p-3 m-0">
          <li v-for="item in items" :key="item.label">
            <a
              class="flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors"
              :class="route.path.startsWith(item.path) ? 'active-link' : 'text-700 hover:surface-100'"


              @click="item.command(); closeCallback()"
            >
              <i :class="item.icon + ' mr-2'"></i>
              <span class="font-medium">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </template>
  </Sidebar>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import Sidebar from 'primevue/sidebar'
import { useRouter, useRoute } from 'vue-router'
import logo from '@/assets/logoBlack.svg'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])
const visible = ref(props.visible)
watch(() => props.visible, val => visible.value = val)
watch(visible, val => emit('update:visible', val))

const router = useRouter()
const route = useRoute()

const routes = [
  { label: "Dashboard", icon: "pi pi-chart-bar", path: "/dashboard" },
  { label: "Usuarios", icon: "pi pi-users", path: "/usuarios" },
  { label: "Leads", icon: "pi pi-envelope", path: "/leads" }
]

const items = routes.map(route => ({
  ...route,
  command: () => router.push(route.path)
}))
</script>
