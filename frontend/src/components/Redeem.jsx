import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowLeft, FaLeaf, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const RedemptionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reward } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [remainingCoins, setRemainingCoins] = useState(0);

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

  // Handle redemption on component mount
  useEffect(() => {
    const redeemReward = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const coinsToDeduct = reward.cost;

      try {
        if (token) {
          // Try backend API first
          try {
            // Check current balance
            const balanceRes = await fetch('http://localhost:5001/api/coins', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const balanceData = await balanceRes.json();

            if (balanceData.success && balanceData.coins >= coinsToDeduct) {
              // Deduct coins via API
              const redeemRes = await fetch('http://localhost:5001/api/coins/redeem', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ coins: coinsToDeduct })
              });

              const redeemData = await redeemRes.json();
              if (redeemData.success) {
                setRemainingCoins(redeemData.remainingCoins);
                setSuccess(true);
                setLoading(false);
                return;
              } else {
                throw new Error(redeemData.message || 'Failed to redeem');
              }
            } else {
              throw new Error('Insufficient coins');
            }
          } catch (apiError) {
            // Fallback to localStorage if API fails
            const current = parseInt(localStorage.getItem('greenCoins') || '0', 10) || 0;
            if (current >= coinsToDeduct) {
              const updated = current - coinsToDeduct;
              localStorage.setItem('greenCoins', String(updated));
              setRemainingCoins(updated);
              setSuccess(true);
              setLoading(false);
              return;
            } else {
              throw new Error('Insufficient coins');
            }
          }
        } else {
          // No token, use localStorage
          const current = parseInt(localStorage.getItem('greenCoins') || '0', 10) || 0;
          if (current >= coinsToDeduct) {
            const updated = current - coinsToDeduct;
            localStorage.setItem('greenCoins', String(updated));
            setRemainingCoins(updated);
            setSuccess(true);
            setLoading(false);
            return;
          } else {
            throw new Error('Insufficient coins');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to redeem reward');
        setLoading(false);
      }
    };

    redeemReward();
  }, [reward]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="max-w-lg w-full bg-gray-800 rounded-lg p-8 text-center">
          <FaSpinner className="text-5xl text-green-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-semibold text-green-500 mb-4">Processing Redemption...</h2>
          <p className="text-gray-300">Please wait while we process your reward.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="max-w-lg w-full bg-gray-800 rounded-lg p-8 text-center">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Redemption Failed</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/rewards')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaArrowLeft /> Back to Rewards
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
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
            You have successfully redeemed <span className="font-bold text-green-400">{reward.name}</span> for{' '}
            <span className="font-bold text-yellow-400">{reward.cost} GreenCoins</span>.
          </p>

          {/* Remaining Coins */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-200 mb-2">Remaining GreenCoins:</p>
            <p className="text-2xl font-bold text-yellow-400">{remainingCoins}</p>
          </div>

          {/* Reward Details */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-200 mb-2 font-semibold">What's Next?</p>
            <p className="text-gray-200">
              {reward.name === '₹100 Cashback' && 'Your ₹100 cashback will be processed and transferred to your registered bank account within 24 hours. Check your email for confirmation!'}
              {reward.name === 'JioCinema/Hotstar Subscription' && 'You will receive your subscription voucher code via email within 2 hours. Activate it on JioCinema or Disney+ Hotstar and enjoy unlimited entertainment!'}
              {reward.name === '₹250 Cashback + Premium Access' && 'Your ₹250 cashback will be processed within 24 hours. Premium ESG analytics and investment tools are now active in your account for 3 months!'}
              {reward.name === '₹500 Gift Card' && 'You will receive a gift card voucher code via email within 2 hours. Choose from Amazon, Flipkart, or other partner brands. Happy shopping!'}
              {!['₹100 Cashback', 'JioCinema/Hotstar Subscription', '₹250 Cashback + Premium Access', '₹500 Gift Card'].includes(reward.name) && 
                (reward.description || 'Your reward will be processed and delivered to you soon. Check your email for details!')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/rewards')}
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
  }

  return null;
};

export default RedemptionScreen;