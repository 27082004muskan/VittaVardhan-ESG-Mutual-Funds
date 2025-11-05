// ProfileSetup.jsx - Fixed skip functionality without toast
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  FaUser, FaChartLine, FaBullseye, 
  FaSave, FaCheck, FaArrowRight, FaArrowLeft, FaTimes, FaCamera 
} from 'react-icons/fa';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    riskTolerance: 'moderate',
    investmentGoals: [],
    monthlyIncome: '',
    investmentExperience: 'beginner',
    investmentHorizon: 'medium_term',
    esgPriorities: [],
    excludeIndustries: []
  });

  // Investment goal options
  const investmentGoalOptions = [
    { value: 'retirement', label: 'Retirement Planning', icon: '🏖️' },
    { value: 'education', label: 'Education Fund', icon: '🎓' },
    { value: 'house', label: 'Home Purchase', icon: '🏠' },
    { value: 'emergency', label: 'Emergency Fund', icon: '🆘' },
    { value: 'wealth_building', label: 'Wealth Building', icon: '💰' },
    { value: 'environmental_impact', label: 'Environmental Impact', icon: '🌱' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalChange = (goalValue) => {
    setProfile(prev => ({
      ...prev,
      investmentGoals: prev.investmentGoals.includes(goalValue)
        ? prev.investmentGoals.filter(goal => goal !== goalValue)
        : [...prev.investmentGoals, goalValue]
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Setting up your profile...');

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add profile data
      Object.keys(profile).forEach(key => {
        if (Array.isArray(profile[key])) {
          formData.append(key, JSON.stringify(profile[key]));
        } else {
          formData.append(key, profile[key]);
        }
      });
      
      // Add profile image if exists
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      console.log('📤 Sending profile data:', profile);

      const response = await fetch('http://localhost:5001/api/profile/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();
      console.log('📥 Profile response:', data);
      
      if (response.ok && data.success) {
        toast.dismiss(loadingToast);
        toast.success('Profile setup completed! 🎉', {
          duration: 2000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        // Update localStorage to mark profile as complete
        const updatedUser = {
          ...currentUser,
          name: profile.name,
          profileCompleted: true,
          hasProfile: true,
          profileImage: data.user?.profileImage || null
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        console.log('✅ Updated user data:', updatedUser);
        
        // Navigate to features page after a short delay
        setTimeout(() => {
          navigate('/features', { replace: true });
        }, 2000);
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || 'Failed to complete profile setup');
        console.error('❌ Profile setup failed:', data);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Network error occurred');
      console.error('❌ Profile setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Clean skip without annoying blue toast
  const handleSkip = () => {
    // Clear any existing toasts first
    toast.dismiss();
    
    // ✅ Mark user as having skipped setup (partial profile completion)
    const updatedUser = {
      ...currentUser,
      profileCompleted: false, // Keep as false since they skipped
      profileSkipped: true,    // Add flag to know they skipped
      hasBasicAccess: true     // Allow basic access to features
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // ✅ Navigate directly without any toast
    navigate('/features', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const isStep1Valid = profile.name && profile.phone && profile.dateOfBirth && profile.gender;
  const isStep2Valid = profile.riskTolerance && profile.monthlyIncome && profile.investmentExperience;
  const isStep3Valid = profile.investmentGoals.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors 
                     px-4 py-2 rounded-lg hover:bg-gray-700/50"
          >
            <FaTimes className="w-4 h-4" />
            Exit
          </button>
          
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white text-sm transition-colors 
                     px-4 py-2 rounded-lg hover:bg-gray-700/50"
          >
            Skip Setup
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 pt-20">
        <div className="max-w-2xl w-full">
          
          {/* Main Header with Profile Icon */}
          <div className="text-center mb-8">
            {/* Profile Image Upload */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-8 h-8 text-white" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
                <FaCamera className="w-3 h-3 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <h1 className="text-3xl font-bold text-green-400 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-400">
              Help us personalize your ESG investment experience
            </p>
          </div>

          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400">Step {step} of 3</span>
              <span className="text-sm text-green-400 font-medium">
                {Math.round((step/3) * 100)}% Complete
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step/3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
            
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUser className="text-green-400 text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Personal Information
                  </h2>
                  <p className="text-gray-400 text-sm">Tell us about yourself to get started</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-white
                               placeholder-gray-400 transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-white
                               placeholder-gray-400 transition-all duration-200"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-white
                               transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-white
                               transition-all duration-200"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Investment Profile */}
            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaChartLine className="text-green-400 text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Investment Profile
                  </h2>
                  <p className="text-gray-400 text-sm">Help us understand your investment preferences</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Risk Tolerance *
                    </label>
                    <select
                      name="riskTolerance"
                      value={profile.riskTolerance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-white
                               transition-all duration-200"
                      required
                    >
                      <option value="low">Low - Conservative approach</option>
                      <option value="moderate">Moderate - Balanced approach</option>
                      <option value="high">High - Aggressive growth</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Monthly Income *
                    </label>
                    <select
                      name="monthlyIncome"
                      value={profile.monthlyIncome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-white
                               transition-all duration-200"
                      required
                    >
                      <option value="">Select Income Range</option>
                      <option value="under-25000">Under ₹25,000</option>
                      <option value="25000-50000">₹25,000 - ₹50,000</option>
                      <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                      <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                      <option value="above-200000">Above ₹2,00,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Investment Experience *
                    </label>
                    <select
                      name="investmentExperience"
                      value={profile.investmentExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-white
                               transition-all duration-200"
                      required
                    >
                      <option value="beginner">Beginner - New to investing</option>
                      <option value="intermediate">Intermediate - Some experience</option>
                      <option value="advanced">Advanced - Experienced investor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Investment Horizon
                    </label>
                    <select
                      name="investmentHorizon"
                      value={profile.investmentHorizon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-white
                               transition-all duration-200"
                    >
                      <option value="short_term">Short Term (1-3 years)</option>
                      <option value="medium_term">Medium Term (3-7 years)</option>
                      <option value="long_term">Long Term (7+ years)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Investment Goals */}
            {step === 3 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBullseye className="text-green-400 text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Investment Goals
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Select your primary investment goals (choose at least one)
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investmentGoalOptions.map((goal) => (
                    <label
                      key={goal.value}
                      className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        profile.investmentGoals.includes(goal.value)
                          ? 'border-green-500 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/20'
                          : 'border-gray-600 hover:border-gray-500 text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={profile.investmentGoals.includes(goal.value)}
                        onChange={() => handleGoalChange(goal.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-4">{goal.icon}</span>
                      <span className="font-medium flex-1 text-sm">{goal.label}</span>
                      {profile.investmentGoals.includes(goal.value) && (
                        <FaCheck className="w-4 h-4 text-green-400 ml-2" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 gap-4">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 
                       disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg 
                       font-medium transition-colors duration-300"
            >
              <FaArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Validation Status */}
            <div className="hidden sm:flex text-sm text-gray-400 items-center">
              {step === 1 && isStep1Valid && (
                <span className="flex items-center gap-2 text-green-400">
                  <FaCheck className="w-4 h-4" />
                  Personal info complete
                </span>
              )}
              {step === 2 && isStep2Valid && (
                <span className="flex items-center gap-2 text-green-400">
                  <FaCheck className="w-4 h-4" />
                  Investment profile complete
                </span>
              )}
              {step === 3 && isStep3Valid && (
                <span className="flex items-center gap-2 text-green-400">
                  <FaCheck className="w-4 h-4" />
                  Goals selected
                </span>
              )}
            </div>

            {/* Next/Complete Button */}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 
                         disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg 
                         font-medium transition-colors duration-300"
              >
                Continue
                <FaArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!isStep3Valid || loading}
                className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 
                         disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg 
                         font-medium transition-colors duration-300"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Completing...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <button
                key={stepNumber}
                onClick={() => stepNumber <= step && setStep(stepNumber)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  stepNumber === step
                    ? 'bg-green-500 scale-125 shadow-lg shadow-green-500/50'
                    : stepNumber < step
                    ? 'bg-green-600'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
