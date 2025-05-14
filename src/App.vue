<script setup>
import { ref } from 'vue'
import { useAwosStore } from './stores/awosStore'
const store = useAwosStore()
const inputIcao = ref('')

const fetchAirportData = () => {
  if (inputIcao.value) {
    store.fetchAirport(inputIcao.value.trim().toUpperCase())
    store.fetchMetar(inputIcao.value.trim().toUpperCase())
  }
}
</script>

<template>
  <main class="min-h-screen bg-black flex flex-col items-center justify-center p-4">
    <!-- Row 1: Input & Info -->
    <section class="w-full max-w-xl mb-4">
      <form @submit.prevent="fetchAirportData" class="flex gap-2">
        <input
          v-model="inputIcao"
          maxlength="4"
          class="bg-gray-900 text-green-400 px-3 py-2 rounded outline-none uppercase"
          placeholder="Enter ICAO (e.g. LGAV)"
        />
        <button class="bg-green-700 text-black px-4 py-2 rounded font-bold">Load</button>
      </form>
      <!-- Header info will go here -->
    </section>
    <!-- Row 2: METAR Details -->
    <section class="w-full max-w-xl mb-4">
      <div class="bg-gray-900 text-green-400 font-mono px-3 py-2 rounded mb-2">
        {{ store.metar }}
      </div>
      <table class="w-full text-green-400 bg-gray-900 rounded text-sm">
        <tbody>
          <tr>
            <td class="font-bold">Station</td>
            <td>{{ store.decodedMetar.station }}</td>
          </tr>
          <tr>
            <td class="font-bold">Time</td>
            <td>
              {{ store.decodedMetar.day }}/{{ store.decodedMetar.hour }}:{{
                store.decodedMetar.minute
              }}
            </td>
          </tr>
          <tr>
            <td class="font-bold">Wind</td>
            <td>
              {{ store.decodedMetar.wind?.degrees }}° {{ store.decodedMetar.wind?.speed
              }}{{ store.decodedMetar.wind?.unit }}
            </td>
          </tr>
          <tr>
            <td class="font-bold">Visibility</td>
            <td>
              {{ store.decodedMetar.visibility?.value }} {{ store.decodedMetar.visibility?.unit }}
            </td>
          </tr>
          <tr>
            <td class="font-bold">Temperature</td>
            <td>{{ store.decodedMetar.temperature }}°C / {{ store.decodedMetar.dewPoint }}°C</td>
          </tr>
          <tr>
            <td class="font-bold">Altimeter</td>
            <td>
              {{ store.decodedMetar.altimeter?.value }} {{ store.decodedMetar.altimeter?.unit }}
            </td>
          </tr>
          <tr v-if="store.decodedMetar.clouds && store.decodedMetar.clouds.length">
            <td class="font-bold">Clouds</td>
            <td>
              <span
                v-for="cloud in store.decodedMetar.clouds"
                :key="cloud.quantity + cloud.height"
                class="mr-2"
              >
                {{ cloud.quantity }}{{ cloud.height }}
              </span>
            </td>
          </tr>
          <tr v-if="store.decodedMetar.remark">
            <td class="font-bold">Remarks</td>
            <td>{{ store.decodedMetar.remark }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <!-- Row 3: Compass & Visuals -->
    <section class="w-full max-w-xl">
      <!-- Compass and runway/wind visualization go here -->
    </section>
  </main>
</template>

<style scoped></style>
