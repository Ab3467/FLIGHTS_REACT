import { useState, useRef } from "react";
import Filters from "../components/Filters";
import FlightTable from "../components/FlightTable";
import MapDisplay from "../components/MapDisplay";
import FlightGraph from "../components/FlightGraph";
import TimeSlider from "../components/TimeSlider";

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filters, setFilters] = useState({
    Type: "",
    AircraftType: "",
    ReportedBy: "",
  });

  const [currentTime, setCurrentTime] = useState(null);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setFlights(json.Flights || []);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  // Normalize the ReportedBy value
  const cleanReportedBy = (reportedByRaw) => {
    if (!reportedByRaw || typeof reportedByRaw !== "string") return "Unknown";

    const value = reportedByRaw.toLowerCase();
    if (value.includes("pilot")) return "Pilot report";
    if (value.includes("station")) return "Radar station";
    return "Unknown";
  };

  const filteredFlights = flights.filter(
    (f) =>
      (!filters.Type || f.Type === filters.Type) &&
      (!filters.AircraftType || f.AircraftType === filters.AircraftType) &&
      (!filters.ReportedBy ||
        cleanReportedBy(f.ReportedBy) === filters.ReportedBy)
  );

  const allTimes = filteredFlights.flatMap((f) =>
    f.Coordinates.map((c) => new Date(c.TimeStamp).getTime())
  );

  const minGlobal = Math.min(...allTimes);
  const maxGlobal = Math.max(...allTimes);

  const startPlayback = () => {
    if (intervalRef.current || allTimes.length === 0) return;
    const step = 1000;
    const end = maxGlobal;

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const prevTime = prev ? new Date(prev).getTime() : minGlobal;
        const next = prevTime + step;
        if (next >= end) {
          stopPlayback();
          return new Date(end).toISOString();
        }
        return new Date(next).toISOString();
      });
    }, step);

    setPlaying(true);
  };

  const stopPlayback = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPlaying(false);
  };

  const togglePlayback = () => {
    playing ? stopPlayback() : startPlayback();
  };

  const handleSliderChange = (e) => {
    const newTime = new Date(Number(e.target.value)).toISOString();
    setCurrentTime(newTime);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-600">Flight Dashboard</h1>

      {/* Upload UI */}
      {flights.length === 0 ? (
        <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
          <div className="w-full max-w-2xl p-10 rounded-2xl border border-gray-600 bg-white/5 backdrop-blur-lg shadow-xl text-center transition-all">
            <h2 className="text-3xl font-bold text-white mb-3">
              Upload Flight Data
            </h2>
            <p className="text-sm text-gray-300 mb-8">
              Upload your <code>flights.json</code> file to explore the
              dashboard
            </p>

            <div
              onClick={() => document.getElementById("fileUpload").click()}
              className="border-2 border-dashed border-indigo-400 rounded-xl p-10 cursor-pointer hover:border-indigo-300 hover:bg-indigo-500/10 transition duration-300"
            >
              <div className="flex flex-col items-center space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <p className="text-gray-300 text-base">
                  Drag & drop your file or{" "}
                  <span className="underline text-indigo-300 font-medium">
                    click to upload
                  </span>
                </p>
              </div>
            </div>

            <input
              id="fileUpload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <p className="mt-4 text-xs text-gray-500">
              Accepts <code>.json</code> format only
            </p>
          </div>
        </div>
      ) : (
        <>
          <Filters filters={filters} setFilters={setFilters} />

          <FlightTable
            flights={filteredFlights}
            setSelectedFlight={setSelectedFlight}
            selectedFlight={selectedFlight}
          />

          {!selectedFlight && (
            <div className="bg-white rounded p-4 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-indigo-600">
                  Time:{" "}
                  {currentTime
                    ? new Date(currentTime).toLocaleTimeString()
                    : "--:--:--"}
                </h2>
                <button
                  onClick={togglePlayback}
                  className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600"
                >
                  {playing ? "Pause" : "Play"}
                </button>
              </div>

              <input
                type="range"
                className="w-full"
                min={minGlobal}
                max={maxGlobal}
                value={
                  currentTime ? new Date(currentTime).getTime() : minGlobal
                }
                onChange={handleSliderChange}
                step={1000}
              />

              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>{new Date(minGlobal).toLocaleTimeString()}</span>
                <span>{new Date(maxGlobal).toLocaleTimeString()}</span>
              </div>
            </div>
          )}

          <MapDisplay
            flights={filteredFlights}
            selectedFlight={selectedFlight}
            currentTime={currentTime}
          />

          {selectedFlight && (
            <>
              <TimeSlider
                flight={selectedFlight}
                setCurrentTime={setCurrentTime}
              />
              <FlightGraph flight={selectedFlight} />
            </>
          )}
        </>
      )}
    </div>
  );
}
