import React, { useState, useEffect } from 'react';
import { getUser, loginWithGoogle } from '../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import '../css/LoginScreen.css';

export default function LoginScreen() {
  const [user, setUser] = useState(null);
  const [googleClientId, setGoogleClientId] = useState(null);
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    console.log("Google Client ID from env:", GOOGLE_CLIENT_ID);
    console.log("Current origin:", window.location.origin);
    setGoogleClientId(GOOGLE_CLIENT_ID);

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn(GOOGLE_CLIENT_ID);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = (clientId) => {
    console.log("Google object available:", !!window.google);
    console.log("Google Client ID:", clientId);

    if (window.google && clientId) {
      console.log("Initializing Google Sign-In with client ID:", clientId);
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLogin
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleLoginButton'),
        { 
          theme: 'outline', 
          size: 'large',
          width: 240,
          height: 50,
          longtitle: true,
          type: 'standard'
        }
      );
    } else {
      console.error("Google Sign-In initialization failed. Google object or client ID not available.");
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);
      console.log("Decoded token:", decoded);
      const user = await loginWithGoogle(response.credential);
      setUser(user);
      // Redirect to dashboard page after successful login
      // navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in with Google', error);
    }
  };

  const handleCustomGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... your existing form submission logic ...
    // After creating the financial plan, update the user's financialPlans array
    if (user) {
      try {
        const response = await fetch('/api/user/financial-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          },
          body: JSON.stringify({ planId: newPlanId }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Handle successful submission
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error('Error submitting financial plan', error);
      }
    }
  };

  // Hover Draw Box
  const [isHovered, setIsHovered] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.3,
        duration: 1.5
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.2 }
    }
  };

  const boxVariants = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="financial-form-container"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={item}>Start your journey</motion.h1>
      <motion.p variants={item}>
        Welcome to the Financial Form page. Here you can start your financial planning journey.
      </motion.p>
      
      <motion.div 
        variants={item} 
        className="new-user-button-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className="new-user-button" onClick={() => navigate('/questionnaire')}>New User</button>
        <svg className="button-outline" width="150" height="50" viewBox="0 0 150 50">
          {/* Top-left corner */}
          <path d="M1 1 H 20 V 1 H 1 V 20" stroke="white" strokeWidth="2" fill="transparent" />
          
          {/* Bottom-right corner */}
          <path d="M149 49 H 130 V 49 H 149 V 30" stroke="white" strokeWidth="2" fill="transparent" />
          
          {/* Top and right sides */}
          <motion.path
            d="M20 1 H 149"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            variants={boxVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          />
          <motion.path
            d="M149 30 V 1"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            variants={boxVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          />
          
          {/* Bottom and left sides */}
          <motion.path
            d="M130 49 H 1"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            variants={boxVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          />
          <motion.path
            d="M1 20 V 49"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            variants={boxVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          />
        </svg>
      </motion.div>

      {!user ? (
        <motion.div className="login-container" variants={item}>
          <h2>Returning User?</h2>
          <motion.p>
          Log in to access your premiere financial plans.
          </motion.p>
          <div className="google-login-wrapper">
            <div id="googleLoginButton"></div>
          </div>
        </motion.div>
      ) : (
        <motion.div className="form-container" variants={item}>
          <h2>Welcome, {user.name}!</h2>
          {/* Your financial form elements go here */}
          <form onSubmit={handleSubmit}>
            {/* Add your form fields here */}
            <button type="submit" className="submit-button">Submit Financial Plan</button>
          </form>
        </motion.div>
      )}

      <motion.div variants={item}>
        <Link to="/" className="back-button">
          <span className="arrow-icon"><FaArrowLeft/></span>
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
