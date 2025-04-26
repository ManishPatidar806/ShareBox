"use client"
import React, { useEffect, useRef } from 'react';
import { Shield, Lock, Users, Zap } from 'lucide-react';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';
const About = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const stats = [
    { icon: Lock, value: "256-bit", label: "Military-Grade Encryption" },
    { icon: Users, value: "2M+", label: "Active Users" },
    { icon: Zap, value: "99.9%", label: "Uptime Guaranteed" },
  ];

  const teamMembers = [
    {
      name: "Urvaksh Tirle",
      role: "Frontend Devloper",
      image: "urvaskh.jpeg",
      description: "Visionary leader with 4 years in Next.js"
    },
    {
      name: "Harsh singh baghel",
      role: "Full stack devloper",
      image: "harsh.jpg",
      description: "Expert in mern stack with 3 year experiance"
    },
    {
      name: "Maya Patel",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      description: "Product strategy and user experience specialist"
    },
    {
      name: "David Kim",
      role: "Head of Security",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      description: "Cryptography and security infrastructure expert"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="w-20 h-20 text-blue-600 mx-auto mb-8 animate-bounce" />
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              About SecureFileX
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize file sharing with uncompromising security and seamless user experience.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative -mt-20 mb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="reveal bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300 opacity-0 translate-y-4"
                >
                  <stat.icon className="w-12 h-12 text-blue-600 mb-6" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="reveal bg-white rounded-3xl shadow-xl overflow-hidden opacity-0 translate-y-4 transition-all duration-500">
            <div className="md:flex">
              <div className="md:w-1/2 p-12 md:p-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
                <div className="prose prose-lg text-gray-600">
                  <p className="mb-4">
                    Founded in 2025, SecureFileX emerged from a simple yet powerful idea: everyone deserves access to secure, reliable, and user-friendly file sharing.
                  </p>
                  <p>
                    Today, we serve millions of users worldwide, providing enterprise-grade security features while maintaining the simplicity that our users love.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-12 md:p-16 text-white flex items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                  <p className="text-lg opacity-90">
                    To revolutionize digital file sharing by making military-grade security accessible and user-friendly for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          {/* <div className="py-24">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Leadership Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="reveal bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 opacity-0 translate-y-4"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <div className="text-blue-600 mb-3">{member.role}</div>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;