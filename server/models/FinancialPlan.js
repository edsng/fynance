import mongoose from 'mongoose';

const financialPlanSchema = new mongoose.Schema({
  // ... schema definition ...
});

export default mongoose.model('FinancialPlan', financialPlanSchema);