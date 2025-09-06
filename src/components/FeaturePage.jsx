import React, { useState } from "react";
import { FaLeaf, FaMoneyBillWave, FaNewspaper, FaUsers, FaCalculator, FaGavel, FaBars, FaTimes } from "react-icons/fa";
import ImpactCalculator from "./ImpactCalculator";
// import SustainabilityScore from "./components/SustainabilityScore";
import GreenNews from './GreenNews';
import GreenMutualFund from './GreenMutualFund';
import GreenFundSearch from './GreenFundSearch';
import ESGEducation from './ESGEducation';
import { useNavigate } from 'react-router-dom';
import RewardsPage from "./rewards";

const features = [
  { name: "ESG Investment Guide", icon: <FaLeaf />, component: <ESGEducation /> },
  { name: "Green Mutual Fund", icon: <FaGavel />, component: <GreenFundSearch /> },
  { name: "ESG Funds Explorer", icon: <FaMoneyBillWave />, component: <GreenMutualFund /> },
  { name: "Impact Calculator", icon: <FaCalculator />, component: <ImpactCalculator /> },
  { name: "Live Green Investment News", icon: <FaNewspaper />, component: <GreenNews /> },
  { name: "Rewards & Coins", icon: <FaUsers />, component: <RewardsPage/> },
];

const FeaturePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-700 hover:bg-gray-600 
                   rounded-lg transition-colors duration-300"
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 h-full z-40
        w-80 md:w-1/4 bg-gray-800 p-6 space-y-4
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex justify-between items-center mb-4 pt-12 md:pt-0">
          <h2 className="text-xl md:text-2xl font-bold">Features</h2>
          <button
            onClick={handleLogout}
            className="px-3 py-2 md:px-4 md:py-2 bg-red-500 hover:bg-red-600 
                     text-white rounded-lg transition-colors duration-300 
                     flex items-center gap-2 text-sm md:text-base"
          >
            <svg 
              className="w-3 h-3 md:w-4 md:h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
        
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
          {features.map((feature) => (
            <li
              key={feature.name}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer 
                         transition-all text-sm md:text-base ${
                selectedFeature.name === feature.name 
                  ? "bg-green-500 text-gray-900" 
                  : "hover:bg-gray-700"
              }`}
              onClick={() => handleFeatureSelect(feature)}
            >
              <span className="text-base md:text-lg flex-shrink-0">{feature.icon}</span>
              <span className="truncate">{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="pt-16 md:pt-0">
          {selectedFeature.component ? (
            React.cloneElement(selectedFeature.component, { 
              onFeatureSelect: setSelectedFeature 
            })
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-2xl md:text-4xl font-semibold text-center px-4">
                {selectedFeature.name}
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;
