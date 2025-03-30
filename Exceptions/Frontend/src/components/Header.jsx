import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import api from "@/utils/api";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in by looking for access token
    const accessToken = localStorage.getItem('access_token');
    setIsLoggedIn(!!accessToken);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('http://localhost:8000/logout/');
      
      // Clear the access token
      localStorage.removeItem('access_token');
      
      // Update login state
      setIsLoggedIn(false);
      
      // Show success message
      toast({
        title: "Success!",
        description: "Logged out successfully.",
        className: "bg-tertiary border-none shadow-shadow-1",
      });

      // Redirect to home page
      navigate('/safereturn');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
        className: "bg-tertiary border-none shadow-shadow-1",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link to="/safereturn" className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-accent-primary">
              SafeReturn
            </span>
            <span className="text-4xl text-accent-primary">.</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-8 px-4 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white"
              >
                Logout
              </Button>
            ) : (
              <a href="http://localhost:8000/login">
                <Button
                  variant="outline"
                  className="h-8 px-4 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white"
                >
                  Login
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
