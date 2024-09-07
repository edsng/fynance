import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import FinancialPlan from './components/FinancialPlan';
import BackgroundParticles from './components/BackgroundParticles';
import './App.css'; // Make sure this import exists

function App() {
    return (
        <Router basename="/fynance">
            <div className="App">
                <BackgroundParticles />
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/plan" element={<FinancialPlan />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
