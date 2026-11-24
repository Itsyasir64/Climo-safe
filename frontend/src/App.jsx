
import { useEffect, useState } from "react";

function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/climate")
            .then((response) => {
                if (!response.ok) throw new Error("API request failed");
                return response.json();
            })
            .then(setData)
            .catch(() => setError("Unable to connect to backend"));
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10">
            <h1 className="text-4xl font-bold text-green-400">
                Climo-Safe
            </h1>

            <p className="mt-3 text-slate-400">
                Climate Awareness & Environmental Protection
            </p>

            <div className="mt-10 rounded-2xl bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                    Climate Information
                </h2>

                {error && <p className="mt-4 text-red-400">{error}</p>}

                {!data && !error && <p className="mt-4">Loading...</p>}

                {data && (
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-800 p-5">
                            <p className="text-slate-400">Temperature</p>
                            <h3 className="mt-2 text-3xl text-green-400">
                                {data.temperature}°C
                            </h3>
                        </div>

                        <div className="rounded-xl bg-slate-800 p-5">
                            <p className="text-slate-400">CO₂ Level</p>
                            <h3 className="mt-2 text-3xl text-green-400">
                                {data.co2_level} ppm
                            </h3>
                        </div>

                        <div className="rounded-xl bg-slate-800 p-5">
                            <p className="text-slate-400">Air Quality</p>
                            <h3 className="mt-2 text-3xl text-green-400">
                                {data.air_quality}
                            </h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
