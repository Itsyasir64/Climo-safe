
import { useEffect, useState } from "react";
import {
    Search, Wind, Droplets, Thermometer,
    Activity, Leaf, RefreshCw, MapPin,
    Sun, Cloud, CloudRain, ArrowUpRight,
    Menu, X, Gauge, Globe2
} from "lucide-react";

import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import "./Dashboard.css";

const API = "http://127.0.0.1:8000";

function getAqiLabel(aqi) {
    if (aqi == null) return "Unavailable";
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for sensitive groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very unhealthy";
    return "Hazardous";
}

function weatherIcon(code) {
    if (code === 0) return Sun;
    if ([1, 2, 3].includes(code)) return Cloud;
    if ([45, 48].includes(code)) return Cloud;
    if (code >= 51) return CloudRain;
    return Sun;
}

export default function Dashboard() {
    const [city, setCity] = useState("Lahore");
    const [search, setSearch] = useState("Lahore");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mobileMenu, setMobileMenu] = useState(false);

    async function fetchData(selectedCity) {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API}/api/dashboard?city=${encodeURIComponent(selectedCity)}`
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Unable to load data");
            }

            setData(result);
            setCity(result.location.name);
            setSearch(result.location.name);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData("Lahore");
    }, []);

    const weather = data?.weather;
    const air = data?.air_quality;
    const forecast = data?.forecast;

    const WeatherIcon = weather
        ? weatherIcon(weather.weather_code)
        : Sun;

    const chartData = forecast?.time?.map((date, index) => ({
        day: new Date(date + "T12:00:00").toLocaleDateString(
            "en-US", { weekday: "short" }
        ),
        max: forecast.temperature_2m_max[index],
        min: forecast.temperature_2m_min[index]
    })) || [];

    const cards = [
        {
            title: "Temperature",
            value: weather?.temperature_2m,
            unit: "°C",
            icon: Thermometer,
            description: "Current temperature"
        },
        {
            title: "Air Quality Index",
            value: air?.us_aqi,
            unit: " AQI",
            icon: Wind,
            description: getAqiLabel(air?.us_aqi)
        },
        {
            title: "Humidity",
            value: weather?.relative_humidity_2m,
            unit: "%",
            icon: Droplets,
            description: "Relative humidity"
        },
        {
            title: "PM2.5",
            value: air?.pm2_5,
            unit: " µg/m³",
            icon: Activity,
            description: "Fine particulate matter"
        }
    ];

    function handleSearch(e) {
        e.preventDefault();
        if (search.trim()) fetchData(search.trim());
    }

    return (
        <div className="dashboard">
            <aside className={`dash-sidebar ${mobileMenu ? "show" : ""}`}>
                <a href="/" className="dash-brand">
                    <span className="dash-brand-icon"><Leaf size={22} /></span>
                    <span>climo<span>safe.</span></span>
                </a>

                <p className="sidebar-label">WORKSPACE</p>

                <a href="#overview" className="side-link active">
                    <Activity size={19} /> Overview
                </a>
                <a href="#climate" className="side-link">
                    <Thermometer size={19} /> Climate Monitor
                </a>
                <a href="#air-quality" className="side-link">
                    <Wind size={19} /> Air Quality
                </a>
                <a href="#forecast" className="side-link">
                    <Globe2 size={19} /> Weather Forecast
                </a>

                <div className="sidebar-bottom">
                    <div className="sidebar-tip">
                        <span><SproutIcon /></span>
                        <strong>Go Green!</strong>
                        <p>Small everyday actions can make a big difference.</p>
                        <a href="/#actions">Explore eco actions <ArrowUpRight size={14} /></a>
                    </div>
                    <a href="/" className="back-home">← Back to website</a>
                </div>
            </aside>

            <main className="dash-main" id="overview">
                <header className="dash-header">
                    <div className="dash-header-left">
                        <button
                            className="dash-menu"
                            onClick={() => setMobileMenu(!mobileMenu)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenu ? <X /> : <Menu />}
                        </button>
                        <div>
                            <span className="dash-breadcrumb">WORKSPACE / OVERVIEW</span>
                            <h1>Environmental Dashboard</h1>
                        </div>
                    </div>

                    <form className="city-search" onSubmit={handleSearch}>
                        <MapPin size={17} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search city..."
                            aria-label="Search city"
                        />
                        <button type="submit" aria-label="Search">
                            <Search size={17} />
                        </button>
                    </form>
                </header>

                <section className="welcome-row">
                    <div>
                        <span className="dash-eyebrow">PLANET HEALTH MONITOR</span>
                        <h2>Know your environment.</h2>
                        <p>Explore real-time environmental conditions and climate data.</p>
                    </div>
                    <button
                        className="refresh-button"
                        onClick={() => fetchData(city)}
                        disabled={loading}
                    >
                        <RefreshCw size={16} className={loading ? "spin" : ""} />
                        Refresh data
                    </button>
                </section>

                {error && (
                    <div className="dash-error">
                        {error}. Check your internet connection and try another city.
                    </div>
                )}

                <section className="location-banner">
                    <div className="location-icon"><MapPin size={21} /></div>
                    <div>
                        <span>MONITORING LOCATION</span>
                        <h3>{data ? `${data.location.name}, ${data.location.country}` : city}</h3>
                    </div>
                    <div className="location-status">
                        <span></span> Environmental data
                    </div>
                </section>

                <section className="metric-grid" id="climate">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <article className="metric-card" key={card.title}>
                                <div className="metric-top">
                                    <span>{card.title}</span>
                                    <span className="metric-icon"><Icon size={19} /></span>
                                </div>
                                <h3>
                                    {loading ? "—" : card.value ?? "N/A"}
                                    <small>{card.value != null ? card.unit : ""}</small>
                                </h3>
                                <p>{loading ? "Loading..." : card.description}</p>
                            </article>
                        );
                    })}
                </section>

                <section className="dash-content-grid">
                    <article className="dash-panel forecast-panel" id="forecast">
                        <div className="panel-heading">
                            <div>
                                <span>WEATHER TRENDS</span>
                                <h3>7-day temperature forecast</h3>
                            </div>
                            <span className="panel-icon"><Activity size={20} /></span>
                        </div>

                        {loading ? (
                            <div className="chart-empty">Loading forecast...</div>
                        ) : chartData.length ? (
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#83a83e" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#83a83e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0e9" />
                                        <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="max"
                                            name="Maximum °C"
                                            stroke="#739d37"
                                            strokeWidth={2.5}
                                            fill="url(#maxGradient)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="min"
                                            name="Minimum °C"
                                            stroke="#4a9b9a"
                                            strokeWidth={2}
                                            fill="transparent"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="chart-empty">Forecast unavailable.</div>
                        )}
                    </article>

                    <article className="dash-panel air-panel" id="air-quality">
                        <div className="panel-heading">
                            <div>
                                <span>AIR POLLUTION</span>
                                <h3>Air quality overview</h3>
                            </div>
                            <span className="panel-icon"><Wind size={20} /></span>
                        </div>

                        <div className="aqi-display">
                            <div className="aqi-number">
                                {loading ? "—" : air?.us_aqi ?? "N/A"}
                            </div>
                            <div>
                                <strong>US AQI</strong>
                                <p>{loading ? "Loading..." : getAqiLabel(air?.us_aqi)}</p>
                            </div>
                        </div>

                        <div className="aqi-track">
                            <div style={{
                                width: `${Math.min((air?.us_aqi || 0) / 300 * 100, 100)}%`
                            }}></div>
                        </div>

                        <div className="pollutant-row">
                            <span>PM2.5</span>
                            <strong>{air?.pm2_5 ?? "—"} µg/m³</strong>
                        </div>
                        <div className="pollutant-row">
                            <span>Ozone</span>
                            <strong>{air?.ozone ?? "—"}</strong>
                        </div>
                        <div className="pollutant-row">
                            <span>Nitrogen dioxide</span>
                            <strong>{air?.nitrogen_dioxide ?? "—"}</strong>
                        </div>
                    </article>
                </section>

                <section className="weather-highlight">
                    <div className="weather-icon"><WeatherIcon size={34} /></div>
                    <div className="weather-summary">
                        <span>CURRENT CONDITIONS</span>
                        <h3>{weather?.temperature_2m ?? "—"}°C</h3>
                        <p>Feels like {weather?.apparent_temperature ?? "—"}°C</p>
                    </div>
                    <div className="weather-detail">
                        <Droplets size={20} />
                        <span>Humidity</span>
                        <strong>{weather?.relative_humidity_2m ?? "—"}%</strong>
                    </div>
                    <div className="weather-detail">
                        <Wind size={20} />
                        <span>Wind speed</span>
                        <strong>{weather?.wind_speed_10m ?? "—"} km/h</strong>
                    </div>
                    <div className="weather-detail">
                        <Gauge size={20} />
                        <span>Precipitation</span>
                        <strong>{weather?.precipitation ?? "—"} mm</strong>
                    </div>
                </section>

                <footer className="dash-footer">
                    <span>© {new Date().getFullYear()} Climo-Safe</span>
                    <span>Environmental awareness starts with you. <Leaf size={14} /></span>
                </footer>
            </main>
        </div>
    );
}

function SproutIcon() {
    return <Leaf size={21} />;
}
