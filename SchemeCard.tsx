
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibilityReason: string;
  category: 'income' | 'gender' | 'caste' | 'age' | 'agriculture' | 'education' | 'housing';
}

interface SchemeCardProps {
  scheme: Scheme;
}

const getCategoryIcon = (category: Scheme['category']) => {
  const iconClasses = "w-10 h-10 flex items-center justify-center rounded-full";
  
  switch (category) {
    case 'income':
      return <div className={`${iconClasses} bg-green-100 text-green-600`}>₹</div>;
    case 'gender':
      return <div className={`${iconClasses} bg-purple-100 text-purple-600`}>♀♂</div>;
    case 'caste':
      return <div className={`${iconClasses} bg-blue-100 text-blue-600`}>SC</div>;
    case 'age':
      return <div className={`${iconClasses} bg-yellow-100 text-yellow-600`}>👵</div>;
    case 'agriculture':
      return <div className={`${iconClasses} bg-green-100 text-green-600`}>🌾</div>;
    case 'education':
      return <div className={`${iconClasses} bg-indigo-100 text-indigo-600`}>🎓</div>;
    case 'housing':
      return <div className={`${iconClasses} bg-orange-100 text-orange-600`}>🏠</div>;
    default:
      return <div className={`${iconClasses} bg-gray-100 text-gray-600`}>📄</div>;
  }
};

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-saarthi-blue">
              {scheme.name}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {scheme.description}
            </CardDescription>
          </div>
          {getCategoryIcon(scheme.category)}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="border-l-4 border-green-400 pl-3 py-2 bg-green-50 text-sm">
          <span className="font-medium">Why you're eligible: </span>
          {scheme.eligibilityReason}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/scheme-chat/${scheme.id}`} className="w-full">
          <Button className="w-full bg-saarthi-orange hover:bg-orange-600 text-white">
            Apply Now
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SchemeCard;
