import React from 'react';
import { Mail, Phone, MapPin, Box } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' }
  ];

  const resources = [
    { name: 'Documentation', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Support Center', href: '#' },
    { name: 'FAQ', href: '#' }
  ];

  const contactInfo = [
    { icon: <Mail className="h-5 w-5" />, text: 'xxxxxxxxxxxxxxxxx@gmail.com' },
    { icon: <Phone className="h-5 w-5" />, text: '+91 xxxxx xxxxx' },
    { icon: <MapPin className="h-5 w-5" />, text: 'Madhya Pradesh, India' }
  ];

  const socialLinks = [
    { icon: <FaTwitter size={20} />, href: '#', color: 'hover:text-[#1DA1F2]' },
    { icon: <FaFacebook size={20} />, href: '#', color: 'hover:text-[#4267B2]' },
    { icon: <FaInstagram size={20} />, href: '#', color: 'hover:text-[#E4405F]' },
    { icon: <FaLinkedin size={20} />, href: '#', color: 'hover:text-[#0077B5]' },
    { icon: <FaGithub size={20} />, href: '#', color: 'hover:text-[#333]' }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2"
            >
              <Box className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ShareBox</span>
            </motion.div>
            <p className="text-gray-600 text-sm">
              Secure file sharing platform with advanced encryption and privacy features.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className={`text-gray-400 ${social.color} transition-colors`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <a href={link.href}>{link.name}</a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <a href={resource.href}>{resource.name}</a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 text-gray-600"
                >
                  <span className="text-blue-600">{info.icon}</span>
                  <span>{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SecureBox. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;