import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAwosStore = defineStore('awos', () => {
  const icaoAirport = ref('')
  const airport = ref('')
  const metar = ref('')
  const selectedRunway = ref('')

  // Actions
  const fetchMetar = async (icao) => {
    const response = await fetch(`https://metar.vatsim.net/metar.php?id=${icao}`)
    const data = await response.text()
    metar.value = data
  }

  const fetchAirport = async (icao) => {
    const response = await fetch(
      `https://apps.estassinos.com/api/fs-core-data-api/airports.php?key=soulis&icao=${icao}`,
    )
    const data = await response.json()
    if (data && data.length > 0) {
      airport.value = data[0]
    } else {
      airport.value = null
    }
  }
  return {
    icaoAirport,
    airport,
    metar,
    selectedRunway,
    fetchMetar,
    fetchAirport,
  }
})
