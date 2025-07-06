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
import ProgressSpinner from 'primevue/progressspinner'
import Textarea from 'primevue/textarea'

const search = ref('')
const leads = ref([])
const editingLeadId = ref(null)
const selectedLead = ref(null)
const showModal = ref(false)
const loading = ref(false)
const API_URL = import.meta.env.VITE_API_URL

// Para el modal de contacto
const showContactModal = ref(false)
const contactLead = ref(null)
const contactAnswer = ref('')

const fetchLeads = async () => {
  try {
    loading.value = true
    const res = await axios.get(`${API_URL}/email/get-emails`)
    leads.value = res.data.data
  } catch (error) {
    console.error('Error al cargar leads:', error)
  } finally {
    loading.value = false
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

// Nueva función para manejar el cambio del dropdown
const onStatusChangeDropdown = (lead, newStatus) => {
  if (newStatus === 'isContact') {
    contactLead.value = lead
    contactAnswer.value = ''
    showContactModal.value = true
  } else {
    handleStatusChange(lead, newStatus)
  }
}

const handleStatusChange = async (lead, newStatus, answer = 'Te estoy contactando, estos son los pasos...') => {
  if (!lead?._id) {
    console.error('❌ El ID del lead no está definido')
    return
  }

  const endpointMap = {
    isNew: `${API_URL}/email/is-new-contact-user/${lead._id}`,
    isContact: `${API_URL}/email/is-contact-user/${lead._id}`,
    isDiscard: `${API_URL}/email/discard-email/${lead._id}`
  }

  // Solo para isContact se envía el answer personalizado
  const endpoint = endpointMap[newStatus]
  const body = newStatus === 'isContact'
    ? { answer }
    : {}

  try {
    console.log(`📤POST a: ${endpoint}`, body)
    const res = await axios.post(endpoint, body)

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

// Confirmar desde el modal
const confirmContactStatus = async () => {
  if (contactLead.value) {
    await handleStatusChange(contactLead.value, 'isContact', contactAnswer.value)
    showContactModal.value = false
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
    <div class="w-full max-w-full">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Leads acumulados</h2>

      <div class="dashboard-card">
        <div class="flex flex-col md:flex-row gap-4 mb-4 justify-between items-center">
          <InputText v-model="search" placeholder="Buscar por nombre o correo" class="w-full md:w-1/3" />
        </div>

        <ProgressSpinner
          v-if="loading"
          style="width: 50px; height: 50px; display: block; margin: 2rem auto;"
          strokeWidth="4"
          animationDuration=".8s"
          aria-label="Cargando"
        />

        <div v-else class="overflow-x-auto rounded-2xl shadow w-full">
          <DataTable
            :value="filteredLeads"
            paginator
            :rows="10"
            class="p-datatable-sm p-datatable-gridlines border-none w-full"
            :rowClass="() => 'hover:bg-blue-50 transition-colors duration-150'"
            style="min-width: 900px; width: 100%;"
          >
            <Column field="name" header="Nombre" sortable headerClass="sticky-header" />
            <Column field="email" header="Correo electrónico" sortable headerClass="sticky-header" />
            <Column field="phone" header="Teléfono" headerClass="sticky-header" />
            <Column field="comentario" header="Comentario" headerClass="sticky-header" />
            <Column field="createdAt" header="Fecha" sortable headerClass="sticky-header">
              <template #body="{ data }">
                {{ new Date(data.createdAt).toLocaleDateString() }}
              </template>
            </Column>
            <Column header="Estado" headerClass="sticky-header">
              <template #body="{ data }">
                <div class="w-full md:w-40">
                  <Dropdown
                    v-if="editingLeadId === data._id"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    :modelValue="getLeadStatus(data)"
                    @update:modelValue="(val) => onStatusChangeDropdown(data, val)"
                    class="w-full"
                  />
                  <Tag
                    v-else
                    :value="statusOptions.find(opt => opt.value === getLeadStatus(data))?.label || 'Sin estado'"
                    :severity="getSeverity(getLeadStatus(data))"
                    class="cursor-pointer w-full text-center font-semibold"
                    @click="startEditing(data)"
                  />
                </div>
              </template>
            </Column>
            <Column header="Acciones" headerClass="sticky-header">
              <template #body="slotProps">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text p-button-sm text-blue-600 hover:bg-blue-100"
                  @click="viewLead(slotProps.data)"
                  v-tooltip.bottom="'Ver detalles'"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Modal para mensaje de contacto -->
      <Dialog v-model:visible="showContactModal" modal header="Mensaje de contacto"
              :style="{ width: '90vw', maxWidth: '500px' }">
        <div>
          <label class="block mb-2 font-semibold">Mensaje para el contacto:</label>
          <Textarea v-model="contactAnswer" autoResize rows="4" class="w-full mb-4" />
          <div class="flex justify-end gap-2">
            <Button label="Cancelar" @click="showContactModal = false" />
            <Button label="Enviar" severity="success" @click="confirmContactStatus" />
          </div>
        </div>
      </Dialog>

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
.sticky-header {
  position: sticky;
  top: 0;
  background: #f3f4f6;
  z-index: 1;
}
.p-datatable .p-datatable-tbody > tr:hover {
  background: #e0edfa !important;
}
</style>