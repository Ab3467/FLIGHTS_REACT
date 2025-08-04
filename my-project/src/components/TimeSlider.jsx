import { useEffect, useState, useRef } from "react";

export default function TimeSlider({ flight, setCurrentTime }) {
  const [currentTime, setLocalTime] = useState(null);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const coords = flight?.Coordinates || [];

  useEffect(() => {
    if (coords.length > 0) {
      const start = new Date(coords[0].TimeStamp);
      setLocalTime(start);
      stop();
    }
  }, [coords, flight]);

  useEffect(() => {
    if (currentTime) {
      setCurrentTime?.(currentTime.toISOString());
    }
  }, [currentTime, setCurrentTime]);

  const getStartTime = () =>
    coords.length ? new Date(coords[0].TimeStamp).getTime() : 0;

  const getEndTime = () =>
    coords.length ? new Date(coords[coords.length - 1].TimeStamp).getTime() : 0;

  const play = () => {
    if (intervalRef.current || coords.length < 2) return;

    const endTime = getEndTime();

    intervalRef.current = setInterval(() => {
      setLocalTime((prev) => {
        const next = new Date(prev.getTime() + 1000); // 1 second step
        if (next.getTime() >= endTime) {
          stop();
          return new Date(endTime);
        }
        return next;
      });
    }, 1000); // 1 second real-time pace

    setPlaying(true);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPlaying(false);
  };

  const toggle = () => {
    playing ? stop() : play();
  };

  const handleSliderChange = (e) => {
    const ms = Number(e.target.value);
    const newTime = new Date(ms);
    setLocalTime(newTime);
  };

  return (
    <div className="my-6 bg-white p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-indigo-600">
          Time: {currentTime?.toLocaleTimeString()}
        </h2>
        <button
          onClick={toggle}
          className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <input
        type="range"
        min={getStartTime()}
        max={getEndTime()}
        value={currentTime?.getTime() || getStartTime()}
        onChange={handleSliderChange}
        className="w-full"
        step={1000}
      />

      <div className="flex justify-between text-xs mt-1 text-gray-500">
        <span>
          {new Date(getStartTime()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span>
          {new Date(getEndTime()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Optional flight info */}
      {coords.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {(() => {
            const closest = coords.reduce((prev, curr) =>
              Math.abs(new Date(curr.TimeStamp) - currentTime) <
              Math.abs(new Date(prev.TimeStamp) - currentTime)
                ? curr
                : prev
            );
            return (
              <>
                Position: {closest.Latitude}, {closest.Longitude} | Altitude:{" "}
                {closest.Height} ft | Speed: {closest.Speed} knots
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}