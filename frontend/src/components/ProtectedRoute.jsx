// ProtectedRoute.jsx - Updated to handle skipped profiles
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ 
    // eslint-disable-next-line react/prop-types
  children, 
  // eslint-disable-next-line react/prop-types
  requireAuth = true, 
  // eslint-disable-next-line react/prop-types
  requireProfile = false,
  // eslint-disable-next-line react/prop-types
  redirectTo = null 
}) => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // If authentication is required but user is not logged in
    if (requireAuth && !currentUser) {
      toast.error('Please sign in to access this page', {
        duration: 3000,
      });
      navigate('/login', { replace: true });
      return;
    }

    // ✅ UPDATED: Handle profile requirements more flexibly
    if (requireProfile && currentUser && 
        !currentUser.profileCompleted && 
        !currentUser.profileSkipped && 
        !currentUser.hasBasicAccess) {
      // Only redirect to profile setup if they haven't skipped it
      navigate('/profile-setup', { replace: true });
      return;
    }

    // Smart redirects for logged-in users accessing auth pages
    if (currentUser && 
        (window.location.pathname === '/login' || 
         window.location.pathname === '/signup')) {
      
      if (currentUser.profileCompleted || currentUser.profileSkipped || currentUser.hasBasicAccess) {
        navigate('/features', { replace: true });
      } else {
        navigate('/profile-setup', { replace: true });
      }
      return;
    }

    // Custom redirect logic
    if (redirectTo && currentUser) {
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, requireAuth, requireProfile, redirectTo, navigate]);

  // Show loading state while checking authentication
  if (requireAuth && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
