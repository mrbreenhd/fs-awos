<script setup>
import { useAwosStore } from './stores/awosStore'

const store = useAwosStore()
store.fetchMetar('LGAV')
store.fetchAirport('LGAV')
</script>

<template>
  <h1 class="text-3xl font-bold underline">Hello!</h1>
  <div>
    <pre>{{ store.airport }}</pre>
    <pre>{{ store.metar }}</pre>
    <pre>{{ store.decodedMetar }}</pre>
  </div>
</template>

<style scoped></style>
