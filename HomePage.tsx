import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import LanguageSelector from '@/components/LanguageSelector';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard');
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-[#e94444]">Sahayak Seva</h1>
        <div className="flex items-center gap-4">
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
          <Button 
            onClick={() => navigate('/signin')}
            className="bg-white text-[#1a1f2e] hover:bg-gray-100"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Empowering Rural India with AI
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          AI-powered solution for accessing government schemes
        </p>
        <Button 
          onClick={() => navigate('/signup')}
          className="bg-[#e94444] hover:bg-[#d63939] text-white px-8 py-6 text-lg"
        >
          Get Started
        </Button>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-[#1e2432] p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Easy Access</h3>
            <p className="text-gray-300">
              Find and access government schemes tailored to your profile with our AI assistance.
            </p>
          </div>
          <div className="bg-[#1e2432] p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Smart Recommendations</h3>
            <p className="text-gray-300">
              Get personalized scheme recommendations based on your eligibility criteria.
            </p>
          </div>
          <div className="bg-[#1e2432] p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Guided Support</h3>
            <p className="text-gray-300">
              Step-by-step guidance for scheme applications and documentation.
            </p>
          </div>
        </div>

        {/* Images Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="flex justify-center">
            <img 
              src="/images/1.1.jpeg" 
              alt="Digital Literacy in Rural India"
              className="w-64 h-64 object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-center">
            <img 
              src="/images/2.2.jpg" 
              alt="Government Schemes"
              className="w-64 h-64 object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-center">
            <img 
              src="/images/2.3.jpeg" 
              alt="Rural Technology"
              className="w-64 h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 