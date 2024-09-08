import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FaArrowRight, FaChartLine, FaLock, FaRobot, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import openAILogo from '../assets/openai-logo.png'; // Import the OpenAI logo
import yourLogo from '../assets/rxdlne.png'; // Import your logo
import '../css/LandingPage.css';

function AnimatedSection({ children, variants }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
        >
            {children}
        </motion.div>
    );
}

function LandingPage() {
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8 }
        }
    };

    const infoItem = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.8 }
        }
    };

    return (
        <div className="landing-page-container">
            <AnimatedSection variants={container}>
                <div className="welcome-container snap-section">
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
                </div>
            </AnimatedSection>

            <AnimatedSection variants={container}>
                <div className="info-container snap-section">
                    <motion.h2 variants={infoItem}>
                        Why Choose <span className="highlight">Fynance</span>?
                    </motion.h2>
                    <div className="info-grid">
                        <motion.div className="info-item" variants={infoItem}>
                            <FaChartLine className="info-icon" />
                            <h3>Smart Insights</h3>
                            <p>Get personalized financial advice based on your unique situation and goals.</p>
                        </motion.div>
                        <motion.div className="info-item" variants={infoItem}>
                            <FaLock className="info-icon" />
                            <h3>Secure & Private</h3>
                            <p>Your financial data is encrypted and never collected or sold. All data is stored locally within your device.</p>
                        </motion.div>
                        <motion.div className="info-item" variants={infoItem}>
                            <FaRobot className="info-icon" />
                            <h3>AI-Powered</h3>
                            <p>Our advanced algorithms provide up-to-date recommendations and incredibly fast financial calculations.</p>
                        </motion.div>
                    </div>
                    <motion.div className="powered-by-openai" variants={infoItem}>
                        <img src={openAILogo} alt="OpenAI Logo" className="openai-logo" />
                        <span>Powered by OpenAI</span>
                    </motion.div>
                </div>
            </AnimatedSection>

            <AnimatedSection variants={container}>
                <div className="creator-container snap-section">
                    <motion.div className="creator-logo" variants={item}>
                        <img src={yourLogo} alt="Creator's Logo" />
                    </motion.div>
                    <motion.div className="creator-links" variants={item}>
                        <a href="https://edsng.github.io/edwsng/" target="_blank" rel="noopener noreferrer">
                            <FaGlobe className="creator-icon" />
                        </a>
                        <a href="https://github.com/edsng" target="_blank" rel="noopener noreferrer">
                            <FaGithub className="creator-icon" />
                        </a>
                        <a href="https://linkedin.com/in/edwsng" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="creator-icon" />
                        </a>
                    </motion.div>
                    <motion.p className="creator-text" variants={item}>
                        &copy; {new Date().getFullYear()} edwsng
                    </motion.p>
                </div>
            </AnimatedSection>
        </div>
    );
}

export default LandingPage;