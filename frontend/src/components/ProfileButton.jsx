import  { useState } from 'react';
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

// eslint-disable-next-line react/prop-types
const ProfileButton = ({ onProfileClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, getCurrentUser, isLoading } = useAuth();
  const currentUser = getCurrentUser();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    onProfileClick();
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  if (!currentUser) return null;

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-xl bg-gray-700 hover:bg-gray-600 
                   transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <FaUserCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-white truncate max-w-32">
            {currentUser.name}
          </span>
          <span className="text-xs text-gray-400">
            {currentUser.email.split('@')[0]}
          </span>
        </div>
        <FaChevronDown 
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 
                          rounded-xl shadow-2xl z-20 py-2">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-200 
                          hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
              >
                <FaUser className="w-4 h-4 mr-3" />
                My Profile
              </button>
              
              <button
                onClick={() => {
                  // Add settings functionality later
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-200 
                          hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
              >
                <FaCog className="w-4 h-4 mr-3" />
                Settings
              </button>

              <hr className="my-1 border-gray-700" />

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center px-4 py-3 text-sm text-red-400 
                          hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-3" />
                ) : (
                  <FaSignOutAlt className="w-4 h-4 mr-3" />
                )}
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileButton;
