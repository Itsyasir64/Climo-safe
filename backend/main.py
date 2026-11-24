
"""Climo-Safe FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI(
    title="Climo-Safe API",
    description="Climate Awareness and Environmental Protection Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to Climo-Safe API",
        "status": "Running"
    }


# Climate endpoint
@app.get("/api/climate")
def climate_data():
    return {
        "temperature": 28,
        "co2_level": 421,
        "air_quality": "Moderate",
        "location": "Lahore, Pakistan"
    }


# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "Climo-Safe"
    }
