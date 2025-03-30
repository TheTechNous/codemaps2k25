import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Debug: Log all cookies
  console.log('All cookies:', document.cookie);
  
  const accessToken = getCookie('access_token');
  console.log('Current access token:', accessToken);

  if (!accessToken) {
    console.log('No access token found, redirecting to login...');
    sessionStorage.setItem('redirectUrl', location.pathname);
    window.location.replace('http://localhost:8000/login');
    return null;
  }

  return children;
};

export default ProtectedRoute; 