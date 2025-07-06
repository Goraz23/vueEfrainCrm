<template>
  <div class="flex items-center justify-between px-4 py-2 bg-primary text-white absolute">
    <Button icon="pi pi-bars" class="p-button-rounded p-button-text" @click="$emit('toggle-sidebar')" />
    <span class="font-bold text-lg">CRM</span>
    <Button icon="pi pi-sign-out" class="p-button-rounded p-button-text" @click="handleLogout" />
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

function handleLogout() {
  confirm.require({
    message: '¿Seguro que deseas cerrar sesión?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: () => {
      auth.logout()
      // toast.add({ severity: 'success', summary: 'Sesión cerrada', detail: 'Has cerrado sesión correctamente', life: 3000 })
      router.push('/login')
    }
  })
}
</script>