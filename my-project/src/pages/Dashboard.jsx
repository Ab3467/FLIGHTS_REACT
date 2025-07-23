import { useEffect, useState } from "react";
import Filters from "../components/Filters";
import FlightTable from "../components/FlightTable";
import MapDisplay from "../components/MapDisplay";
import FlightGraph from "../components/FlightGraph";
import TimeSlider from "../components/TimeSlider";

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [currentTime, setCurrentTime] = useState(null); // ✅ synced time
  const [filters, setFilters] = useState({
    Type: "",
    AircraftType: "",
    ReportedBy: "",
  });
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    fetch("/flights.json")
      .then((res) => res.json())
      .then((data) => setFlights(data.Flights));
  }, []);

  const filteredFlights = flights.filter(
    (f) =>
      (!filters.Type || f.Type === filters.Type) &&
      (!filters.AircraftType || f.AircraftType === filters.AircraftType) &&
      (!filters.ReportedBy || f.ReportedBy === filters.ReportedBy)
  );

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-600">Flight Dashboard</h1>

      <Filters filters={filters} setFilters={setFilters} />

      <button
        onClick={() => setShowTable(!showTable)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
      >
        {showTable ? "Hide Flight List" : "Show Flight List"}
      </button>

      {showTable && (
        <FlightTable
          flights={filteredFlights}
          setSelectedFlight={setSelectedFlight}
          selectedFlight={selectedFlight}
        />
      )}

      <MapDisplay
        flights={filteredFlights}
        selectedFlight={selectedFlight}
        currentTime={currentTime}
      />

      {selectedFlight && (
        <>
          <TimeSlider flight={selectedFlight} setCurrentTime={setCurrentTime} />
          <FlightGraph flight={selectedFlight} />
        </>
      )}
    </div>
  );
}
