import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCoins, FaGift, FaQuestionCircle, FaLeaf, FaRupeeSign, FaTv, FaCreditCard, FaStar, FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const RewardsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [qrScanned, setQrScanned] = useState(false);
  const [remainingCoins, setRemainingCoins] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Read coins and keep in sync with other tabs / updates
  const fetchCoins = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch('http://localhost:5001/api/coins', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setCoins(data.coins || 0);
          return;
        }
      } catch {}
    }
    const stored = parseInt(localStorage.getItem('greenCoins') || '0', 10);
    setCoins(isNaN(stored) ? 0 : stored);
  }, []);

  useEffect(() => {
    fetchCoins();
    // Listen for storage events to sync coins across tabs
    const handleStorageChange = () => {
      fetchCoins();
    };
    // Refresh coins when page comes into focus (e.g., returning from redeem page)
    const handleFocus = () => {
      fetchCoins();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchCoins]);

  // Refresh coins when navigating back to this page
  useEffect(() => {
    if (location.pathname === '/rewards') {
      fetchCoins();
    }
  }, [location.pathname, fetchCoins]);

  // Define rewards with unique IDs, sorted by cost (lowest to highest)
  const rewards = [
    { id: 'cashback-100', name: '₹100 Cashback', cost: 50, description: 'Get ₹100 cashback directly to your bank account. Instant transfer within 24 hours!' },
    { id: 'jio-hotstar', name: 'JioCinema/Hotstar Subscription', cost: 100, description: 'Enjoy 1 month of premium entertainment with JioCinema or Disney+ Hotstar subscription.' },
    { id: 'cashback-250-premium', name: '₹250 Cashback + Premium Access', cost: 150, description: 'Get ₹250 cashback plus 3 months of premium ESG analytics and investment tools.' },
    { id: 'gift-card-500', name: '₹500 Gift Card', cost: 200, description: 'Redeem a ₹500 gift card from Amazon, Flipkart, or your favorite brand. Your choice!' },
  ];

  const handleRedeem = (reward) => {
    // Double-check that user has enough coins (button should be disabled, but extra safety)
    if (coins < reward.cost) {
      alert(`You need ${reward.cost} GreenCoins to redeem this reward. You currently have ${coins} coins.`);
      return;
    }
    setSelectedReward(reward);
    setShowQRModal(true);
    setQrScanned(false);
    setShowSuccess(false);
  };

  const handleQRScan = useCallback(async () => {
    if (!selectedReward) return;
    
    // Simulate QR code scanning
    setQrScanned(true);
    
    // Wait a moment for scanning animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Deduct coins
    const token = localStorage.getItem('token');
    const coinsToDeduct = selectedReward.cost;
    
    try {
      if (token) {
        try {
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
            setCoins(redeemData.remainingCoins);
          } else {
            // Fallback to localStorage
            const current = parseInt(localStorage.getItem('greenCoins') || '0', 10) || 0;
            const updated = current - coinsToDeduct;
            localStorage.setItem('greenCoins', String(updated));
            setRemainingCoins(updated);
            setCoins(updated);
          }
        } catch (apiError) {
          // Fallback to localStorage
          const current = parseInt(localStorage.getItem('greenCoins') || '0', 10) || 0;
          const updated = current - coinsToDeduct;
          localStorage.setItem('greenCoins', String(updated));
          setRemainingCoins(updated);
          setCoins(updated);
        }
      } else {
        // No token, use localStorage
        const current = parseInt(localStorage.getItem('greenCoins') || '0', 10) || 0;
        const updated = current - coinsToDeduct;
        localStorage.setItem('greenCoins', String(updated));
        setRemainingCoins(updated);
        setCoins(updated);
      }
      
      // Show success animation
      setShowSuccess(true);
    } catch (err) {
      console.error('Error redeeming:', err);
    }
  }, [selectedReward]);

  const closeModal = () => {
    setShowQRModal(false);
    setSelectedReward(null);
    setQrScanned(false);
    setShowSuccess(false);
    fetchCoins(); // Refresh coins
  };

  // Auto-scan QR after modal opens (for demo purposes)
  useEffect(() => {
    if (showQRModal && selectedReward && !qrScanned && !showSuccess) {
      // Auto trigger scan after 2 seconds (simulating QR scan)
      const timer = setTimeout(() => {
        handleQRScan();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showQRModal, selectedReward, qrScanned, showSuccess, handleQRScan]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-500 flex items-center gap-2">
            <FaLeaf /> GreenCoins Rewards
          </h1>
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg border border-green-700">
            <FaCoins className="text-yellow-400" />
            <span className="text-lg font-semibold">{coins}</span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gray-800 rounded-lg p-8 mb-8 text-center">
          <FaCoins className="text-5xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Grow Wealth & Impact with GreenCoins</h2>
          <p className="text-gray-300 mb-6">
            Invest in ESG mutual funds and earn GreenCoins to unlock amazing rewards! Redeem for cashback, subscription vouchers (JioCinema/Hotstar), premium features, and gift cards from Amazon, Flipkart, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className="bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold">💰 Cashback up to ₹500</span>
            <span className="bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold">📺 Entertainment Subscriptions</span>
            <span className="bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold">🎁 Gift Cards</span>
          </div>
          <button
            // onClick={() => navigate('/green-funds')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Earning Rewards
          </button>
        </section>

        {/* How to Earn GreenCoins */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-500 mb-4">How to Earn GreenCoins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <FaCoins className="text-3xl text-green-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Invest in ESG Funds</h3>
              <p className="text-gray-300">
                Earn 10 GreenCoins for every ₹1000 invested in our ESG mutual funds.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <FaLeaf className="text-3xl text-green-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Hold Investments</h3>
              <p className="text-gray-300">
                Earn 5 GreenCoins annually for every ₹1000 held in ESG funds for 12+ months.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <FaGift className="text-3xl text-green-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Refer Friends</h3>
              <p className="text-gray-300">
                Get 50 GreenCoins when a referred friend invests in an ESG fund.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <FaQuestionCircle className="text-3xl text-green-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Learn About ESG</h3>
              <p className="text-gray-300">
                Earn 20 GreenCoins by completing our ESG investment quiz or tutorial.
              </p>
            </div>
          </div>
        </section>

        {/* Rewards Catalog */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-500 mb-4">Redeem Your GreenCoins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {rewards.map((reward) => {
              const canRedeem = coins >= reward.cost;
              // Get icon based on reward type
              const getRewardIcon = () => {
                if (reward.id === 'cashback-100' || reward.id === 'cashback-250-premium') {
                  return <FaRupeeSign className="text-4xl text-green-500" />;
                } else if (reward.id === 'jio-hotstar') {
                  return <FaTv className="text-4xl text-green-500" />;
                } else if (reward.id === 'gift-card-500') {
                  return <FaCreditCard className="text-4xl text-green-500" />;
                }
                return <FaGift className="text-4xl text-green-500" />;
              };

              return (
                <div key={reward.id} className={`bg-gray-800 rounded-lg p-6 border-2 transition-all relative flex flex-col h-full ${
                  canRedeem 
                    ? 'border-transparent hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20' 
                    : 'border-gray-700 opacity-75'
                }`}>
                  {/* Popular badge for middle rewards */}
                  {(reward.id === 'jio-hotstar' || reward.id === 'cashback-250-premium') && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                      <FaStar className="text-xs" /> POPULAR
                    </div>
                  )}
                  
                  {/* Icon - fixed at top */}
                  <div className="text-center mb-4">
                    {getRewardIcon()}
                  </div>
                  
                  {/* Reward Title - fixed position */}
                  <h3 className="text-xl font-bold text-green-400 mb-3 text-center leading-tight">
                    {reward.name}
                  </h3>
                  
                  {/* Coin Cost Badge - fixed position, aligned across all cards */}
                  <div className="mb-4 flex justify-center">
                    <span className="inline-flex items-center gap-2 bg-yellow-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                      <FaCoins className="text-yellow-300" />
                      {reward.cost} GreenCoins
                    </span>
                  </div>
                  
                  {/* Description - flex-grow to push button down */}
                  <div className="flex-grow flex items-center justify-center min-h-[4rem]">
                    <p className="text-gray-300 text-sm leading-relaxed text-center">
                      {reward.description || 'Redeem your GreenCoins for this exclusive reward!'}
                    </p>
                  </div>
                  
                  {/* Button - always at bottom, aligned across all cards */}
                  <div className="mt-4">
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canRedeem}
                      className={`w-full px-4 py-2.5 rounded transition-all font-semibold ${
                        canRedeem
                          ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer hover:scale-105 transform'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canRedeem ? 'Redeem Now' : `Need ${reward.cost - coins} more coins`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-green-500 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-500">How do I earn GreenCoins?</h3>
              <p className="text-gray-300">
                Earn coins by investing in ESG funds, holding investments, referring friends, or completing ESG education modules.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-500">What can I redeem with GreenCoins?</h3>
              <p className="text-gray-300">
                Redeem your GreenCoins for exciting rewards like cashback, subscription vouchers (JioCinema/Hotstar), premium features, and gift cards from popular brands like Amazon and Flipkart.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-500">Do GreenCoins expire?</h3>
              <p className="text-gray-300">
                GreenCoins remain valid as long as your account is active and you maintain ESG investments.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-500">Are rewards taxable?</h3>
              <p className="text-gray-300">
                Rewards like discounts and merchandise may have tax implications. Consult a tax advisor for details.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400">
          <p>© 2025 GreenFund Platform. All rights reserved.</p>
        </footer>
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>

            {!showSuccess ? (
              <>
                {/* QR Code Section */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-green-500 mb-2">Scan QR Code to Redeem</h2>
                  <p className="text-gray-300 text-sm mb-4">
                    Scan this QR code to unlock your reward: <span className="font-semibold text-green-400">{selectedReward.name}</span>
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    {qrScanned ? (
                      <div className="w-64 h-64 flex items-center justify-center">
                        <FaSpinner className="text-6xl text-green-500 animate-spin" />
                      </div>
                    ) : (
                      <QRCodeSVG
                        value={`${selectedReward.id}-${selectedReward.cost}-${Date.now()}`}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    )}
                  </div>
                </div>

                {qrScanned && !showSuccess && (
                  <div className="text-center">
                    <p className="text-green-400 font-semibold animate-pulse mb-4">Scanning QR Code...</p>
                    <p className="text-gray-400 text-xs">Processing your redemption...</p>
                  </div>
                )}

                {!qrScanned && (
                  <div className="text-center mt-4">
                    <p className="text-gray-400 text-sm mb-4">Scan the QR code above with your device</p>
                    <button
                      onClick={handleQRScan}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                    >
                      Simulate Scan (Demo)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Success Animation */}
                <div className="text-center">
                  {/* Confetti Effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="mb-6 relative">
                    <div className="animate-bounce">
                      <FaCheckCircle className="text-7xl text-green-500 mx-auto drop-shadow-lg" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 border-4 border-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-green-500 mb-2 animate-pulse">
                    🎉 Whoa! You Unlocked This! 🎉
                  </h2>
                  
                  <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-lg p-6 mb-6 border-2 border-green-400 shadow-lg">
                    <p className="text-2xl font-bold text-white mb-2">
                      {selectedReward.name}
                    </p>
                    <p className="text-gray-100 text-sm">
                      {selectedReward.description}
                    </p>
                  </div>

                  {/* Remaining Coins */}
                  <div className="bg-yellow-600 bg-opacity-30 rounded-lg p-5 mb-6 border-2 border-yellow-400 shadow-lg">
                    <p className="text-gray-200 mb-2 text-sm font-semibold">Remaining GreenCoins:</p>
                    <div className="flex items-center justify-center gap-2">
                      <FaCoins className="text-yellow-400 text-2xl" />
                      <p className="text-5xl font-bold text-yellow-400">{remainingCoins}</p>
                    </div>
                  </div>

                  <button
                    onClick={closeModal}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all font-semibold w-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🚀 Awesome! Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;