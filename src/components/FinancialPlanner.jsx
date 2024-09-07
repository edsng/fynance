import React, { useState } from 'react';
import FinancialForm from './FinancialForm';
import FinancialPlan from './FinancialPlan';

function FinancialPlanner() {
    const [financialPlan, setFinancialPlan] = useState(null);

    const handleFormSubmit = async (formData) => {
        // Remove sensitive information before sending to API
        const apiData = {
            annualIncome: formData.annualIncome,
            currentDebts: formData.currentDebts,
            creditScore: formData.creditScore
        };

        try {
            // Replace with actual API call
            const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY_HERE'
                },
                body: JSON.stringify({
                    prompt: `Create a financial plan based on the following data: ${JSON.stringify(apiData)}`,
                    max_tokens: 150
                })
            });

            const data = await response.json();
            setFinancialPlan(data.choices[0].text);

            // Store sensitive data locally
            localStorage.setItem('financialGoals', formData.financialGoals);
        } catch (error) {
            console.error('Error generating financial plan:', error);
        }
    };

    return (
        <div>
            <h1>Create Your Financial Plan</h1>
            {!financialPlan ? (
                <FinancialForm onSubmit={handleFormSubmit} />
            ) : (
                <FinancialPlan plan={financialPlan} />
            )}
        </div>
    );
}

export default FinancialPlanner;