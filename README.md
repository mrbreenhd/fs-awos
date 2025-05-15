# FS-AWOS (Flight Simulator Automated Weather Observation System)

A Vue.js application that graphically displays airport and METAR weather data for pilots, featuring runway visualization and wind information.

## Features

- Airport search by ICAO code
- Real-time METAR data visualization with automatic updates every 15 minutes
- Two-column responsive layout optimized for desktop and mobile viewing
- Graphical wind/runway heading display using an intuitive compass visualization
- Wind component calculations (headwind/crosswind) with severity indicators
- Detailed weather information with METAR decoding
- Last update timestamp tracking
- Error handling and UI feedback for data fetch failures

## How to Use

1. **Enter an airport ICAO code** (e.g., LGAV, EGLL, KJFK) in the input field
2. **Click "Load"** to fetch airport and weather data
3. **Select a runway** from the dropdown menu to see wind information relative to that runway
4. **View the wind compass display** showing:
   - Runway heading (gray strip)
   - Current wind direction (red arrow)
   - Headwind and crosswind components
5. **Check METAR details** in the data panels for complete weather information

The application automatically shows headwind/crosswind calculations and visually displays the relationship between wind direction and runway heading to help with landing/takeoff decisions.

## Technologies Used

- Vue.js 3 with Composition API
- Pinia for state management
- Tailwind CSS for styling
- METAR-TAF Parser library

## Getting Started

### Prerequisites

- Node.js (version 16+)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/e4rthdog/fs-awos.git
cd fs-awos

# Install dependencies
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Version Information

- Current Version: 1.0.0
- Last Updated: May 2025
- Created by: Flight Simulator AWOS Team

## Copyright

© 2025 FS-AWOS. All rights reserved.
