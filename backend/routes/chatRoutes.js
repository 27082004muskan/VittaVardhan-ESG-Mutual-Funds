const express = require('express');
const router = express.Router();
const axios = require('axios');
const OpenAI = require('openai');

function cleanModelOutput(text) {
  if (!text) return '';
  let cleaned = String(text);
  // Remove any chain-of-thought blocks like <think> ... </think>
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
  return cleaned.trim();
}

function buildSuggestionsFromResponse(text) {
  const responseLower = String(text || '').toLowerCase();
  if (responseLower.includes('esg') || responseLower.includes('sustainable') || responseLower.includes('fund')) {
    return ["Best ESG funds", "ESG SIP calculator", "ESG portfolio"];
  }
  if (responseLower.includes('sip') || responseLower.includes('systematic') || responseLower.includes('investment plan')) {
    return ["Calculate SIP returns", "Best SIP funds", "SIP strategies"];
  }
  if (responseLower.includes('stock') || responseLower.includes('share') || responseLower.includes('market')) {
    return ["Get stock prices", "Stock analysis", "Market trends"];
  }
  return ["ESG investing", "SIP planning", "Portfolio advice"];
}

async function generateWithHuggingFace({ systemPrompt, userMessage }) {
  const hfKey = process.env.HF_API_KEY;
  // Hugging Face Inference Providers use an OpenAI-compatible API.
  // Docs: https://huggingface.co/docs/api-inference/quicktour
  const hfModel = process.env.HF_MODEL || 'deepseek-ai/DeepSeek-R1:fastest';

  if (!hfKey) return null;

  const url = 'https://router.huggingface.co/v1/chat/completions';

  const { data } = await axios.post(
    url,
    {
      model: hfModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 300,
      stream: false
    },
    {
      headers: {
        Authorization: `Bearer ${hfKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  const content = data?.choices?.[0]?.message?.content;
  const cleaned = cleanModelOutput(content);
  if (cleaned) return cleaned;

  const errorMsg = data?.error?.message || data?.error || 'unexpected response format';
  throw new Error(`Hugging Face router error: ${errorMsg}`);
}

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('✅ OpenAI client initialized (backup provider)');
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI client:', error.message);
  }
} else {
  // If Hugging Face is configured, OpenAI is optional (backup only).
  if (!process.env.HF_API_KEY) {
    console.warn('⚠️  WARNING: No AI provider key found (HF_API_KEY / OPENAI_API_KEY). Using local fallback responses.');
  }
}

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

        const userMsg = message.toLowerCase();

        // 💡 High-confidence, rule-based replies for common questions

        // 1) Difference between saving and investing
        if (
            userMsg.includes('difference between saving and investing') ||
            (userMsg.includes('saving') && userMsg.includes('investing') && userMsg.includes('difference'))
        ) {
            const resp =
                `**Saving vs Investing:**\n\n` +
                `- **Saving** means keeping money safe (for example, in a savings account). The focus is on **safety and liquidity**, not high returns.\n` +
                `- **Investing** means putting money into assets like **mutual funds, stocks, or bonds** to grow it over time.\n\n` +
                `As your ESG broker at VittaVardhan, I recommend: first build a basic **emergency fund (3–6 months of expenses)** in savings, then start **SIP investments** for long‑term goals.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Why is an emergency fund important?", "What is SIP?", "Beginner ESG SIP plan"],
                timestamp: new Date(),
                source: 'local-saving-vs-investing'
            });
        }

        // 2) Emergency fund
        if (userMsg.includes('emergency fund')) {
            const resp =
                `An **emergency fund** is money kept aside for unexpected situations like **job loss, medical issues, or urgent expenses**.\n\n` +
                `✔ Ideally, keep **3–6 months of your monthly expenses** in a very safe place (savings account or liquid fund).\n` +
                `✔ This protects your long‑term investments so you **don’t need to break your SIPs or sell funds in a market crash**.\n\n` +
                `Once your emergency fund is in place, we can plan an **ESG SIP** for long‑term goals.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["How much should I save monthly?", "What is SIP?", "Plan my ESG SIP"],
                timestamp: new Date(),
                source: 'local-emergency-fund'
            });
        }

        // 3) 50-30-20 rule
        if (userMsg.includes('50-30-20') || userMsg.includes('50 30 20')) {
            const resp =
                `The **50-30-20 rule** is a simple budgeting formula:\n\n` +
                `- **50%** of income → **Needs** (rent, bills, groceries)\n` +
                `- **30%** → **Wants** (shopping, eating out, lifestyle)\n` +
                `- **20%** → **Savings & Investments** (SIP, emergency fund, goals)\n\n` +
                `If you follow this, we can use the **20% part** to create a structured ESG investment plan for you.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["How much should I save monthly?", "Help me plan a SIP", "ESG portfolio advice"],
                timestamp: new Date(),
                source: 'local-50-30-20'
            });
        }

        // 4) What is SIP
        if (userMsg.includes('what is sip') || (userMsg.includes('sip') && userMsg.includes('meaning'))) {
            const resp =
                `**SIP (Systematic Investment Plan)** lets you invest a fixed amount **regularly** (monthly/weekly) into a mutual fund.\n\n` +
                `Benefits:\n` +
                `- Builds wealth gradually through **power of compounding**\n` +
                `- Brings **discipline** — money is invested automatically\n` +
                `- Uses **rupee-cost averaging** (you buy more units when markets are low, fewer when high)\n\n` +
                `At VittaVardhan, we can set up a **zero‑brokerage ESG SIP** starting with small amounts.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Calculate SIP", "Beginner ESG SIP plan", "What is compound interest?"],
                timestamp: new Date(),
                source: 'local-sip'
            });
        }

        // 5) Compound interest
        if (userMsg.includes('compound interest')) {
            const resp =
                `**Compound interest** means you earn interest on your **initial investment + the interest already earned**.\n\n` +
                `Example: If you invest in an ESG SIP, the returns every year get reinvested, so over time your money can grow like a **snowball**.\n\n` +
                `This is why starting **early** and staying invested for the long term is so powerful.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["When should I start investing?", "Calculate SIP", "Long-term ESG strategy"],
                timestamp: new Date(),
                source: 'local-compound-interest'
            });
        }

        // 6) Safer: FD or mutual funds
        if (
            userMsg.includes('safer') &&
            (userMsg.includes('fd') || userMsg.includes('fixed deposit')) &&
            userMsg.includes('mutual')
        ) {
            const resp =
                `**Fixed Deposit (FD) vs Mutual Funds:**\n\n` +
                `- **FD:** Low risk, fixed returns, backed by the bank. Returns are usually lower but more stable.\n` +
                `- **Mutual Funds:** Market‑linked, can give **higher long‑term returns** but come with ups and downs.\n\n` +
                `For **short‑term goals or emergency funds → FD / very safe options**.\n` +
                `For **long‑term goals (5+ years) → diversified mutual funds / ESG funds** are usually better.\n\n` +
                `We can mix both based on your timeline and risk comfort.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Plan my goals", "Beginner ESG SIP plan", "What is an emergency fund?"],
                timestamp: new Date(),
                source: 'local-fd-vs-mf'
            });
        }

        // 7) Section 80C
        if (userMsg.includes('section 80c') || userMsg.includes(' 80c')) {
            const resp =
                `**Section 80C** of the Income Tax Act lets you **save tax up to ₹1.5 lakh per year**.\n\n` +
                `Popular 80C options:\n` +
                `- **PPF (Public Provident Fund)**\n` +
                `- **ELSS (Equity Linked Savings Scheme) mutual funds**\n` +
                `- **EPF/VPF, life insurance premiums, certain fixed deposits**, etc.\n\n` +
                `If you want tax‑saving with growth, **ELSS funds** can be a good option (3‑year lock‑in, equity‑based).`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["What is PPF?", "What is ELSS?", "Tax‑saving SIP ideas"],
                timestamp: new Date(),
                source: 'local-80c'
            });
        }

        // 8) PPF
        if (userMsg.includes('what is ppf') || userMsg.startsWith('ppf ')) {
            const resp =
                `**PPF (Public Provident Fund)** is a long‑term, government‑backed savings scheme.\n\n` +
                `- Lock‑in: **15 years** (with partial withdrawal options later)\n` +
                `- Returns: Fixed and tax‑free (rate decided by the government)\n` +
                `- Tax: **EEE** (Exempt on investment, growth, and withdrawal under Section 80C)\n\n` +
                `PPF is good for **very safe, long‑term goals**, while ESG mutual funds are better for higher growth with some risk.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["What is ELSS?", "Compare PPF vs ELSS", "Long‑term goal planning"],
                timestamp: new Date(),
                source: 'local-ppf'
            });
        }

        // 9) ELSS
        if (userMsg.includes('what is elss')) {
            const resp =
                `**ELSS (Equity Linked Savings Scheme)** is a type of mutual fund that offers **tax benefit under Section 80C** with a **3‑year lock‑in**.\n\n` +
                `- Invests mainly in **equities (stocks)**\n` +
                `- Shortest lock‑in among 80C options\n` +
                `- Good for investors who want **tax saving + higher return potential** and can handle market risk\n\n` +
                `There are also **ESG‑focused ELSS funds** which combine tax savings with sustainable investing.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Best ESG / ELSS funds", "Plan tax‑saving SIP", "Risk vs return in ELSS"],
                timestamp: new Date(),
                source: 'local-elss'
            });
        }

        // 10) When should I start investing
        if (userMsg.includes('when should i start investing')) {
            const resp =
                `The best time to start investing is **as early as possible**.\n\n` +
                `Starting early gives more time for **compounding** to work, even with small SIPs. Waiting 5–10 years can reduce your final wealth **by a big margin**.\n\n` +
                `Even if you start with **₹500–₹1,000 per month** in an ESG SIP, consistency matters more than the initial amount.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Can I start with ₹500?", "Help me start an ESG SIP", "What is compound interest?"],
                timestamp: new Date(),
                source: 'local-start-investing'
            });
        }

        // 11) How much should I save monthly
        if (userMsg.includes('how much should i save') || userMsg.includes('save monthly')) {
            const resp =
                `As a thumb rule, try to save **20–30% of your monthly income**.\n\n` +
                `If that’s difficult right now, even **5–10% is a good start** — you can increase it as your income grows.\n\n` +
                `A simple approach:\n` +
                `- Build your **emergency fund** first\n` +
                `- Then split new savings between **ESG SIPs** (long‑term goals) and other priorities.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["What is the 50-30-20 rule?", "Plan my SIP amount", "Goal‑based investing help"],
                timestamp: new Date(),
                source: 'local-save-monthly'
            });
        }

        // 12) Inflation 6% vs return 4%
        if (userMsg.includes('inflation is 6') && userMsg.includes('return is 4')) {
            const resp =
                `If **inflation is 6%** and your return is **only 4%**, you are actually **losing purchasing power**.\n\n` +
                `Your money is growing slower than prices, so in real terms you can buy **less** in the future.\n\n` +
                `That’s why for long‑term goals we prefer **growth‑oriented investments** (like diversified ESG funds) instead of only low‑return options.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Help me beat inflation", "ESG mutual fund options", "Long‑term SIP planning"],
                timestamp: new Date(),
                source: 'local-inflation-quiz'
            });
        }

        // 13) Savings account enough for retirement?
        if (userMsg.includes('savings account') && userMsg.includes('retirement')) {
            const resp =
                `Keeping all your money only in a **savings account is not enough for retirement**.\n\n` +
                `Savings accounts usually **do not beat inflation**, so your money may lose value over time.\n\n` +
                `For retirement, you need a **mix of growth investments** (like mutual funds / ESG funds) plus **safer assets** as you get closer to your goal.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Plan my retirement SIP", "How much should I invest monthly?", "ESG retirement portfolio"],
                timestamp: new Date(),
                source: 'local-retirement-savings'
            });
        }

        // 14) Delay investing by 5 years
        if (userMsg.includes('delay investing') && userMsg.includes('5 years')) {
            const resp =
                `Delaying investing by **5 years** can **significantly reduce** your final wealth because you lose early years of **compounding**.\n\n` +
                `Two people investing the same monthly amount, but one starts 5 years earlier, can end up with **lakhs of rupees difference** at retirement.\n\n` +
                `It’s better to start small **now** and increase later, rather than waiting to start “perfectly” later.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Start an ESG SIP now", "How much should I start with?", "What is compound interest?"],
                timestamp: new Date(),
                source: 'local-delay-investing'
            });
        }

        // 15) What is ESG investing
        if (userMsg.includes('what is esg investing')) {
            const resp =
                `**ESG investing** means choosing investments based on **Environmental, Social, and Governance** factors along with financial returns.\n\n` +
                `You invest in companies / funds that:\n` +
                `- Care about the **environment** (lower pollution, climate action)\n` +
                `- Treat **people** well (employees, customers, community)\n` +
                `- Follow good **governance** (ethics, transparency, no major scandals)\n\n` +
                `With VittaVardhan, we focus on **Indian ESG mutual funds** that aim to create both **wealth + positive impact**, with **₹0 brokerage**.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Best ESG funds", "Start an ESG SIP", "ESG vs normal mutual funds"],
                timestamp: new Date(),
                source: 'local-esg-investing'
            });
        }

        // 16) Can I start investing with ₹500?
        if (userMsg.includes('start investing with 500') || userMsg.includes('start with 500')) {
            const resp =
                `Yes, you **can start investing with ₹500 per month**.\n\n` +
                `Many mutual funds (including ESG funds) allow SIPs starting from **₹500**.\n\n` +
                `The key is to **start now**, stay consistent, and increase the SIP amount as your income grows. Small amounts + time + compounding can still create meaningful wealth.`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Help me start a ₹500 SIP", "Beginner ESG SIP plan", "What is SIP?"],
                timestamp: new Date(),
                source: 'local-start-500'
            });
        }

        // 17) AI / technology mutual funds (India)
        if (
            userMsg.includes('ai mutual fund') ||
            userMsg.includes('ai mutual funds') ||
            (userMsg.includes('artificial intelligence') && userMsg.includes('fund')) ||
            (userMsg.includes('ai') && userMsg.includes('mutual fund')) ||
            (userMsg.includes('ai') && userMsg.includes('mutual funds')) ||
            userMsg.includes('technology fund') ||
            userMsg.includes('tech mutual fund')
        ) {
            const resp =
                `Here are some **AI and technology-focused mutual fund ideas** you can explore. In India, most options are **technology/innovation themed**, not pure “AI-only” funds, but they still give you exposure to companies driving AI.\n\n` +
                `### 1) Technology-focused funds (India)\n` +
                `- **ICICI Prudential Technology Fund** – invests in Indian and global IT companies with strong exposure to cloud, automation, and AI.\n` +
                `- **SBI Technology Opportunities Fund** – sectoral fund focusing on tech firms involved in data, analytics, software and automation.\n\n` +
                `These are suitable for long-term investors who believe in the growth of the tech and AI ecosystem and can handle short‑term volatility.\n\n` +
                `### 2) Global / US tech exposure\n` +
                `- **Motilal Oswal Nasdaq 100 FOF** – tracks the NASDAQ 100 index, which has heavy weights in global tech and AI leaders.\n` +
                `- **Nippon India US Equity Opportunities Fund** – gives exposure to large US technology and innovation companies.\n\n` +
                `These funds indirectly capture the AI growth story through companies like cloud providers, chip makers and software giants.\n\n` +
                `### 3) How to decide based on risk\n` +
                `- **More balanced growth:** diversified flexi‑cap funds with some tech/AI exposure.\n` +
                `- **Higher growth / higher risk:** dedicated technology or global tech funds.\n\n` +
                `Before investing, be clear about your **time horizon (ideally 5+ years)**, your **risk tolerance**, and whether you prefer **SIP or lump sum**. For personalised allocation, share your age, monthly investment amount and risk level (low / medium / high).`;

            return res.json({
                success: true,
                response: resp,
                suggestions: ["Plan an AI + ESG portfolio", "Start a tech SIP", "Compare tech vs diversified funds"],
                timestamp: new Date(),
                source: 'local-ai-funds'
            });
        }

        // ESG-specific rule handlers
        const asksEsgDefinition =
            /what\s+is\s+esg/.test(userMsg) ||
            /full\s*form/.test(userMsg) ||
            /meaning\s+of\s+esg/.test(userMsg) ||
            /define\s+esg/.test(userMsg) ||
            /esg\s+stands\s+for/.test(userMsg) ||
            /esg\s+full\s*form/.test(userMsg);

        if (asksEsgDefinition) {
            const definitionResponse =
                `**ESG full form:** Environmental, Social, and Governance.\n\n` +
                `**What it means:** ESG is a framework to judge how responsibly a company or fund operates:\n` +
                `- **E (Environmental):** carbon footprint, energy use, pollution, water & waste management\n` +
                `- **S (Social):** employee welfare, customer safety, community impact, diversity & inclusion\n` +
                `- **G (Governance):** board independence, ethics, transparency, shareholder rights\n\n` +
                `**For investing:** ESG funds select companies with stronger ESG practices and avoid high‑risk, poorly governed businesses. ` +
                `With VittaVardhan’s **₹0 brokerage**, more of your SIP goes directly into these ESG funds instead of fees.`;

            return res.json({
                success: true,
                response: definitionResponse,
                suggestions: ["Best ESG funds", "Start an ESG SIP", "How ESG scoring works", "Portfolio advice"],
                timestamp: new Date(),
                source: 'local-esg-definition'
            });
        }

        const beginnerFundQuestion =
            userMsg.includes('beginner') &&
            (userMsg.includes('fund') || userMsg.includes('esg') || userMsg.includes('invest'));

        if (beginnerFundQuestion) {
            const beginnerResponse =
                `As a beginner in ESG investing, a good starting point is a **diversified ESG equity mutual fund via SIP** (Systematic Investment Plan).\n\n` +
                `**1) What type of fund?**\n` +
                `- Choose a **large & mid-cap ESG fund** or **multi‑cap ESG fund** (more diversified, smoother ride).\n` +
                `- Look for 5+ year track record, A/A+ ESG rating, and reasonable expense ratio (< ~1%).\n\n` +
                `**2) Key conditions to check:**\n` +
                `- **Time horizon:** Aim for at least **5–7 years**.\n` +
                `- **Risk tolerance:** Be comfortable with **short‑term ups & downs** of equity.\n` +
                `- **SIP amount:** Start with an amount you can continue monthly without stress (e.g., ₹3k–₹5k).\n` +
                `- **Fund house quality:** Prefer established AMCs with transparent ESG methodology.\n\n` +
                `If you tell me your **monthly budget, time horizon, and risk level (low/medium/high)**, I can suggest a more tailored ESG SIP structure for you.`;

            return res.json({
                success: true,
                response: beginnerResponse,
                suggestions: ["Best ESG funds", "Calculate SIP", "ESG SIP strategies", "Portfolio advice"],
                timestamp: new Date(),
                source: 'local-beginner-guidance'
            });
        }

        // If Hugging Face is configured, we don't need to warn about OpenAI being absent.

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

        // Prefer Hugging Face if configured
        if (process.env.HF_API_KEY) {
            try {
                const hfResponse = await generateWithHuggingFace({ systemPrompt, userMessage: message });
                if (hfResponse) {
                    return res.json({
                        success: true,
                        response: hfResponse,
                        suggestions: buildSuggestionsFromResponse(hfResponse),
                        timestamp: new Date(),
                        source: 'huggingface'
                    });
                }
            } catch (hfError) {
                console.error('Hugging Face API Error:', hfError?.response?.data || hfError);
                // Fall through to OpenAI/fallback
            }
        }

        // Only use OpenAI if client is initialized
        let openaiFailure = null;
        if (openai && process.env.OPENAI_API_KEY) {
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

            const aiResponse = cleanModelOutput(completion.choices[0].message.content);
            
            console.log('✅ OpenAI API Success!');
            
            return res.json({
                success: true,
                response: aiResponse,
                suggestions: buildSuggestionsFromResponse(aiResponse),
                timestamp: new Date(),
                source: 'openai-gpt'
            });
            } catch (openaiError) {
                openaiFailure = openaiError;
                console.error('OpenAI API Error:', openaiError);
                // Fall through to fallback response below
            }
        }
        
        // Fallback response (used when OpenAI is not available or fails)
        {
            if (!openai || !process.env.OPENAI_API_KEY) {
                console.warn('⚠️  Using fallback response (OpenAI not configured)');
            } else if (openaiFailure) {
                console.warn('⚠️  Using fallback response (OpenAI request failed)');
            }
            
            // Fallback response if OpenAI fails
            const userMsg = message.toLowerCase();
            let fallbackResponse = '';
            
            const asksEsgDefinition =
                /what\s+is\s+esg/.test(userMsg) ||
                /full\s*form/.test(userMsg) ||
                /meaning\s+of\s+esg/.test(userMsg) ||
                /define\s+esg/.test(userMsg) ||
                /esg\s+stands\s+for/.test(userMsg) ||
                /esg\s+full\s*form/.test(userMsg);

            if (asksEsgDefinition) {
                fallbackResponse =
                    `**ESG full form:** Environmental, Social, and Governance.\n\n` +
                    `**What it means:** ESG is a way to evaluate how responsibly a company or fund operates:\n` +
                    `- **E (Environmental):** carbon footprint, energy use, pollution, water/waste management\n` +
                    `- **S (Social):** employee welfare, customer safety, community impact, diversity\n` +
                    `- **G (Governance):** board independence, ethics, transparency, shareholder rights\n\n` +
                    `**In investing:** ESG funds try to pick companies with stronger ESG practices (and avoid high‑risk, poorly governed companies). With VittaVardhan’s **₹0 brokerage**, more of your SIP goes into the fund.`;
            } else if (userMsg.includes('esg') || userMsg.includes('sustainable')) {
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
                suggestions: asksEsgDefinition
                    ? ["Best ESG funds", "Start an ESG SIP", "How ESG scoring works", "Portfolio advice"]
                    : ["What is ESG?", "Calculate SIP", "Best ESG funds", "Portfolio help"],
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
