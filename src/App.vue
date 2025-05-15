<script setup>
// Import Vue, Pinia store, and WindCompass component
import { ref, watch } from 'vue'
import { useAwosStore } from './stores/awosStore'
import WindCompass from './components/WindCompass.vue'

// Pinia store instance
const store = useAwosStore()
// ICAO input field
const inputIcao = ref('')
// Loading and data state
const isLoading = ref(false)
const hasData = ref(false)
const errorMessage = ref('')
const lastUpdated = ref('')
// Currently selected runway
const selectedRunway = ref(null)

// Update timestamp for last data fetch
const updateTimestamp = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  lastUpdated.value = `${hours}:${minutes}:${seconds}`
}

// Fetch airport and METAR data for given ICAO
const fetchAirportData = async () => {
  if (inputIcao.value) {
    isLoading.value = true
    errorMessage.value = ''
    store.resetData()
    hasData.value = false
    const icao = inputIcao.value.trim().toUpperCase()
    // Fetch airport info
    const airportSuccess = await store.fetchAirport(icao)
    if (!airportSuccess) {
      errorMessage.value = `Could not find airport data for ICAO: ${icao}`
      isLoading.value = false
      return
    }
    // Set default runway
    if (store.airport?.runways?.length) {
      selectedRunway.value = store.airport.runways[0]
    }
    // Fetch METAR info
    const metarSuccess = await store.fetchMetar(icao)
    isLoading.value = false
    if (!metarSuccess) {
      errorMessage.value = `Could not find weather data for ICAO: ${icao}`
      return
    }
    hasData.value = store.airport && store.metar
    updateTimestamp()
    // Start polling for METAR updates
    if (hasData.value) {
      store.startMetarPolling(icao)
    }
  }
}

// Watch for airport changes to update selected runway
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

// Update timestamp on METAR update
store.$subscribe(() => {
  if (store.metar && hasData.value) {
    updateTimestamp()
  }
})
</script>

<template>
  <main class="min-h-screen h-screen overflow-y-auto bg-black flex flex-col items-center p-3">
    <!-- ICAO input and runway selector -->
    <section class="w-full max-w-6xl mb-4">
      <form
        @submit.prevent="fetchAirportData"
        class="flex flex-wrap gap-2 justify-center items-center w-full"
      >
        <div class="flex flex-wrap gap-2 items-center justify-center">
          <label class="text-green-400 font-bold">ICAO:</label>
          <input
            v-model="inputIcao"
            maxlength="4"
            :disabled="isLoading"
            class="bg-gray-900 text-green-400 px-3 py-2 rounded outline-none uppercase"
            placeholder="Enter ICAO"
            @keyup.enter="fetchAirportData"
          />
          <button
            :disabled="isLoading"
            :class="[
              'px-4 py-2 rounded font-bold flex items-center gap-2',
              isLoading ? 'bg-red-700 text-white' : 'bg-green-700 text-black',
            ]"
            style="min-width: 80px"
          >
            <span
              v-if="isLoading"
              class="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"
            ></span>
            Load
          </button>
        </div>
        <div
          class="flex items-center gap-2 min-w-[180px] flex-1 md:flex-none w-full md:w-auto justify-center"
        >
          <label class="text-green-400 font-bold">RWY:</label>
          <select
            v-model="selectedRunway"
            class="bg-gray-900 text-green-400 px-3 py-2 rounded outline-none w-full"
            :disabled="!store.airport?.runways?.length"
          >
            <option v-if="!store.airport?.runways?.length" disabled value="">No runways</option>
            <option
              v-for="runway in store.airport?.runways || []"
              :key="runway.runway"
              :value="runway"
            >
              {{ runway.runway }}
            </option>
          </select>
        </div>
      </form>
    </section>
    <!-- Welcome or error message -->
    <section
      v-if="!hasData && !isLoading"
      class="w-full max-w-6xl flex-1 flex flex-col items-center justify-center"
    >
      <div
        :class="[
          'text-center p-6 border rounded-lg bg-opacity-30',
          errorMessage
            ? 'text-red-400 border-red-700 bg-gray-900'
            : 'text-green-400 border-green-700 bg-gray-900',
        ]"
      >
        <p v-if="errorMessage" class="text-xl mb-2">Error</p>
        <p v-else class="text-2xl mb-2">Welcome to FS-AWOS</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <p v-else>Enter an airport ICAO code above and click Load to view weather data</p>
      </div>
    </section>
    <!-- Main data display: left METAR, right compass -->
    <div v-if="hasData" class="w-full max-w-6xl flex-1 flex flex-col md:flex-row gap-4 items-start">
      <section class="w-full md:w-1/2">
        <!-- Airport info header -->
        <div class="bg-gray-900 bg-opacity-60 p-3 rounded mb-2 animate-fadeIn">
          <div class="flex justify-between items-center">
            <div class="font-bold text-xl text-green-400">{{ store.airport.airport_icao }}</div>
            <div class="text-green-300">{{ new Date().toLocaleDateString('el-GR') }}</div>
          </div>
          <div class="text-sm text-gray-300">{{ store.airport.airport_name }}</div>
        </div>
        <!-- METAR banner -->
        <div
          class="bg-gray-900 text-gray-300 font-mono px-3 py-2 rounded mb-2 flex justify-between items-center"
        >
          <div>{{ store.metar }}</div>
          <div v-if="lastUpdated" class="text-xs text-green-400">
            Last updated: {{ lastUpdated }}
          </div>
        </div>
        <!-- Weather/airport data table -->
        <div class="p-3 bg-gray-900 rounded">
          <table class="w-full text-gray-300 bg-gray-900 rounded text-md">
            <tbody>
              <!-- Station, time, wind, etc. -->
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
                  {{ store.decodedMetar.visibility?.value }}
                  {{ store.decodedMetar.visibility?.unit }}
                </td>
              </tr>
              <tr>
                <td class="font-bold">Temperature</td>
                <td>
                  {{ store.decodedMetar.temperature }}°C / {{ store.decodedMetar.dewPoint }}°C
                </td>
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
        </div>
      </section>
      <section class="w-full md:w-1/2 bg-gray-900 pb-5">
        <!-- Wind compass visualization -->
        <div class="w-full h-auto">
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
    </div>
    <!-- Footer with GitHub link -->
    <footer
      class="w-full max-w-6xl text-gray-500 text-sm p-2 mt-4 flex flex-wrap text-center items-center gap-2 justify-center"
    >
      <p>FS-AWOS - Metar updates every 15 min.</p>
      <a href="https://github.com/e4rthdog/fs-awos" target="_blank" rel="noopener noreferrer">
        <img src="@/assets/github-mark-white.svg" class="w-5 h-5" />
      </a>
    </footer>
  </main>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}
</style>
