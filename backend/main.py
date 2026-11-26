"""Climo-Safe environmental monitoring API."""

from collections import defaultdict
from time import monotonic

import httpx
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(
    title="Climo-Safe API",
    description="Climate Awareness and Environmental Protection Platform",
    version="1.0.0"
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept", "Content-Type"],
)

_rate_limit_window = 60.0
_rate_limit_requests = 60
_request_timestamps: defaultdict[str, list[float]] = defaultdict(list)


@app.middleware("http")
async def security_middleware(request: Request, call_next):
    """Apply basic API throttling and browser security headers."""
    if request.url.path.startswith("/api/"):
        client_ip = request.client.host if request.client else "unknown"
        now = monotonic()
        recent_requests = [
            timestamp
            for timestamp in _request_timestamps[client_ip]
            if now - timestamp < _rate_limit_window
        ]

        if len(recent_requests) >= _rate_limit_requests:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
                headers={"Retry-After": "60"},
            )

        recent_requests.append(now)
        _request_timestamps[client_ip] = recent_requests

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    return response


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
async def dashboard(
    city: str = Query(
        default="Lahore",
        min_length=1,
        max_length=80,
        pattern=r"^[\w\s.'-]+$",
    )
):

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

        except (httpx.HTTPError, KeyError, TypeError, ValueError):
            raise HTTPException(
                status_code=502,
                detail="Environmental data service unavailable"
            )
