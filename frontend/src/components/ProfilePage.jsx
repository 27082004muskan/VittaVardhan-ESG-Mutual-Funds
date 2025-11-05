// ProfilePage.jsx - Enhanced design (better than before)
import { useState, useEffect } from 'react';

import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  FaUser, FaChartLine, FaSave, FaEdit, FaCheck, FaLeaf, FaShieldAlt,

} from 'react-icons/fa';

const ProfilePage = () => {
  const { getCurrentUser } = useAuth();
 
  const currentUser = getCurrentUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    riskTolerance: 'moderate',
    investmentGoals: [],
    monthlyIncome: '',
    investmentExperience: 'beginner',
    esgPriorities: [],
    excludeIndustries: [],
    investmentHorizon: 'medium_term'
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

  // ESG Priority options
  const esgPriorityOptions = [
    { value: 'environmental', label: 'Environmental Protection', icon: '🌍' },
    { value: 'social', label: 'Social Responsibility', icon: '🤝' },
    { value: 'governance', label: 'Corporate Governance', icon: '⚖️' },
    { value: 'impact_investing', label: 'Impact Investing', icon: '🎯' },
    { value: 'sustainable_development', label: 'Sustainable Development', icon: '🔄' }
  ];

  // Industries to exclude
  const excludeIndustryOptions = [
    { value: 'tobacco', label: 'Tobacco', icon: '🚭' },
    { value: 'alcohol', label: 'Alcohol', icon: '🍺' },
    { value: 'gambling', label: 'Gambling', icon: '🎰' },
    { value: 'weapons', label: 'Weapons', icon: '🔫' },
    { value: 'fossil_fuels', label: 'Fossil Fuels', icon: '⛽' },
    { value: 'adult_entertainment', label: 'Adult Entertainment', icon: '🔞' }
  ];

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setProfile({
          name: data.user.name || '',
          phone: data.profile.phone || '',
          dateOfBirth: data.profile.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : '',
          gender: data.profile.gender || '',
          riskTolerance: data.profile.riskTolerance || 'moderate',
          investmentGoals: data.profile.investmentGoals || [],
          monthlyIncome: data.profile.monthlyIncome || '',
          investmentExperience: data.profile.investmentExperience || 'beginner',
          esgPriorities: data.profile.esgPriorities || [],
          excludeIndustries: data.profile.excludeIndustries || [],
          investmentHorizon: data.profile.investmentHorizon || 'medium_term'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Updating profile...');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.dismiss(loadingToast);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        
        // Update localStorage user data
        const updatedUser = {
          ...currentUser,
          name: data.user.name,
          hasProfile: data.user.hasProfile,
          profileCompleted: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Network error occurred');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const totalFields = 8;
    
    if (profile.name) completed++;
    if (profile.phone) completed++;
    if (profile.dateOfBirth) completed++;
    if (profile.riskTolerance) completed++;
    if (profile.investmentGoals.length > 0) completed++;
    if (profile.monthlyIncome) completed++;
    if (profile.investmentExperience) completed++;
    if (profile.investmentHorizon) completed++;
    
    return Math.round((completed / totalFields) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      

      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header Card */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.name || 'Your Profile'}</h2>
                <p className="text-gray-400">ESG Investment Profile</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Profile {calculateCompletion()}% Complete</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 
                           text-white rounded-lg font-medium transition-colors duration-300"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 
                             disabled:bg-gray-600 text-white rounded-lg font-medium 
                             transition-colors duration-300 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaSave className="w-4 h-4" />
                    )}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    disabled={loading}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg 
                             font-medium transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Profile Completion</span>
              <span className="text-sm text-green-400 font-medium">{calculateCompletion()}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateCompletion()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUser className="text-green-400" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent 
                           disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Investment Profile */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaChartLine className="text-green-400" />
              Investment Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
                <select
                  name="riskTolerance"
                  value={profile.riskTolerance}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="low">Low - Conservative approach</option>
                  <option value="moderate">Moderate - Balanced approach</option>
                  <option value="high">High - Aggressive growth</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monthly Income</label>
                <select
                  name="monthlyIncome"
                  value={profile.monthlyIncome}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent 
                           disabled:opacity-50 disabled:cursor-not-allowed"
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
                <label className="block text-sm font-medium mb-2">Investment Experience</label>
                <select
                  name="investmentExperience"
                  value={profile.investmentExperience}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="beginner">Beginner - New to investing</option>
                  <option value="intermediate">Intermediate - Some experience</option>
                  <option value="advanced">Advanced - Experienced investor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Investment Horizon</label>
                <select
                  name="investmentHorizon"
                  value={profile.investmentHorizon}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="short_term">Short Term (1-3 years)</option>
                  <option value="medium_term">Medium Term (3-7 years)</option>
                  <option value="long_term">Long Term (7+ years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Investment Goals */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🎯 Investment Goals
            </h2>
            
            <div className="grid grid-cols-1 gap-3">
              {investmentGoalOptions.map((goal) => (
                <label
                  key={goal.value}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    profile.investmentGoals.includes(goal.value)
                      ? 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-gray-600 hover:border-gray-500'
                  } ${!isEditing ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={profile.investmentGoals.includes(goal.value)}
                    onChange={() => handleArrayChange('investmentGoals', goal.value)}
                    disabled={!isEditing}
                    className="sr-only"
                  />
                  <span className="text-lg mr-3">{goal.icon}</span>
                  <span className="text-sm font-medium flex-1">{goal.label}</span>
                  {profile.investmentGoals.includes(goal.value) && (
                    <FaCheck className="w-3 h-3 text-green-400 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* ESG Preferences */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaLeaf className="text-green-400" />
              ESG Priorities
            </h2>
            
            <div className="space-y-3">
              {esgPriorityOptions.map((priority) => (
                <label
                  key={priority.value}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    profile.esgPriorities.includes(priority.value)
                      ? 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-gray-600 hover:border-gray-500'
                  } ${!isEditing ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={profile.esgPriorities.includes(priority.value)}
                    onChange={() => handleArrayChange('esgPriorities', priority.value)}
                    disabled={!isEditing}
                    className="sr-only"
                  />
                  <span className="text-lg mr-3">{priority.icon}</span>
                  <span className="text-sm font-medium flex-1">{priority.label}</span>
                  {profile.esgPriorities.includes(priority.value) && (
                    <FaCheck className="w-3 h-3 text-green-400" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Industries to Exclude */}
        <div className="mt-8 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-red-400" />
            Industries to Exclude
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {excludeIndustryOptions.map((industry) => (
              <label
                key={industry.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  profile.excludeIndustries.includes(industry.value)
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-gray-600 hover:border-gray-500'
                } ${!isEditing ? 'pointer-events-none opacity-60' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={profile.excludeIndustries.includes(industry.value)}
                  onChange={() => handleArrayChange('excludeIndustries', industry.value)}
                  disabled={!isEditing}
                  className="sr-only"
                />
                <span className="text-lg mr-3">{industry.icon}</span>
                <span className="text-sm font-medium flex-1">{industry.label}</span>
                {profile.excludeIndustries.includes(industry.value) && (
                  <FaCheck className="w-3 h-3 text-red-400" />
                )}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
