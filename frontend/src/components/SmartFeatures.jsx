/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from 'react';
import { Send, Calculator, TrendingUp, DollarSign, Sparkles, X, BarChart3 } from 'lucide-react';

const BrokerChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to VittaVardhan! I'm your ESG-focused investment advisor. How can I help you build a sustainable portfolio with zero brokerage today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSIPModal, setShowSIPModal] = useState(false);
  const [sipLoading, setSipLoading] = useState(false);
  const [sipData, setSipData] = useState({ monthlyAmount: '', expectedReturn: '12', timePeriod: '' });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ ONLY CHANGED THIS FUNCTION - Backend API Call
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage; // Store message before clearing
    setInputMessage('');
    setLoading(true);

    try {
      // Real API call to your backend
      const response = await fetch('http://localhost:5001/api/chat/send-message-free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: messages.length + 2,
          text: data.response,
          sender: 'ai',
          timestamp: new Date(),
          suggestions: data.suggestions || ["Show ESG funds", "Calculate SIP", "Compare returns"]
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      console.error('Error details:', error.message);
      
      // More helpful error message
      const errorMessage = error.message.includes('Failed to fetch') || error.message.includes('NetworkError')
        ? "Unable to connect to the server. Please make sure the backend server is running on port 5001."
        : `Error: ${error.message}. Please try again or contact support.`;
      
      // Fallback message with error info in console
      const aiMessage = {
        id: messages.length + 2,
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: ["Try again", "Check server connection", "Contact support"]
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SIP Calculator with better validation and error handling
  const calculateSIP = async () => {
    const monthly = parseFloat(sipData.monthlyAmount);
    const expectedReturn = parseFloat(sipData.expectedReturn);
    const timePeriod = parseFloat(sipData.timePeriod);
    
    // Validate inputs
    if (!sipData.monthlyAmount || !sipData.expectedReturn || !sipData.timePeriod) {
      alert('Please fill in all fields before calculating.');
      return;
    }
    
    if (isNaN(monthly) || monthly <= 0) {
      alert('Please enter a valid monthly investment amount.');
      return;
    }
    
    if (isNaN(expectedReturn) || expectedReturn <= 0 || expectedReturn > 100) {
      alert('Please enter a valid expected return percentage (0-100).');
      return;
    }
    
    if (isNaN(timePeriod) || timePeriod <= 0) {
      alert('Please enter a valid investment period in years.');
      return;
    }

    setSipLoading(true);

    try {
      // Real API call to your backend
      const response = await fetch('http://localhost:5001/api/chat/calculate-sip-free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyAmount: monthly,
          expectedReturn: expectedReturn,
          timePeriod: timePeriod
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const result = data.data;
        const sipMessage = {
          id: messages.length + 1,
          text: `💰 SIP Calculation Results:\n\n📊 Monthly Investment: ₹${result.input.monthlyAmount.toLocaleString()}\n⏱️ Duration: ${result.input.timePeriod} years\n📈 Expected Return: ${result.input.expectedReturn}% per annum\n\n✨ Maturity Amount: ₹${result.results.maturityAmount.toLocaleString()}\n💵 Total Invested: ₹${result.results.totalInvestment.toLocaleString()}\n📊 Total Gains: ₹${result.results.totalGains.toLocaleString()}\n🎯 Absolute Return: ${result.results.absoluteReturn}%\n🔥 Brokerage Saved (Zero Brokerage): ₹${result.results.brokerageSaved.toLocaleString()}\n\n💡 With VittaVardhan's zero brokerage, you save ₹${result.results.brokerageSaved.toLocaleString()} compared to traditional brokers!`,
          sender: 'ai',
          timestamp: new Date(),
          isCalculation: true
        };
        setMessages(prev => [...prev, sipMessage]);
        setShowSIPModal(false);
        setSipData({ monthlyAmount: '', expectedReturn: '12', timePeriod: '' });
      } else {
        throw new Error(data.error || 'SIP calculation failed');
      }
    } catch (error) {
      console.error('SIP Error:', error);
      
      // Fallback calculation if API fails
      const rate = expectedReturn / 100 / 12;
      const months = timePeriod * 12;
      const maturity = monthly * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
      const invested = monthly * months;
      const gains = maturity - invested;
      const brokerageSaved = months * 20; // ₹20 per transaction per month

      const sipMessage = {
        id: messages.length + 1,
        text: `💰 SIP Calculation Results (Local Calculation):\n\n📊 Monthly Investment: ₹${monthly.toLocaleString()}\n⏱️ Duration: ${timePeriod} years\n📈 Expected Return: ${expectedReturn}% per annum\n\n✨ Maturity Amount: ₹${Math.round(maturity).toLocaleString()}\n💵 Total Invested: ₹${invested.toLocaleString()}\n📊 Total Gains: ₹${Math.round(gains).toLocaleString()}\n🎯 Absolute Return: ${((gains / invested) * 100).toFixed(2)}%\n🔥 Brokerage Saved (Zero Brokerage): ₹${brokerageSaved.toLocaleString()}\n\n💡 Note: Backend server may not be running. Using local calculation.`,
        sender: 'ai',
        timestamp: new Date(),
        isCalculation: true
      };
      setMessages(prev => [...prev, sipMessage]);
      setShowSIPModal(false);
      setSipData({ monthlyAmount: '', expectedReturn: '12', timePeriod: '' });
    } finally {
      setSipLoading(false);
    }
  };

  // ✅ NO CHANGES - Your original quickActions
  const quickActions = [
    { icon: <Calculator className="w-4 h-4" />, text: "SIP Calculator", action: () => setShowSIPModal(true) },
    { icon: <TrendingUp className="w-4 h-4" />, text: "ESG Funds", action: () => setInputMessage("Show me top ESG mutual funds") },
    { icon: <BarChart3 className="w-4 h-4" />, text: "Stock Price", action: () => setInputMessage("Get RELIANCE.NS stock price") },
    { icon: <DollarSign className="w-4 h-4" />, text: "Zero Brokerage", action: () => setInputMessage("Benefits of zero brokerage") }
  ];

  // ✅ NO CHANGES - Your original handleKeyPress
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ✅ NO CHANGES TO YOUR UI - EXACT SAME DESIGN
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[80vh] bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden flex flex-col">
        
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VittaVardhan AI</h1>
              <p className="text-xs text-emerald-100">Sustainable Investment Advisor</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">₹0</p>
              <p className="text-xs text-emerald-100">Brokerage Fee</p>
            </div>
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="animate-fadeIn">
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white'
                        : message.isCalculation
                        ? 'bg-gradient-to-br from-blue-900/80 to-blue-800/80 text-blue-100 border border-blue-600/50'
                        : 'bg-gray-800/80 backdrop-blur text-gray-100 border border-gray-700/50'
                    } px-5 py-3 rounded-2xl shadow-lg`}>
                      <p className="leading-relaxed whitespace-pre-line">{message.text}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.sender === 'ai' && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-4 py-2 text-sm bg-gray-800/60 backdrop-blur hover:bg-emerald-600 
                                   text-gray-300 hover:text-white rounded-full border border-gray-600/50
                                   hover:border-emerald-500 transition-all duration-300 hover:scale-105"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-gray-800/80 backdrop-blur px-5 py-4 rounded-2xl border border-gray-700/50">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-gray-800/50 backdrop-blur border-t border-gray-700/50 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1 bg-gray-900/50 rounded-2xl border border-gray-700/50 focus-within:border-emerald-500 transition-colors">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about ESG funds, SIP, stocks..."
                    className="w-full px-5 py-4 bg-transparent focus:outline-none text-white placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 
                           text-white p-4 rounded-2xl transition-all duration-300 disabled:opacity-50 
                           disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="w-64 bg-gray-800/30 backdrop-blur border-l border-gray-700/50 p-4 flex flex-col">
            <h3 className="font-semibold text-emerald-400 mb-4 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-2 mb-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white 
                           bg-gray-900/50 hover:bg-emerald-600 rounded-xl transition-all duration-300 
                           border border-gray-700/50 hover:border-emerald-500 hover:scale-105"
                >
                  {action.icon}
                  <span>{action.text}</span>
                </button>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="space-y-3 mt-auto">
              <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 backdrop-blur rounded-xl p-4 border border-emerald-700/50">
                <p className="text-3xl font-bold text-emerald-400">10K+</p>
                <p className="text-xs text-gray-400 mt-1">Active Investors</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur rounded-xl p-4 border border-blue-700/50">
                <p className="text-3xl font-bold text-blue-400">₹50Cr+</p>
                <p className="text-xs text-gray-400 mt-1">Assets Under Advisory</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced SIP Modal */}
      {showSIPModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-emerald-400 flex items-center">
                <Calculator className="w-6 h-6 mr-2" />
                SIP Calculator
              </h3>
              <button
                onClick={() => !sipLoading && setShowSIPModal(false)}
                disabled={sipLoading}
                className="text-gray-400 hover:text-white transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Monthly Investment (₹)
                </label>
                <input
                  type="number"
                  value={sipData.monthlyAmount}
                  onChange={(e) => setSipData({...sipData, monthlyAmount: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                           focus:outline-none focus:border-emerald-500 text-white transition-colors"
                  placeholder="5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={sipData.expectedReturn}
                  onChange={(e) => setSipData({...sipData, expectedReturn: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                           focus:outline-none focus:border-emerald-500 text-white transition-colors"
                  placeholder="12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  value={sipData.timePeriod}
                  onChange={(e) => setSipData({...sipData, timePeriod: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                           focus:outline-none focus:border-emerald-500 text-white transition-colors"
                  placeholder="10"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSIPModal(false)}
                disabled={sipLoading}
                className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl 
                         hover:bg-gray-800 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={calculateSIP}
                disabled={sipLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 
                         hover:from-emerald-600 hover:to-green-700 text-white rounded-xl 
                         transition-all duration-300 font-medium shadow-lg hover:scale-105
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                         flex items-center justify-center"
              >
                {sipLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  'Calculate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BrokerChatbot;
