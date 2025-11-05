/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AboutUs from "./About";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import Working from "./Working";
import FeatureSection from "./Feature";

// Import your background image from assets
import backgroundImage from '../../assets/bg.gif';// Replace with your actual image name

const LandingPage = () => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const words = ["Invest Smart.. Invest Green ..","Invest for a Better Tomorrow.."," Grow with ESG..Save the world..","Your Green Investment Partner.."];

  const handleGetStarted = () => {
    navigate("/login");
  };

  // Typewriter Effect
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setDisplayText(
        isDeleting
          ? fullText.substring(0, displayText.length - 1)
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, words]);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100">
      {/* Enhanced Hero Section with Background Images */}
      <section
        className="relative h-screen w-full flex items-center justify-center 
             bg-gradient-to-br from-green-900 via-gray-900 to-gray-900 
             overflow-hidden -mt-3"
      >
        {/* Background Images - Increased Opacity */}
        <div className="absolute inset-0">
          {/* Your local background image with higher opacity */}
          <div 
            className="absolute inset-0 opacity-60 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`
            }}
          />
        </div>

        {/* Reduced overlay opacity to show image better */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

        {/* Animated Background Elements - Reduced opacity */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 
                         rounded-full filter blur-3xl animate-pulse"
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600 
                         rounded-full filter blur-3xl animate-pulse delay-1000"
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         w-96 h-96 bg-green-400 rounded-full filter blur-3xl animate-pulse delay-2000 opacity-20"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Brand Name - Vittaवर्धन */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold 
                          bg-gradient-to-r from-green-400 to-green-600 
                          bg-clip-text text-transparent mb-4
                          tracking-wide leading-tight">
             Green Vitta<span className="text-green-300">वर्धन</span>
            </h1>
          </div>

          {/* Typewriter Effect for Tagline - Reduced Size */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold 
bg-gradient-to-r from-white to-gray-300 
bg-clip-text text-transparent leading-tight h-8 md:h-20 lg:h-24
">
              <span className="typewriter-text">
                {displayText}
                <span className="animate-pulse text-green-400">|</span>
              </span>
            </h2>
          </div>
          
          {/* Subtitle */}
           {/* <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 font-light 
                        max-w-4xl mx-auto leading-relaxed">
            Invest sustainably with ESG funds and secure a greener future today!
          </p> */}

          {/* Get Started Button - Unchanged */}
          <button
            onClick={handleGetStarted}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 
                      rounded-lg font-semibold transition-all duration-300 
                      transform hover:scale-105 hover:shadow-lg relative 
                      overflow-hidden group"
          >
            <span className="relative z-10">Get Started </span>
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
      
      {/* Add custom styles for typewriter effect */}
      <style jsx>{`
        .typewriter-text {
          border-right: 2px solid #4ade80;
          animation: blink-caret 1.5s infinite;
        }
        
        @keyframes blink-caret {
          from, to {
            border-color: transparent;
          }
          50% {
            border-color: #4ade80;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
