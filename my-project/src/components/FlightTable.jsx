import React from 'react';

export default function FlightTable({ flights, setSelectedFlight, selectedFlight }) {
  const handleSelect = (flight) => {
    setSelectedFlight((prev) => (prev?.Id === flight.Id ? null : flight));
  };

  const cleanReportedBy = (reportedBy) => {
    const value = reportedBy?.trim().toLowerCase();
    if (value.includes('pilot')) return 'Pilot report';
    if (value.includes('station')) return 'Radar station';
    return 'Unknown';
  };

  return (
    <div className="bg-[#f9fafb] p-6 shadow-xl rounded-2xl overflow-x-auto border border-gray-200">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">📋 Flight List</h2>

      <table className="w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr className="text-gray-600 text-left bg-white">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Aircraft</th>
            <th className="px-4 py-3">Reported By</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {flights.map((flight) => {
            const isSelected = selectedFlight?.Id === flight.Id;
            const reportedBy = cleanReportedBy(flight.ReportedBy);

            return (
              <tr
                key={flight.Id}
                className={`rounded-lg bg-white shadow-sm transition-all ${
                  isSelected ? 'ring-2 ring-indigo-400' : 'hover:ring-1 hover:ring-indigo-100'
                }`}
              >
                <td className="px-4 py-3">{flight.Id}</td>

                <td className="px-4 py-3">
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

                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {flight.AircraftType}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="text-gray-700 font-medium">{reportedBy}</span>
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => handleSelect(flight)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shadow-sm ${
                      isSelected
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
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
