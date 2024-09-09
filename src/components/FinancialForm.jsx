import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import '../css/FinancialForm.css';

export default function FinancialForm() {
  const [file, setFile] = useState(null);
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      console.log('File uploaded:', file.name);
    }
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
        <button className="new-user-button">New User</button>
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

      <motion.div variants={item} className="returning-user-section">
        <h2>Returning User?</h2>
        <p>Upload your previous plan file to skip the form:</p>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".json,.txt"
          className="file-input"
        />
        <button onClick={handleFileUpload} className="upload-button">
          Upload Previous Plan
        </button>
      </motion.div>
      <motion.div variants={item}>
        <Link to="/" className="back-button">
          <span className="arrow-icon"><FaArrowLeft/></span>
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
