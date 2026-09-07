<script setup lang="ts">
const showcaseIcons = [
  'fas fa-house', 'fas fa-gear', 'fas fa-magnifying-glass', 'fas fa-bell',
  'fas fa-circle-user', 'fas fa-cloud-arrow-up', 'fas fa-arrow-trend-up',
  'fas fa-shield-halved', 'fas fa-bolt', 'fas fa-microchip',
  'fas fa-sitemap', 'fas fa-sliders',
]

// La fuente propia que publica el módulo. La clase de cara es obligatoria: de
// ella cuelgan la familia y el glifo, y las dos caras NO comparten codepoints.
const robotbasIcons = [
  'icon-projects', 'icon-bed', 'icon-building-settings', 'icon-warning-fill',
  'icon-chevrons-left', 'icon-chevrons-right', 'icon-dashboard', 'icon-logout',
]
</script>

<template>
  <div class="row g-3">
    <div class="col-12">
      <DemoCard label="Font Awesome — el pack por defecto">
        <div class="d-flex flex-wrap gap-4 fs-3 text-secondary">
          <RobotbasIcon v-for="ic in showcaseIcons" :key="ic" :name="ic" />
        </div>
      </DemoCard>
    </div>

    <div class="col-md-6">
      <DemoCard label="RobotApps — Light">
        <div class="d-flex flex-wrap gap-4 fs-3 text-secondary">
          <RobotbasIcon
            v-for="ic in robotbasIcons"
            :key="`light-${ic}`"
            :name="`robotbas-icon-light ${ic}`"
          />
        </div>
      </DemoCard>
    </div>

    <div class="col-md-6">
      <DemoCard label="RobotApps — Bold">
        <div class="d-flex flex-wrap gap-4 fs-3 text-secondary">
          <RobotbasIcon
            v-for="ic in robotbasIcons"
            :key="`bold-${ic}`"
            :name="`robotbas-icon-bold ${ic}`"
          />
        </div>
      </DemoCard>
    </div>
  </div>
</template>
