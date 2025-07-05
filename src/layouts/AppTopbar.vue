<template>
  <div class="flex items-center justify-between px-4 py-2 bg-primary text-white">
    <Button icon="pi pi-bars" class="p-button-rounded p-button-text" @click="$emit('toggle-sidebar')" />
    <span class="font-bold text-lg">CRM</span>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
</script>