import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import FinancialForm from './components/FinancialForm';
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
                        <Route path="/form" element={<FinancialForm />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
