import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userIdentifier: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userId: { type: String, required: true },
  questionnaireAnswers: { type: Object, default: {} }
});

// Ensure only userIdentifier has an index
userSchema.index({ userIdentifier: 1 }, { unique: true });

export default mongoose.model('User', userSchema);