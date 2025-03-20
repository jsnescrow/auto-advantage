
import React from 'react';
import { Button } from '@/components/ui/button';

interface ResultCardProps {
  provider: {
    name: string;
    rate?: string;
    benefits?: string[];
    url: string;
    logo?: string;
  };
}

const ResultCard: React.FC<ResultCardProps> = ({ provider }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center p-2">
            {provider.logo ? (
              <img src={provider.logo} alt={provider.name} className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-xl font-bold text-brand-500">{provider.name.substring(0, 2).toUpperCase()}</div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
            {provider.rate && <p className="text-brand-500 font-bold mb-2">{provider.rate}</p>}
            {provider.benefits && provider.benefits.length > 0 && (
              <ul className="text-sm text-gray-600 mb-4">
                {provider.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <Button
              className="w-full md:w-auto bg-brand-500 hover:bg-brand-600 text-white"
              onClick={() => window.open(provider.url, '_blank')}
            >
              View Rates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
