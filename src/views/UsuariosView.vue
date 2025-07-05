<template>
  <div class="py-8 px-4 flex justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-screen-xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-black">Usuarios registrados</h2>
        <Button
          label="Agregar usuario"
          icon="pi pi-user-plus"
          class="bg-blue-500 border-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          @click="openAddUserForm"
        />
      </div>

      <AddUserForm v-model="showAddForm" @refresh="fetchUsers" />
      <EditUserForm v-model="showEditForm" :user="selectedUser" @refresh="fetchUsers" />

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
          <tbody class="bg-white divide-y divide-gray-200" v-if="paginatedUsers.length">
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
              <td colspan="6" class="text-center px-6 py-4 text-gray-500">Cargando usuarios...</td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div class="p-4 border-t border-gray-200 flex justify-center">
          <Paginator
            :rows="rowsPerPage"
            :totalRecords="users.length"
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

import AddUserForm from '@/components/AddUserForm.vue'
import EditUserForm from '@/components/EditUserForm.vue'

const users = ref([])
const showAddForm = ref(false)
const showEditForm = ref(false)
const selectedUser = ref(null)

const rowsPerPage = 10
const first = ref(0)

const paginatedUsers = computed(() => {
  return users.value.slice(first.value, first.value + rowsPerPage)
})

const openAddUserForm = () => {
  showAddForm.value = true
}

const openEditUser = (user) => {
  selectedUser.value = { ...user }
  showEditForm.value = true
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

onMounted(fetchUsers)
</script>

<style scoped>
table {
  border-radius: 12px;
  border: solid 1px #e5e7eb;
  box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.05);
}
</style>
