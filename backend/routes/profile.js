const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');

// @route GET /api/profile
// @desc Get user profile
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const user = req.user;
    let profile = await Profile.findOne({ user: user._id });
    
    if (!profile) {
      profile = new Profile({ 
        user: user._id,
        profileCompleted: false,
        completionPercentage: 0
      });
      await profile.save();
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        hasProfile: user.hasProfile
      },
      profile: profile
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route PUT /api/profile
// @desc Update user profile
// @access Private
router.put('/', protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      riskTolerance,
      investmentGoals,
      monthlyIncome,
      investmentExperience,
      esgPriorities,
      excludeIndustries,
      investmentHorizon,
      address
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name: name,
        hasProfile: true 
      },
      { new: true }
    ).select('-password');

    const profileData = {
      user: req.user._id,
      phone,
      dateOfBirth,
      gender,
      address,
      riskTolerance,
      investmentGoals: investmentGoals || [],
      monthlyIncome,
      investmentExperience,
      esgPriorities: esgPriorities || [],
      excludeIndustries: excludeIndustries || [],
      investmentHorizon
    };

    let profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        hasProfile: updatedUser.hasProfile,
        profileCompleted: profile.profileCompleted
      },
      profile: profile
    });

  } catch (error) {
    console.error('Profile update error:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route POST /api/profile/complete
// @desc Complete user profile setup (first time)
// @access Private
router.post('/complete', protect, async (req, res) => {
  try {
    console.log('📥 Received profile completion request');
    console.log('📦 Request body:', req.body);

    // Handle both FormData and JSON requests
    let profileData;
    
    if (req.body.name && typeof req.body.investmentGoals === 'string') {
      // FormData request - parse JSON strings
      profileData = {
        name: req.body.name,
        phone: req.body.phone || '',
        dateOfBirth: req.body.dateOfBirth || null,
        gender: req.body.gender || '',
        riskTolerance: req.body.riskTolerance || 'moderate',
        investmentGoals: JSON.parse(req.body.investmentGoals || '[]'),
        monthlyIncome: req.body.monthlyIncome || '',
        investmentExperience: req.body.investmentExperience || 'beginner',
        esgPriorities: JSON.parse(req.body.esgPriorities || '[]'),
        excludeIndustries: JSON.parse(req.body.excludeIndustries || '[]'),
        investmentHorizon: req.body.investmentHorizon || 'medium_term'
      };
    } else {
      // JSON request
      profileData = {
        name: req.body.name,
        phone: req.body.phone || '',
        dateOfBirth: req.body.dateOfBirth || null,
        gender: req.body.gender || '',
        riskTolerance: req.body.riskTolerance || 'moderate',
        investmentGoals: req.body.investmentGoals || [],
        monthlyIncome: req.body.monthlyIncome || '',
        investmentExperience: req.body.investmentExperience || 'beginner',
        esgPriorities: req.body.esgPriorities || [],
        excludeIndustries: req.body.excludeIndustries || [],
        investmentHorizon: req.body.investmentHorizon || 'medium_term'
      };
    }

    console.log('🔄 Processed profile data:', profileData);

    // Update user name and hasProfile flag
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name: profileData.name || req.user.name,
        hasProfile: true 
      },
      { new: true }
    ).select('-password');

    console.log('👤 Updated user:', updatedUser);

    // Create or update profile
    const profileUpdateData = {
      user: req.user._id,
      ...profileData
    };

    let profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      profileUpdateData,
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    console.log('📋 Created/Updated profile:', profile);

    res.json({
      success: true,
      message: 'Profile setup completed successfully!',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        hasProfile: true,
        profileCompleted: profile.profileCompleted
      },
      profile: profile
    });

  } catch (error) {
    console.error('❌ Profile complete error:', error);
    console.error('📊 Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while completing profile setup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
