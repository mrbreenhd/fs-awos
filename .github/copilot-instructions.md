# Guidelines

- Always use the standard labels for git commit messages.
- Do not show all the code that you propose, onlynthe important parts and keep it short
- The application will be written with VUE framework. Use all the best practices from VUE.

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
