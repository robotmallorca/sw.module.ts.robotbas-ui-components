<script setup lang="ts">
import { componentInventory } from '../data/components'
</script>

<template>
  <div class="row g-3">
    <div v-for="c in componentInventory" :key="c.name" class="col-6 col-md-4 col-lg-3">
      <DemoCard class="d-flex align-items-start gap-3">
        <RobotbasIcon :name="c.icon + ' fs-4 ' + (c.live ? 'text-success' : 'text-secondary')" />
        <div>
          <div class="fw-semibold d-flex align-items-center gap-2">
            {{ c.name }}
            <RobotbasIcon v-if="c.live" name="bi bi-check-circle-fill text-success small" />
          </div>
          <div class="small text-muted">{{ c.desc }}</div>
        </div>
      </DemoCard>
    </div>
  </div>
</template>
