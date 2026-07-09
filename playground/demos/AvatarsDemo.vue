<script setup lang="ts"></script>

<template>
  <div class="row g-3">
    <div class="col-md-4">
      <DemoCard label="Avatar">
        <div class="d-flex gap-3 align-items-center">
          <RobotbasAvatar text="RB" />
          <RobotbasAvatar text="AL" />
          <RobotbasAvatar icon="bi bi-person-fill" />
          <RobotbasAvatar icon="bi bi-robot" />
        </div>
      </DemoCard>
    </div>
    <div class="col-md-4">
      <DemoCard label="Con Chip de estado">
        <div class="d-flex gap-3 align-items-center">
          <RobotbasAvatar text="ON" :chip="{ ui: { base: 'chip-dot' } }" />
          <RobotbasAvatar icon="bi bi-person-fill" :chip="{ inset: false , ui: { base: 'chip-dot' } }" />
        </div>
      </DemoCard>
    </div>
    <div class="col-md-4">
      <DemoCard label="AvatarGroup (max 3)">
        <RobotbasAvatarGroup :max="3">
          <RobotbasAvatar text="AA" />
          <RobotbasAvatar text="BB" />
          <RobotbasAvatar text="CC" />
          <RobotbasAvatar text="DD" />
          <RobotbasAvatar text="EE" />
        </RobotbasAvatarGroup>
      </DemoCard>
    </div>
  </div>
</template>
