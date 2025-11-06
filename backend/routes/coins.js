const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/coins - current user's balance
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('coins');
    res.json({ success: true, coins: user?.coins || 0 });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch coins' });
  }
});

// POST /api/coins/award - add coins to current user
// body: { coins?: number, amount?: number }
router.post('/award', protect, async (req, res) => {
  try {
    const coinsFromBody = parseInt(req.body.coins, 10);
    const amount = parseFloat(req.body.amount);
    let toAdd = 0;
    if (!isNaN(coinsFromBody)) {
      toAdd = Math.max(0, coinsFromBody);
    } else if (!isNaN(amount)) {
      toAdd = Math.floor(amount / 500); // 1 coin per ₹500 by default
    }
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { coins: toAdd } },
      { new: true, select: 'coins' }
    );
    res.json({ success: true, coinsAwarded: toAdd, totalCoins: updated.coins });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to award coins' });
  }
});

module.exports = router;



