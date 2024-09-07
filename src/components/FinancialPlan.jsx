import React from 'react';
import { motion } from 'framer-motion';
import '../css/FinancialPlan.css';

function FinancialPlan({ plan }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2>Your Financial Plan</h2>
            <pre>{JSON.stringify(plan, null, 2)}</pre>
            {/* Add visual diagrams here */}
        </motion.div>
    );
}

export default FinancialPlan;