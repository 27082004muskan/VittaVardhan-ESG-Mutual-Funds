const User = require('../models/User');
const Profile = require('../models/Profile');
const { validationResult } = require('express-validator');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create empty profile if doesn't exist
    if (!profile) {
      profile = new Profile({ user: req.user.id });
      await profile.save();
      
      // Update user hasProfile flag
      user.hasProfile = true;
      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasProfile: user.hasProfile,
        createdAt: user.createdAt
      },
      profile: {
        id: profile._id,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        address: profile.address,
        riskTolerance: profile.riskTolerance,
        investmentGoals: profile.investmentGoals,
        monthlyIncome: profile.monthlyIncome,
        investmentExperience: profile.investmentExperience,
        esgPriorities: profile.esgPriorities,
        excludeIndustries: profile.excludeIndustries,
        totalInvestment: profile.totalInvestment,
        currentPortfolioValue: profile.currentPortfolioValue,
        investmentHorizon: profile.investmentHorizon,
        profileCompleted: profile.profileCompleted,
        completionPercentage: profile.completionPercentage,
        lastUpdated: profile.lastUpdated
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user name if provided
    if (req.body.name && req.body.name !== user.name) {
      user.name = req.body.name;
      await user.save();
      
      // Update localStorage
      const updatedUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider
      };
    }

    // Find or create profile
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({ user: req.user.id });
    }

    // Update profile fields
    const updateFields = [
      'phone', 'dateOfBirth', 'gender', 'address', 'riskTolerance',
      'investmentGoals', 'monthlyIncome', 'investmentExperience',
      'esgPriorities', 'excludeIndustries', 'totalInvestment',
      'currentPortfolioValue', 'investmentHorizon'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    // Update user hasProfile flag
    user.hasProfile = true;
    await user.save();

    console.log('✅ Profile updated successfully for:', user.email);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasProfile: user.hasProfile
      },
      profile: {
        id: profile._id,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        address: profile.address,
        riskTolerance: profile.riskTolerance,
        investmentGoals: profile.investmentGoals,
        monthlyIncome: profile.monthlyIncome,
        investmentExperience: profile.investmentExperience,
        esgPriorities: profile.esgPriorities,
        excludeIndustries: profile.excludeIndustries,
        totalInvestment: profile.totalInvestment,
        currentPortfolioValue: profile.currentPortfolioValue,
        investmentHorizon: profile.investmentHorizon,
        profileCompleted: profile.profileCompleted,
        completionPercentage: profile.completionPercentage,
        lastUpdated: profile.lastUpdated
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
