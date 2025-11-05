// App.jsx - Updated with smart routing
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import FeaturePage from "./components/FeaturePage";
import GreenFundSearch from "./components/GreenFundSearch";
import RedemptionScreen from "./components/Redeem"; 
import TransactionPage from "./components/TransactionPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import LandingPage from "./components/landing/LandingPage";
import RewardsPage from "./components/rewards";
import Navbar from "./components/Navbar";
import ProfileSetup from "./components/ProfileSetup";
import ProfilePage from "./components/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function NavbarWrapper() {
  const location = useLocation();
  
  const noNavbarRoutes = ['/login', '/signup', '/features', '/profile-setup', '/profile'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);
  
  const isLandingPage = location.pathname === '/';
  const shouldAddPadding = showNavbar && !isLandingPage;
  
  return (
    <div className="overflow-x-hidden">
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#374151',
            color: '#fff',
            border: '1px solid #4B5563',
            borderRadius: '8px',
          },
          success: {
            duration: 2000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />
      
      {showNavbar && <Navbar />}
      <div className={shouldAddPadding ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes - Redirect if already logged in */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Signup />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/profile-setup" 
            element={
              <ProtectedRoute requireAuth={true}>
                <ProfileSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/features" 
            element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <FeaturePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requireAuth={true}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/green-funds" 
            element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <GreenFundSearch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transaction" 
            element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <TransactionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rewards" 
            element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <RewardsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/redeem/:rewardId" 
            element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <RedemptionScreen />
              </ProtectedRoute>
            } 
          />
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
