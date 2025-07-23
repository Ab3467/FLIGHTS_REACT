import { MapContainer, TileLayer, Polyline, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';

const colorMap = {
  Commercial: 'green',
  Special: 'red',
  Unknown: 'yellow',
};

const iconMap = {
  Aeroplane: '✈️',
  Helicopter: '🚁',
  Fighter: '🛩️',
};

export default function MapDisplay({ flights = [], selectedFlight = null, currentTime = null }) {
  const center = [31.2, 71.4];

  const getClosestCoord = (coords, time) => {
    if (!time) return coords[coords.length - 1];
    return (
      coords.reduce((prev, curr) =>
        Math.abs(new Date(curr.TimeStamp) - new Date(time)) <
        Math.abs(new Date(prev.TimeStamp) - new Date(time))
          ? curr
          : prev
      ) || coords[coords.length - 1]
    );
  };

  return (
    <div className="h-[550px] rounded shadow border overflow-hidden">
      <MapContainer center={center} zoom={7} scrollWheelZoom className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {(selectedFlight ? [selectedFlight] : flights).map((flight) => {
          if (!flight.Coordinates || flight.Coordinates.length < 2) return null;

          const coords = flight.Coordinates.map(c => [c.Latitude, c.Longitude]);
          const first = flight.Coordinates[0];
          const last = flight.Coordinates[flight.Coordinates.length - 1];
          const pathColor = selectedFlight ? 'blue' : (colorMap[flight.Type] || 'gray');
          const icon = new L.DivIcon({
            html: `<div style="font-size: 22px;">${iconMap[flight.AircraftType] || '🛫'}</div>`,
            className: 'custom-flight-icon',
          });

          const movingCoord = getClosestCoord(flight.Coordinates, currentTime);

          return (
            <React.Fragment key={flight.Id}>
              <Polyline
                positions={coords}
                pathOptions={{
                  color: pathColor,
                  weight: 6,
                  opacity: 0.85,
                  dashArray: selectedFlight ? null : '6',
                }}
              >
                <Tooltip sticky>
                  <div className="text-sm leading-tight">
                    <strong>Flight {flight.Id}</strong><br />
                    From: {first.Latitude.toFixed(3)}, {first.Longitude.toFixed(3)}<br />
                    To: {last.Latitude.toFixed(3)}, {last.Longitude.toFixed(3)}<br />
                    Type: {flight.Type}<br />
                    <span className="text-gray-500 text-xs">
                      Start: {first.TimeStamp}<br />
                      End: {last.TimeStamp}
                    </span>
                  </div>
                </Tooltip>
              </Polyline>

              <Marker position={[movingCoord.Latitude, movingCoord.Longitude]} icon={icon}>
                <Tooltip direction="right">
                  <div className="text-xs leading-tight">
                    <strong>Flight {flight.Id}</strong><br />
                    Type: {flight.Type}<br />
                    Aircraft: {flight.AircraftType}<br />
                    Time: {movingCoord.TimeStamp}
                  </div>
                </Tooltip>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
