import { defineStore } from 'pinia'
import { parseMetar } from 'metar-taf-parser'
import { ref } from 'vue'

export const useAwosStore = defineStore('awos', () => {
  const airport = ref({})
  const metar = ref('')
  const decodedMetar = ref({})

  let metarFetchInterval = null

  // Actions
  const fetchMetar = async (icao) => {
    try {
      const response = await fetch(`https://metar.vatsim.net/metar.php?id=${icao}`)
      const data = await response.text()
      if (data && !data.includes('Error')) {
        metar.value = data
        decodedMetar.value = parseMetar(data)
        return true
      }
      return false
    } catch (error) {
      console.error('Error fetching METAR:', error)
      return false
    }
  }

  const fetchAirport = async (icao) => {
    try {
      const response = await fetch(
        `https://apps.estassinos.com/api/fs-core-data-api/airports.php?key=soulis&icao=${icao}`,
      )
      const data = await response.json()
      airport.value = data
      return true
    } catch (error) {
      console.error('Error fetching airport data:', error)
      airport.value = {}
      return false
    }
  }

  const resetData = () => {
    airport.value = {}
    metar.value = ''
    decodedMetar.value = {}

    // Clear any existing polling interval
    if (metarFetchInterval) {
      clearInterval(metarFetchInterval)
      metarFetchInterval = null
    }
  }

  const startMetarPolling = (icao) => {
    if (metarFetchInterval) {
      clearInterval(metarFetchInterval)
    }
    metarFetchInterval = setInterval(async () => {
      const success = await fetchMetar(icao)
      if (success) {
        // We can use this to update the lastUpdated timestamp in the UI
        // The $patch call will trigger any store.subscribe listeners
        airport.value = { ...airport.value }
      }
    }, 60000) // Fetch every 60 seconds
  }

  return {
    airport,
    metar,
    decodedMetar,
    fetchMetar,
    fetchAirport,
    startMetarPolling,
    resetData,
  }
})
