import React, { useState } from 'react';
import FinancialForm from './FinancialForm';
import FinancialPlan from './FinancialPlan';
import '../css/FinancialPlanner.css';

function FinancialPlanner() {
  const [planData, setPlanData] = useState(null);

  const handleFormSubmit = (data) => {
    setPlanData(data);
  };

  return (
    <div className="financial-planner">
      <h1>Financial Planner</h1>
      {!planData ? (
        <FinancialForm onSubmit={handleFormSubmit} />
      ) : (
        <FinancialPlan data={planData} />
      )}
    </div>
  );
}

export default FinancialPlanner;