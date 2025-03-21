
import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">Finding the best rates for you...</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        We're searching multiple providers to find you the best coverage at the lowest prices.
      </p>
      <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
        <div className="bg-brand-500 h-2.5 rounded-full animate-pulse w-full"></div>
      </div>
      <div className="text-sm text-gray-400">This may take a few moments</div>
    </div>
  );
};

export default LoadingAnimation;
