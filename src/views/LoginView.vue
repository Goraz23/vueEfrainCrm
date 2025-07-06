<template>
  <div class="min-h-screen flex align-items-center justify-content-center px-4 py-5">
    <div class="w-full sm:w-30rem">
      <div class="bg-white p-5 border border-round-xl border-green-500 shadow-5 flex flex-column gap-4">
        <h2 class="text-3xl font-semibold text-center text-gray-800">Iniciar sesión</h2>

        <div class="flex flex-column gap-2">
          <label for="email" class="text-sm font-medium text-gray-700">Correo electrónico</label>
          <span class="p-input-icon-left w-full">
            <InputText
              id="email"
              v-model="email"
              class="w-full"
              placeholder="usuario@correo.com"
              :class="{ 'p-invalid': error }"
            />
          </span>
        </div>

        <div class="flex flex-column gap-2">
          <label for="password" class="text-sm font-medium text-gray-700">Contraseña</label>
          <span class="p-input-icon-left w-full">
            <Password
              id="password"
              v-model="password"
              class="w-full"
              toggleMask
              :feedback="false"
              input-class="w-full"
              placeholder="********"
            />
          </span>
        </div>

        <Button
          label="Entrar"
          icon="pi pi-sign-in"
          class="w-full p-button-success p-button-raised"
          @click="handleLogin"
          :loading="loading"
        />

        <p v-if="error" class="text-red-600 text-sm text-center mt-2">
          Correo o contraseña incorrectos. Intenta nuevamente.
        </p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useToast } from 'primevue/usetoast'

// PrimeVue
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const email = ref('')
const password = ref('')
const error = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = false
  const success = await auth.login({ email: email.value, password: password.value })
  loading.value = false
  if (success && auth.user?.role === 'admin') {
    router.push('/dashboard')
    toast.add({
      severity: 'success',
      summary: 'Inicio de sesión exitoso',
      detail: 'Bienvenido al sistema',
      life: 3000
    })
  } else {
    error.value = true
    toast.add({
      severity: 'error',
      summary: 'Acceso denegado',
      detail: 'Solo los administradores pueden ingresar.',
      life: 3000
    })
  }
}
</script>
