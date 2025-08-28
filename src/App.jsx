// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Footer from './Footer';
import FeaturePage from './FeaturePage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GreenFundSearch from './components/GreenFundSearch';
import TransactionPage from './components/TransactionPage'; // Import TransactionPage
import RewardsPage from './components/rewards';
import RedemptionScreen from './components/Redeem'; // Import RedemptionScreenimport RedemptionScreen from './RedemptionScreen'; // Import RedemptionScreen

function App() {
  return (
    <Router>
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/features"
            element={
              // <ProtectedRoute>
              <FeaturePage />
              // </ProtectedRoute>
            }
          />
          <Route path="/green-funds" element={<GreenFundSearch />} />
          <Route path="/transaction" element={<TransactionPage />} /> {/* Add this route */}
          <Route path="/rewards" element={<RewardsPage />} /> {/* New rewards route */}
          <Route path="/redeem/:rewardId" element={<RedemptionScreen />} /> {/* New redemption route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;