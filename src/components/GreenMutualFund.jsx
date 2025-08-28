import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaChartLine, FaLeaf, FaPercentage, FaRupeeSign, FaInfoCircle, FaCircle } from 'react-icons/fa';

const GreenMutualFund = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFund, setSelectedFund] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Funds');

  // ESG Score Categories
  const esgCategories = [
    { name: 'All Funds', range: null },
    { name: 'Excellent ESG (80+)', range: [80, 100] },
    { name: 'Good ESG (60-79)', range: [60, 79] },
    { name: 'Average ESG (40-59)', range: [40, 59] },
    { name: 'Below Average ESG (<40)', range: [0, 39] }
  ];

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/green-funds');
        setFunds(response.data);
      } catch (error) {
        console.error('Error fetching funds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  const handleFundSelect = async (fund) => {
    setSelectedFund(fund);
    try {
      const response = await axios.get(`http://localhost:5000/api/recommendations/${fund.id}`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedFund(null);
  };

  // Filter funds based on ESG score category
  const filteredFunds = funds.filter(fund => {
    if (selectedCategory === 'All Funds') return true;
    const category = esgCategories.find(cat => cat.name === selectedCategory);
    return category && fund.esgScore >= category.range[0] && fund.esgScore <= category.range[1];
  });

  const getESGScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';    // Excellent
    if (score >= 60) return 'text-blue-400';     // Good
    if (score >= 40) return 'text-yellow-400';   // Average
    return 'text-red-400';                       // Below Average
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-green-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading green mutual funds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header with Additional Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-green-400 flex items-center">
              <FaLeaf className="mr-3" />
              Green Mutual Funds
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search funds..."
                className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className="bg-gray-800 text-white px-4 py-2 rounded-lg">
                <option>Sort by ESG Score</option>
                <option>Sort by Returns</option>
                <option>Sort by Risk Level</option>
              </select>
            </div>
          </div>

          {/* ESG Score Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {esgCategories.map(category => (
              <button 
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === category.name 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 text-white hover:bg-green-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fund List with selection functionality */}
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            {filteredFunds.length > 0 ? (
              filteredFunds.map((fund) => (
                <div 
                  key={fund.id} 
                  onClick={() => handleFundSelect(fund)}
                  className={`p-6 border-b border-gray-700 cursor-pointer transition-colors ${
                    selectedFund?.id === fund.id ? 'bg-gray-700' : 'hover:bg-gray-750'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-semibold">{fund.name}</h4>
                    <div className={`text-lg font-bold ${getESGScoreColor(fund.esgScore)}`}>
                      ESG: {fund.esgScore.toFixed(1)}
                    </div>
                  </div>
                  
                  {/* Enhanced Fund Details */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">AUM</div>
                      <div className="font-semibold">₹{fund.aum.toLocaleString()} Cr</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">Returns (1Y)</div>
                      <div className="font-semibold text-green-400">+{fund.returns?.oneYear || 0}%</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">Risk Level</div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaCircle 
                            key={i}
                            className={`w-2 h-2 mr-1 ${i < fund.riskLevel ? 'text-yellow-500' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-700 p-4 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-400">Carbon Score</div>
                      <div className="font-semibold">{fund.carbonScore || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Sustainability Rating</div>
                      <div className="flex">
                        {[...Array(fund.sustainabilityRating || 0)].map((_, i) => (
                          <FaLeaf key={i} className="text-green-500 mr-1" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400">
                No funds found in this ESG category
              </div>
            )}
          </div>

          {/* Similar Funds Panel */}
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-6">Similar Funds</h3>
              {selectedFund ? (
                <div className="space-y-4">
                  {recommendations.map((fund) => (
                    <div 
                      key={fund.id} 
                      className="bg-gray-700 p-6 rounded-xl hover:bg-gray-600 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-semibold">{fund.name}</h4>
                        <div className="flex items-center">
                          <div className={`text-lg font-bold ${getESGScoreColor(fund.esgScore)}`}>
                            {fund.esgScore.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          Similarity Score
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-24 bg-gray-600 rounded-full mr-2">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${fund.similarityScore}%` }}
                            />
                          </div>
                          <span className="text-green-400 font-semibold">
                            {fund.similarityScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <FaLeaf className="text-4xl mb-4" />
                  <p>Select a fund to see recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenMutualFund; 