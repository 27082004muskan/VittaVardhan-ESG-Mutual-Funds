import { useNavigate } from 'react-router-dom';
import { FaCoins, FaGift, FaQuestionCircle, FaLeaf } from 'react-icons/fa';

const RewardsPage = () => {
  const navigate = useNavigate();

  // Define rewards with unique IDs
  const rewards = [
    { id: 'discount-500', name: '₹500 Investment Discount', cost: 100 },
    { id: 'esg-analytics', name: 'ESG Analytics', cost: 200 },
    { id: 'sustainable-merch', name: 'Sustainable Merch', cost: 150 },
    { id: 'charity-donation', name: 'Charity Donation', cost: 50 },
  ];

  const handleRedeem = (reward) => {
    console.log('Navigating to redeem page with reward:', reward); // Debug log
    navigate(`/redeem/${reward.id}`, { state: { reward } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
   
          <h1 className="text-3xl font-bold text-green-500 flex items-center gap-2">
            <FaLeaf /> GreenCoins Rewards
          </h1>
        </header>

        {/* Hero Section */}
        <section className="bg-gray-800 rounded-lg p-8 mb-8 text-center">
          <FaCoins className="text-5xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Grow Wealth & Impact with GreenCoins</h2>
          <p className="text-gray-300 mb-6">
            Invest in ESG mutual funds and earn GreenCoins to unlock exclusive rewards. Support sustainability while enjoying discounts, premium tools, and eco-friendly perks!
          </p>
          <button
            // onClick={() => navigate('/green-funds')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Collect your Rewards
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-gray-800 rounded-lg p-6 text-center">
                <FaGift className="text-3xl text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">{reward.name}</h3>
                <p className="text-gray-300 mb-4">
                  {reward.name === '₹500 Investment Discount' && 'Redeem 100 GreenCoins for a ₹500 discount on ESG fund investments.'}
                  {reward.name === 'ESG Analytics' && 'Redeem 200 GreenCoins for a 3-month premium ESG analytics subscription.'}
                  {reward.name === 'Sustainable Merch' && 'Redeem 150 GreenCoins for an eco-friendly tote bag or water bottle.'}
                  {reward.name === 'Charity Donation' && 'Redeem 50 GreenCoins to donate ₹250 to an ESG-focused charity.'}
                </p>
                <button
                  onClick={() => handleRedeem(reward)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Redeem Now
                </button>
              </div>
            ))}
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
                Redeem coins for investment discounts, premium ESG analytics, sustainable merchandise, or charitable donations.
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
    </div>
  );
};

export default RewardsPage;