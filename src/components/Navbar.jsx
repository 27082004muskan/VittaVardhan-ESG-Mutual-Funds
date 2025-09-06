// components/Navbar.jsx
import { Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate("/features");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // ✅ Check if it's landing page
  const isLandingPage = location.pathname === '/';
  
  // ✅ Use absolute positioning on landing page, fixed on others
  const navPositionClasses = isLandingPage 
    ? "absolute top-3 left-6 right-6 z-50" 
    : "fixed top-3 left-6 right-6 z-50";

  return (
    <>
      {/* Conditional Positioned Navbar */}
      <nav
        className={`${navPositionClasses} flex items-center justify-between 
                   bg-gray-900/70 hover:bg-gray-900/90 backdrop-blur-xl 
                   border border-gray-700/50 rounded-2xl px-8 py-4 
                   shadow-2xl shadow-green-500/10 transition-all duration-300 
                   hover:shadow-green-500/20 text-gray-100`}
      >
        {/* Logo */}
        <span
          className="text-2xl font-bold text-green-500 hover:text-green-400 
                        transition-all duration-300 transform hover:scale-105 cursor-pointer"
          onClick={() => navigate('/')}
        >
          GreenVest
        </span>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center space-x-8 mr-6">
            <a
              href="/#about-us"
              className="text-gray-200 hover:text-green-400 transition-all duration-300 
                         relative after:content-[''] after:absolute after:w-0 
                         after:h-0.5 after:bg-green-400 after:left-0 
                         after:bottom-0 hover:after:w-full after:transition-all 
                         font-medium text-sm tracking-wide"
            >
              About Us
            </a>
            <a
              href="/#feature"
              className="text-gray-200 hover:text-green-400 transition-all duration-300 
                         relative after:content-[''] after:absolute after:w-0 
                         after:h-0.5 after:bg-green-400 after:left-0 
                         after:bottom-0 hover:after:w-full after:transition-all 
                         font-medium text-sm tracking-wide"
            >
              Why ESG?
            </a>
            <a
              href="/#working"
              className="text-gray-200 hover:text-green-400 transition-all duration-300 
                         relative after:content-[''] after:absolute after:w-0 
                         after:h-0.5 after:bg-green-400 after:left-0 
                         after:bottom-0 hover:after:w-full after:transition-all 
                         font-medium text-sm tracking-wide"
            >
              Working
            </a>
            <a
              href="/#faq"
              className="text-gray-200 hover:text-green-400 transition-all duration-300 
                         relative after:content-[''] after:absolute after:w-0 
                         after:h-0.5 after:bg-green-400 after:left-0 
                         after:bottom-0 hover:after:w-full after:transition-all 
                         font-medium text-sm tracking-wide"
            >
              FAQ
            </a>
          </div>
          
          {/* Contact & Get Started */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = 'mailto:contact@greenvest.com'}
              className="text-gray-200 p-2 rounded-xl hover:bg-gray-700/50 
                         transition-all duration-300 backdrop-blur-sm hover:text-green-400"
              title="Contact Us"
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-green-500 to-green-600 
                         hover:from-green-600 hover:to-green-700 text-white 
                         px-5 py-2 rounded-xl font-semibold text-sm
                         transition-all duration-300 transform hover:scale-105
                         shadow-lg shadow-green-500/25"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          <button
            onClick={() => window.location.href = 'mailto:contact@greenvest.com'}
            className="text-gray-200 p-2 rounded-xl hover:bg-gray-700/50 
                       transition-all duration-300"
            title="Contact Us"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-200 p-2 rounded-xl hover:bg-gray-700/50 
                       transition-all duration-300 focus:outline-none"
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

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-20 right-6 w-80 max-w-[calc(100vw-3rem)]
                    bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 
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
            <span 
              className="text-xl font-bold text-green-500 cursor-pointer"
              onClick={() => {
                navigate('/');
                closeMenu();
              }}
            >
              GreenVest
            </span>
            <button
              onClick={closeMenu}
              className="text-gray-200 p-2 rounded-xl hover:bg-gray-700/50 
                         transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="space-y-4">
            <a
              href="/#about-us"
              onClick={closeMenu}
              className="block text-gray-200 hover:text-green-400 
                         transition-all duration-300 py-3 px-4 rounded-xl
                         hover:bg-gray-700/30 font-medium"
            >
              About Us
            </a>
            <a
              href="/#feature"
              onClick={closeMenu}
              className="block text-gray-200 hover:text-green-400 
                         transition-all duration-300 py-3 px-4 rounded-xl
                         hover:bg-gray-700/30 font-medium"
            >
              Why ESG?
            </a>
            <a
              href="/#working"
              onClick={closeMenu}
              className="block text-gray-200 hover:text-green-400 
                         transition-all duration-300 py-3 px-4 rounded-xl
                         hover:bg-gray-700/30 font-medium"
            >
              Working
            </a>
            <a
              href="/#faq"
              onClick={closeMenu}
              className="block text-gray-200 hover:text-green-400 
                         transition-all duration-300 py-3 px-4 rounded-xl
                         hover:bg-gray-700/30 font-medium"
            >
              FAQ
            </a>
          </div>

          {/* Mobile Get Started */}
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <button
              onClick={() => {
                handleGetStarted();
                closeMenu();
              }}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 
                         hover:from-green-600 hover:to-green-700 text-white 
                         px-6 py-3 rounded-xl font-semibold transition-all 
                         duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
