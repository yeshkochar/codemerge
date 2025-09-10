
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProfileForm, { UserProfile } from '@/components/ProfileForm';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch user profile from localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error("Error parsing user profile:", error);
        localStorage.removeItem('userProfile'); // Clear invalid data
        navigate('/signup');
      }
    } else {
      // If no profile, redirect to signup
      toast.info("Please sign up to continue");
      navigate('/signup');
    }
  }, [navigate]);
  
  const handleUpdateProfile = (data: UserProfile) => {
    // Update the profile in localStorage
    localStorage.setItem('userProfile', JSON.stringify(data));
    setUserProfile(data);
    toast.success("Profile updated successfully!");
  };
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userProfile');
    toast.info("Logged out successfully!");
    
    // Redirect to signup page
    navigate('/signup');
  };
  
  if (!userProfile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg mb-4">Loading profile...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
        
        <ProfileForm
          initialValues={userProfile}
          onSubmit={handleUpdateProfile}
        />
      </div>
    </Layout>
  );
};

export default ProfilePage;
