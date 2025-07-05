<script setup>

import { ref, computed } from 'vue'
import { InputText } from 'primevue/inputtext'
import { DataTable } from 'primevue/datatable'
import { Column } from 'primevue/column'
import { Button } from 'primevue/button'

const search = ref('')

const leads = ref([
  { id: 1, name: 'Laura Hernández', email: 'laura@example.com', phone: '555-1234', date: '2025-06-20' },
  { id: 2, name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '555-5678', date: '2025-06-21' },
  { id: 3, name: 'María Pérez', email: 'maria@example.com', phone: '555-9876', date: '2025-06-22' }
])

const filteredLeads = computed(() => {
  if (!search.value) return leads.value
  return leads.value.filter(lead =>
    lead.name.toLowerCase().includes(search.value.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.value.toLowerCase())
  )
})

const viewLead = (lead) => {
  console.log('Ver lead:', lead)
}
</script>
<template>
  <div class="py-6 px-4 flex justify-center bg-gray-50 min-h-screen">
    <div class="w-full" style="max-width: 1400px">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Leads acumulados</h2>

      <!-- Card contenedora -->
      <div class="dashboard-card">
        <!-- Filtros -->
        <div class="flex flex-column md:flex-row gap-4 mb-4 justify-between items-center">
          <InputText
            v-model="search"
            placeholder="Buscar por nombre o correo"
            class="w-full md:w-1/3"
          />
        </div>

        <!-- Tabla de leads -->
        <DataTable
          :value="filteredLeads"
          paginator
          :rows="5"
          class="p-datatable-sm p-datatable-gridlines surface-card border-round shadow-2"
        >
          <Column field="name" header="Nombre" sortable></Column>
          <Column field="email" header="Correo electrónico" sortable></Column>
          <Column field="phone" header="Teléfono"></Column>
          <Column field="date" header="Fecha" sortable></Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <Button
                icon="pi pi-eye"
                class="p-button-rounded p-button-text p-button-sm"
                @click="viewLead(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>



<style scoped>
.dashboard-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.2s ease;
}
.dashboard-card:hover {
  transform: translateY(-2px);
}
</style>
