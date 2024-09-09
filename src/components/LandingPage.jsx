import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChartLine, FaLock, FaRobot, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import openAILogo from '../assets/openai-logo.png'; // Import the OpenAI logo
import yourLogo from '../assets/rxdlne.png'; // Import your logo
import '../css/LandingPage.css';

function useScrollSnap(ref) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = ref.current.querySelectorAll('.snap-section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [ref]);
}

function LandingPage() {
    const scrollRef = useRef(null);
    useScrollSnap(scrollRef);

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

    const infoItem = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.8 }
        }
    };

    const fadeInVariant = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 1.2 }
        }
    };

    return (
        <div className="landing-page-container" ref={scrollRef}>
            <motion.div 
                className="welcome-container snap-section"
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
                    <Link to="/form">
                        <div className="get-started-button">
                            <span className="button-text">Get Started</span>
                            <span className="arrow-icon">
                                <FaArrowRight />
                            </span>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div 
                className="info-container snap-section"
                variants={fadeInVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
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
                        <p>Your financial data is encrypted and never collected or stored.</p>
                    </motion.div>
                    <motion.div className="info-item" variants={infoItem}>
                        <FaRobot className="info-icon" />
                        <h3>AI-Powered</h3>
                        <p>Our advanced algorithms provide up-to-date recommendations and incredibly fast financial calculations.</p>
                    </motion.div>
                </div>
                <div className="powered-by-openai">
                    <img src={openAILogo} alt="OpenAI Logo" className="openai-logo" />
                    <span>Powered by OpenAI</span>
                </div>
            </motion.div>

            <motion.div 
                className="creator-container snap-section"
                variants={fadeInVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
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
            </motion.div>
        </div>
    );
}

export default LandingPage;