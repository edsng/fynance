import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FinancialForm from './components/FinancialForm.jsx';  // Add .jsx extension

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/form" element={<FinancialForm />} />
    </Routes>
  );
}

export default App;