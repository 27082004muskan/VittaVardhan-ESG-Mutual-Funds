
import { FaCheck } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';

const Working = () => {
  return (
    <div className="w-full bg-gray-900 text-white">
     
      <section className="w-full py-20 bg-gray-900">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 
                   bg-gradient-to-r from-green-400 to-green-600 
                   bg-clip-text text-transparent">
      How It Works
    </h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="p-6 text-center border border-gray-700 rounded-lg 
                     hover:border-green-500/50 transition-all duration-300 
                     bg-gray-800 hover:transform hover:scale-105">
        <div className="bg-green-500 w-14 h-14 rounded-full flex items-center 
                       justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
          <span className="text-xl font-bold">1</span>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-green-400">Learn About ESG Funds</h3>
        <p className="text-gray-300">Explore the impact of ESG mutual funds and why sustainable investing matters.</p>
      </div>
      <div className="p-6 text-center border border-gray-700 rounded-lg 
                     hover:border-green-500/50 transition-all duration-300 
                     bg-gray-800 hover:transform hover:scale-105">
        <div className="bg-green-500 w-14 h-14 rounded-full flex items-center 
                       justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
          <span className="text-xl font-bold">2</span>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-green-400">Calculate Your Investment</h3>
        <p className="text-gray-300">Use our tool to determine how much of your income you can allocate toward ESG funds.</p>
      </div>
      <div className="p-6 text-center border border-gray-700 rounded-lg 
                     hover:border-green-500/50 transition-all duration-300 
                     bg-gray-800 hover:transform hover:scale-105">
        <div className="bg-green-500 w-14 h-14 rounded-full flex items-center 
                       justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
          <span className="text-xl font-bold">3</span>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-green-400">Simulate & Track Impact</h3>
        <p className="text-gray-300">Make virtual investments, track your portfolio, and see the real-world impact of your choices.</p>
      </div>
    </div>
  </div>
</section>

      {/* Pricing Plans Section */}
      <section className="w-full py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 
                         bg-gradient-to-r from-green-400 to-green-600 
                         bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700 
                           hover:border-green-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">Basic</h3>
              <p className="text-3xl font-bold mb-6 text-white">Free</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-green-500 w-5 h-5" />
                  <span className="text-white">Basic Portfolio Analysis</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-green-500 w-5 h-5" />
                  <span className="text-white">Market Updates</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-green-500 w-5 h-5" />
                  <span className="text-white">Community Access</span>
                </li>
              </ul>
              <button className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition">
                Get Started
              </button>
            </div>
            <div className="bg-green-600 rounded-xl p-8 text-center transform scale-105 
                           shadow-xl shadow-green-500/20 border border-green-500/50">
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <p className="text-3xl font-bold mb-6">₹499/mo</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-white w-5 h-5" />
                  <span>Advanced Analytics</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-white w-5 h-5" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-white w-5 h-5" />
                  <span>Expert Consultation</span>
                </li>
              </ul>
              <button className="w-full bg-white text-green-600 py-2 rounded-lg hover:bg-gray-100 transition">
                Go Pro
              </button>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700 
                           hover:border-green-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">Enterprise</h3>
              <p className="text-3xl font-bold mb-6 text-white">Custom</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-green-500 w-5 h-5" />
                  <span className="text-white">Custom Solutions</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-green-500 w-5 h-5" />
                  <span className="text-white">Dedicated Manager</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <FaCheck className="text-green-500 w-5 h-5" />
                  <span className="text-white">API Access</span>
                </li>
              </ul>
              <button className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full py-20 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-700 
                         hover:border-green-500/50 transition-all duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 
                            bg-gradient-to-r from-green-400 to-green-600 
                            bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-gray-300">Get the latest insights on sustainable investing directly in your inbox.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-gray-300 border border-gray-700 
                           focus:outline-none focus:border-green-500 transition-all duration-300"
              />
              <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg 
                                font-semibold transition-all duration-300 flex items-center 
                                justify-center gap-2 hover:shadow-lg hover:shadow-green-500/20">
                Subscribe
                <HiMail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Working;
