import React, { useState } from "react";
import { FaLeaf, FaMoneyBillWave, FaNewspaper, FaUsers, FaCalculator, FaGavel, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from '../hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import ImpactCalculator from "./ImpactCalculator";
import GreenNews from './GreenNews';
import GreenMutualFund from './GreenMutualFund';
import GreenFundSearch from './GreenFundSearch';
import ESGEducation from './ESGEducation';
import RewardsPage from "./rewards";
import PlanMaker from "./ESGInvestmentPlanMaker";
import SmartFeatures from "./SmartFeatures";
import ProfileButton from "./ProfileButton";
import ProfilePage from './ProfilePage'; // Add this import

const features = [
  { name: "ESG Investment Guide", icon: <FaLeaf />, component: <ESGEducation /> },
  { name: "Green Mutual Fund", icon: <FaGavel />, component: <GreenFundSearch /> },
  { name: "Smart Features", icon: <FaLeaf />, component: <SmartFeatures /> },
  { name: "ESG Funds Explorer", icon: <FaMoneyBillWave />, component: <GreenMutualFund /> },
  { name: "Impact Calculator", icon: <FaCalculator />, component: <ImpactCalculator /> },
  { name: "ESG Investment Plan Maker", icon: <FaCalculator />, component: <PlanMaker /> },
  { name: "Live Green Investment News", icon: <FaNewspaper />, component: <GreenNews /> },
  { name: "Rewards & Coins", icon: <FaUsers />, component: <RewardsPage /> },
];

const FeaturePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Add profile state
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    setShowProfile(false); // Hide profile when selecting features
    setIsSidebarOpen(false);
  };

  // Add profile click handler
  const handleProfileClick = () => {
    setShowProfile(true);
    setSelectedFeature(null); // Clear selected feature
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            style: {
              background: '#065f46',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#7f1d1d',
              color: '#fff',
            },
          },
        }}
      />

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

        {/* Sidebar - COMPACT VERSION */}
        <div className={`
          fixed md:relative top-0 left-0 h-full z-40
          w-80 md:w-1/4 bg-gray-800 p-4
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Header - COMPACT */}
          <div className="flex justify-between items-center mb-3 pt-12 md:pt-0">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold">Features</h2>
            </div>
          </div>

          {/* Profile Button - ADD THIS */}
          <div className="mb-4">
            <ProfileButton onProfileClick={handleProfileClick} />
          </div>

          {/* Feature List - COMPACT SPACING */}
          <ul className="space-y-1">
            {features.map((feature) => (
              <li
                key={feature.name}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer 
                           transition-all duration-200 text-sm md:text-base
                           hover:shadow-lg ${
                  !showProfile && selectedFeature && selectedFeature.name === feature.name 
                    ? "bg-green-500 text-gray-900 shadow-lg" 
                    : "hover:bg-gray-700 hover:transform hover:scale-[1.02]"
                }`}
                onClick={() => handleFeatureSelect(feature)}
                title={feature.name}
              >
                <span className="text-base md:text-lg shrink-0">
                  {feature.icon}
                </span>
                <span className="truncate font-medium">
                  {feature.name}
                </span>
                {!showProfile && selectedFeature && selectedFeature.name === feature.name && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Footer - COMPACT */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-gray-400 text-center">
              <p>VittaVardhan ESG Platform</p>
              <p className="mt-1">Sustainable Investment Solutions</p>
            </div>
          </div>
        </div>

        {/* Content Area - UPDATED */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-900">
          <div className="pt-16 md:pt-0 h-full">
            {/* Show Profile or Feature */}
            {showProfile ? (
              <ProfilePage />
            ) : selectedFeature && selectedFeature.component ? (
              <div className="h-full">
                {React.cloneElement(selectedFeature.component, { 
                  onFeatureSelect: setSelectedFeature,
                  currentUser: currentUser 
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl md:text-6xl mb-4 text-green-500">
                    🌱
                  </div>
                  <h1 className="text-2xl md:text-4xl font-semibold mb-2 px-4">
                    Welcome to VittaVardhan
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Select a feature to get started with sustainable investing
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturePage;
