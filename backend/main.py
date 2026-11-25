
"""Climo-Safe environmental monitoring API."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(
    title="Climo-Safe API",
    description="Climate Awareness and Environmental Protection Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Climo-Safe API",
        "status": "Running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/api/dashboard")
async def dashboard(city: str = "Lahore"):

    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            # Find city coordinates
            geo_response = await client.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params={
                    "name": city,
                    "count": 1,
                    "language": "en",
                    "format": "json"
                }
            )
            geo_response.raise_for_status()

            geo_data = geo_response.json()
            results = geo_data.get("results", [])

            if not results:
                raise HTTPException(
                    status_code=404,
                    detail="City not found"
                )

            place = results[0]
            latitude = place["latitude"]
            longitude = place["longitude"]

            # Get weather information
            weather_response = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": (
                        "temperature_2m,relative_humidity_2m,"
                        "apparent_temperature,is_day,"
                        "precipitation,weather_code,wind_speed_10m"
                    ),
                    "daily": "temperature_2m_max,temperature_2m_min",
                    "forecast_days": 7,
                    "timezone": "auto"
                }
            )
            weather_response.raise_for_status()

            weather = weather_response.json()

            # Get air quality information
            air_response = await client.get(
                "https://air-quality-api.open-meteo.com/v1/air-quality",
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": (
                        "us_aqi,pm2_5,ozone,"
                        "nitrogen_dioxide,carbon_monoxide"
                    ),
                    "timezone": "auto"
                }
            )
            air_response.raise_for_status()

            air = air_response.json()

            return {
                "location": {
                    "name": place["name"],
                    "country": place.get("country", ""),
                    "latitude": latitude,
                    "longitude": longitude
                },
                "weather": weather.get("current", {}),
                "forecast": weather.get("daily", {}),
                "air_quality": air.get("current", {}),
                "units": {
                    "weather": weather.get("current_units", {}),
                    "air_quality": air.get("current_units", {})
                }
            }

        except HTTPException:
            raise

        except httpx.HTTPError as error:
            raise HTTPException(
                status_code=502,
                detail=f"Environmental data service unavailable: {error}"
            ) from error
