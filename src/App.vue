<script setup>
import { ref, watch } from 'vue'
import { useAwosStore } from './stores/awosStore'
import WindCompass from './components/WindCompass.vue'
const store = useAwosStore()
const inputIcao = ref('')

const selectedRunway = ref(null)

const fetchAirportData = async () => {
  if (inputIcao.value) {
    await store.fetchAirport(inputIcao.value.trim().toUpperCase())
    if (store.airport?.runways?.length) {
      selectedRunway.value = store.airport.runways[0]
    }
    store.fetchMetar(inputIcao.value.trim().toUpperCase())
  }
}

// Update selected runway if airport changes
watch(
  () => store.airport,
  (airport) => {
    if (airport?.runways?.length) {
      selectedRunway.value = airport.runways[0]
    } else {
      selectedRunway.value = null
    }
  },
)
</script>

<template>
  <main class="min-h-screen h-screen overflow-hidden bg-black flex flex-col items-center p-3">
    <!-- Row 1: Input & Info -->
    <section class="w-full max-w-xl mb-4">
      <form @submit.prevent="fetchAirportData" class="flex gap-2 items-center">
        <input
          v-model="inputIcao"
          maxlength="4"
          class="bg-gray-900 text-green-400 px-3 py-2 rounded outline-none uppercase"
          placeholder="Enter ICAO (e.g. LGAV)"
        />
        <button class="bg-green-700 text-black px-4 py-2 rounded font-bold">Load</button>
        <!-- Runway selector moved here -->
        <div v-if="store.airport?.runways?.length" class="flex-1 min-w-0">
          <select
            v-model="selectedRunway"
            class="bg-gray-900 text-green-400 px-3 py-2 rounded outline-none w-full"
          >
            <option v-for="runway in store.airport.runways" :key="runway.runway" :value="runway">
              {{ runway.runway }} ({{ runway.heading_degrees }}°)
            </option>
          </select>
        </div>
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
    <section class="flex justify-center items-center w-full flex-1 my-8">
      <div class="w-full h-full max-w-3xl aspect-square">
        <WindCompass
          v-if="selectedRunway"
          :runwayHeading="selectedRunway.heading_degrees"
          :runwayName="selectedRunway.runway"
          :windDirection="Number(store.decodedMetar.wind?.degrees)"
          :windSpeed="Number(store.decodedMetar.wind?.speed)"
          :windGust="Number(store.decodedMetar.wind?.gust)"
        />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
