<template>
  <Sidebar v-model:visible="visible" position="left" :showCloseIcon="true" style="width: 16rem;" @update:visible="$emit('update:visible', $event)">
    <template #container="{ closeCallback }">
      <div class="flex flex-column h-full">
        <!-- Aquí va tu menú, usando el arreglo de rutas -->
        <ul class="list-none p-3 m-0">
          <li v-for="item in items" :key="item.label">
            <a
              class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors"
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
import { useRouter } from 'vue-router'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])
const visible = ref(props.visible)
watch(() => props.visible, val => visible.value = val)
watch(visible, val => emit('update:visible', val))

const router = useRouter()
const routes = [
  { label: "Inicio", icon: "pi pi-home", path: "/dashboard" },
  { label: "Usuarios", icon: "pi pi-users", path: "/usuarios" },
  { label: "Configuración", icon: "pi pi-cog", path: "/configuracion" }
]
const items = routes.map(route => ({
  label: route.label,
  icon: route.icon,
  command: () => router.push(route.path)
}))
</script>