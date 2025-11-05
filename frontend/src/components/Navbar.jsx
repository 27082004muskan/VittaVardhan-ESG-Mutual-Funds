// Navbar.jsx - Smart Get Started button behavior
import { Mail, Menu, X, User, ChevronDown, LogOut, Settings, Home } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Import the green sustainability image
import sustainabilityLogo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Memoize the update function to prevent useEffect dependency warning
  const updateUserInfo = useCallback(() => {
    const latestUser = getCurrentUser();
    setCurrentUser(latestUser);
  }, [getCurrentUser]);

  // Update user info when localStorage changes
  useEffect(() => {
    // Listen for storage changes
    window.addEventListener('storage', updateUserInfo);
    
    // Check for updates periodically (for same-tab updates)
    const interval = setInterval(updateUserInfo, 2000);

    return () => {
      window.removeEventListener('storage', updateUserInfo);
      clearInterval(interval);
    };
  }, [updateUserInfo]);

  // ✅ SMART GET STARTED BUTTON LOGIC
  const handleGetStarted = () => {
    if (currentUser) {
      // User is already logged in
      if (currentUser.profileCompleted) {
        // Profile is complete, go directly to features/dashboard
        navigate("/features");
        toast.success("Welcome back to your dashboard!", {
          duration: 2000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
      } else {
        // Profile is incomplete, go to profile setup
        navigate("/profile-setup");
        toast("Complete your profile to unlock all features", {
          icon: '📋',
          duration: 2500,
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
      }
    } else {
      // User not logged in, go to signup (not login)
      navigate("/signup");
    }
    closeMenu();
  };

  const handleLogin = () => {
    navigate("/login");
    closeMenu();
  };

  // Handle logout with toast
  const handleLogout = () => {
    toast.dismiss();
    
    logout();
    setCurrentUser(null);
    setDropdownOpen(false);
    closeMenu();
    
    toast.success('Logged out successfully', {
      duration: 2000,
      style: {
        background: '#6B7280',
        color: '#fff',
      },
    });
    
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 500);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
    closeMenu();
  };

  const handleFeaturesClick = () => {
    navigate('/features');
    setDropdownOpen(false);
    closeMenu();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
  };

  // Smooth scroll function
  const handleSmoothScroll = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Handle navigation with smooth scroll
  const handleNavClick = (href, e) => {
    e.preventDefault();
    
    if (href.startsWith('/#')) {
      const targetId = href.substring(2);
      
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          handleSmoothScroll(targetId);
        }, 100);
      } else {
        handleSmoothScroll(targetId);
      }
    }
    
    closeMenu();
  };

  // Scroll detection for landing page
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        setIsScrolled(window.scrollY > 100);
      }
    };

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname]);

  // Dynamic positioning based on page and scroll
  const isLandingPage = location.pathname === '/';
  const shouldBeFixed = !isLandingPage || (isLandingPage && isScrolled);
  
  const navPositionClasses = shouldBeFixed 
    ? "fixed top-3 left-6 right-6 z-50" 
    : "absolute top-3 left-6 right-6 z-50";

  // ✅ DYNAMIC BUTTON TEXT BASED ON USER STATUS
  const getStartedButtonText = () => {
    if (currentUser) {
      if (currentUser.profileCompleted) {
        return "Dashboard";
      } else {
        return "Complete Profile";
      }
    } else {
      return "Get Started";
    }
  };

  return (
    <>
      {/* Dynamic Positioned Navbar */}
      <nav
        className={`${navPositionClasses} flex items-center justify-between 
                   bg-gray-900/70 hover:bg-gray-900/90 backdrop-blur-xl 
                   border border-gray-700/50 rounded-2xl px-8 py-4 
                   shadow-2xl shadow-green-500/10 transition-all duration-300 
                   hover:shadow-green-500/20 text-gray-100 
                   ${isScrolled ? 'animate-in slide-in-from-top-2' : ''}`}
      >
        {/* Logo with Image and Text */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <img 
              src={sustainabilityLogo} 
              alt="VittaVardhan Sustainability" 
              className="w-12 h-12 rounded-xl object-cover border-2 border-green-500/20 
                        group-hover:border-green-400/40 transition-all duration-300
                        group-hover:scale-110 shadow-lg"
            />
            <div className="absolute inset-0 rounded-xl bg-green-500/10 
                          opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xl font-bold text-green-500 
                          group-hover:text-green-400 transition-all duration-300 
                          transform group-hover:scale-105 leading-tight">
              Vitta<span className="text-green-300">वर्धन</span>
            </span>
            <span className="text-xs text-gray-400 group-hover:text-gray-300 
                          transition-all duration-300 -mt-1 tracking-wider">
              Green World !
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center space-x-8 mr-6">
            <button
              onClick={(e) => handleNavClick('/#about-us', e)}
              className="text-gray-200 hover:text-green-400 transition-all duration-300 
                         font-medium text-sm tracking-wide cursor-pointer
                         hover:scale-105 transform"
            >
              About Us
            </button>
            <button
              onClick={(e) => handleNavClick('/#feature', e)}
              className="text-gray-200 hover:text-green-400 transition-all duration-300 
                         font-medium text-sm tracking-wide cursor-pointer
                         hover:scale-105 transform"
            >
              Why ESG?
            </button>
            <button
              onClick={(e) => handleNavClick('/#working', e)}
              className="text-gray-200 hover:text-green-400 transition-all duration-300 
                         font-medium text-sm tracking-wide cursor-pointer
                         hover:scale-105 transform"
            >
              Working
            </button>
            <button
              onClick={(e) => handleNavClick('/#faq', e)}
              className="text-gray-200 hover:text-green-400 transition-all duration-300 
                         font-medium text-sm tracking-wide cursor-pointer
                         hover:scale-105 transform"
            >
              FAQ
            </button>
          </div>
          
          {/* Contact & Authentication Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = 'mailto:contact@vittavardhan.com'}
              className="text-gray-200 p-2 rounded-xl hover:bg-gray-700/50 
                         transition-all duration-300 backdrop-blur-sm hover:text-green-400
                         hover:scale-110 transform"
              title="Contact Us"
            >
              <Mail className="w-5 h-5" />
            </button>

            {/* Authentication Section */}
            {currentUser ? (
              /* Logged In User - Desktop */
              <div className="flex items-center space-x-4">
                {/* Smart Get Started Button */}
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-green-500 to-green-600 
                           hover:from-green-600 hover:to-green-700 text-white 
                           px-5 py-2 rounded-xl font-semibold text-sm
                           transition-all duration-300 transform hover:scale-105
                           shadow-lg shadow-green-500/25"
                >
                  {getStartedButtonText()}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-700/50 
                             transition-all duration-300 group"
                  >
                    {/* Profile Image or Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-green-500 flex items-center justify-center
                                 border-2 border-green-500/20 group-hover:border-green-400/40 transition-all duration-300">
                      {currentUser.profileImage ? (
                        <img 
                          src={currentUser.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <ChevronDown 
                      className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900/90 backdrop-blur-xl rounded-xl 
                                  shadow-2xl border border-gray-700/50 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700/50">
                        <p className="text-white text-sm font-medium">{currentUser.name}</p>
                        <p className="text-gray-400 text-xs">{currentUser.email}</p>
                      </div>
                      
                      <button
                        onClick={handleFeaturesClick}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-300 
                                 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-300 
                                 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      
                      <hr className="my-2 border-gray-700/50" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-400 
                                 hover:text-red-300 hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Not Logged In - Desktop */
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogin}
                  className="text-gray-200 hover:text-white font-medium text-sm transition-all duration-300
                           px-4 py-2 rounded-xl hover:bg-gray-700/50"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-green-500 to-green-600 
                           hover:from-green-600 hover:to-green-700 text-white 
                           px-5 py-2 rounded-xl font-semibold text-sm
                           transition-all duration-300 transform hover:scale-105
                           shadow-lg shadow-green-500/25"
                >
                  {getStartedButtonText()}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          <button
            onClick={() => window.location.href = 'mailto:contact@vittavardhan.com'}
            className="text-gray-200 p-2 rounded-xl hover:bg-gray-700/50 
                       transition-all duration-300 hover:scale-110 transform"
            title="Contact Us"
          >
            <Mail className="w-4 h-4" />
          </button>
          
          {/* User Avatar for Mobile */}
          {currentUser && (
            <div className="w-6 h-6 rounded-full overflow-hidden bg-green-500 flex items-center justify-center
                         border border-green-500/20">
              {currentUser.profileImage ? (
                <img 
                  src={currentUser.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-3 h-3 text-white" />
              )}
            </div>
          )}
          
          <button
            onClick={toggleMenu}
            className="text-gray-200 p-2 rounded-xl hover:bg-gray-700/50 
                       transition-all duration-300 focus:outline-none hover:scale-110 transform"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Dropdown Backdrop for Desktop */}
      {dropdownOpen && (
        <div 
          className="hidden lg:block fixed inset-0 z-40" 
          onClick={() => setDropdownOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-20 right-6 w-80 max-w-[calc(100vw-3rem)]
                    bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 
                    rounded-2xl z-50 transform transition-all duration-300 ease-out
                    shadow-2xl shadow-green-500/10 ${
                      isMenuOpen 
                        ? "translate-x-0 opacity-100 scale-100" 
                        : "translate-x-full opacity-0 scale-95"
                    }`}
      >
        <div className="p-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6">
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => {
                navigate('/');
                closeMenu();
              }}
            >
              <img 
                src={sustainabilityLogo} 
                alt="VittaVardhan" 
                className="w-8 h-8 rounded-lg object-cover border border-green-500/20"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-green-500 leading-tight">
                  Vitta<span className="text-green-300">वर्धन</span>
                </span>
                <span className="text-xs text-gray-400 -mt-1">
                  Green World !
                </span>
              </div>
            </div>
            <button
              onClick={closeMenu}
              className="text-gray-200 p-2 rounded-xl hover:bg-gray-700/50 
                         transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info Section for Mobile */}
          {currentUser && (
            <div className="mb-6 p-4 bg-gray-700/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-green-500 flex items-center justify-center
                             border-2 border-green-500/20">
                  {currentUser.profileImage ? (
                    <img 
                      src={currentUser.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{currentUser.name}</p>
                  <p className="text-gray-400 text-xs">
                    {currentUser.profileCompleted ? 'Profile Complete' : 'Setup Pending'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="space-y-4">
            <button
              onClick={(e) => handleNavClick('/#about-us', e)}
              className="block w-full text-left text-gray-200 hover:text-green-400 
                         transition-all duration-300 py-3 px-4 rounded-xl
                         hover:bg-gray-700/30 font-medium cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={(e) => handleNavClick('/#feature', e)}
              className="block w-full text-left text-gray-200 hover:text-green-400 
                         transition-all duration-300 py-3 px-4 rounded-xl
                         hover:bg-gray-700/30 font-medium cursor-pointer"
            >
              Why ESG?
            </button>
            <button
              onClick={(e) => handleNavClick('/#working', e)}
              className="block w-full text-left text-gray-200 hover:text-green-400 
                         transition-all duration-300 py-3 px-4 rounded-xl
                         hover:bg-gray-700/30 font-medium cursor-pointer"
            >
              Working
            </button>
            <button
              onClick={(e) => handleNavClick('/#faq', e)}
              className="block w-full text-left text-gray-200 hover:text-green-400 
                         transition-all duration-300 py-3 px-4 rounded-xl
                         hover:bg-gray-700/30 font-medium cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* Mobile Authentication Section */}
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            {currentUser ? (
              /* Logged In User - Mobile */
              <div className="space-y-3">
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 
                           hover:from-green-600 hover:to-green-700 text-white 
                           px-6 py-3 rounded-xl font-semibold transition-all 
                           duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                >
                  {getStartedButtonText()}
                </button>

                <button
                  onClick={handleFeaturesClick}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-300 
                           hover:text-white hover:bg-gray-700/30 transition-all duration-300 rounded-xl"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-300 
                           hover:text-white hover:bg-gray-700/30 transition-all duration-300 rounded-xl"
                >
                  <Settings className="w-4 h-4" />
                  <span>Profile Settings</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-400 
                           hover:text-red-300 hover:bg-gray-700/30 transition-all duration-300 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              /* Not Logged In - Mobile */
              <div className="space-y-3">
                <button
                  onClick={handleLogin}
                  className="w-full text-gray-200 hover:text-white font-medium 
                           transition-all duration-300 py-3 px-4 rounded-xl
                           hover:bg-gray-700/30 text-left"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 
                           hover:from-green-600 hover:to-green-700 text-white 
                           px-6 py-3 rounded-xl font-semibold transition-all 
                           duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                >
                  {getStartedButtonText()}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
