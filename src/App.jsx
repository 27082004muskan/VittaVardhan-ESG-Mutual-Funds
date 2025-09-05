// App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FeaturePage from "./components/FeaturePage";
import GreenFundSearch from "./components/GreenFundSearch";
import RedemptionScreen from "./components/Redeem"; 
import TransactionPage from "./components/TransactionPage"; // Import TransactionPage
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import LandingPage from "./components/landing/LandingPage";
import RewardsPage from "./components/rewards";

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
          <Route path="/transaction" element={<TransactionPage />} />{" "}
          {/* Add this route */}
          <Route path="/rewards" element={<RewardsPage />} />{" "}
          {/* New rewards route */}
          <Route path="/redeem/:rewardId" element={<RedemptionScreen />} />{" "}
          {/* New redemption route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
