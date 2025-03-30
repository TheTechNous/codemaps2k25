import React, { useState } from 'react';
import { motion } from "framer-motion";
import { fadeIn, scaleIn } from '@/variants';

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is SafeReturn?",
      answer: "SafeReturn is a web platform that helps users recover lost items securely by connecting finders and owners through technology."
    },
    {
      question: "Who can use SafeReturn?",
      answer: "Anyone who has lost or found an item can use the platform, whether individuals, businesses, or organizations."
    },
    {
      question: "How does SafeReturn help recover lost items?",
      answer: "Users report lost items, and the system cross-checks them with found items in the database. If a match is found, the owner is notified for secure retrieval."
    },
    {
      question: "Is my personal information safe with SafeReturn?",
      answer: "Yes! We use encryption and authentication to protect user data, ensuring privacy and security."
    },
    {
      question: "What types of items can be reported on SafeReturn?",
      answer: "Electronics, personal items, documents, and even pets! The platform supports a wide range of lost and found categories."
    },
    {
      question: "Is SafeReturn free to use?",
      answer: "Basic services are free, but we offer premium features like priority matching and instant notifications for a small fee."
    }
  ];

  return (
    <section className="w-full bg-[#f8f9fa]">

      <motion.nav 
        variants={fadeIn("down", 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        transition={{ duration: 0.2 }}
        className="flex justify-between items-center py-4 px-8 bg-black"
      >
        <div className="text-2xl font-bold text-white">SafeReturn</div>
        <div className="hidden md:flex items-center space-x-6">
          <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded">Button</button>
        </div>
      </motion.nav>


      <div className="container mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeIn("right", 0.1)}
               initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              SafeReturn
            </h1>
            <p className="text-gray-600 mb-8">
              In a world where things often go missing, SafeReturn ensures they find their way home. Designed with efficiency and security at its core, our platform simplifies the process of reporting, tracking, and recovering lost items.
            </p>
            <div className="flex items-center space-x-6">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
                href="#contact"
                className="group relative inline-flex items-center overflow-hidden rounded px-8 py-3 bg-accent-primary text-white"
              >
                <span className="absolute -end-full transition-all group-hover:end-4">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white transition-all group-hover:me-4">
                  Get Started
                </span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
                href="#learn-more"
                className="group relative inline-flex items-center overflow-hidden rounded border-2 border-accent-primary px-8 py-3 text-accent-primary"
              >
                <span className="absolute -end-full transition-all group-hover:end-4">
                  <svg
                    className="h-5 w-5 text-accent-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium text-accent-primary transition-all group-hover:me-4">
                  Learn More
                </span>
              </motion.a>
            </div>
          </motion.div>
          <motion.div
            variants={fadeIn("left", 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-auto"
          >
            <div className="bg-accent-primary/10 rounded-2xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Secure Recovery</h3>
                </div>
                <p className="text-gray-600">Our platform ensures safe and efficient item recovery through verified processes.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


      <div className="container mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Every lost item has its way back</h2>
            <p className="text-gray-600">
              At SafeReturn, we believe that every lost item has its way back to its rightful owner. Our platform streamlines the journey from loss to recovery through a structured process—detailed reporting, secure faculty verification, and organized tracking with QR-coded storage. Users can effortlessly browse, filter, and reclaim their belongings, ensuring that what's lost is never truly gone, just waiting to be found. With SafeReturn, every missing piece finds its way home.
            </p>
          </motion.div>
          <div className="space-y-8">
            <motion.div
              variants={fadeIn("left", 0.05)}
             initial="hidden" 
              whileInView="show"
              viewport={{ once: false, amount: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex gap-4"
            >
              <div className="bg-accent-primary p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Recovery Process</h3>
                <p className="text-gray-600">Every found item is submitted for faculty verification before being securely stored, ensuring authenticity and preventing false claims.</p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn("left", 0.1)}
             initial="hidden" 
              whileInView="show"
              viewport={{ once: false, amount: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex gap-4"
            >
              <div className="bg-accent-primary p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Tracking with QR Codes</h3>
                <p className="text-gray-600">Once verified, lost items are assigned a QR code, making retrieval fast, efficient, and completely organized for both users and administrators.</p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn("left", 0.15)}
			 initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex gap-4"
            >
              <div className="bg-accent-primary p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & Seamless Authentication</h3>
                <p className="text-gray-600">With JWT-based authentication, user logins are protected through encrypted tokens and cookies, ensuring safe access to lost and found listings.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>


      <div className="container mx-auto px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">

          <motion.div
            variants={fadeIn("up", 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-black text-white h-48 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Overview</h3>
            <p className="text-gray-600">
              A technology to ensure safe returns. Built with React, Node.js, and MongoDB, SafeReturn streamlines the entire recovery process.
            </p>
            <motion.a 
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.1 }}
              href="#" 
              className="text-gray-600 hover:text-gray-900"
            >
              Learn more
            </motion.a>
          </motion.div>

          <motion.div
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-black text-white h-48 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">How SafeReturn Works
            </h3>
            <p className="text-gray-600">
              Users submit lost item reports through our intuitive interface. Our REST API processes requests, manages data securely, and facilitates communication between finders and owners.
            </p>
            <motion.a 
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.1 }}
              href="#" 
              className="text-gray-600 hover:text-gray-900"
            >
              See process
            </motion.a>
          </motion.div>


          <motion.div
            variants={fadeIn("up", 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-black text-white h-48 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Real-World Impact</h3>
            <p className="text-gray-600">
              From recovering lost electronics to reuniting students with important documents, SafeReturn has streamlined the recovery process. Future updates will include mobile apps and AI-powered item matching.
            </p>
            <motion.a 
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.1 }}
              href="#" 
              className="text-gray-600 hover:text-gray-900"
            >
              View success stories
            </motion.a>
          </motion.div>
        </div>
      </div>


      <div className="container mx-auto px-8 py-16">
        <motion.h2
          variants={fadeIn("down", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
          transition={{ duration: 0.2 }}
          className="text-3xl font-bold text-center mb-4 text-accent-primary"
        >
          What People Say About Us
        </motion.h2>
        <motion.p
          variants={fadeIn("down", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
          transition={{ duration: 0.2 }}
          className="text-center text-gray-600 mb-12"
        >
          Hear from our satisfied users
        </motion.p>
        <div className="grid md:grid-cols-3 gap-8">

          <motion.div
            variants={fadeIn("up", 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="text-center h-full"
          >
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 h-full flex flex-col">
              <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                "SafeReturn helped me recover my lost laptop within hours! The platform is user-friendly and efficient. Highly recommend it!"
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-semibold">VS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Vijay Sajwan</p>
                  <p className="text-gray-600">Tech Solutions Inc.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeIn("up", 0.1)}
           initial="hidden" 
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="text-center h-full"
          >
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 h-full flex flex-col">
              <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                "The authentication system is top-notch! I feel secure knowing my data is protected while tracking my items in real-time."
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-semibold">KK</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Kavlin Kaur</p>
                  <p className="text-gray-600">SecureTrack Ltd.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn("up", 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            transition={{ duration: 0.2 }}
            className="text-center h-full"
          >
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 h-full flex flex-col">
              <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                "I love how simple and intuitive SafeReturn is. It took me just minutes to register my lost item, and I got updates instantly!"
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-semibold">AS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Aditya Singh</p>
                  <p className="text-gray-600">Freelancer</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>

      <div className="container mx-auto px-8 py-16">
        <motion.h2
          variants={fadeIn("down", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
          transition={{ duration: 0.2 }}
          className="text-4xl font-bold text-center mb-8 text-accent-primary"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Everything you need to know about SafeReturn
        </motion.p>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
        <motion.div  
              key={index}
              variants={fadeIn("up", 0.05 * (index + 1))}
         initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.7 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg hover:shadow-lg transition-shadow duration-200 border border-gray-200"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <motion.svg
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`w-5 h-5 text-accent-primary transform ${activeIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
              <motion.div
                animate={{
                  height: activeIndex === index ? "auto" : 0,
                  opacity: activeIndex === index ? 1 : 0
                }}
                initial={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </motion.div>
        </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;