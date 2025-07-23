export default function Filters({ filters, setFilters }) {
  return (
    <div className="flex gap-4 mb-4">
      {['Type', 'AircraftType', 'ReportedBy'].map(field => (
        <select 
          key={field}
          value={filters[field]}
          onChange={e => setFilters({ ...filters, [field]: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="">{field}</option>
          {['Type', 'AircraftType', 'ReportedBy'].includes(field) && ['Commercial', 'Special', 'Unknown'].map(val => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
