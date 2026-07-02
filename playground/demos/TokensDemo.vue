<script setup lang="ts">
const palette = [
  { name: 'primary-25', value: '#f4f9ff' },
  { name: 'primary-50', value: '#e7f1ff' },
  { name: 'primary-100', value: '#cfe2ff' },
  { name: 'primary-200', value: '#9ec5fe' },
  { name: 'primary-500', value: '#0d6efd' },
  { name: 'primary-700', value: '#0a58ca' },
  { name: 'gray-100', value: '#f8f9fa' },
  { name: 'gray-600', value: '#6c757d' },
  { name: 'gray-700', value: '#495057' },
  { name: 'gray-900', value: '#212529' },
]
</script>

<template>
  <div class="row g-3 mt-1">
    <div v-for="c in palette" :key="c.name" class="col-6 col-md-3 col-lg-2">
      <div class="demo-swatch" :style="{ background: c.value }" />
      <div class="small fw-semibold mt-2">{{ c.name }}</div>
      <div class="small text-muted">{{ c.value }}</div>
    </div>
  </div>
</template>
