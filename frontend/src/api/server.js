import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import process from 'process';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Fund symbols and cache setup
const fundSymbols = [
  { symbol: 'SBISX', name: 'SBI ESG Fund' },
  { symbol: 'HDFCX', name: 'HDFC ESG Fund' },
  { symbol: 'ICICI', name: 'ICICI ESG Fund' },
  { symbol: 'AXISX', name: 'Axis ESG Fund' },
  { symbol: 'KOTAX', name: 'Kotak ESG Fund' }
];

let esgDataCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ESG Score function
async function getESGScore(symbol) {
  if (esgDataCache.has(symbol)) {
    const cachedData = esgDataCache.get(symbol);
    if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
  }

  try {
    const url = `https://www.alphavantage.co/query?function=ESG&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    
    const esgData = {
      timestamp: Date.now(),
      data: response.data
    };
    
    esgDataCache.set(symbol, esgData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ESG score for ${symbol}:`, error);
    return null;
  }
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// News endpoint
app.get('/api/news', async (req, res) => {
  console.log('Received request for /api/news');
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'green investment OR sustainable finance OR ESG investing',
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const articles = response.data.articles.slice(0, 5);
    console.log('Successfully fetched news articles');
    res.json(articles);
  } catch (error) {
    console.error('News API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Green Funds endpoint
app.get('/api/green-funds', async (req, res) => {
  try {
    const fundsWithESG = await Promise.all(
      fundSymbols.map(async (fund) => {
        const esgData = await getESGScore(fund.symbol);
        
        return {
          id: fund.symbol,
          name: fund.name,
          symbol: fund.symbol,
          esgScore: esgData?.ESGScore || Math.random() * 20 + 70,
          aum: Math.random() * 5000 + 3000,
          expenseRatio: (Math.random() * 1 + 0.5).toFixed(2),
          riskLevel: Math.floor(Math.random() * 5) + 1
        };
      })
    );

    res.json(fundsWithESG);
  } catch (error) {
    console.error('Error fetching funds:', error);
    res.status(500).json({ error: 'Failed to fetch fund data' });
  }
});

// Fund Recommendations endpoint
app.get('/api/recommendations/:fundId', async (req, res) => {
  try {
    const fundId = req.params.fundId;
    const fund = fundSymbols.find(f => f.symbol === fundId);
    
    if (!fund) {
      return res.status(404).json({ error: 'Fund not found' });
    }

    // const esgData = await getESGScore(fund.symbol);
    
    const recommendations = await Promise.all(
      fundSymbols
        .filter(f => f.symbol !== fundId)
        .slice(0, 3)
        .map(async (f) => {
          const recEsgData = await getESGScore(f.symbol);
          return {
            id: f.symbol,
            name: f.name,
            symbol: f.symbol,
            esgScore: recEsgData?.ESGScore || Math.random() * 20 + 70,
            similarityScore: Math.round(Math.random() * 30 + 70)
          };
        })
    );

    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`News endpoint available at http://localhost:${PORT}/api/news`);
  console.log(`Green funds endpoint available at http://localhost:${PORT}/api/green-funds`);
}); 