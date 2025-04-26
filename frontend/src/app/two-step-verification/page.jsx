"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import axios from 'axios';
import API from '../../utils/api';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '../Loading/Loading';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(360);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    inputRefs.current[0]?.focus();
    startTimer();
  }, []);

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const otpValue = otp.join('');

      const response = await API.post(`/api/email/verify?otp=${otpValue}&email=${searchParams.get('email')}`);

      if (response.data != "") {
        localStorage.setItem('token', response.data);
        document.cookie = `token=${response.data.token}; path=/;`;
        setSuccess('OTP verified successfully');
        router.push('/');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError('');
      const response = await axios.post('/api/resend-otp', {
        // Add necessary data
        // email: user.email,
        // phone: user.phone,
      });

      if (response.data.success) {
        setTimer(30);
        startTimer();
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <Suspense fallback={<Loading/>}>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
          <p className="text-gray-600">
            We have sent a 6-digit OTP to your registered email/phone
          </p>
        </div>

        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-4 text-center ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}
          >
            {error || success}
          </motion.div>
        )}

        <div className="flex justify-center gap-2 mb-8">
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-black" // Added text-black here
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleVerify}
          disabled={otp.join('').length !== 6 || isLoading}
          className={`w-full py-4 rounded-lg font-medium text-white mb-4 flex items-center justify-center
            ${otp.join('').length === 6 && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'}`}
          whileHover={{ scale: otp.join('').length === 6 && !isLoading ? 1.01 : 1 }}
          whileTap={{ scale: otp.join('').length === 6 && !isLoading ? 0.99 : 1 }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            <>
              Verify OTP
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </motion.button>

        <button
          onClick={handleResend}
          disabled={timer > 0}
          className={`w-full py-4 rounded-lg font-medium mb-6 
            ${timer === 0
              ? 'text-blue-600 hover:bg-blue-50'
              : 'text-gray-400 cursor-not-allowed'}`}
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </button>

        <div className="flex items-center justify-center text-gray-500 text-sm">
          <Shield className="w-4 h-4 mr-2" />
          Do not share your OTP with anyone
        </div>
      </motion.div>
    </div></Suspense>
  );
};

export default OTPVerification;
