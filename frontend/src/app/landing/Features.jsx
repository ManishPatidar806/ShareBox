import React from 'react';
import { Lock, Clock, Fingerprint, Key, Shield, FileText, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="p-4 bg-blue-50 rounded-xl inline-flex items-center justify-center mb-6 text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: "End-to-End Encryption",
      description: "Files are encrypted before leaving your device and can only be decrypted by the intended recipient."
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Password Protection",
      description: "Add an extra layer of security by requiring a password to access your shared files."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Expiring Links",
      description: "Set expiration times for your shared links to ensure they can't be accessed indefinitely."
    },
    {
      icon: <EyeOff className="h-6 w-6" />,
      title: "Zero-Knowledge Privacy",
      description: "We can't see your files or data. Your content remains private even from us."
    },
    {
      icon: <Fingerprint className="h-6 w-6" />,
      title: "Two-Factor Authentication",
      description: "Protect your account with an additional verification step when signing in."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Access Controls",
      description: "Define who can view, edit, or download shared files with granular permissions."
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-6"
          >
            <Shield className="h-4 w-4 mr-2" />
            <span>Why Choose SecureShare</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900"
          >
            Advanced Security Features
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Our secure file sharing platform offers industry-leading protection with features designed to keep your sensitive data safe.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-80 bg-blue-100/50 rounded-r-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute right-0 top-3/4 -translate-y-1/2 w-40 h-60 bg-blue-200/30 rounded-l-full blur-3xl"
      />
    </section>
  );
};

export default Features;