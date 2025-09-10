import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export interface UserProfile {
  fullName: string;
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  familyIncome: number;
  caste: 'general' | 'obc' | 'sc' | 'st';
  aadhaarNumber: string;
  panNumber: string;
  state: string;
  district: string;
  firebaseId?: string;
}

interface ProfileFormProps {
  initialValues?: Partial<UserProfile>;
  onSubmit: (data: UserProfile) => void;
  isSignup?: boolean;
  disabled?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  initialValues = {}, 
  onSubmit,
  isSignup = false,
  disabled = false
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    email: '',
    password: '',
    gender: undefined,
    age: undefined,
    maritalStatus: undefined,
    familyIncome: undefined,
    caste: undefined,
    aadhaarNumber: '',
    panNumber: '',
    state: '',
    district: '',
    ...initialValues
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (name: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.fullName || !formData.gender || !formData.age || !formData.maritalStatus) {
        toast.error("Please fill all required fields");
        return;
      }
    } else if (step === 2) {
      if (!formData.familyIncome || !formData.caste || !formData.state) {
        toast.error("Please fill all required fields");
        return;
      }
    }
    setStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    // Validate all required fields
    if (!formData.fullName || !formData.gender || !formData.age || !formData.maritalStatus || 
        !formData.familyIncome || !formData.aadhaarNumber || !formData.caste || !formData.state) {
      toast.error("Please fill all required fields");
      return;
    }

    // Format Aadhaar number (remove spaces)
    const formattedAadhaar = formData.aadhaarNumber.replace(/\s/g, "");

    // Simple validation of Aadhaar number (12 digits)
    if (formattedAadhaar.length !== 12 || !/^\d+$/.test(formattedAadhaar)) {
      toast.error("Aadhaar number should be 12 digits");
      return;
    }

    // PAN number validation if provided
    if (
      formData.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)
    ) {
      toast.error("Invalid PAN number format");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the data with the formatted Aadhaar number
      const formattedData = {
        ...formData,
        aadhaarNumber: formattedAadhaar,
        age: Number(formData.age),
        familyIncome: Number(formData.familyIncome)
      } as UserProfile;

      // Call onSubmit with the formatted data
      onSubmit(formattedData);
      
      toast.success(isSignup ? "Registration successful!" : "Profile updated successfully!");
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              required
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Gender <span className="text-red-500">*</span></Label>
            <RadioGroup
              value={formData.gender || ''}
              onValueChange={(value) => handleChange('gender', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
            <Input
              id="age"
              type="number"
              value={formData.age || ''}
              onChange={(e) => handleChange('age', parseInt(e.target.value))}
              placeholder="Enter your age"
              min={1}
              max={120}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status <span className="text-red-500">*</span></Label>
            <Select
              value={formData.maritalStatus}
              onValueChange={(value) => handleChange('maritalStatus', value)}
            >
              <SelectTrigger id="maritalStatus">
                <SelectValue placeholder="Select your marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="familyIncome">Annual Family Income (₹) <span className="text-red-500">*</span></Label>
            <Input
              id="familyIncome"
              type="number"
              value={formData.familyIncome || ''}
              onChange={(e) => handleChange('familyIncome', parseInt(e.target.value))}
              placeholder="Enter your annual family income"
              min={0}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caste">Category <span className="text-red-500">*</span></Label>
            <Select
              value={formData.caste}
              onValueChange={(value) => handleChange('caste', value)}
            >
              <SelectTrigger id="caste">
                <SelectValue placeholder="Select your category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="obc">OBC</SelectItem>
                <SelectItem value="sc">SC</SelectItem>
                <SelectItem value="st">ST</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleChange('state', value)}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                <SelectItem value="assam">Assam</SelectItem>
                <SelectItem value="bihar">Bihar</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
                <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="west-bengal">West Bengal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={formData.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              placeholder="Enter your district"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aadhaarNumber">Aadhaar Number <span className="text-red-500">*</span></Label>
            <Input
              id="aadhaarNumber"
              value={formData.aadhaarNumber || ''}
              onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
              placeholder="XXXX XXXX XXXX"
              required
            />
            <p className="text-xs text-gray-500">Your 12-digit Aadhaar number</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="panNumber">PAN Number</Label>
            <Input
              id="panNumber"
              value={formData.panNumber || ''}
              onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
            />
            <p className="text-xs text-gray-500">Your 10-character PAN number (optional)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aadhaarUpload">Upload Aadhaar Card (Optional)</Label>
            <Input
              id="aadhaarUpload"
              type="file"
              accept="image/*"
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">Upload a clear photo or scan of your Aadhaar card</p>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={disabled}
          className="w-full"
        >
          {isSubmitting ? "Saving..." : "Complete Registration"}
        </Button>
      </form>
    </Card>
  );
};

export default ProfileForm;
