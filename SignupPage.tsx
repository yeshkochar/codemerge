import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm, { UserProfile } from '@/components/ProfileForm';
import { toast } from "sonner";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';

const SignupPage = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  React.useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      // User is already logged in, redirect to dashboard
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleSignup = async (data: UserProfile) => {
    try {
      // Create user with Firebase Auth
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Store the profile data in localStorage
      localStorage.setItem('userProfile', JSON.stringify(data));
      
      // Show success message
      toast.success("Registration successful!");
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please sign in instead.');
        navigate('/signin');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center bg-gradient-to-r from-saarthi-orange to-orange-500 text-white rounded-t-lg">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-saarthi-orange">S</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Saarthi AI</CardTitle>
          <CardDescription className="text-white/90">
            Your personal assistant for government schemes and services
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Create Your Profile</h2>
            <ProfileForm onSubmit={handleSignup} isSignup={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
