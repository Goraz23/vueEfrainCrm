<template>
  <div class="dashboard-wrapper py-8 px-4 flex justify-center min-h-screen">
    <div class="w-full" style="max-width: 1400px">
      <h2 class="text-3xl font-bold mb-8 text-black">Dashboard</h2>

      <!-- Grid de tarjetas resumen -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <!-- Leads totales -->
        <div class="dashboard-card cursor-pointer" @click="goTo('/leads')">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-black">Leads acumulados</span>
            <i class="pi pi-users text-black text-xl" />
          </div>
          <div class="text-4xl font-bold text-black">{{ totalLeads }}</div>
        </div>

        <!-- Usuarios registrados -->
        <div class="dashboard-card cursor-pointer" @click="goTo('/usuarios')">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-black">Usuarios registrados</span>
            <i class="pi pi-user text-black text-xl" />
          </div>
          <div class="text-4xl font-bold text-black">{{ totalUsers }}</div>
        </div>

        <!-- Últimos prospectos -->
        <div class="dashboard-card">
          <div class="text-sm text-black mb-3">Últimos prospectos</div>
          <ul class="list-none m-0 p-0 space-y-2">
            <li v-for="lead in recentLeads" :key="lead.id">
              <div class="text-black font-medium">{{ lead.name }}</div>
              <div class="text-sm text-black/60">{{ lead.email }}</div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Gráficas -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Gráfica de barras -->
        <div class="dashboard-card">
          <h3 class="text-lg font-semibold text-black mb-4">Leads por mes</h3>
          <Chart type="bar" :data="barData" :options="barOptions" />
        </div>

        <!-- Gráfica de dona -->
        <div class="dashboard-card">
          <h3 class="text-lg font-semibold text-black mb-4">Origen de los leads</h3>
          <Chart type="doughnut" :data="doughnutData" :options="doughnutOptions" />
        </div>
      </div>

      <!-- Formulario modal -->
      <AddUserForm v-model="showAddUser" @refresh="fetchUsers" />
    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import AddUserForm from '@/components/AddUserForm.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const showAddUser = ref(false)
const totalLeads = 42
const totalUsers = ref(0)

const fetchUsers = async () => {
  try {
    const response = await axios.get('https://back-landing-dwi.onrender.com/api/users/get-users')
    console.log('Usuarios obtenidos:', response.data)
    totalUsers.value = Array.isArray(response.data.data)
      ? response.data.data.length
      : 0
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    totalUsers.value = 0
  }
}

const router = useRouter()
const goTo = (path) => {
  router.push(path)
}


onMounted(() => {
  fetchUsers()
})

const recentLeads = [
  { id: 1, name: 'Laura Hernández', email: 'laura@example.com' },
  { id: 2, name: 'Carlos Ruiz', email: 'carlos@example.com' },
  { id: 3, name: 'María Pérez', email: 'maria@example.com' }
]

// Gráfica de barras
const barData = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
  datasets: [
    {
      label: 'Leads',
      backgroundColor: '#3b82f6',
      data: [12, 19, 7, 25]
    }
  ]
}

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  }
}

// Gráfica de dona
const doughnutData = {
  labels: ['Facebook', 'Google', 'Instagram', 'Directo'],
  datasets: [
    {
      data: [10, 20, 8, 4],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'],
      hoverBackgroundColor: ['#059669', '#2563eb', '#d97706', '#4f46e5']
    }
  ]
}

const doughnutOptions = {
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#000'
      }
    }
  }
}


</script>

<style scoped>
.dashboard-card {
  background: rgba(255, 255, 255, 0.688);
  backdrop-filter: blur(20px);
  background-repeat: no-repeat;
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}
</style>
