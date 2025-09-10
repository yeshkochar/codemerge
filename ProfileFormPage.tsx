import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import ProfileForm from '@/components/ProfileForm';
import { saveUserToFirebase } from '@/services/firebase';
import type { UserProfile } from '@/components/ProfileForm';

const ProfileFormPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFormData = (data: UserProfile) => {
    const errors: string[] = [];

    if (!data.email) errors.push('Email is required');
    if (!data.password) errors.push('Password is required');
    if (data.password && data.password.length < 6) errors.push('Password must be at least 6 characters');
    if (!data.fullName) errors.push('Full name is required');
    if (!data.gender) errors.push('Gender is required');
    if (!data.age) errors.push('Age is required');
    if (!data.maritalStatus) errors.push('Marital status is required');
    if (!data.familyIncome) errors.push('Family income is required');
    if (!data.caste) errors.push('Caste is required');
    if (!data.aadhaarNumber) errors.push('Aadhaar number is required');
    if (!data.state) errors.push('State is required');
    if (!data.district) errors.push('District is required');

    return errors;
  };

  const handleProfileSubmit = async (data: UserProfile) => {
    try {
      setIsSubmitting(true);
      
      // Validate form data
      const validationErrors = validateFormData(data);
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => toast.error(error));
        return;
      }

      console.log('Starting profile submission...');
      
      // Save to Firebase
      const firebaseId = await saveUserToFirebase(data);
      console.log('Firebase save successful, ID:', firebaseId);
      
      // Save to localStorage with Firebase ID
      const userDataWithId = { ...data, firebaseId };
      localStorage.setItem('userProfile', JSON.stringify(userDataWithId));
      console.log('Local storage updated');
      
      toast.success('Profile saved successfully!');
      
      // Navigate after a brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Detailed error in handleProfileSubmit:', error);
      
      // Handle specific Firebase authentication errors
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            toast.error('This email is already registered. Please use a different email.');
            break;
          case 'auth/invalid-email':
            toast.error('Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            toast.error('Password is too weak. Please use a stronger password.');
            break;
          case 'auth/network-request-failed':
            toast.error('Network error. Please check your internet connection.');
            break;
          default:
            toast.error(`Error: ${error.message || 'Failed to save profile. Please try again.'}`);
        }
      } else {
        toast.error(error.message || 'Failed to save profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-center">Welcome to Sahayak Seva</h2>
            <p className="text-gray-600 mt-2">Please fill in your details to get started</p>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm 
            onSubmit={handleProfileSubmit}
            isSignup={true}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileFormPage; 