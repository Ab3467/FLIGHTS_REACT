export default function Filters({ filters, setFilters }) {
  const options = {
    Type: ['Commercial', 'Special', 'Unknown'],
    AircraftType: ['Fighter', 'Helicopter', 'Aeroplane'],
    ReportedBy: ['Pilot report', 'Radar station'], // Matches table values
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-6 bg-[#f9fafb] rounded-xl shadow-xl border border-gray-200">
      {Object.keys(options).map((field) => (
        <div key={field} className="flex flex-col text-sm w-48">
          <label className="mb-2 text-gray-800 font-semibold">{field}</label>
          <select
            value={filters[field]}
            onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          >
            <option value="">All</option>
            {options[field].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
