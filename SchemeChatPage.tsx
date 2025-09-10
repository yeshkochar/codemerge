import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/chatbot/ChatInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { mockSendSchemeMessage, mockGetSchemeById } from '@/services/mockApi';
import { Scheme } from '@/components/SchemeCard';

const SchemeChatPage = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchScheme = async () => {
      if (schemeId) {
        try {
          setLoading(true);
          const schemeData = await mockGetSchemeById(schemeId);
          setScheme(schemeData);
        } catch (error) {
          console.error("Error fetching scheme:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchScheme();
  }, [schemeId]);
  
  const handleSendMessage = async (message: string) => {
    // In a real application, we would send this message to the Gemini API
    // For now, we'll use a mock API
    try {
      const response = await mockSendSchemeMessage(message, schemeId);
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };
  
  const getInitialMessage = () => {
    if (!scheme) return "";
    
    return `Hello! I'm your virtual assistant for the ${scheme.name} application. I can help you complete the application form. You can speak or type in any language, and I'll understand and assist you. How would you like to proceed with your application?`;
  };
  
  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Scheme Assistant</h1>
        </div>
        
        {loading ? (
          <Card>
            <CardContent className="p-8 flex justify-center">
              <div className="animate-pulse-slow w-full max-w-md">
                <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        ) : scheme ? (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{scheme.name}</CardTitle>
                <CardDescription>{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-l-4 border-green-400 pl-3 py-2 bg-green-50">
                  <span className="font-medium">Why you're eligible: </span>
                  {scheme.eligibilityReason}
                </div>
              </CardContent>
            </Card>
            
            <ChatInterface 
              chatType="scheme" 
              onSendMessage={handleSendMessage}
              initialMessage={getInitialMessage()}
            />
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">
                No specific scheme selected
              </h2>
              <p className="text-gray-600 mb-6">
                You can still ask general questions about government schemes and I'll do my best to help.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-saarthi-blue hover:bg-saarthi-chakra"
              >
                Browse Eligible Schemes
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SchemeChatPage;
