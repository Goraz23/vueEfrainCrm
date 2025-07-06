<template>
  <Dialog v-model:visible="visible" modal header="Editar usuario" :style="{ width: '500px' }">
    <Form @submit="handleSubmit" :validation-schema="schema" :initial-values="initialValues">
      <div class="mb-4">
        <label class="block mb-1">Nombre</label>
        <Field name="name" v-slot="{ field }">
          <InputText v-bind="field" class="w-full" />
        </Field>
        <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Correo</label>
        <Field name="email" v-slot="{ field }">
          <InputText v-bind="field" class="w-full" />
        </Field>
        <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Teléfono</label>
        <Field name="phone" v-slot="{ field }">
          <InputText v-bind="field" class="w-full" />
        </Field>
        <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
      </div>

      <div class="mb-6">
        <label class="block mb-1">Rol</label>
        <Field name="role" v-slot="{ field, handleChange }">
          <Dropdown
            v-model="field.value"
            :options="roles"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            @change="handleChange($event.value)"
          />
        </Field>
        <ErrorMessage name="role" class="text-red-500 text-sm mt-1" />
      </div>

      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="visible = false" />
        <Button type="submit" label="Guardar" />
      </div>
    </Form>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import axios from 'axios'

// Props
const props = defineProps({
  modelValue: Boolean,
  user: Object
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Usuario', value: 'user' }
]

// Validación Yup (sin password)
const schema = yup.object({
  name: yup.string().required('Nombre requerido'),
  email: yup.string().email('Correo inválido').required('Correo requerido'),
  phone: yup.string().required('Teléfono requerido'),
  role: yup.string().required('Rol requerido')
})

// Valores iniciales para edición
const initialValues = computed(() => ({
  name: props.user?.name || '',
  email: props.user?.email || '',
  phone: props.user?.phone || '',
  role: props.user?.role || ''
}))

// Guardar cambios
const handleSubmit = async (values, { resetForm }) => {
  try {
    await axios.put(`https://back-landing-dwi.onrender.com/api/users/update-user/${props.user._id}`, values)
    emit('refresh')
    visible.value = false
    resetForm()
  } catch (error) {
    console.error('Error al editar', error)
  }
}
</script>
