import { defineStore } from 'pinia'
import { parseMetar } from 'metar-taf-parser'
import { ref } from 'vue'

export const useAwosStore = defineStore('awos', () => {
  const icaoAirport = ref('')
  const airport = ref({})
  const metar = ref('')
  const decodedMetar = ref({})
  const selectedRunway = ref('')

  let metarFetchInterval = null

  // Actions
  const fetchMetar = async (icao) => {
    const response = await fetch(`https://metar.vatsim.net/metar.php?id=${icao}`)
    const data = await response.text()
    metar.value = data
    decodedMetar.value = parseMetar(data)
  }

  const fetchAirport = async (icao) => {
    const response = await fetch(
      `https://apps.estassinos.com/api/fs-core-data-api/airports.php?key=soulis&icao=${icao}`,
    )
    const data = await response.json()
    airport.value = data
  }

  const startMetarPolling = (icao) => {
    if (metarFetchInterval) {
      clearInterval(metarFetchInterval)
    }
    metarFetchInterval = setInterval(() => {
      fetchMetar(icao)
    }, 60000) // Fetch every 60 seconds
  }
  return {
    icaoAirport,
    airport,
    metar,
    decodedMetar,
    selectedRunway,
    fetchMetar,
    fetchAirport,
    startMetarPolling,
  }
})
