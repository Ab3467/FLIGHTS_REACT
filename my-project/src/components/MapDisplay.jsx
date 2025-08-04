import React from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Interpolate aircraft position
function getInterpolatedPosition(coords, time) {
  if (!time || coords.length < 2) return coords[0];
  const targetTime = new Date(time).getTime();

  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const currTime = new Date(curr.TimeStamp).getTime();
    const nextTime = new Date(next.TimeStamp).getTime();

    if (targetTime >= currTime && targetTime <= nextTime) {
      const progress = (targetTime - currTime) / (nextTime - currTime);
      const lat = curr.Latitude + (next.Latitude - curr.Latitude) * progress;
      const lng = curr.Longitude + (next.Longitude - curr.Longitude) * progress;
      const height = curr.Height + (next.Height - curr.Height) * progress;

      return {
        Latitude: lat,
        Longitude: lng,
        Height: height,
        TimeStamp: targetTime,
        Prev: curr,
        Next: next,
      };
    }
  }

  return coords[coords.length - 1];
}

// Calculate bearing angle from point A to B
function calculateBearing(lat1, lng1, lat2, lng2) {
  const toRad = deg => (deg * Math.PI) / 180;
  const toDeg = rad => (rad * 180) / Math.PI;

  const dLon = toRad(lng2 - lng1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export default function MapDisplay({ flights = [], selectedFlight = null, currentTime = null }) {
  const center = [31.2, 71.4];

  return (
    <div className="h-[550px] rounded shadow border overflow-hidden">
      <MapContainer center={center} zoom={7} scrollWheelZoom className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {(selectedFlight ? [selectedFlight] : flights).map((flight, index) => {
          if (!flight.Coordinates || flight.Coordinates.length < 2) return null;

          const coords = flight.Coordinates.map(c => [
            c.Latitude + index * 0.01,
            c.Longitude + index * 0.01,
          ]);

          const first = flight.Coordinates[0];
          const last = flight.Coordinates[flight.Coordinates.length - 1];
          const pathColor = selectedFlight ? 'blue' : (colorMap[flight.Type] || 'gray');

          const movingCoord = getInterpolatedPosition(flight.Coordinates, currentTime);
          const offsetLat = movingCoord.Latitude + index * 0.01;
          const offsetLng = movingCoord.Longitude + index * 0.01;

          // Calculate direction towards next point
          let bearing = 0;
          if (movingCoord.Next) {
            bearing = calculateBearing(
              movingCoord.Latitude,
              movingCoord.Longitude,
              movingCoord.Next.Latitude,
              movingCoord.Next.Longitude
            );
          }

          const icon = new L.DivIcon({
            html: `<div style="
              font-size: 24px;
              transform: rotate(${bearing}deg);
              display: inline-block;
            ">${iconMap[flight.AircraftType] || '🛫'}</div>`,
            className: 'custom-flight-icon',
          });

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

              <Marker position={[offsetLat, offsetLng]} icon={icon}>
                <Tooltip direction="right">
                  <div className="text-xs leading-tight">
                    <strong>Flight {flight.Id}</strong><br />
                    Type: {flight.Type}<br />
                    Aircraft: {flight.AircraftType}<br />
                    Time: {new Date(movingCoord.TimeStamp).toLocaleTimeString()}
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
