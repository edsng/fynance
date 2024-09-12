import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen'; // Update this import
import Results from './components/Results'; // Update this import
import Questionnaire from './components/Questionnaire';
import BackgroundParticles from './components/BackgroundParticles';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <BackgroundParticles />
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/questionnaire" element={<Questionnaire />} />
                        <Route path="/results" element={<Results />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;