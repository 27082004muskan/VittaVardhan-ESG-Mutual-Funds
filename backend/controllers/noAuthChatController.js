const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Gemini with your FREE API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const chatController = {
  // PRIMARY: AI-powered chat (Gemini)
  sendMessage: async (req, res) => {
    try {
      const { message } = req.body;
      
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

KEY ADVANTAGE: VittaVardhan charges ZERO brokerage while traditional brokers charge ₹20-50 per transaction.

Answer the user's question as an expert investment advisor:`;

      // Generate AI response
      const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${message}`);
      const aiResponse = result.response.text();
      
      // Smart suggestions based on response content
      let suggestions = [];
      const responseLower = aiResponse.toLowerCase();
      
      if (responseLower.includes('esg') || responseLower.includes('sustainable')) {
        suggestions = ["Show ESG funds", "ESG portfolio", "Calculate ESG SIP"];
      } else if (responseLower.includes('sip') || responseLower.includes('systematic')) {
        suggestions = ["Calculate SIP", "Best SIP funds", "SIP strategies"];
      } else if (responseLower.includes('stock') || responseLower.includes('share')) {
        suggestions = ["Get stock prices", "Stock analysis", "Market trends"];
      } else {
        suggestions = ["ESG investing", "SIP planning", "Stock prices", "Portfolio advice"];
      }

      res.json({
        success: true,
        response: aiResponse,
        suggestions: suggestions,
        timestamp: new Date(),
        source: 'gemini-ai'
      });

    } catch (error) {
      console.error('Gemini API Error, using fallback:', error);
      
      // Fallback with your original ESG data
      const userMsg = message.toLowerCase();
      let fallbackResponse = '';
      
      if (userMsg.includes('esg full form') || userMsg.includes('stands for')) {
        fallbackResponse = `ESG stands for Environmental, Social, and Governance. These are three key factors used to measure the sustainability and ethical impact of investments.`;
      } else if (userMsg.includes('esg') || userMsg.includes('sustainable')) {
        fallbackResponse = `Here are top ESG mutual funds for sustainable investing:

**Top ESG Funds:**
1. **Aditya Birla ESG Fund** - 15.2% returns, 0.75% expense ratio
2. **SBI Magnum ESG Fund** - 13.8% returns, 0.82% expense ratio
3. **ICICI Prudential ESG** - 14.5% returns, 0.79% expense ratio

**VittaVardhan Advantage:** Zero brokerage means 100% of your money goes into investments!`;
      } else if (userMsg.includes('sip')) {
        fallbackResponse = `**SIP Benefits:** Power of compounding - ₹5,000/month for 10 years = ₹11.27 lakhs at 12% returns. **VittaVardhan SIP Advantage:** ZERO brokerage saves ₹6,000-15,000 annually compared to traditional brokers.`;
      } else {
        fallbackResponse = `Welcome to VittaVardhan - India's smartest broker! I can help with ESG fund recommendations, SIP calculations, portfolio optimization, and zero-brokerage investing strategies. What would you like to explore?`;
      }

      res.json({
        success: true,
        response: fallbackResponse,
        suggestions: ["What is ESG?", "Calculate SIP", "Stock prices", "Portfolio help"],
        timestamp: new Date(),
        source: 'fallback'
      });
    }
  },

  // Keep your enhanced SIP calculator (same function name)
  calculateSIP: async (req, res) => {
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
            brokerageSaved: brokerageSaved,
            actualMaturityWithSavings: Math.round(maturityAmount + brokerageSaved),
            additionalGain: brokerageSaved
          },
          breakdown: {
            totalSIPs: totalMonths,
            averageMonthlyGain: Math.round(totalGains / totalMonths),
            yearlyProjection: Array.from({length: timePeriod}, (_, i) => {
              const year = i + 1;
              const monthsCompleted = year * 12;
              const yearlyMaturity = monthlyAmount * 
                (((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * 
                (1 + monthlyRate));
              return {
                year: year,
                invested: monthlyAmount * monthsCompleted,
                value: Math.round(yearlyMaturity),
                gains: Math.round(yearlyMaturity - (monthlyAmount * monthsCompleted))
              };
            })
          }
        }
      });

    } catch (error) {
      console.error('SIP calculation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate SIP returns'
      });
    }
  },

  // Get real ESG funds data
  getESGFunds: async (req, res) => {
    try {
      // Real Indian ESG funds with current data (same as your original)
      const esgFunds = [
        {
          id: 1,
          name: 'Aditya Birla Sun Life ESG Fund',
          amc: 'Aditya Birla Sun Life',
          category: 'ESG Equity',
          nav: 45.67,
          returns: { '1y': 15.2, '3y': 12.8, '5y': 11.5 },
          expenseRatio: 0.75,
          esgScore: 'A+',
          aum: 2500,
          minSIP: 500,
          riskLevel: 'High',
          topHoldings: ['Infosys', 'HDFC Bank', 'Reliance'],
          esgFocus: ['Clean Energy', 'Water Management', 'Social Impact']
        },
        {
          id: 2,
          name: 'SBI Magnum ESG Fund',
          amc: 'SBI Mutual Fund',
          category: 'ESG Equity',
          nav: 38.94,
          returns: { '1y': 13.8, '3y': 11.5, '5y': 10.2 },
          expenseRatio: 0.82,
          esgScore: 'A',
          aum: 1800,
          minSIP: 500,
          riskLevel: 'High',
          topHoldings: ['TCS', 'ICICI Bank', 'Asian Paints'],
          esgFocus: ['Carbon Reduction', 'Governance', 'Employee Welfare']
        },
        {
          id: 3,
          name: 'ICICI Prudential ESG Fund',
          amc: 'ICICI Prudential',
          category: 'ESG Equity',
          nav: 52.31,
          returns: { '1y': 14.5, '3y': 13.2, '5y': 12.1 },
          expenseRatio: 0.79,
          esgScore: 'A+',
          aum: 3200,
          minSIP: 1000,
          riskLevel: 'High',
          topHoldings: ['HDFC Bank', 'Bharti Airtel', 'Wipro'],
          esgFocus: ['Renewable Energy', 'Financial Inclusion', 'Data Privacy']
        }
      ];

      res.json({
        success: true,
        data: esgFunds,
        metadata: {
          totalFunds: esgFunds.length,
          lastUpdated: new Date(),
          disclaimer: 'Invest based on your risk profile. Past performance doesn\'t guarantee future returns.'
        }
      });

    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch ESG funds' });
    }
  }
};

module.exports = chatController;
