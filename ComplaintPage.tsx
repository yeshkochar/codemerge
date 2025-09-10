
import React from 'react';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/chatbot/ChatInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSendComplaintMessage } from '@/services/mockApi';

const ComplaintPage = () => {
  const handleSendMessage = async (message: string) => {
    // In a real application, we would send this message to the Gemini API
    // For now, we'll use a mock API
    try {
      const response = await mockSendComplaintMessage(message);
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };
  
  const initialMessage = `Hello! I'm your virtual complaint assistant. I can help you file a complaint regarding any issues with government services like ration distribution, pension, gas cylinder subsidy, or others. Please describe your problem in detail, and I'll help you submit it to the right department. You can speak or type in any language.`;
  
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">File a Complaint</h1>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Report Issues with Government Services</CardTitle>
            <CardDescription>
              Use this assistant to report problems with government schemes, corruption, or denial of services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-orange-400 pl-3 py-2 bg-orange-50">
                <span className="font-medium">Report ration issues</span>
                <p className="text-sm text-gray-600">
                  Not receiving your entitled ration, quality issues, or overcharging
                </p>
              </div>
              <div className="border-l-4 border-blue-400 pl-3 py-2 bg-blue-50">
                <span className="font-medium">Gas cylinder problems</span>
                <p className="text-sm text-gray-600">
                  Subsidy not received, delivery issues, or additional charges
                </p>
              </div>
              <div className="border-l-4 border-purple-400 pl-3 py-2 bg-purple-50">
                <span className="font-medium">Pension payment delays</span>
                <p className="text-sm text-gray-600">
                  Late payments, missing payments, or incorrect amounts
                </p>
              </div>
              <div className="border-l-4 border-red-400 pl-3 py-2 bg-red-50">
                <span className="font-medium">Report corruption</span>
                <p className="text-sm text-gray-600">
                  Officials demanding bribes or misusing their position
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ChatInterface 
          chatType="complaint" 
          onSendMessage={handleSendMessage}
          initialMessage={initialMessage}
        />
      </div>
    </Layout>
  );
};

export default ComplaintPage;
