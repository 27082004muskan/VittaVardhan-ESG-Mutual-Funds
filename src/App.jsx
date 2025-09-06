// App.jsx - Updated (Navbar hide on /features page)
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import FeaturePage from "./components/FeaturePage";
import GreenFundSearch from "./components/GreenFundSearch";
import RedemptionScreen from "./components/Redeem"; 
import TransactionPage from "./components/TransactionPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import LandingPage from "./components/landing/LandingPage";
import RewardsPage from "./components/rewards";
import Navbar from "./components/Navbar";

function NavbarWrapper() {
  const location = useLocation();
  
  // ✅ UPDATED: Hide navbar on login, signup, AND features page
  const noNavbarRoutes = ['/login', '/signup', '/features'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);
  
  const isLandingPage = location.pathname === '/';
  const shouldAddPadding = showNavbar && !isLandingPage;
  
  return (
    <div className="overflow-x-hidden">
      {showNavbar && <Navbar />}
      <div className={shouldAddPadding ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/features" element={<FeaturePage />} />
          <Route path="/green-funds" element={<GreenFundSearch />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/redeem/:rewardId" element={<RedemptionScreen />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NavbarWrapper />
    </Router>
  );
}

export default App;
