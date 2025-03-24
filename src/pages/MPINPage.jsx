import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MPINPage = ({ onAuthenticate }) => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Refs for the pin input fields
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  
  // The correct PIN (in a real app, this would be stored securely or verified via API)
  const correctPin = ['1', '2', '3', '4'];
  
  // Focus the first input on mount
  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);
  
  // Handle PIN input change
  const handlePinChange = (index, value) => {
    if (value.length > 1) {
      // If pasting a value, only take the first digit
      value = value.charAt(0);
    }
    
    if (isNaN(Number(value)) && value !== '') {
      // Only allow numbers
      return;
    }
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Auto-focus next input if this one is filled
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
    
    // Automatically check PIN if all fields are filled
    if (index === 3 && value !== '') {
      setTimeout(() => {
        verifyPin(newPin);
      }, 100);
    }
  };
  
  // Handle key down (for backspace navigation)
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && index > 0 && pin[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };
  
  // Verify the entered PIN
  const verifyPin = (currentPin) => {
    if (currentPin.join('') === correctPin.join('')) {
      // Successful authentication
      setIsAuthenticated(true);
      
      // Call the authentication handler after animation completes
      setTimeout(() => {
        if (onAuthenticate) {
          onAuthenticate(); // This will set the cookie and update parent state
        }
        navigate('/');
      }, 800);
    } else {
      // Failed authentication
      setError('Incorrect PIN. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      
      // Clear PIN and focus first input
      setPin(['', '', '', '']);
      inputRefs[0].current.focus();
    }
  };
  
  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-6">
      {!isAuthenticated ? (
        <motion.div 
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* App Logo */}
          <motion.div 
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <div className="h-24 w-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </motion.div>
          
          {/* Welcome Text */}
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Enter your 4-digit PIN to continue</p>
          </motion.div>
          
          {/* PIN Input */}
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <div className={`flex justify-center space-x-4 ${shake ? 'animate-shake' : ''}`}>
              {pin.map((digit, index) => (
                <div 
                  key={index} 
                  className="w-14 h-14 relative"
                >
                  <input
                    ref={inputRefs[index]}
                    type="text"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-full h-full bg-white border-2 ${
                      error ? 'border-red-400' : digit ? 'border-blue-500' : 'border-gray-300'
                    } rounded-xl text-center text-xl font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
                    maxLength={1}
                    autoComplete="off"
                    inputMode="numeric"
                  />
                  {digit && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Error message */}
            {error && (
              <motion.p 
                className="text-red-600 text-center mt-3 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
          </motion.div>
          
          {/* Helper text */}
          <motion.div 
            className="text-center text-sm text-gray-500"
            variants={itemVariants}
          >
            <p>Default PIN: 1234</p>
            <p className="mt-4">Forgot PIN? <button className="text-blue-600 font-medium">Contact Admin</button></p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="flex flex-col items-center justify-center"
          variants={successVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Authentication Successful</h2>
          <p className="text-gray-600 mt-2">Redirecting to dashboard...</p>
        </motion.div>
      )}
      
      {/* Custom CSS for shake animation */}
      <style jsx="true">{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default MPINPage;