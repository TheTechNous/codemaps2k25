import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from '@/variants';

const Footer = ({ name }) => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="container mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Logo and Title */}
          <motion.div 
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col space-y-4"
          >
            <h3 className="text-4xl w-fit text-accent-primary font-semibold font-cookie cursor-pointer">
              {name}<span className="text-5xl text-accent-primary">.</span>
            </h3>
            <p className="text-gray-600 max-w-md">
              The university property and validation system that helps find the things you lost and declare lost no to the unity.
            </p>
          </motion.div>

          {/* Right Side - Contact Details */}
          <motion.div 
            variants={fadeIn("left", 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col space-y-4 md:items-end"
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Contact Us</h3>
              <p className="text-gray-600">Email: contact@safereturn.com</p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-600">Address: 123 Main Street, City, Country</p>
            </div>
          </motion.div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">&#169; {year}. All rights reserved by safereturn.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
