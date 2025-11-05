import  { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SustainabilityScore = () => {
  const [formData, setFormData] = useState({
    carbonFootprint: 0,
    renewableEnergyUsage: 0,
    socialImpactScore: 0,
    governanceScore: 0,
  });
  const [greenScore, setGreenScore] = useState(null);

  const calculateGreenScore = () => {
    const score = (
      formData.renewableEnergyUsage * 0.4 +
      formData.socialImpactScore * 0.3 +
      formData.governanceScore * 0.3 -
      formData.carbonFootprint * 0.2
    );
    setGreenScore(score.toFixed(2));
  };

  const chartData = {
    labels: ['Carbon Footprint', 'Renewable Energy Usage', 'Social Impact Score', 'Governance Score'],
    datasets: [
      {
        data: [
          formData.carbonFootprint,
          formData.renewableEnergyUsage,
          formData.socialImpactScore,
          formData.governanceScore,
        ],
        backgroundColor: ['#ff6b6b', '#51cf66', '#339af0', '#845ef7'],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Company Green Score Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Carbon Footprint (kg CO₂)</label>
            <input
              type="number"
              value={formData.carbonFootprint}
              onChange={(e) => setFormData({ ...formData, carbonFootprint: Number(e.target.value) })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              min="0"
              max="500"
            />
          </div>

          <div>
            <label className="block mb-2">Renewable Energy Usage (%)</label>
            <input
              type="number"
              value={formData.renewableEnergyUsage}
              onChange={(e) => setFormData({ ...formData, renewableEnergyUsage: Number(e.target.value) })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block mb-2">Social Impact Score (0-100)</label>
            <input
              type="number"
              value={formData.socialImpactScore}
              onChange={(e) => setFormData({ ...formData, socialImpactScore: Number(e.target.value) })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block mb-2">Governance Score (0-100)</label>
            <input
              type="number"
              value={formData.governanceScore}
              onChange={(e) => setFormData({ ...formData, governanceScore: Number(e.target.value) })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              min="0"
              max="100"
            />
          </div>

          <button
            onClick={calculateGreenScore}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Calculate Green Score
          </button>

          {greenScore && (
            <div className="mt-4 p-4 bg-green-500 bg-opacity-20 rounded">
              <h3 className="text-xl font-semibold">Green Score: {greenScore}</h3>
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl font-semibold mb-4">ESG Factor Distribution</h3>
          <Pie data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default SustainabilityScore; 