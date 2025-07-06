<template>
  <div class="py-8 px-4 flex justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-screen-xl">
      <div class="flex justify-content-between align-items-center mb-6 gap-4">
        <h2 class="text-3xl font-bold text-gray-800">Usuarios registrados</h2>
        <Button
          label="Agregar usuario"
          icon="pi pi-user-plus"
          @click="openAddUserForm"
        />
      </div>

      <!-- Buscador -->
      <div class="mb-6">
        <InputText
          v-model="search"
          placeholder="Buscar por nombre o correo"
          class="w-full md:w-1/3"
        />
      </div>

      <AddUserForm v-model="showAddForm" @refresh="fetchUsers" />
      <EditUserForm v-model="showEditForm" :user="selectedUser" @refresh="fetchUsers" />

      <ProgressSpinner
        v-if="loading"
        style="width: 50px; height: 50px; display: block; margin: 2rem auto;"
        strokeWidth="4"
        animationDuration=".8s"
        aria-label="Cargando"
      />

      <div v-else class="dashboard-card overflow-x-auto">
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
          <tbody class="divide-y divide-gray-200" v-if="paginatedUsers.length">
            <tr v-for="user in paginatedUsers" :key="user._id">
              <td class="px-6 py-4 text-sm text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ user.email }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ user.phone }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 capitalize">{{ user.role }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
              <td class="px-6 py-4 text-sm">
                <Button
                  label="Editar"
                  icon="pi pi-pencil"
                  severity="warning"
                  class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded"
                  @click="openEditUser(user)"
                />
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center px-6 py-4 text-gray-500">No se encontraron usuarios...</td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div class="p-4 border-t border-gray-200 flex justify-center">
          <Paginator
            :rows="rowsPerPage"
            :totalRecords="filteredUsers.length"
            :first="first"
            @update:first="first = $event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'

import AddUserForm from '@/components/AddUserForm.vue'
import EditUserForm from '@/components/EditUserForm.vue'

// Obtener el usuario autenticado desde localStorage (o tu store)
const authUser = ref(null)
try {
  const stored = localStorage.getItem('user')
  if (stored) authUser.value = JSON.parse(stored)
} catch (e) {
  authUser.value = null
}

const users = ref([])
const showAddForm = ref(false)
const showEditForm = ref(false)
const selectedUser = ref(null)
const loading = ref(false)

const search = ref('')
const rowsPerPage = 10
const first = ref(0)

// 🔍 Filtrado dinámico (excluye el usuario autenticado)
const filteredUsers = computed(() => {
  let list = users.value
  if (authUser.value && authUser.value._id) {
    list = list.filter(user => user._id !== authUser.value._id)
  }
  if (!search.value.trim()) return list
  const query = search.value.toLowerCase()
  return list.filter(user =>
    user.name?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  )
})

// 🧮 Paginación
const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(first.value, first.value + rowsPerPage)
})

// 👤 Modal
const openAddUserForm = () => (showAddForm.value = true)
const openEditUser = (user) => {
  selectedUser.value = { ...user }
  showEditForm.value = true
}

// 🔁 Obtener usuarios
const fetchUsers = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('https://back-landing-dwi.onrender.com/api/users/get-users')
    users.value = data.data || []
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  } finally {
    loading.value = false
  }
}

// 🕓 Formatear fecha
const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('es-MX', options)
}

onMounted(fetchUsers)
</script>

<style scoped>
.dashboard-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.2s ease;
  overflow-x: auto;
}
.dashboard-card:hover {
  transform: translateY(-2px);
}

table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
}
th, td {
  white-space: nowrap;
}
</style>