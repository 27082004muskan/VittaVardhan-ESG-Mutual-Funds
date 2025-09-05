import { Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AboutUs from "./About";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import Working from "./Working";
import FeatureSection from "./Feature";

const LandingPage = () => {
  const navigate = useNavigate();
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

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100">
      {/* Enhanced Responsive Navbar */}
      <nav
        className="flex items-center justify-between sticky top-0 border-b border-gray-800 w-full p-7 
                      backdrop-blur-lg bg-gray-900/90 z-50 transition-all duration-300 shadow-lg"
      >
        {/* Logo */}
        <span
          className="text-2xl font-bold text-green-500 hover:text-green-400 
                        transition-all duration-300 transform hover:scale-105"
        >
          GreenVest
        </span>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center space-x-8 mr-8">
            <a
              href="#about-us"
              className="hover:text-green-500 transition-all duration-300 
                                 relative after:content-[''] after:absolute after:w-0 
                                 after:h-0.5 after:bg-green-500 after:left-0 
                                 after:bottom-0 hover:after:w-full after:transition-all"
            >
              About Us
            </a>
            <a
              href="#feature"
              className="hover:text-green-500 transition-all duration-300 
                                 relative after:content-[''] after:absolute after:w-0 
                                 after:h-0.5 after:bg-green-500 after:left-0 
                                 after:bottom-0 hover:after:w-full after:transition-all"
            >
              Why ESG?
            </a>
            <a
              href="#working"
              className="hover:text-green-500 transition-all duration-300 
                                 relative after:content-[''] after:absolute after:w-0 
                                 after:h-0.5 after:bg-green-500 after:left-0 
                                 after:bottom-0 hover:after:w-full after:transition-all"
            >
              Working
            </a>
            <a
              href="#faq"
              className="hover:text-green-500 transition-all duration-300 
                                 relative after:content-[''] after:absolute after:w-0 
                                 after:h-0.5 after:bg-green-500 after:left-0 
                                 after:bottom-0 hover:after:w-full after:transition-all"
            >
              FAQ
            </a>
          </div>
          <button
            onClick={() => window.location.href = 'mailto:contact@greenvest.com'}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-all 
                       duration-300 backdrop-blur-sm"
            title="Contact Us"
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <button
            onClick={() => window.location.href = 'mailto:contact@greenvest.com'}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-all 
                       duration-300 backdrop-blur-sm"
            title="Contact Us"
          >
            <Mail className="w-5 h-5" />
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-all 
                       duration-300 backdrop-blur-sm focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-gray-900 
                    border-l border-gray-800 z-50 transform transition-transform 
                    duration-300 ease-in-out ${
                      isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-7 border-b border-gray-800">
            <span className="text-2xl font-bold text-green-500">GreenVest</span>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-all 
                         duration-300 backdrop-blur-sm"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Links */}
          <div className="flex-1 p-7">
            <div className="flex flex-col space-y-6">
              <a
                href="#about-us"
                onClick={closeMenu}
                className="text-lg hover:text-green-500 transition-all duration-300 
                           pb-2 border-b border-gray-700 hover:border-green-500"
              >
                About Us
              </a>
              <a
                href="#feature"
                onClick={closeMenu}
                className="text-lg hover:text-green-500 transition-all duration-300 
                           pb-2 border-b border-gray-700 hover:border-green-500"
              >
                Why ESG?
              </a>
              <a
                href="#working"
                onClick={closeMenu}
                className="text-lg hover:text-green-500 transition-all duration-300 
                           pb-2 border-b border-gray-700 hover:border-green-500"
              >
                Working
              </a>
              <a
                href="#faq"
                onClick={closeMenu}
                className="text-lg hover:text-green-500 transition-all duration-300 
                           pb-2 border-b border-gray-700 hover:border-green-500"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Menu Footer */}
          <div className="p-7 border-t border-gray-800">
            <button
              onClick={handleGetStarted}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 
                         rounded-lg font-semibold transition-all duration-300 
                         transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section
        className="relative h-screen w-full flex items-center justify-center 
                         bg-gradient-to-br from-green-900 via-gray-900 to-gray-900 
                         overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 
                         rounded-full filter blur-3xl animate-pulse"
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600 
                         rounded-full filter blur-3xl animate-pulse delay-1000"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 
                         to-green-600 bg-clip-text text-transparent"
          >
            Invest Smart, Invest Green!
          </h1>
          <p className="text-xl mb-8 text-gray-200 font-light">
            Invest sustainably with ESG funds and secure a greener future today!
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 
                      rounded-lg font-semibold transition-all duration-300 
                      transform hover:scale-105 hover:shadow-lg relative 
                      overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
            <div
              className="absolute inset-0 bg-green-400 transform scale-x-0 
                           group-hover:scale-x-100 transition-transform duration-300 
                           origin-left"
            />
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full bg-gray-800 text-gray-100">
        <div id="about-us">
          <AboutUs />
        </div>
        <div id="feature">
          <FeatureSection />
        </div>
        <div id="working">
          <Working />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
