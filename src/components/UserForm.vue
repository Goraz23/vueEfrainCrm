<template>
  <Dialog v-model:visible="visible" :modal="true" :header="isEdit ? 'Editar usuario' : 'Nuevo usuario'" :style="{ width: '500px' }">
    <Form :validation-schema="schema" :initial-values="initialValues" @submit="handleSubmit">
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

      <div class="mb-4" v-if="!isEdit">
        <label class="block mb-1">Contraseña</label>
        <Field name="password" v-slot="{ field }">
          <Password v-model="field.value" toggleMask class="w-full" inputClass="w-full" autocomplete="new-password" />
        </Field>
        <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
      </div>

      <div class="mb-6">
        <label class="block mb-1">Rol</label>
        <Field name="role" v-slot="{ field, meta, handleChange }">
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
import Password from 'primevue/password'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const props = defineProps({
  modelValue: Boolean,
  user: Object
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.user?._id)

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Usuario', value: 'user' }
]

const schema = yup.object({
  name: yup.string().required('Nombre requerido'),
  email: yup.string().email('Correo inválido').required('Correo requerido'),
  phone: yup.string().required('Teléfono requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').when([], {
    is: () => !isEdit.value,
    then: schema => schema.required('Contraseña requerida'),
    otherwise: schema => schema.notRequired()
  }),
  role: yup.string().required('Rol requerido')
})

const initialValues = computed(() => ({
  name: props.user?.name || '',
  email: props.user?.email || '',
  phone: props.user?.phone || '',
  password: '',
  role: props.user?.role || ''
}))

const handleSubmit = async (values, { resetForm }) => {
  try {
    if (isEdit.value) {
      await axios.put(`${API_URL}/users/update-user/${props.user._id}`, values)
    } else {
      await axios.post(`${API_URL}/users/create-user`, values)
    }
    emit('refresh')
    visible.value = false
    resetForm()
  } catch (error) {
    console.error('Error al guardar', error)
  }
}
</script>
