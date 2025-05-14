<template>
  <svg
    class="w-full h-full"
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
    <g
      font-size="12"
      fill="#d1d5db"
      font-family="'Share Tech Mono', monospace"
      style="letter-spacing: 3px"
    >
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
    <g :transform="'rotate(' + runwayHeading + ' 200 200)'">
      <!-- Main runway surface (black) - made wider -->
      <rect x="185" y="100" width="30" height="200" fill="black" />

      <!-- Runway Centerline (white, dashed) - position unchanged -->
      <line
        x1="200"
        y1="105"
        x2="200"
        y2="295"
        stroke="white"
        stroke-width="1.5"
        stroke-dasharray="15, 10"
      />

      <!-- Runway Edge Lines (white, solid) - adjusted for wider runway -->
      <line x1="186" y1="100" x2="186" y2="300" stroke="white" stroke-width="1" />
      <line x1="214" y1="100" x2="214" y2="300" stroke="white" stroke-width="1" />
    </g>

    <!-- Wind Arrow -->
    <g :transform="'rotate(' + windDirection + ' 200 200)'">
      <polygon points="200,40 190,20 210,20" fill="red" stroke="black" stroke-width="1" />
    </g>

    <!-- Aircraft icon (at runway end) -->
    <g :transform="'rotate(' + (runwayHeading + 180) + ' 200 200)'">
      <!-- Arrow at top end of runway -->
      <g transform="translate(0, 180)">
        <polygon points="200,30 190,0 210,0" fill="yellow" stroke="black" stroke-width="2" />
        <rect x="198" y="0" width="4" height="15" fill="yellow" />
      </g>
    </g>

    <!-- Wind Direction, Speed, and Gust Label (Top Center) -->
    <text
      x="200"
      y="10"
      font-size="18"
      text-anchor="middle"
      fill="#d1d5db"
      font-family="'Share Tech Mono', monospace"
      style="pointer-events: none"
    >
      RWY: {{ runwayName }} - {{ windDirection.toString().padStart(3, '0') }}° / {{ windSpeed
      }}{{ gustDisplay }} kt
    </text>

    <!-- Headwind / Crosswind Components -->
    <g font-size="14" font-family="'Share Tech Mono', monospace" fill="#d1d5db">
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
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
