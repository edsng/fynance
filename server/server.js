import express from 'express';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import GoogleUser from './models/GoogleUser.js';
import FinancialPlan from './models/FinancialPlan.js';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('GOOGLE_CLIENT_ID:', process.env.VITE_GOOGLE_CLIENT_ID);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // or whatever port your Vite dev server is running on
  credentials: true,
}));
app.use(express.json());

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;

    let user = await GoogleUser.findOne({ googleId });
    if (!user) {
      user = new GoogleUser({
        googleId,
        email,
        firstName,
        lastName,
        userId: uuidv4()
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id, isGoogleUser: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error verifying JWT:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/api/user/financial-plan', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { planId } = req.body;
    user.financialPlans.push(planId);
    await user.save();

    res.json({ message: 'Financial plan added successfully', user });
  } catch (error) {
    console.error('Error adding financial plan:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/api/financial-plan', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, description } = req.body;
    const newPlan = new FinancialPlan({
      name,
      description,
      userId: user._id
    });
    await newPlan.save();

    res.json({ message: 'Financial plan created successfully', planId: newPlan._id });
  } catch (error) {
    console.error('Error creating financial plan:', error);
    res.status(500).json({ error: 'Failed to create financial plan' });
  }
});

app.post('/api/create-account', async (req, res) => {
  console.log('Received request to create account:', req.body);
  try {
    const { firstName, lastName, email } = req.body;
    const userIdentifier = `${email}_${firstName}_${lastName}`;
    const userId = uuidv4();

    let user = await User.findOne({ userIdentifier });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({
      userIdentifier,
      firstName,
      lastName,
      email,
      userId
    });
    await user.save();

    const token = jwt.sign({ userId: user._id, isGoogleUser: false }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Account created successfully', token, user });
  } catch (error) {
    console.error('Error creating account:', error);
    if (error.code === 11000) {
      console.error('Duplicate key error details:', error.keyValue);
    }
    res.status(500).json({ error: 'Internal server error', details: error.message, code: error.code });
  }
});

app.post('/api/questionnaire', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.isGoogleUser) {
      user = await GoogleUser.findById(decoded.userId);
    } else {
      user = await User.findById(decoded.userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { ...answers } = req.body;
    user.questionnaireAnswers = answers;
    await user.save();

    res.status(201).json({ message: 'Questionnaire submitted successfully' });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/api/questionnaire-results', async (req, res) => {
  try {
    const { firstName, lastName } = req.query;
    console.log('Fetching results for:', { firstName, lastName });

    const user = await User.findOne({ firstName, lastName });
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.questionnaireAnswers) {
      return res.status(404).json({ error: 'No questionnaire results found' });
    }

    res.json({ ...user.questionnaireAnswers, firstName, lastName });
  } catch (error) {
    console.error('Error fetching questionnaire results:', error);
    res.status(500).json({ error: 'Failed to fetch questionnaire results', details: error.message });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.use((req, res) => {
  console.log('Unhandled request:', req.method, req.url);
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));