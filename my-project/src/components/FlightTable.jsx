export default function FlightTable({ flights, setSelectedFlight, selectedFlight }) {
  const handleSelect = (flight) => {
    setSelectedFlight(prev => (prev?.Id === flight.Id ? null : flight));
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg overflow-x-auto transition-all">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">Flight List</h2>

      <table className="table-auto w-full border border-gray-300 rounded text-sm">
        <thead>
          <tr className="bg-indigo-100 text-indigo-800">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Aircraft</th>
            <th className="px-4 py-2 border">Reported By</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {flights.map((flight) => {
            const isSelected = selectedFlight?.Id === flight.Id;

            return (
              <tr
                key={flight.Id}
                className={`transition text-center ${
                  isSelected
                    ? 'bg-indigo-50 font-semibold ring-2 ring-indigo-300'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-2 border">{flight.Id}</td>

                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      flight.Type === 'Commercial'
                        ? 'bg-green-100 text-green-700'
                        : flight.Type === 'Special'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {flight.Type}
                  </span>
                </td>

                <td className="px-4 py-2 border">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {flight.AircraftType}
                  </span>
                </td>

                <td className="px-4 py-2 border">{flight.ReportedBy}</td>

                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleSelect(flight)}
                    className={`px-3 py-1 rounded text-white text-xs font-medium transition ${
                      isSelected
                        ? 'bg-gray-500 hover:bg-gray-600'
                        : 'bg-indigo-500 hover:bg-indigo-600'
                    }`}
                  >
                    {isSelected ? 'Unselect' : 'View'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
