const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY is not set in environment variables!');
  console.error('Please check your .env file in the backend directory.');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log('✅ OpenAI client initialized');

router.post('/send-message-free', async (req, res) => {
    try {
        const { message } = req.body;
        
        console.log('📨 Received message:', message);
        
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY not found!');
            throw new Error('OpenAI API key is not configured');
        }

        // System prompt - Acting as an ESG Broker
        const systemPrompt = `You are VittaVardhan AI, an expert ESG (Environmental, Social, Governance) investment broker helping users invest in sustainable funds. Act as a professional broker who:

YOUR ROLE AS BROKER:
- Help users choose the right ESG funds based on their goals and risk profile
- Explain ESG fund benefits, returns, and sustainability impact
- Assist with SIP (Systematic Investment Plan) planning and calculations
- Provide personalized investment advice for Indian mutual funds
- Highlight the zero brokerage advantage (₹0 fees vs traditional brokers who charge ₹20-50 per transaction)
- Guide users on portfolio diversification and long-term wealth building

KEY ESG FUNDS TO RECOMMEND:
1. Aditya Birla Sun Life ESG Fund - 15.2% annual returns, 0.75% expense ratio, A+ ESG rating
2. SBI Magnum ESG Fund - 13.8% annual returns, 0.82% expense ratio, A ESG rating
3. ICICI Prudential ESG Fund - 14.5% annual returns, 0.79% expense ratio, A+ ESG rating

YOUR BROKER APPROACH:
- Ask relevant questions to understand user's investment goals, risk tolerance, and timeline
- Provide specific fund recommendations with clear reasoning
- Explain how ESG investing creates both financial returns and positive environmental/social impact
- Compare different ESG funds and help users make informed decisions
- Suggest SIP amounts based on user's financial capacity
- Always emphasize the zero brokerage benefit - more money goes into investments

RESPONSE STYLE:
- Be professional, helpful, and broker-like in tone
- Keep responses conversational and under 200 words
- Use specific numbers and data when recommending funds
- Focus on Indian market (NSE, BSE, Indian mutual funds)
- Be actionable - guide users on next steps
- Always mention zero brokerage savings when relevant

Remember: You are a broker helping users invest in ESG funds. Be proactive, ask questions, and provide expert guidance.`;

        try {
            // Call OpenAI API
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 300,
                temperature: 0.7,
            });

            const aiResponse = completion.choices[0].message.content;
            
            console.log('✅ OpenAI API Success!');
            
            // Smart suggestions based on response content
            let suggestions = [];
            const responseLower = aiResponse.toLowerCase();
            
            if (responseLower.includes('esg') || responseLower.includes('sustainable') || responseLower.includes('fund')) {
                suggestions = ["Best ESG funds", "ESG SIP calculator", "ESG portfolio"];
            } else if (responseLower.includes('sip') || responseLower.includes('systematic') || responseLower.includes('investment plan')) {
                suggestions = ["Calculate SIP returns", "Best SIP funds", "SIP strategies"];
            } else if (responseLower.includes('stock') || responseLower.includes('share') || responseLower.includes('market')) {
                suggestions = ["Get stock prices", "Stock analysis", "Market trends"];
            } else {
                suggestions = ["ESG investing", "SIP planning", "Portfolio advice"];
            }

            return res.json({
                success: true,
                response: aiResponse,
                suggestions: suggestions,
                timestamp: new Date(),
                source: 'openai-gpt'
            });

        } catch (openaiError) {
            console.error('OpenAI API Error:', openaiError);
            
            // Fallback response if OpenAI fails
            const userMsg = message.toLowerCase();
            let fallbackResponse = '';
            
            if (userMsg.includes('esg') || userMsg.includes('sustainable')) {
                fallbackResponse = `Here are top ESG mutual funds I recommend as your broker:

**Top ESG Funds:**
1. **Aditya Birla Sun Life ESG Fund** - 15.2% returns, 0.75% expense ratio, A+ rating
2. **SBI Magnum ESG Fund** - 13.8% returns, 0.82% expense ratio, A rating  
3. **ICICI Prudential ESG Fund** - 14.5% returns, 0.79% expense ratio, A+ rating

**My Broker Advantage:** With VittaVardhan's zero brokerage, 100% of your money goes into investments! Traditional brokers charge ₹20-50 per transaction, but we charge ₹0.

What's your investment goal and risk tolerance? I can help you choose the best ESG fund.`;
            } else if (userMsg.includes('sip')) {
                fallbackResponse = `**SIP Benefits:** Power of compounding - ₹5,000/month for 10 years = ₹11.27 lakhs at 12% returns. 

**My Broker Advantage:** ZERO brokerage saves you ₹6,000-15,000 annually compared to traditional brokers. More money working for you!

Would you like me to calculate your SIP returns? Just share your monthly amount, expected return, and time period.`;
            } else {
                fallbackResponse = `Welcome! I'm your ESG investment broker at VittaVardhan. I help investors build sustainable portfolios with zero brokerage fees. 

I can assist you with:
- ESG fund recommendations based on your goals
- SIP planning and calculations
- Portfolio optimization
- Zero-brokerage investing strategies

What would you like to invest in today?`;
            }

            return res.json({
                success: true,
                response: fallbackResponse,
                suggestions: ["What is ESG?", "Calculate SIP", "Best ESG funds", "Portfolio help"],
                timestamp: new Date(),
                source: 'fallback'
            });
        }
        
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process message. Please try again.'
        });
    }
});

