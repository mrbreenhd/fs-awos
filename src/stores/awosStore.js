import { defineStore } from 'pinia'
import { parseMetar } from 'metar-taf-parser'
import { ref } from 'vue'

// Pinia store for AWOS state and actions
export const useAwosStore = defineStore('awos', () => {
  // State
  const airport = ref({})
  const metar = ref('')
  const decodedMetar = ref({})

  let metarFetchInterval = null

  // Fetch METAR data and decode it
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

  // Fetch airport info (runways, name, etc)
  const fetchAirport = async (icao) => {
    try {
      const response = await fetch(
        `https://apps.estassinos.com/api/fs-core-data-api/airports.php?icao=${icao}`,
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

  // Reset all state and clear polling
  const resetData = () => {
    airport.value = {}
    metar.value = ''
    decodedMetar.value = {}
    if (metarFetchInterval) {
      clearInterval(metarFetchInterval)
      metarFetchInterval = null
    }
  }

  // Start polling for METAR updates every 15 minutes
  const startMetarPolling = (icao) => {
    if (metarFetchInterval) {
      clearInterval(metarFetchInterval)
    }
    metarFetchInterval = setInterval(async () => {
      const success = await fetchMetar(icao)
      if (success) {
        // Trigger reactivity for UI updates
        airport.value = { ...airport.value }
      }
    }, 60000 * 15)
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
