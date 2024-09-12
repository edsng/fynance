import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Results() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userName'));
        if (!userInfo) {
          throw new Error('User information not found');
        }

        console.log('Fetching results for:', userInfo);

        const response = await fetch(`http://localhost:3000/api/questionnaire-results?firstName=${encodeURIComponent(userInfo.firstName)}&lastName=${encodeURIComponent(userInfo.lastName)}`);

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch results: ${response.status} ${response.statusText}. Details: ${errorData.details || 'No details provided'}`);
        }

        const data = await response.json();
        console.log('Fetched results:', data);
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(error.message);
      }
    };

    fetchResults();
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Results</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/questionnaire')}>Retake Questionnaire</button>
      </div>
    );
  }

  if (!results) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="results-container">
      <h1>Your Questionnaire Results</h1>
      <div className="results-summary">
        <p>Name: {results.firstName} {results.lastName}</p>
        <p>Age: {results.age}</p>
        <p>Income: ${results.income}</p>
        <p>Savings: ${results.savings}</p>
        <p>Financial Goal: {results.goal}</p>
        <p>Risk Tolerance: {results.risk}</p>
      </div>
      {/* Add more detailed analysis or recommendations here */}
    </div>
  );
}