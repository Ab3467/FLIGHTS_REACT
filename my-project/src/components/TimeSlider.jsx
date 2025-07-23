import { useEffect, useState, useRef } from 'react';

export default function TimeSlider({ flight, setCurrentTime }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  const coords = flight?.Coordinates || [];
  const current = coords[index];

  useEffect(() => {
    setIndex(0); // Reset when flight changes
    stop();
  }, [flight]);

  useEffect(() => {
    setCurrentTime?.(current?.TimeStamp);
  }, [current?.TimeStamp, setCurrentTime]);

  const play = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        if (prev >= coords.length - 1) {
          stop();
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
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

  return (
    <div className="my-6 bg-white p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-indigo-600">
          Flight Time: {current?.TimeStamp}
        </h2>
        <button
          onClick={toggle}
          className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600 transition"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={coords.length - 1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="w-full"
      />

      <div className="mt-2 text-sm text-gray-600">
        Position: {current?.Latitude}, {current?.Longitude} | Altitude: {current?.Height} ft | Speed: {current?.Speed} knots
      </div>
    </div>
  );
}
