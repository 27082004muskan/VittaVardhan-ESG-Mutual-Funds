import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading('Logging out...');
    
    try {
      // Call backend logout endpoint
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch('http://localhost:5001/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.warn('Backend logout failed:', error);
        }
      }

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.dismiss(loadingToast);
      toast.success('Successfully logged out!');
      
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.dismiss(loadingToast);
      toast.error('Logout encountered an issue');
      
      // Force logout anyway
      localStorage.clear();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  return {
    logout,
    isAuthenticated,
    getCurrentUser,
    isLoading
  };
};
