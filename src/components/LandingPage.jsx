import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa'; // Make sure to install react-icons
import '../css/LandingPage.css';

function LandingPage() {
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.5,  // Increased delay before children start animating
                staggerChildren: 0.3,  // Increased delay between each child's animation
                duration: 1.5  // Overall container fade-in duration
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1.2  // Increased duration for each item's animation
            }
        }
    };

    return (
        <motion.div 
            className="landing-page"
            variants={container}
            initial="hidden"
            animate="visible"
        >
            <div className="intro-text">
                <motion.h2 variants={item}>Introducing</motion.h2>
                <motion.h1 variants={item}>Fynance</motion.h1>
                <motion.p variants={item}>Your personal AI-powered financial advisor</motion.p>
            </div>
            <motion.div variants={item} className="get-started-container">
                <Link to="/plan">
                    <div className="get-started-button">
                        <span className="button-text">Get Started</span>
                        <span className="arrow-icon">
                            <FaArrowRight />
                        </span>
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}

export default LandingPage;