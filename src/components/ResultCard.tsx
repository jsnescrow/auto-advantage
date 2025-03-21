
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
  
  // Function to decode HTML entities
  const decodeHtml = (html: string | undefined): string => {
    if (!html) return '';
    
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  
  return (
    <div className="relative mb-12">
      <div className={cn(
        "bg-white rounded-md shadow-sm border overflow-hidden transition-all duration-300",
        isTopChoice 
          ? "border-gray-200" 
          : "border-gray-200"
      )}>
        {/* Rank indicator */}
        <div className="absolute top-0 left-0 flex items-center">
          <div className={cn(
            "flex items-center justify-center w-7 h-7 text-white font-bold text-sm",
            isTopChoice ? "bg-black" : "bg-gray-600"
          )}>
            {rank}
          </div>
          
          {isTopChoice && (
            <div className="bg-brand-500 h-7 py-1 px-3 text-white text-xs font-medium ml-1 flex items-center">
              Our Top Choice
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className={cn(
                "flex-shrink-0 w-20 h-20 rounded-md flex items-center justify-center p-2",
                "bg-white border border-gray-100"
              )}>
                {provider.logo ? (
                  <img src={provider.logo} alt={provider.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-xl font-bold text-brand-500">
                    {provider.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold mb-1 text-gray-800">
                  {provider.name}
                </h3>
                {provider.rate && (
                  <p className="text-gray-600">{decodeHtml(provider.rate)}</p>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 mb-6">
              {isTopChoice ? (
                <Button
                  className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-6 animate-pulse-slow"
                  onClick={() => window.open(provider.url, '_blank')}
                >
                  VIEW RATES
                </Button>
              ) : (
                <Button
                  className="bg-brand-500 hover:bg-brand-600 text-white font-medium"
                  onClick={() => window.open(provider.url, '_blank')}
                >
                  VIEW RATES
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Visitor counter badge - positioned as an overlay on the bottom */}
      {isTopChoice && (
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 flex justify-center">
          <div className="bg-white py-1.5 px-4 text-center shadow-md rounded-full border border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-brand-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span><span className="font-semibold">1,906</span> drivers visited this site today</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