// SIP Calculator endpoint
router.post('/calculate-sip-free', async (req, res) => {
    try {
        const { monthlyAmount, expectedReturn, timePeriod, stepUp = 0 } = req.body;

        console.log('📊 SIP Calculation Request:', { monthlyAmount, expectedReturn, timePeriod, stepUp });

        // Validate inputs
        if (!monthlyAmount || !expectedReturn || !timePeriod) {
            return res.status(400).json({
                success: false,
                error: 'Monthly amount, expected return, and time period are required'
            });
        }

        // Convert to numbers
        const monthly = parseFloat(monthlyAmount);
        const returnRate = parseFloat(expectedReturn);
        const period = parseFloat(timePeriod);
        const stepUpRate = parseFloat(stepUp) || 0;

        // Validate numeric values
        if (isNaN(monthly) || isNaN(returnRate) || isNaN(period) || monthly <= 0 || returnRate <= 0 || period <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid input values. All values must be positive numbers.'
            });
        }

        // Calculate monthly interest rate
        const monthlyRate = returnRate / (12 * 100);
        const totalMonths = period * 12;
        
        let maturityAmount = 0;
        let totalInvestment = 0;
        
        // Enhanced calculation with step-up SIPs
        if (stepUpRate > 0) {
            let currentSIP = monthly;
            for (let year = 0; year < period; year++) {
                const yearlyInvestment = currentSIP * 12;
                const remainingYears = period - year;
                const futureValue = yearlyInvestment * (((Math.pow(1 + monthlyRate, remainingYears * 12) - 1) / monthlyRate) * (1 + monthlyRate));
                
                maturityAmount += futureValue;
                totalInvestment += yearlyInvestment;
                
                currentSIP += currentSIP * (stepUpRate / 100);
            }
        } else {
            // Regular SIP calculation formula
            maturityAmount = monthly * 
                (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
                (1 + monthlyRate));
            totalInvestment = monthly * totalMonths;
        }

        const totalGains = maturityAmount - totalInvestment;
        const absoluteReturn = ((totalGains / totalInvestment) * 100);
        // Calculate brokerage saved (₹20 per transaction, one transaction per month)
        const brokerageSaved = totalMonths * 20;

        console.log('✅ SIP Calculation successful');

        res.json({
            success: true,
            data: {
                input: {
                    monthlyAmount: monthly,
                    expectedReturn: returnRate,
                    timePeriod: period,
                    stepUp: stepUpRate
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
                    yearlyProjection: Array.from({length: period}, (_, i) => {
                        const year = i + 1;
                        const monthsCompleted = year * 12;
                        const yearlyMaturity = monthly * 
                            (((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * 
                            (1 + monthlyRate));
                        return {
                            year: year,
                            invested: monthly * monthsCompleted,
                            value: Math.round(yearlyMaturity),
                            gains: Math.round(yearlyMaturity - (monthly * monthsCompleted))
                        };
                    })
                }
            }
        });

    } catch (error) {
        console.error('❌ SIP calculation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate SIP returns. Please check your inputs and try again.'
        });
    }
});

module.exports = router;
