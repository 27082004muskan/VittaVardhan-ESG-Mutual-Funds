const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Information
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[1-9]?[\d\s\-\(\)]{10,}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },
  
  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  
  // Investment Profile
  riskTolerance: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  investmentGoals: [{
    type: String,
    enum: ['retirement', 'education', 'house', 'emergency', 'wealth_building', 'environmental_impact']
  }],
  monthlyIncome: {
    type: String,
    enum: ['under-25000', '25000-50000', '50000-100000', '100000-200000', 'above-200000']
  },
  investmentExperience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  // ESG Preferences
  esgPriorities: [{
    type: String,
    enum: ['environmental', 'social', 'governance', 'impact_investing', 'sustainable_development']
  }],
  excludeIndustries: [{
    type: String,
    enum: ['tobacco', 'alcohol', 'gambling', 'weapons', 'fossil_fuels', 'adult_entertainment']
  }],
  
  // Investment Details
  totalInvestment: {
    type: Number,
    default: 0
  },
  currentPortfolioValue: {
    type: Number,
    default: 0
  },
  investmentHorizon: {
    type: String,
    enum: ['short_term', 'medium_term', 'long_term'], // 1-3 years, 3-7 years, 7+ years
    default: 'medium_term'
  },
  
  // Profile Status
  profileCompleted: {
    type: Boolean,
    default: false
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate completion percentage
profileSchema.methods.calculateCompletion = function() {
  let completed = 0;
  const totalFields = 8;
  
  if (this.phone) completed++;
  if (this.dateOfBirth) completed++;
  if (this.gender) completed++;
  if (this.riskTolerance) completed++;
  if (this.investmentGoals && this.investmentGoals.length > 0) completed++;
  if (this.monthlyIncome) completed++;
  if (this.investmentExperience) completed++;
  if (this.investmentHorizon) completed++;
  
  this.completionPercentage = Math.round((completed / totalFields) * 100);
  this.profileCompleted = this.completionPercentage >= 70; // 70% completion threshold
  
  return this.completionPercentage;
};

// Update lastUpdated on save
profileSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  this.calculateCompletion();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
