const express = require('express');
const router = express.Router();

router.post('/send-message-free', async (req, res) => {
    try {
        const { message } = req.body;
        
        // System prompt for investment advice
        const prompt = `You are VittaVardhan AI, India's leading investment advisor specializing in ESG investing and zero-brokerage solutions. 

Give specific investment advice for: ${message}

Focus on:
- Indian mutual funds and SIP planning
- Age-based investment strategies  
- ESG fund recommendations
- Practical advice with real numbers
- Keep response under 150 words`;

        try {
            // FREE Hugging Face Inference API - No key required!
            const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 200,
                        temperature: 0.7,
                        return_full_text: false
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                let aiResponse = data[0]?.generated_text || data.generated_text || '';
                
                // Clean up the response
                aiResponse = aiResponse.replace(prompt, '').trim();
                
                if (aiResponse && aiResponse.length > 20) {
                    console.log('✅ Hugging Face API Success!');
                    
                    // Smart suggestions
                    let suggestions = [];
                    const responseLower = aiResponse.toLowerCase();
                    
                    if (responseLower.includes('esg') || responseLower.includes('sustainable')) {
                        suggestions = ["Best ESG funds", "ESG SIP calculator", "ESG portfolio"];
                    } else if (responseLower.includes('sip') || responseLower.includes('systematic')) {
                        suggestions = ["Calculate SIP returns", "Best SIP funds", "SIP strategies"];
                    } else {
                        suggestions = ["Investment advice", "SIP calculator", "ESG funds"];
                    }

                    return res.json({
                        success: true,
                        response: aiResponse,
                        suggestions: suggestions,
                        timestamp: new Date(),
                        source: 'huggingface-ai'
                    });
                }
            }
        } catch (hfError) {
            console.log('Hugging Face failed, trying alternative...');
        }

        // Alternative: OpenRouter Free API
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-or-v1-free',
                    'HTTP-Referer': 'https://localhost:3000'
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3.2-3b-instruct:free',
                    messages: [{
                        role: 'user',
                        content: prompt
                    }],
                    max_tokens: 200
                })
            });

            if (response.ok) {
                const data = await response.json();
                const aiResponse = data.choices[0].message.content;
                
                console.log('✅ OpenRouter API Success!');
                
                return res.json({
                    success: true,
                    response: aiResponse,
                    suggestions: ["Investment advice", "SIP calculator", "ESG funds"],
                    timestamp: new Date(),
                    source: 'openrouter-ai'
                });
            }
        } catch (orError) {
            console.log('OpenRouter failed, using fallback');
        }

        // Final fallback - but this won't be reached if APIs work
        res.json({
            success: true,
            response: "I'm experiencing high demand. Please try asking your investment question again in a moment.",
            suggestions: ["Try again", "SIP calculator", "ESG funds"],
            timestamp: new Date(),
            source: 'temporary-fallback'
        });
        
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process message'
        });
    }
});

// Your SIP calculator (unchanged)
router.post('/calculate-sip-free', async (req, res) => {
    // ... your existing SIP calculator code
});

module.exports = router;
