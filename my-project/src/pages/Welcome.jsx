import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold mb-8">Flight Display System</h1>
      <button 
        onClick={() => navigate('/dashboard')}
        className="bg-white text-indigo-600 px-6 py-3 rounded-xl shadow-md hover:bg-gray-200 transition"
      >
        Enter Dashboard
      </button>
    </div>
  );
}
