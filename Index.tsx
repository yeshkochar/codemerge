import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SchemeCard, { Scheme } from '@/components/SchemeCard';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { mockGetEligibleSchemes } from '@/services/mockApi';
import { UserProfile } from '@/components/ProfileForm';

const Dashboard = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('all');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user profile exists in localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (!storedProfile) {
      // If no profile, redirect to signup
      toast.info("Please sign up to continue");
      navigate('/signup');
      return;
    }
    
    try {
      const parsedProfile = JSON.parse(storedProfile);
      setUserProfile(parsedProfile);
      
      // Fetch eligible schemes
      const fetchSchemes = async () => {
        setIsLoading(true);
        try {
          const eligibleSchemes = await mockGetEligibleSchemes();
          setSchemes(eligibleSchemes);
        } catch (error) {
          console.error("Error fetching schemes:", error);
          toast.error("Failed to load eligible schemes");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSchemes();
    } catch (error) {
      console.error("Error parsing user profile:", error);
      localStorage.removeItem('userProfile'); // Clear invalid data
      navigate('/signup');
    }
  }, [navigate]);
  
  const filteredSchemes = schemes.filter(scheme => {
    if (currentTab === 'all') return true;
    return scheme.category === currentTab;
  });
  
  const schemeCountByCategory = {
    all: schemes.length,
    income: schemes.filter(s => s.category === 'income').length,
    gender: schemes.filter(s => s.category === 'gender').length,
    caste: schemes.filter(s => s.category === 'caste').length,
    education: schemes.filter(s => s.category === 'education').length,
    housing: schemes.filter(s => s.category === 'housing').length,
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-saarthi-blue to-saarthi-chakra text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  नमस्ते, {userProfile?.fullName?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-white/80">
                  Welcome to Saarthi AI, your guide to government schemes and services.
                </p>
              </div>
              <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
                <p className="text-sm text-white/80">Eligible Schemes</p>
                <p className="text-3xl font-bold">{schemes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="all">
              All ({schemeCountByCategory.all})
            </TabsTrigger>
            <TabsTrigger value="income">
              Income ({schemeCountByCategory.income})
            </TabsTrigger>
            <TabsTrigger value="gender">
              Gender ({schemeCountByCategory.gender})
            </TabsTrigger>
            <TabsTrigger value="caste">
              Caste ({schemeCountByCategory.caste})
            </TabsTrigger>
            <TabsTrigger value="education">
              Education ({schemeCountByCategory.education})
            </TabsTrigger>
            <TabsTrigger value="housing">
              Housing ({schemeCountByCategory.housing})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item} className="h-[200px] animate-pulse-slow">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">
                  No schemes found in this category.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
