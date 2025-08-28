
import { Moon } from 'lucide-react';

import FAQSection from './FAQSection';
import Working from './working';
import Footer from './Footer';
import AboutUs from './About';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/features');
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100">
      {/* Enhanced Navbar */}
      <nav className="flex items-center justify-between sticky top-0 border-b border-gray-800 w-full p-7 
                      backdrop-blur-lg bg-gray-900/90 z-50 transition-all duration-300 shadow-lg">
        {/* Logo */}
        <span className="text-2xl font-bold text-green-500 hover:text-green-400 
                        transition-all duration-300 transform hover:scale-105">
          GreenVest
        </span>

        {/* Navigation Links at the end */}
        <div className="flex items-center">
          <div className="flex items-center space-x-8 mr-8">
            <a href="#" className="hover:text-green-500 transition-all duration-300 
                                 relative after:content-[''] after:absolute after:w-0 
                                 after:h-0.5 after:bg-green-500 after:left-0 
                                 after:bottom-0 hover:after:w-full after:transition-all">
              About Us
            </a>
            <a href="#" className="hover:text-green-500 transition-all duration-300 
                                 relative after:content-[''] after:absolute after:w-0 
                                 after:h-0.5 after:bg-green-500 after:left-0 
                                 after:bottom-0 hover:after:w-full after:transition-all">
              Investments
            </a>
            <a href="#" className="hover:text-green-500 transition-all duration-300 
                                 relative after:content-[''] after:absolute after:w-0 
                                 after:h-0.5 after:bg-green-500 after:left-0 
                                 after:bottom-0 hover:after:w-full after:transition-all">
              FAQ
            </a>
            <a href="#" className="hover:text-green-500 transition-all duration-300 
                                 relative after:content-[''] after:absolute after:w-0 
                                 after:h-0.5 after:bg-green-500 after:left-0 
                                 after:bottom-0 hover:after:w-full after:transition-all">
              Plan
            </a>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-700/50 transition-all 
                            duration-300 backdrop-blur-sm">
            <Moon className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center 
                         bg-gradient-to-br from-green-900 via-gray-900 to-gray-900 
                         overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 
                         rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600 
                         rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 
                         to-green-600 bg-clip-text text-transparent">
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
            <div className="absolute inset-0 bg-green-400 transform scale-x-0 
                           group-hover:scale-x-100 transition-transform duration-300 
                           origin-left" />
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full bg-gray-800 text-gray-100">
        <AboutUs />
        <FAQSection />
        <Working />
      </div> 
      <Footer />
    </div>
  );
};

export default LandingPage;


