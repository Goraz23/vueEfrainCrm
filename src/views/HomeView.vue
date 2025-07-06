<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-container">
      <h2 class="dashboard-title">Dashboard</h2>

      <!-- Primera fila: 3 tarjetas -->
      <div class="dashboard-grid-3">
        <div class="dashboard-card cursor-pointer" @click="goTo('/leads')">
          <div class="card-header">
            <span>Leads acumulados</span>
            <i class="pi pi-users icon"></i>
          </div>
          <div class="card-value">{{ totalLeads }}</div>
        </div>

        <div class="dashboard-card cursor-pointer" @click="goTo('/usuarios')">
          <div class="card-header">
            <span>Usuarios registrados</span>
            <i class="pi pi-user icon"></i>
          </div>
          <div class="card-value">{{ totalUsers }}</div>
        </div>

        <div class="dashboard-card">
          <div class="card-header">Últimos prospectos</div>
          <ul class="prospect-list">
            <li v-for="lead in recentLeads" :key="lead._id">
              <div class="prospect-name">{{ lead.name }}</div>
              <div class="prospect-email">{{ lead.email }}</div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Segunda fila: 2 tarjetas -->
      <div class="dashboard-grid-2">
        <div class="dashboard-card">
          <h3 class="card-title">Origen de los leads</h3>
          <Chart type="doughnut" :data="doughnutData" :options="doughnutOptions" />
        </div>

        <div class="dashboard-card">
          <h3 class="card-title">Leads por mes</h3>
          <Chart type="bar" :data="barData" :options="barOptions" />
        </div>
      </div>

      <AddUserForm v-model="showAddUser" @refresh="fetchUsers" />
    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart'
import AddUserForm from '@/components/AddUserForm.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const showAddUser = ref(false)
const totalLeads = ref(0)
const totalUsers = ref(0)
const recentLeads = ref([])
const API_URL = import.meta.env.VITE_API_URL

// Hacemos barData reactivo para que la gráfica se actualice
const barData = ref({
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Leads',
      backgroundColor: '#3b82f6',
      data: Array(12).fill(0)
    }
  ]
})

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } }
}

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
      labels: { color: '#000' }
    }
  }
}

const fetchLeads = async () => {
  try {
    const res = await axios.get('https://api.landingcrm.store/api/email/get-emails')
    if (res.data.status === 'success' && Array.isArray(res.data.data)) {
      recentLeads.value = res.data.data.slice(-5).reverse()
      totalLeads.value = res.data.data.length

      // Conteo leads por mes
      const monthsCount = Array(12).fill(0)
      res.data.data.forEach(lead => {
        if (lead.date) {
          const monthIndex = new Date(lead.date).getMonth()
          monthsCount[monthIndex]++
        }
      })

      // Actualizamos barData reemplazando el objeto para activar reactividad
      barData.value = {
        ...barData.value,
        datasets: [
          {
            ...barData.value.datasets[0],
            data: monthsCount
          }
        ]
      }
    }
  } catch (error) {
    console.error('Error fetching leads:', error)
    totalLeads.value = 0
    recentLeads.value = []
  }
}

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/get-users`)
    totalUsers.value = Array.isArray(response.data.data) ? response.data.data.length : 0
  } catch {
    totalUsers.value = 0
  }
}

const router = useRouter()
const goTo = (path) => router.push(path)

onMounted(() => {
  fetchLeads()
  fetchUsers()
})
</script>

<style scoped>
.dashboard-wrapper {
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: #f9fafb;
}

.dashboard-container {
  width: 100%;
  max-width: 1400px;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
}

.dashboard-grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .dashboard-grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .dashboard-grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.dashboard-card {
  background: rgba(255 255 255 / 0.7);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0 0 0 / 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0 0 0 / 0.18);
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #1e293b;
}

.icon {
  font-size: 1.25rem;
  color: #1e293b;
}

.card-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
}

.prospect-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 13rem;
  overflow-y: auto;
}

.prospect-list li {
  margin-bottom: 1rem;
}

.prospect-name {
  font-weight: 600;
  color: #1e293b;
}

.prospect-email {
  font-size: 0.875rem;
  color: #64748b;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
}
</style>
