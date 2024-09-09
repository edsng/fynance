import React from 'react';
import '../css/FinancialPlan.css';

function FinancialPlan({ data }) {
  return (
    <div className="financial-plan">
      <h2>Your Financial Plan</h2>
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FinancialPlan;