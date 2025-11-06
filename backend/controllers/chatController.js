const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Gemini with your FREE API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const geminiChatController = {
  sendMessage: async (req, res) => {
    try {
      const { message } = req.body;
      
      // Enhanced system prompt with your ESG fund data
      const systemPrompt = `You are VittaVardhan AI, India's leading zero-brokerage investment advisor and ESG specialist.

EXPERTISE AREAS:
- ESG (Environmental, Social, Governance) investing
- Indian mutual funds and SIP planning  
- Portfolio allocation and diversification
- Stock market analysis (NSE/BSE)
- Zero-brokerage advantage over traditional brokers

RESPONSE STYLE:
- Keep answers under 120 words
- Be specific and actionable
- Always highlight zero brokerage benefits
- Focus on Indian market (NSE, BSE, Indian MFs)
- Give practical advice with examples

KEY ESG FUNDS TO RECOMMEND:
1. Aditya Birla Sun Life ESG Fund - 15.2% returns, 0.75% expense ratio
2. SBI Magnum ESG Fund - 13.8% returns, 0.82% expense ratio
3. ICICI Prudential ESG Fund - 14.5% returns, 0.79% expense ratio

KEY ADVANTAGE: 
VittaVardhan charges ZERO brokerage while traditional brokers charge ₹20-50 per transaction. This saves thousands annually.

Answer the user's question as an expert investment advisor:`;

      // Generate AI response
      const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${message}`);
      const aiResponse = result.response.text();
      
      // Smart suggestions based on response content
      let suggestions = [];
      const responseLower = aiResponse.toLowerCase();
      
      if (responseLower.includes('esg') || responseLower.includes('sustainable')) {
        suggestions = ["Show ESG funds", "ESG portfolio", "ESG vs regular funds"];
      } else if (responseLower.includes('sip') || responseLower.includes('systematic')) {
        suggestions = ["Calculate SIP", "Best SIP funds", "SIP strategies"];  
      } else if (responseLower.includes('stock') || responseLower.includes('share')) {
        suggestions = ["Get stock prices", "Stock analysis", "Market trends"];
      } else {
        suggestions = ["ESG investing", "SIP planning", "Stock prices"];
      }

      res.json({
        success: true,
        response: aiResponse,
        suggestions: suggestions,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback with your original ESG data
      const userMsg = message.toLowerCase();
      let fallbackResponse = '';

      if (userMsg.includes('esg')) {
        fallbackResponse = `Here are top ESG mutual funds for sustainable investing:

**Top ESG Funds:**
1. **Aditya Birla ESG Fund** - 15.2% returns, 0.75% expense ratio
2. **SBI Magnum ESG Fund** - 13.8% returns, 0.82% expense ratio  
3. **ICICI Prudential ESG** - 14.5% returns, 0.79% expense ratio

**VittaVardhan Advantage:** Zero brokerage means 100% of your money goes into investments!`;
      } else {
        fallbackResponse = `I'm VittaVardhan AI, your investment advisor. I can help with ESG funds, SIP calculations, and zero-brokerage investing. What would you like to know?`;
      }
      
      res.json({
        success: true,
        response: fallbackResponse,
        suggestions: ["What is ESG?", "Calculate SIP", "Stock prices"],
        timestamp: new Date()
      });
    }
  },

  // Keep your enhanced SIP calculator
  calculateSIPFree: async (req, res) => {
    try {
      const { monthlyAmount, expectedReturn, timePeriod, stepUp = 0 } = req.body;

      if (!monthlyAmount || !expectedReturn || !timePeriod) {
        return res.status(400).json({
          success: false,
          error: 'Monthly amount, expected return, and time period required'
        });
      }

      const monthlyRate = expectedReturn / (12 * 100);
      const totalMonths = timePeriod * 12;
      
      let maturityAmount = 0;
      let totalInvestment = 0;
      
      // Enhanced calculation with step-up SIPs
      if (stepUp > 0) {
        let currentSIP = monthlyAmount;
        for (let year = 0; year < timePeriod; year++) {
          const yearlyInvestment = currentSIP * 12;
          const remainingYears = timePeriod - year;
          const futureValue = yearlyInvestment * (((Math.pow(1 + monthlyRate, remainingYears * 12) - 1) / monthlyRate) * (1 + monthlyRate));
          
          maturityAmount += futureValue;
          totalInvestment += yearlyInvestment;
          
          currentSIP += currentSIP * (stepUp / 100);
        }
      } else {
        // Regular SIP calculation
        maturityAmount = monthlyAmount * 
          (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
          (1 + monthlyRate));
        totalInvestment = monthlyAmount * totalMonths;
      }

      const totalGains = maturityAmount - totalInvestment;
      const absoluteReturn = ((totalGains / totalInvestment) * 100);
      const brokerageSaved = totalMonths * 20;

      res.json({
        success: true,
        data: {
          input: {
            monthlyAmount: parseFloat(monthlyAmount),
            expectedReturn: parseFloat(expectedReturn), 
            timePeriod: parseFloat(timePeriod),
            stepUp: stepUp
          },
          results: {
            totalInvestment: Math.round(totalInvestment),
            maturityAmount: Math.round(maturityAmount),
            totalGains: Math.round(totalGains),
            absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
            brokerageSaved: brokerageSaved
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to calculate SIP returns'
      });
    }
  },

  // Get real ESG funds data from MFApi (FREE)
  getESGFunds: async (req, res) => {
    try {
      // Using the FREE MFApi.in data you showed me
      const response = await axios.get('https://api.mfapi.in/mf');
      const allFunds = response.data;
      
      // Filter ESG funds from the real data
      const esgFunds = allFunds.filter(fund => 
        fund.schemeName.toLowerCase().includes('esg') ||
        fund.schemeName.toLowerCase().includes('sustainable') ||
        fund.schemeName.toLowerCase().includes('responsible') ||
        fund.schemeName.toLowerCase().includes('environment')
      ).slice(0, 10);

      res.json({
        success: true,
        data: esgFunds,
        metadata: {
          totalFunds: esgFunds.length,
          lastUpdated: new Date(),
          source: 'MFApi.in - Live data'
        }
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch ESG funds' 
      });
    }
  }
};

module.exports = geminiChatController;
