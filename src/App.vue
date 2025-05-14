<script setup>
import { useAwosStore } from './stores/awosStore'
const store = useAwosStore()
</script>

<template>
  <main class="min-h-screen bg-black flex flex-col items-center justify-center p-4">
    <!-- Row 1: Input & Info -->
    <section class="w-full max-w-xl mb-4">
      <!-- Airport input and header info go here -->
    </section>
    <!-- Row 2: METAR Details -->
    <section class="w-full max-w-xl mb-4">
      <!-- Weather/metar panels go here -->
    </section>
    <!-- Row 3: Compass & Visuals -->
    <section class="w-full max-w-xl">
      <!-- Compass and runway/wind visualization go here -->
    </section>
  </main>
</template>

<style scoped></style>
