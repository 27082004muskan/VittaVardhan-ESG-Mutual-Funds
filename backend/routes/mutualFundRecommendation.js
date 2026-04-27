const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/recommend', async (req, res) => {
  try {
    const { age, monthlyIncome, monthlyInvestment, riskProfile, investmentHorizonYears, goal } = req.body || {};

    const modelUrl =
      process.env.ML_MODEL_URL || 'http://localhost:8000/recommend';

    // Proxy request to Python ML service
    const response = await axios.post(
      modelUrl,
      {
        age,
        monthlyIncome,
        monthlyInvestment,
        riskProfile,
        investmentHorizonYears,
        goal
      },
      { timeout: 30000 }
    );

    return res.json({
      success: true,
      recommendations: response.data?.recommendations || response.data || [],
      source: 'ml-model'
    });
  } catch (error) {
    console.error('ML recommendation route error:', error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error:
        'Unable to fetch ML recommendations. Please ensure your ML model service is running and reachable.',
      details: error?.response?.data || error.message
    });
  }
});

module.exports = router;

