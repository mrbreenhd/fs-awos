<template>
  <svg
    width="400"
    height="480"
    viewBox="-40 -40 480 600"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Compass Background -->
    <circle cx="200" cy="200" r="150" fill="#1e1e1e" stroke="#444" stroke-width="4" />

    <!-- Tick Marks -->
    <g stroke="#888" stroke-width="2">
      <g v-for="angle in majorAngles" :key="'tick-' + angle">
        <line x1="200" y1="50" x2="200" y2="60" :transform="'rotate(' + angle + ' 200 200)'" />
      </g>
    </g>

    <!-- Tick Labels -->
    <g font-size="12" fill="#0f0" font-family="monospace">
      <text
        v-for="angle in majorAngles"
        :key="'label-' + angle"
        :x="labelX(angle)"
        :y="labelY(angle)"
        text-anchor="middle"
        alignment-baseline="middle"
      >
        {{ angle.toString().padStart(3, '0') }}
      </text>
    </g>

    <!-- Runway Strip -->
    <rect
      x="190"
      y="100"
      width="20"
      height="200"
      fill="#444"
      :transform="'rotate(' + runwayHeading + ' 200 200)'"
    />

    <!-- Runway Name (Top) -->
    <text
      x="200"
      y="115"
      font-size="20"
      text-anchor="middle"
      fill="#0f0"
      stroke="black"
      stroke-width="0.5"
      :transform="'rotate(' + runwayHeading + ' 200 200)'"
    >
      {{ runwayName }}
    </text>

    <!-- Opposite Runway (Bottom) -->
    <text
      x="200"
      y="285"
      font-size="20"
      text-anchor="middle"
      fill="#0f0"
      stroke="black"
      stroke-width="0.5"
      :transform="'rotate(' + runwayHeading + ' 200 200)'"
    >
      {{ oppositeRunway }}
    </text>

    <!-- Wind Arrow and Wind Direction Label -->
    <g :transform="'rotate(' + windDirection + ' 200 200)'">
      <polygon points="200,40 190,20 210,20" fill="red" stroke="black" stroke-width="1" />
      <text x="200" y="5" font-size="18" text-anchor="middle" fill="white">
        {{ windDirection.toString().padStart(3, '0') }}°
      </text>
    </g>

    <!-- Wind Speed and Gust Display -->
    <text x="200" y="215" font-size="20" text-anchor="middle" fill="#0f0" font-family="monospace">
      {{ windSpeed }}{{ gustDisplay }} kt
    </text>

    <!-- Headwind / Crosswind Components -->
    <g font-size="14" font-family="monospace" fill="#0f0">
      <text x="200" y="435" text-anchor="middle">Headwind: {{ headwind.toFixed(1) }} kt</text>
      <text x="200" y="455" text-anchor="middle">
        Crosswind: {{ crosswind.toFixed(1) }} kt {{ crosswindDir }}
      </text>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  runwayHeading: { type: Number, required: true },
  runwayName: { type: String, required: true },
  windDirection: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  windGust: { type: Number, default: null },
})

const majorAngles = computed(() => Array.from({ length: 12 }, (_, i) => i * 30))

const oppositeRunway = computed(() => {
  const opposite = (props.runwayHeading + 180) % 360
  return String(Math.round(opposite / 10)).padStart(2, '0')
})

const toRadians = (deg) => (deg * Math.PI) / 180

const relativeAngle = computed(() => {
  let delta = props.windDirection - props.runwayHeading
  delta = ((delta + 540) % 360) - 180
  return delta
})

const headwind = computed(() => props.windSpeed * Math.cos(toRadians(relativeAngle.value)))

const crosswind = computed(() =>
  Math.abs(props.windSpeed * Math.sin(toRadians(relativeAngle.value))),
)

const crosswindDir = computed(() => {
  const dir = relativeAngle.value
  if (dir === 0 || dir === 180) return ''
  return dir > 0 ? '(from right)' : '(from left)'
})

const hasGust = computed(() => props.windGust && props.windGust > props.windSpeed)

const gustDisplay = computed(() => (hasGust.value ? `G${props.windGust}` : ''))

const labelRadius = 135
const labelX = (angle) => {
  const rad = toRadians(angle)
  return 200 + labelRadius * Math.sin(rad)
}
const labelY = (angle) => {
  const rad = toRadians(angle)
  return 200 - labelRadius * Math.cos(rad)
}
</script>

<style scoped>
svg {
  overflow: visible;
}
</style>
