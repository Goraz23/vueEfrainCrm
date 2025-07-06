<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'

const search = ref('')
const leads = ref([])
const editingLeadId = ref(null)
const selectedLead = ref(null)
const showModal = ref(false)

const fetchLeads = async () => {
  try {
    const res = await axios.get('https://back-landing-dwi.onrender.com/api/email/get-emails')
    leads.value = res.data.data
  } catch (error) {
    console.error('Error al cargar leads:', error)
  }
}

onMounted(fetchLeads)

const filteredLeads = computed(() => {
  if (!search.value) return leads.value
  return leads.value.filter(lead =>
    lead.name.toLowerCase().includes(search.value.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.value.toLowerCase())
  )
})

const viewLead = (lead) => {
  selectedLead.value = lead
  showModal.value = true
}

const statusOptions = [
  { label: 'Nuevo', value: 'isNew' },
  { label: 'Contacto', value: 'isContact' },
  { label: 'Descartado', value: 'isDiscard' },
]

const getLeadStatus = (lead) => {
  if (lead.isNew) return 'isNew'
  if (lead.isContact) return 'isContact'
  if (lead.isDiscard) return 'isDiscard'
  return null
}

const startEditing = (lead) => {
  editingLeadId.value = lead._id
}

const handleStatusChange = async (lead, newStatus) => {
  if (!lead?._id) {
    console.error('❌ El ID del lead no está definido')
    return
  }

  const endpointMap = {
    isNew: `https://api.landingcrm.store/api/email/is-new-contact-user/${lead._id}`,
    isContact: `https://api.landingcrm.store/api/email/is-contact-user/${lead._id}`,
    isDiscard: `https://api.landingcrm.store/api/email/discard-email/${lead._id}`
  }

  const endpoint = endpointMap[newStatus]
  const body = newStatus === 'isContact'
    ? { answer: 'Te estoy contactando, estos son los pasos...' }
    : {}

  try {
    console.log(`📤POST a: ${endpoint}`, body)
    const res = await axios.post(endpoint, body)

    console.log(' Estado actualizado correctamente:', res.data)

    // Reflejar en UI
    lead.isNew = false
    lead.isContact = false
    lead.isDiscard = false
    lead[newStatus] = true

  } catch (error) {
    console.error(' Error al actualizar estado:', error)
  } finally {
    editingLeadId.value = null
  }
}


const getSeverity = (status) => {
  switch (status) {
    case 'isNew': return 'info'
    case 'isContact': return 'success'
    case 'isDiscard': return 'danger'
    default: return null
  }
}
</script>

<template>
  <div class="py-6 px-4 flex justify-center bg-gray-50 min-h-screen">
    <div class="w-full" style="max-width: 1400px">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Leads acumulados</h2>

      <div class="dashboard-card">
        <div class="flex flex-col md:flex-row gap-4 mb-4 justify-between items-center">
          <InputText v-model="search" placeholder="Buscar por nombre o correo" class="w-full md:w-1/3" />
        </div>

        <DataTable :value="filteredLeads" paginator :rows="10"
                   class="p-datatable-sm p-datatable-gridlines surface-card border-round shadow-2">
          <Column field="name" header="Nombre" sortable />
          <Column field="email" header="Correo electrónico" sortable />
          <Column field="phone" header="Teléfono" />
          <Column field="comentario" header="Comentario" />
          <Column field="createdAt" header="Fecha" sortable>
            <template #body="{ data }">
              {{ new Date(data.createdAt).toLocaleDateString() }}
            </template>
          </Column>
          <Column header="Estado">
            <template #body="{ data }">
              <div class="w-full md:w-40">
                <Dropdown
                  v-if="editingLeadId === data._id"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  :modelValue="getLeadStatus(data)"
                  @update:modelValue="(val) => handleStatusChange(data, val)"
                  class="w-full"
                />
                <Tag
                  v-else
                  :value="statusOptions.find(opt => opt.value === getLeadStatus(data))?.label || 'Sin estado'"
                  :severity="getSeverity(getLeadStatus(data))"
                  class="cursor-pointer w-full text-center"
                  @click="startEditing(data)"
                />
              </div>
            </template>
          </Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm"
                      @click="viewLead(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog v-model:visible="showModal" modal header="Detalles del Lead"
              :style="{ width: '90vw', maxWidth: '500px' }">
        <div v-if="selectedLead" class="space-y-4">
          <div><strong>Nombre:</strong> {{ selectedLead.name }}</div>
          <div><strong>Correo:</strong> {{ selectedLead.email }}</div>
          <div><strong>Teléfono:</strong> {{ selectedLead.phone }}</div>
          <div><strong>Comentario:</strong>
            <p class="whitespace-pre-line">{{ selectedLead.comentario || 'Sin comentario' }}</p>
          </div>
          <div><strong>Fecha:</strong> {{ new Date(selectedLead.createdAt).toLocaleString() }}</div>
          <div>
            <strong>Estado:</strong>
            <div class="flex gap-2 mt-2">
              <Tag v-if="selectedLead.isNew" severity="info" value="Nuevo" />
              <Tag v-if="selectedLead.isContact" severity="success" value="Contacto" />
              <Tag v-if="selectedLead.isDiscard" severity="danger" value="Descartado" />
              <span v-if="!selectedLead.isNew && !selectedLead.isContact && !selectedLead.isDiscard">
                No definido
              </span>
            </div>
          </div>
        </div>
      </Dialog>
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
