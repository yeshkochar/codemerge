
import React from 'react';
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-saarthi-orange rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-saarthi-blue">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          asChild
          className="bg-saarthi-blue hover:bg-saarthi-chakra"
        >
          <a href="/">
            <Home size={18} className="mr-2" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
