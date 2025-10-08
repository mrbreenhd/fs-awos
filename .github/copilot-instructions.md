# Guidelines

- Use conventional commit message format.Always use the imperative mood in the subject line. Do not capitalize the first letter of the subject line. Do not end the subject line with a period.Reference issues and pull requests liberally.
- Always use the standard labels for git commit messages.
- No description in the commit message body.
- DO NOT add explanatory text below the first line. Keep the git commit messages in one line.
- Keep git commit messages concise
- Do not show all the code that you propose, onlynthe important parts and keep it short
- The application will be written with VUE framework. Use all the best practices from VUE. Use Composition API and VUE 3.
- Use Pinia for state management.
- Use official VUE documentation for all the VUE features.
- Use official TAILWIND documentation for all the TAILWIND features.
- When providing code examples:
  - Show only key snippets that illustrate core concepts (5-15 lines maximum)
  - Focus on architecture and patterns rather than full implementations, unless asked
- DO NOT use typescript.
- Treat me like i am a junior software engineer. Provide step by step instructions in short form and DO NOT expand too much.

# Project Description

- The project purpose is to graphically show a choosen airport with its relative metar data.
- The project will use 2 APIs to get the info required.
- The first API is to get the metar information for an airport.
- METAR API URL: https://metar.vatsim.net/metar.php?id=LGAV

METAR API RESPONSE:

```
LGAV 131320Z 04015KT 9999 FEW025 SCT070 21/10 Q1012 NOSIG
```

- The second API is to get the airport information data with runwy info and runway heading info.

AIRPORT API RESPONSE:

```json
{
  "airport_icao": "LGAV",
  "airport_name": "Athens Eleftherios Venizelos International Airport",
  "runways": [
    {
      "runway": "03L",
      "heading_degrees": 30
    },
    {
      "runway": "03R",
      "heading_degrees": 30
    },
    {
      "runway": "21L",
      "heading_degrees": 210
    },
    {
      "runway": "21R",
      "heading_degrees": 210
    }
  ]
}
```

## UI Considerations

The UI should be responsive and similar to an aviation weather observation system (AWOS) display with:

## Header section showing:

Airport ICAO code
Current date/time
Elapsed time information

## Weather data panels displaying:

- Pressure readings in both hPa and inHg
- Temperature (°C and °F)
- Dew point (°C and °F)
- Transition altitude/height (in feet)
- Transition level
- Density altitude
- Visibility (in Km)
- Cloud information (FEW, SCT with height in feet)
- METAR information displayed in a highlighted banner

## Runway information section showing:

- Selected runway (e.g., "RWY 03L")
- Runway elevation
- Wind direction visualization with:

## A circular compass display showing:

- Runway heading (displayed as a fixed reference)
- Wind direction (shown as a movable arrow/indicator)
- Degree markings (0-360°)
- Current wind heading in digital format (e.g., "030°")
- Wind speed value (e.g., "14kt")

## Controls to switch between runways

- Possibly tabs or sections for additional information
- The primary focus should be the visual relationship between runway heading and wind direction, clearly displaying crosswind component information for pilots.
