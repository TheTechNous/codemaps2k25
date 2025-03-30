import { useState } from "react";
import { motion } from 'motion/react';
import { fadeIn } from "@/variants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login/', formData);
      
      // Store the access token
      localStorage.setItem('access_token', response.data.access);
      
      toast({
        title: "Success!",
        description: "Logged in successfully.",
        className: "bg-tertiary border-none shadow-shadow-1",
      });

      // Redirect to the items page
      navigate('/safereturn/items');
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Failed to login. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        className: "bg-tertiary border-none shadow-shadow-1",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-bg-color-2">
      <div className="pb-12 pt-8 lg:pb-20 lg:pt-16 w-full">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="mb-12">
            <motion.h2
              variants={fadeIn("left", 0)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="text-lightn font-bold font-montserrat xl:leading-[75px] xl:text-6xl md:leading-[60px] md:text-5xl text-3xl capitalize"
            >
              Login
            </motion.h2>
          </div>

          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full max-w-md mx-auto bg-bg-color-1 shadow-shadow-1 p-8 rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-lightn font-medium text-lg">Username</label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your username"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-lightn font-medium text-lg">Password</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white h-14 text-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Login; 