
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  provider: {
    name: string;
    rate?: string;
    url: string;
    logo?: string;
  };
  rank: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ provider, rank }) => {
  const isTopChoice = rank === 1;
  
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 mb-6",
      isTopChoice 
        ? "border-brand-300 shadow-md hover:shadow-lg" 
        : "border-gray-100 hover:shadow-md"
    )}>
      <div className="relative">
        <div className={cn(
          "absolute top-0 left-0 text-white px-4 py-1 rounded-tr-lg rounded-bl-lg font-medium z-10",
          isTopChoice ? "bg-brand-500" : "bg-gray-600"
        )}>
          {isTopChoice ? 'Our Top Choice' : `#${rank}`}
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className={cn(
                "flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center p-2",
                isTopChoice ? "bg-brand-50" : "bg-gray-100"
              )}>
                {provider.logo ? (
                  <img src={provider.logo} alt={provider.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className={cn(
                    "text-xl font-bold",
                    isTopChoice ? "text-brand-500" : "text-gray-500"
                  )}>
                    {provider.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h3 className={cn(
                  "text-xl font-semibold mb-2",
                  isTopChoice ? "text-brand-700" : "text-gray-800"
                )}>
                  {provider.name}
                </h3>
                {provider.rate && (
                  <p className="text-gray-600">{provider.rate}</p>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              {isTopChoice ? (
                <div className="relative">
                  <Button
                    className="bg-brand-500 hover:bg-brand-600 text-white font-medium relative z-10"
                    onClick={() => window.open(provider.url, '_blank')}
                  >
                    VIEW RATES
                  </Button>
                  <span className="absolute inset-0 rounded-md animate-spin-slow bg-brand-500/10"></span>
                </div>
              ) : (
                <Button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium"
                  onClick={() => window.open(provider.url, '_blank')}
                >
                  VIEW RATES
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isTopChoice && (
        <div className="bg-brand-50 py-2 px-4 text-center border-t border-brand-100">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-brand-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span><span className="font-semibold">1,906</span> drivers visited this site today</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
