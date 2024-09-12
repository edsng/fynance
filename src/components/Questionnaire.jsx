import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginWithGoogle } from '../utils/auth';
import '../css/Questionnaire.css';

export default function Questionnaire() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showNameForm, setShowNameForm] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleLoginButton'),
        { 
          theme: 'outline', 
          size: 'large',
          width: 240,
          height: 50,
          longtitle: true,
          type: 'standard'
        }
      );
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const { user, token } = await loginWithGoogle(response.credential);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUserEmail(user.email);
      setUserId(user.userId);
      setToken(token);
      setShowNameForm(false);
      localStorage.setItem('userName', JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userId: user.userId,
        isGoogleUser: true
      }));
    } catch (error) {
      console.error('Error logging in with Google', error);
      setError(error.message);
    }
  };

  const questions = [
    { id: 'age', question: 'What is your age?', type: 'number' },
    { id: 'income', question: 'What is your annual income?', type: 'number' },
    { id: 'savings', question: 'How much do you have in savings?', type: 'number' },
    { id: 'goal', question: 'What is your primary financial goal?', type: 'select', options: ['Large Purchase', 'Financial Security', 'Building Credit', 'Buying Real Estate', 'Investing', 'Automobile'] },
    { id: 'risk', question: 'How would you describe your risk tolerance?', type: 'select', options: ['Low - I tend not to spend a lot of money or invest', 'Medium - I spend moderately and invest occasionally', 'High - I am prone to high risk spending or investing'] }
  ];

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (firstName && lastName && userEmail) {
      try {
        console.log('Sending request to create account:', { firstName, lastName, email: userEmail });
        const response = await fetch('http://localhost:3000/api/create-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email: userEmail }),
        });

        console.log('Response status:', response.status);
        const result = await response.text(); // Use .text() instead of .json() for debugging
        console.log('Response text:', result);

        if (!response.ok) {
          throw new Error(result || 'Failed to create account');
        }

        const data = JSON.parse(result);
        setToken(data.token);
        setUserId(data.user.userId);
        setShowNameForm(false);
        localStorage.setItem('userName', JSON.stringify({ 
          firstName, 
          lastName, 
          email: userEmail, 
          userId: data.user.userId, 
          isGoogleUser: false
        }));
      } catch (error) {
        console.error('Error creating account:', error);
        setError(error.message);
      }
    }
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    if (answers[currentQuestion.id]) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleQuestionnaireComplete();
      }
    }
  };

  const handleQuestionnaireComplete = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userName'));
      const finalAnswers = {
        ...answers,
      };

      console.log('Submitting questionnaire:', finalAnswers);

      const response = await fetch('http://localhost:3000/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(finalAnswers),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}. Details: ${result.details || 'No details provided'}`);
      }

      // If successful, navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    setAnswers({ ...answers, [questions[currentQuestionIndex].id]: e.target.value });
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5 }
    }
  };

  const blinkVariant = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const questionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.5 } }
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Submitting Questionnaire</h2>
        <p>{error}</p>
        <button onClick={() => {
          setError(null);
          handleQuestionnaireComplete(answers);
        }}>
          Retry Submission
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="questionnaire-container"
      initial="hidden"
      animate="visible"
      variants={fadeInVariant}
    >
      {showNameForm ? (
        <motion.div className="name-form" variants={fadeInVariant}>
          <motion.h1 variants={fadeInVariant}>Let's get a little personal.</motion.h1>
          <motion.h3 variants={fadeInVariant}>What's your name?</motion.h3>
          <motion.form onSubmit={handleNameSubmit} variants={fadeInVariant}>
            <motion.div className="input-container" variants={fadeInVariant}>
              <motion.span className="blink-cursor" variants={blinkVariant} initial="hidden" animate="visible">-</motion.span>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First Name"
              />
            </motion.div>
            <motion.div className="input-container" variants={fadeInVariant}>
              <motion.span className="blink-cursor" variants={blinkVariant} initial="hidden" animate="visible">-</motion.span>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last Name"
              />
            </motion.div>
            <motion.div className="input-container" variants={fadeInVariant}>
              <motion.span className="blink-cursor" variants={blinkVariant} initial="hidden" animate="visible">-</motion.span>
              <input
                type="text"
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                placeholder="Email"
              />
            </motion.div>
            <motion.button type="submit" variants={fadeInVariant}>Begin Questionnaire</motion.button>
          </motion.form>
          <motion.div className="login-divider" variants={fadeInVariant}>
            <span>or</span>
          </motion.div>
          <motion.div className="google-login-wrapper" variants={fadeInVariant}>
            <div id="googleLoginButton"></div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div className="questionnaire-form" variants={fadeInVariant}>
          <motion.h1 variants={fadeInVariant}>Welcome to the Questionnaire, {firstName} {lastName}!</motion.h1>
          <form onSubmit={handleQuestionSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                variants={questionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3>{questions[currentQuestionIndex].question}</h3>
                {questions[currentQuestionIndex].type === 'select' ? (
                  <select
                    value={answers[questions[currentQuestionIndex].id] || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select an option</option>
                    {questions[currentQuestionIndex].options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={questions[currentQuestionIndex].type}
                    value={answers[questions[currentQuestionIndex].id] || ''}
                    onChange={handleInputChange}
                    required
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <motion.button type="submit" variants={fadeInVariant}>
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </motion.button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
}