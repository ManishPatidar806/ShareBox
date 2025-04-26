"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Lock, Shield, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  const heroRef = useRef(null);
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = 'Share your files instantly and securely';

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const features = [
    { icon: Lock, text: 'Secure File Sharing' },
    { icon: Shield, text: 'Protected Transfer' },
    { icon: CheckCircle, text: 'Easy Collaboration' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-[10%] w-80 h-80 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-8">
            <Shield className="h-4 w-4 mr-2" />
            <span>File Sharing Made Simple</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {displayText}
            <span className={`inline-block w-[3px] h-[1em] bg-blue-600 ml-1 ${isTypingComplete ? 'animate-pulse' : ''
              }`} />
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Share your files instantly and securely with our modern platform.
            Upload, organize, and collaborate with confidence in just a few clicks.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Link href='/login'> Start Sharing</Link>

            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Link href='/about'> Learn More</Link>

            </motion.button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.text}
                </h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-4xl mx-auto h-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center justify-center h-full p-8">
                <div className="w-full max-w-2xl border-2 border-dashed border-blue-300 rounded-2xl p-12 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 group">
                  <div className="text-center">
                    <div className="relative">
                      <FileText className="h-20 w-20 text-blue-600 mx-auto mb-6 transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 animate-ping opacity-20">
                        <FileText className="h-20 w-20 text-blue-600 mx-auto" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      Drop your files here
                    </h3>
                    <p className="text-gray-600 mb-6">
                      or <span className="text-blue-600 font-medium">browse</span> from your computer
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                        Drag & Drop
                      </div>
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                        Up to 2GB
                      </div>
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></div>
                        Secure
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;