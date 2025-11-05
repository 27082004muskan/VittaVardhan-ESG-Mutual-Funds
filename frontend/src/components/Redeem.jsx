import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowLeft, FaLeaf } from 'react-icons/fa';

const RedemptionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reward } = location.state || {};

  // Debug log to verify reward data
  console.log('Received reward in RedemptionScreen:', reward);

  // Fallback if reward data is missing
  if (!reward || !reward.name || !reward.cost) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-500 mb-4">Error: No reward selected.</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Back to Rewards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="max-w-lg w-full bg-gray-800 rounded-lg p-8 text-center">
        {/* Success Icon */}
        <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />

        {/* Success Message */}
        <h2 className="text-2xl font-semibold text-green-500 mb-4">
          Reward Redeemed Successfully!
        </h2>
        <p className="text-gray-300 mb-6">
          You have successfully redeemed <span className="font-bold">{reward.name}</span> for{' '}
          <span className="font-bold">{reward.cost}</span> GreenCoins.
        </p>

        {/* Reward Details */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-gray-200">
            {reward.name === '₹500 Investment Discount' && 'Use this discount on your next ESG fund investment.'}
            {reward.name === 'ESG Analytics' && 'Access premium ESG analytics for the next 3 months.'}
            {reward.name === 'Sustainable Merch' && 'Your eco-friendly tote bag or water bottle will be shipped soon.'}
            {reward.name === 'Charity Donation' && '₹250 has been donated to a renewable energy project.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Rewards
          </button>
          <button
            onClick={() => navigate('/features')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaLeaf /> Explore More ESG Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedemptionScreen;