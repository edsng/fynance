import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../css/FinancialForm.css';

function FinancialForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        financialGoals: '',
        annualIncome: '',
        currentDebts: '',
        creditScore: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <input
                type="text"
                name="financialGoals"
                placeholder="Financial Goals"
                value={formData.financialGoals}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="annualIncome"
                placeholder="Annual Income"
                value={formData.annualIncome}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="currentDebts"
                placeholder="Current Debts / Loans"
                value={formData.currentDebts}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="creditScore"
                placeholder="Approximate Credit Score"
                value={formData.creditScore}
                onChange={handleChange}
                required
            />
            <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Generate Financial Plan
            </motion.button>
        </motion.form>
    );
}

export default FinancialForm;