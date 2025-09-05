import React, { useState } from "react";
import { FaLeaf, FaMoneyBillWave, FaNewspaper, FaUsers, FaCalculator, FaGavel } from "react-icons/fa";
import ImpactCalculator from "./ImpactCalculator";
// import SustainabilityScore from "./components/SustainabilityScore";
import GreenNews from './GreenNews';
import GreenMutualFund from './GreenMutualFund';
import GreenFundSearch from './GreenFundSearch';
import ESGEducation from './ESGEducation';
import { useNavigate } from 'react-router-dom';
import RewardsPage from "./rewards";

const features = [
  // { name: "Sustainability Score System", icon: <FaLeaf />, component: <SustainabilityScore /> },
  { name: "ESG Investment Guide", icon: <FaLeaf />, component: <ESGEducation /> },
  { name: "Green Mutual Fund", icon: <FaGavel />, component: <GreenFundSearch /> },
  { name: "ESG Funds Explorer", icon: <FaMoneyBillWave />, component: <GreenMutualFund /> },
  { name: "Impact Calculator", icon: <FaCalculator />, component: <ImpactCalculator /> },
  { name: "Live Green Investment News", icon: <FaNewspaper />, component: <GreenNews /> },
  { name: "Rewards & Coins", icon: <FaUsers />, component: <RewardsPage/> },
];

const FeaturePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Features</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg 
                     transition-colors duration-300 flex items-center gap-2"
          >
            <svg 
              className="w-4 h-4" 
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
            Logout
          </button>
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li
              key={feature.name}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                selectedFeature.name === feature.name ? "bg-green-500 text-gray-900" : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedFeature(feature)}
            >
              <span className="text-lg">{feature.icon}</span>
              <span>{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        {selectedFeature.component ? (
          React.cloneElement(selectedFeature.component, { 
            onFeatureSelect: setSelectedFeature 
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-semibold">{selectedFeature.name}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturePage;