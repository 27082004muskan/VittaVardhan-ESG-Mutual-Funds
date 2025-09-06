
import { useNavigate } from "react-router-dom";
import AboutUs from "./About";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import Working from "./Working";
import FeatureSection from "./Feature";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/features");
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100">
      {/* Enhanced Hero Section */}
      <section
        className="relative h-screen w-full flex items-center justify-center 
             bg-gradient-to-br from-green-900 via-gray-900 to-gray-900 
             overflow-hidden -mt-3"
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
