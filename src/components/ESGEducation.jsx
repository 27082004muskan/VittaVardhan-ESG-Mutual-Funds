import React from 'react';
import { FaSearch, FaChartLine, FaNewspaper, FaLeaf, FaChartPie, FaGraduationCap } from 'react-icons/fa';

const ESGEducation = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 text-white">
      {/* Navigation Bar */}
      <div className="flex items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <h1 className="text-2xl font-bold">ESG Funds Education</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">What is ESG?</h2>
          <p className="text-gray-300 mb-4">
            ESG stands for Environmental, Social, and Governance. It represents a framework for evaluating companies based on:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-green-500 font-medium mb-3">Environmental</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Climate change impact</li>
                <li>• Carbon emissions</li>
                <li>• Resource conservation</li>
                <li>• Waste management</li>
                <li>• Renewable energy use</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-green-500 font-medium mb-3">Social</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Employee relations</li>
                <li>• Workplace diversity</li>
                <li>• Human rights</li>
                <li>• Community impact</li>
                <li>• Data protection</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-green-500 font-medium mb-3">Governance</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Board diversity</li>
                <li>• Business ethics</li>
                <li>• Executive compensation</li>
                <li>• Shareholder rights</li>
                <li>• Corporate transparency</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">What are ESG Funds?</h2>
          <p className="text-gray-300">
            ESG (Environmental, Social, and Governance) funds focus on sustainable and ethical investments, 
            considering factors like carbon footprint, social responsibility, and corporate governance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Why Invest in ESG?</h2>
          <p className="text-gray-300">
            ESG funds promote sustainability while offering competitive returns and reducing risks related 
            to environmental and social challenges. Investing responsibly ensures a positive impact on society.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Steps to Invest</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Research ESG funds to understand their focus.</li>
            <li>Compare fund performance, fees, & risks.</li>
            <li>Choose a trusted brokerage platform.</li>
            <li>Allocate funds based on your financial goals.</li>
            <li>Monitor and rebalance your investments.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">ESG Fund Categories</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Top Global ESG Funds</h3>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Sustainable ETFs</h3>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Green Energy Funds</h3>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Socially Responsible Funds</h3>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Our Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FaSearch className="text-green-500 text-xl" />
                <h3 className="font-medium">Smart Fund Search</h3>
              </div>
              <p className="text-gray-300">
                Advanced filtering and search capabilities to find ESG funds that match your investment criteria and values.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FaChartLine className="text-green-500 text-xl" />
                <h3 className="font-medium">Performance Analytics</h3>
              </div>
              <p className="text-gray-300">
                Detailed performance metrics, ESG scores, and historical data to make informed investment decisions.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FaNewspaper className="text-green-500 text-xl" />
                <h3 className="font-medium">Green News Feed</h3>
              </div>
              <p className="text-gray-300">
                Stay updated with latest sustainable investing news, market trends, and ESG developments.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FaLeaf className="text-green-500 text-xl" />
                <h3 className="font-medium">ESG Impact Tracking</h3>
              </div>
              <p className="text-gray-300">
                Monitor the environmental and social impact of your investments through detailed ESG metrics and reports.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FaChartPie className="text-green-500 text-xl" />
                <h3 className="font-medium">Portfolio Management</h3>
              </div>
              <p className="text-gray-300">
                Tools to build and manage a diversified sustainable investment portfolio aligned with your goals.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FaGraduationCap className="text-green-500 text-xl" />
                <h3 className="font-medium">Educational Resources</h3>
              </div>
              <p className="text-gray-300">
                Comprehensive guides, tutorials, and resources to understand ESG investing principles and strategies.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Benefits of ESG Investing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-500 mb-3">Financial Benefits</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Potential for competitive long-term returns</li>
                <li>• Reduced exposure to environmental and governance risks</li>
                <li>• Portfolio diversification opportunities</li>
                <li>• Protection against future regulatory changes</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-500 mb-3">Impact Benefits</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Support sustainable business practices</li>
                <li>• Contribute to environmental conservation</li>
                <li>• Promote social responsibility</li>
                <li>• Drive positive corporate behavior</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Small Investments, Big Impact</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-6">
              <h3 className="text-green-500 text-lg font-medium mb-3">Start Small, Think Big</h3>
              <p className="text-gray-300 mb-4">
                You don't need large amounts of capital to make a difference. Even investing just 2% of your income in green funds can create significant positive impact over time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-green-400 font-medium mb-2">Example Impact</h4>
                <p className="text-gray-300">
                  If 1,000 people invest just ₹1,000 monthly in green funds:
                </p>
                <ul className="mt-3 space-y-2 text-gray-300">
                  <li>• ₹12 million yearly towards sustainable projects</li>
                  <li>• Potential to offset 100+ tons of CO2 annually</li>
                  <li>• Support for multiple renewable energy initiatives</li>
                </ul>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-green-400 font-medium mb-2">Benefits of Starting Small</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Lower financial risk while learning</li>
                  <li>• Develop sustainable investing habits</li>
                  <li>• Flexibility to increase investment over time</li>
                  <li>• Part of a larger collective impact</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-900 p-4 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">Did You Know?</h4>
              <p className="text-gray-300">
                If every working Indian invested just 2% of their income in green funds, it could generate over ₹500 billion annually for sustainable development – enough to fund multiple large-scale renewable energy projects!
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h5 className="text-green-400 text-lg font-bold mb-2">2%</h5>
                <p className="text-gray-300 text-sm">Monthly Income</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h5 className="text-green-400 text-lg font-bold mb-2">12x</h5>
                <p className="text-gray-300 text-sm">Compound Growth Potential</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h5 className="text-green-400 text-lg font-bold mb-2">∞</h5>
                <p className="text-gray-300 text-sm">Lasting Impact</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Getting Started is Easy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-green-500 font-medium mb-3">Step 1: Start Small</h3>
              <p className="text-gray-300">
                Begin with as little as 2% of your monthly income. This creates a sustainable habit without straining your finances.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-green-500 font-medium mb-3">Step 2: Stay Consistent</h3>
              <p className="text-gray-300">
                Regular small investments are more effective than irregular large ones. Set up automatic monthly investments.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-green-500 font-medium mb-3">Step 3: Grow Gradually</h3>
              <p className="text-gray-300">
                As you become comfortable, gradually increase your investment percentage. Watch your impact grow over time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ESGEducation; 