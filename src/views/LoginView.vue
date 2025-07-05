<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 w-full">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>

      <div class="mb-4">
        <label for="email" class="block mb-1 text-gray-700">Correo electrónico</label>
        <InputText id="email" v-model="email" class="w-full" />
      </div>

      <div class="mb-6">
        <label for="password" class="block mb-1 text-gray-700">Contraseña</label>
        <Password id="password" v-model="password" class="w-full" toggleMask feedback="false" />
      </div>

      <Button label="Entrar" class="w-full p-button-success" @click="handleLogin" />
      <p v-if="error" class="text-red-500 text-sm mt-4 text-center">Credenciales inválidas</p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// PrimeVue
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref(false)

const handleLogin = async () => {
  const success = await auth.login({ email: email.value, password: password.value })
  if (success) {
    router.push('/dashboard')
  } else {
    error.value = true
  }
}
</script>
