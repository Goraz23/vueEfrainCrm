
<!-- UsuariosView.vue -->
<template>
  <div class="py-8 px-4 flex justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-screen-xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-black">Usuarios registrados</h2>
        <Button label="Agregar usuario" icon="pi pi-user-plus" @click="openNewUserForm" severity="info" outlined />
      </div>

      <InputText v-model="search" placeholder="Buscar por nombre o correo" class="mb-4 w-full" />

      <UserForm v-model="showUserForm" :user="selectedUser" @refresh="fetchUsers" />

      <div class="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha de registro</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" v-if="filteredUsers.length">
            <tr v-for="user in paginatedUsers" :key="user._id">
              <td class="px-6 py-4 text-sm text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ user.email }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ user.phone }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 capitalize">{{ user.role }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
              <td class="px-6 py-4">
                <Button label="Editar" icon="pi pi-pencil" severity="warning" text rounded class="text-yellow-600 px-3 py-1" @click="openEditUser(user)" />
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center px-6 py-4 text-gray-500">No hay usuarios disponibles.</td>
            </tr>
          </tbody>
        </table>
        <Paginator :rows="rows" :totalRecords="filteredUsers.length" v-model:first="first" class="mt-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import UserForm from '@/components/UserForm.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'

const showUserForm = ref(false)
const selectedUser = ref(null)
const users = ref([])
const search = ref('')
const rows = 10
const first = ref(0)

function openNewUserForm() {
  selectedUser.value = null
  showUserForm.value = true
}

function openEditUser(user) {
  selectedUser.value = { ...user }
  showUserForm.value = true
}

const fetchUsers = async () => {
  try {
    const response = await axios.get('https://back-landing-dwi.onrender.com/api/users/get-users')
    users.value = response.data.data || []
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  }
}

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('es-MX', options)
}

const filteredUsers = computed(() => {
  const term = search.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  )
})

const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(first.value, first.value + rows)
})

onMounted(fetchUsers)
</script>