import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function FlightGraph({ flight }) {
  const timeLabels = flight.Coordinates.map((c) => new Date(c.TimeStamp).toLocaleTimeString());
  const altitudes = flight.Coordinates.map((c) => c.Height);
  const speeds = flight.Coordinates.map((c) => c.Speed);

  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Altitude (ft)',
        data: altitudes,
        borderColor: 'blue',
        backgroundColor: 'blue',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Speed (knots)',
        data: speeds,
        borderColor: 'orange',
        backgroundColor: 'orange',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Flight ${flight.Id} - Altitude & Speed Over Time`,
        font: { size: 18 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Altitude (ft)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Speed (knots)',
        },
      },
    },
  };

  return (
    <div className="my-6 p-6 border rounded-lg bg-white shadow">
      <Line data={data} options={options} />
    </div>
  );
}
