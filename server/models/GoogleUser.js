import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userId: { type: String, required: true },
  questionnaireAnswers: { type: Object, default: {} }
});

export default mongoose.model('GoogleUser', googleUserSchema);