import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-page">
            <div className="intro-text">
                <h2>Introducing</h2>
                <h1>Fynance</h1>
                <p>Your personal AI-powered financial advisor</p>
            </div>
            <Link to="/plan">
                <button>Get Started</button>
            </Link>
        </div>
    );
}

export default LandingPage;