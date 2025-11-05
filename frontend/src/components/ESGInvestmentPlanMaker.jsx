import  { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaRupeeSign, 
  FaChartLine,
    FaBullseye, 
  FaCalendarAlt,
  FaLeaf,
  FaSeedling,
  FaCalculator,
  FaCheckCircle
} from 'react-icons/fa';

const ESGInvestmentPlanMaker = () => {
  const [formData, setFormData] = useState({
    age: '',
    monthlyIncome: '',
    currentSavings: '',
    riskTolerance: 'moderate',
    investmentGoal: '',
    targetAmount: '',
    timeHorizon: '',
    monthlyInvestmentCapacity: ''
  });

  const [planResult, setPlanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate investment plan
  const calculatePlan = () => {
    console.log('Calculate Plan clicked!'); // Debug log
    console.log('Form Data:', formData); // Debug log
    
    setIsLoading(true);
    setPlanResult(null); // Clear previous results
    
    // Add validation
    const income = parseFloat(formData.monthlyIncome);
    const targetAmount = parseFloat(formData.targetAmount);
    const timeHorizon = parseInt(formData.timeHorizon);
    const currentSavings = parseFloat(formData.currentSavings) || 0;
    
    console.log('Parsed values:', { income, targetAmount, timeHorizon, currentSavings }); // Debug log
    
    if (!income || !targetAmount || !timeHorizon) {
      alert('Please fill in all required fields: Monthly Income, Target Amount, and Time Horizon');
      setIsLoading(false);
      return;
    }
    
    setTimeout(() => {
      try {
        // ESG fund expected returns based on risk tolerance
        const expectedReturns = {
          conservative: 0.08, // 8%
          moderate: 0.12, // 12%
          aggressive: 0.15 // 15%
        };
        
        const annualReturn = expectedReturns[formData.riskTolerance];
        const monthlyReturn = annualReturn / 12;
        
        console.log('Returns:', { annualReturn, monthlyReturn }); // Debug log
        
        // Calculate future value of current savings
        const futureValueCurrentSavings = currentSavings * Math.pow(1 + annualReturn, timeHorizon);
        const remainingTarget = Math.max(0, targetAmount - futureValueCurrentSavings);
        
        console.log('Future value calculations:', { futureValueCurrentSavings, remainingTarget }); // Debug log
        
        // Monthly SIP calculation using correct formula
        const monthsTotal = timeHorizon * 12;
        let monthlyRequired = 0;
        
        if (remainingTarget > 0) {
          if (monthlyReturn > 0) {
            // Correct SIP formula: PMT = FV × r / ((1 + r)^n - 1)
            monthlyRequired = (remainingTarget * monthlyReturn) / (Math.pow(1 + monthlyReturn, monthsTotal) - 1);
          } else {
            monthlyRequired = remainingTarget / monthsTotal;
          }
        }
        
        console.log('Monthly required:', monthlyRequired); // Debug log
        
        // Suggested investment capacity (2-20% of income)
        const suggestedMin = income * 0.02;
        const suggestedMax = income * 0.20;
        
        // Create timeline milestones
        const milestones = [];
        for (let year = 1; year <= timeHorizon; year++) {
          const investedAmount = (monthlyRequired * 12 * year) + currentSavings;
          
          // Future value of current savings after 'year' years
          const fvCurrent = currentSavings * Math.pow(1 + annualReturn, year);
          
          // Future value of SIP after 'year' years
          const monthsElapsed = year * 12;
          let fvSip = 0;
          if (monthlyReturn > 0 && monthlyRequired > 0) {
            fvSip = monthlyRequired * ((Math.pow(1 + monthlyReturn, monthsElapsed) - 1) / monthlyReturn);
          } else if (monthlyRequired > 0) {
            fvSip = monthlyRequired * monthsElapsed;
          }
          
          const totalValue = fvCurrent + fvSip;
          const returnsGenerated = totalValue - investedAmount;
          
          milestones.push({
            year,
            invested: Math.round(investedAmount),
            value: Math.round(totalValue),
            returns: Math.round(returnsGenerated)
          });
        }

        const plan = {
          monthlyRequired: Math.round(monthlyRequired),
          totalInvested: Math.round((monthlyRequired * monthsTotal) + currentSavings),
          expectedReturns: Math.round(targetAmount - ((monthlyRequired * monthsTotal) + currentSavings)),
          annualReturnRate: (annualReturn * 100).toFixed(1),
          affordability: monthlyRequired <= income * 0.20 ? 'Affordable' : 'Challenging',
          suggestedRange: { min: Math.round(suggestedMin), max: Math.round(suggestedMax) },
          milestones,
          recommendedFunds: getRecommendedFunds(formData.riskTolerance),
          investmentStrategy: getInvestmentStrategy(formData.riskTolerance, timeHorizon)
        };

        console.log('Final plan:', plan); // Debug log
        setPlanResult(plan);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Calculation error:', error);
        alert('Error calculating investment plan. Please check your inputs.');
        setIsLoading(false);
      }
    }, 1000); // Reduced timeout for faster response
  };

  // Get recommended ESG funds based on risk tolerance
  const getRecommendedFunds = (riskTolerance) => {
    const funds = {
      conservative: [
        { name: 'SBI Magnum ESG Fund', type: 'Debt + ESG Equity', risk: 'Low' },
        { name: 'HDFC ESG Fund', type: 'Conservative ESG', risk: 'Low-Medium' }
      ],
      moderate: [
        { name: 'Axis ESG Equity Fund', type: 'ESG Large Cap', risk: 'Medium' },
        { name: 'DSP World ESG Fund', type: 'Global ESG', risk: 'Medium' },
        { name: 'Quantum ESG Indian Fund', type: 'Indian ESG Equity', risk: 'Medium' }
      ],
      aggressive: [
        { name: 'Mirae Asset ESG Sector Fund', type: 'ESG Growth', risk: 'High' },
        { name: 'L&T ESG Fund', type: 'ESG Small & Mid Cap', risk: 'High' },
        { name: 'Aditya Birla Sun Life ESG Fund', type: 'ESG Multi Cap', risk: 'High' }
      ]
    };
    return funds[riskTolerance] || funds.moderate;
  };

  // Get investment strategy recommendations
  const getInvestmentStrategy = (riskTolerance, timeHorizon) => {
    if (timeHorizon >= 10) {
      return {
        allocation: '70% ESG Equity + 20% ESG Debt + 10% International ESG',
        approach: 'Long-term wealth creation with strong ESG impact',
        rebalancing: 'Annual rebalancing recommended'
      };
    } else if (timeHorizon >= 5) {
      return {
        allocation: '60% ESG Equity + 30% ESG Debt + 10% Liquid ESG',
        approach: 'Balanced growth with moderate ESG exposure',
        rebalancing: 'Semi-annual review recommended'
      };
    } else {
      return {
        allocation: '40% ESG Equity + 50% ESG Debt + 10% ESG Liquid',
        approach: 'Conservative growth with ESG principles',
        rebalancing: 'Quarterly monitoring recommended'
      };
    }
  };

  // Debug useEffect to log state changes
  useEffect(() => {
    console.log('Plan result updated:', planResult);
  }, [planResult]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FaLeaf className="text-green-500 text-3xl" />
          <h1 className="text-3xl font-bold">ESG Investment Plan Maker</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Create a personalized sustainable investment plan tailored to your goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FaUser className="text-green-500" />
            Your Investment Profile
          </h2>

          <div className="space-y-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Enter your age"
              />
            </div>

            {/* Monthly Income - Required */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Income (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="e.g., 50000"
                required
              />
            </div>

            {/* Current Savings */}
            <div>
              <label className="block text-sm font-medium mb-2">Current Savings (₹)</label>
              <input
                type="number"
                name="currentSavings"
                value={formData.currentSavings}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="e.g., 100000 (Enter 0 if none)"
              />
            </div>

            {/* Investment Goal */}
            <div>
              <label className="block text-sm font-medium mb-2">Investment Goal</label>
              <select
                name="investmentGoal"
                value={formData.investmentGoal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              >
                <option value="">Select your goal</option>
                <option value="retirement">Retirement Planning</option>
                <option value="house">House Purchase</option>
                <option value="education">Child&apos;s Education</option>
                <option value="emergency">Emergency Fund</option>
                <option value="wealth">Wealth Creation</option>
                <option value="travel">Travel Fund</option>
              </select>
            </div>

            {/* Target Amount - Required */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="e.g., 1000000"
                required
              />
            </div>

            {/* Time Horizon - Required */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Time Horizon (Years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="timeHorizon"
                value={formData.timeHorizon}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="e.g., 5"
                min="1"
                max="40"
                required
              />
            </div>

            {/* Risk Tolerance */}
            <div>
              <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
              <select
                name="riskTolerance"
                value={formData.riskTolerance}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              >
                <option value="conservative">Conservative (8% returns)</option>
                <option value="moderate">Moderate (12% returns)</option>
                <option value="aggressive">Aggressive (15% returns)</option>
              </select>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculatePlan}
              disabled={isLoading || !formData.monthlyIncome || !formData.targetAmount || !formData.timeHorizon}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating Plan...
                </>
              ) : (
                <>
                  <FaCalculator />
                  Generate ESG Investment Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-gray-800 rounded-lg p-6">
          {!planResult ? (
            <div className="text-center py-12">
              <FaSeedling className="text-green-500 text-4xl mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">
                Fill out the form to generate your personalized ESG investment plan
              </p>
              <p className="text-gray-500 text-sm mt-2">
                * Required fields: Monthly Income, Target Amount, Time Horizon
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FaBullseye className="text-green-500" />
                Your ESG Investment Plan
              </h2>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <FaRupeeSign className="text-green-500 mb-2" />
                  <p className="text-sm text-gray-300">Monthly Investment</p>
                  <p className="text-xl font-bold">₹{planResult.monthlyRequired.toLocaleString()}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <FaChartLine className="text-green-500 mb-2" />
                  <p className="text-sm text-gray-300">Expected Returns</p>
                  <p className="text-xl font-bold">{planResult.annualReturnRate}% p.a.</p>
                </div>
              </div>

              {/* Affordability Check */}
              <div className={`p-4 rounded-lg ${
                planResult.affordability === 'Affordable' 
                  ? 'bg-green-900 border border-green-600' 
                  : 'bg-orange-900 border border-orange-600'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className={planResult.affordability === 'Affordable' ? 'text-green-400' : 'text-orange-400'} />
                  <h3 className="font-medium">Affordability: {planResult.affordability}</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Suggested monthly investment range: ₹{planResult.suggestedRange.min.toLocaleString()} - 
                  ₹{planResult.suggestedRange.max.toLocaleString()}
                </p>
              </div>

              {/* Investment Breakdown */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Investment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Investment:</span>
                    <span>₹{planResult.totalInvested.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Expected Returns:</span>
                    <span className="text-green-400">₹{planResult.expectedReturns.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-600 pt-2">
                    <span>Target Amount:</span>
                    <span>₹{formData.targetAmount ? parseInt(formData.targetAmount).toLocaleString() : '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rest of your component remains the same... */}
      {/* Detailed Plan Results */}
      {planResult && (
        <div className="mt-8 space-y-6">
          {/* Timeline */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-green-500" />
              Investment Timeline
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Year</th>
                    <th className="text-left py-2">Invested Amount</th>
                    <th className="text-left py-2">Portfolio Value</th>
                    <th className="text-left py-2">Returns Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {planResult.milestones.map((milestone) => (
                    <tr key={milestone.year} className="border-b border-gray-700">
                      <td className="py-2">{milestone.year}</td>
                      <td className="py-2">₹{milestone.invested.toLocaleString()}</td>
                      <td className="py-2 text-green-400">₹{milestone.value.toLocaleString()}</td>
                      <td className="py-2 text-green-400">₹{milestone.returns.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommended Funds */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recommended ESG Funds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planResult.recommendedFunds.map((fund, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-green-400 mb-2">{fund.name}</h4>
                  <p className="text-sm text-gray-300 mb-1">{fund.type}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    fund.risk === 'Low' ? 'bg-green-900 text-green-400' :
                    fund.risk === 'Medium' || fund.risk === 'Low-Medium' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-red-900 text-red-400'
                  }`}>
                    {fund.risk} Risk
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Strategy */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Investment Strategy</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-400 mb-2">Asset Allocation</h4>
                <p className="text-gray-300">{planResult.investmentStrategy.allocation}</p>
              </div>
              <div>
                <h4 className="font-medium text-green-400 mb-2">Approach</h4>
                <p className="text-gray-300">{planResult.investmentStrategy.approach}</p>
              </div>
              <div>
                <h4 className="font-medium text-green-400 mb-2">Portfolio Management</h4>
                <p className="text-gray-300">{planResult.investmentStrategy.rebalancing}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ESGInvestmentPlanMaker;
