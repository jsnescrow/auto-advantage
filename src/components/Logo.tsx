
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="text-2xl md:text-3xl font-bold">
        <span className="text-brand-500">TOP</span>
        <span className="text-brand-700">5</span>
        <span className="text-brand-500">COMPARE</span>
        <span className="ml-1 text-brand-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="inline-block w-6 h-6 mb-1"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor"/>
            <path 
              d="M17.5 10.5l-5.5 5.5-3.5-3.5" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Logo;
