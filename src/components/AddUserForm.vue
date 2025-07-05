<template>
  <Dialog v-model:visible="visible" modal header="Nuevo usuario" :style="{ width: '500px' }">
    <Form @submit="handleSubmit" :validation-schema="schema">
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

      <div class="mb-4">
        <label class="block mb-1">Contraseña</label>
        <Field name="password" v-slot="{ field, handleChange }">
          <Password
            v-model="field.value"
            toggleMask
            class="w-full"
            inputClass="w-full"
            @input="handleChange($event)"
            autocomplete="new-password"
          />
        </Field>
        <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
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
            placeholder="Selecciona un rol"
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

const props = defineProps({
  modelValue: Boolean
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

const schema = yup.object({
  name: yup.string().required('Nombre requerido'),
  email: yup.string().email('Correo inválido').required('Correo requerido'),
  phone: yup.string().required('Teléfono requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
  role: yup.string().required('Rol requerido')
})

const handleSubmit = async (values, { resetForm }) => {
  try {
    await axios.post('https://back-landing-dwi.onrender.com/api/users/create-user', values)
    emit('refresh')
    visible.value = false
    resetForm()
  } catch (error) {
    console.error('Error al guardar usuario', error)
  }
}
</script>
