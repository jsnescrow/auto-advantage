
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import ResultCard from '@/components/ResultCard';
import FormCard from '@/components/FormCard';
import { useFormContext } from '@/context/FormContext';
import { Provider } from '@/utils/api';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetForm } = useFormContext();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve providers from sessionStorage
    const storedProviders = sessionStorage.getItem('insuranceProviders');
    
    if (storedProviders) {
      try {
        const parsedProviders = JSON.parse(storedProviders);
        setProviders(parsedProviders);
      } catch (error) {
        console.error('Error parsing providers:', error);
      }
    }
    
    // Simulate loading time for a smoother transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-800 to-brand-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <div className="max-w-4xl mx-auto flex justify-center">
            <div className="animate-pulse w-full">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-grow">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-auto">
                      <div className="h-10 bg-gray-200 rounded w-full md:w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-800 to-brand-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Top Car Insurance Matches
            </h1>
            <p className="text-xl text-white/80">
              Based on your information, we found these options for you
            </p>
          </div>
          
          {providers.length > 0 ? (
            <div className="space-y-6 animate-fade-in">
              {providers.map((provider, index) => (
                <ResultCard 
                  key={provider.id} 
                  provider={provider} 
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <FormCard className="text-center py-12 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-brand-500 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <h2 className="text-2xl font-bold mb-4">No Matches Found</h2>
              <p className="text-gray-600 mb-8">
                We couldn't find any insurance providers that match your criteria. Try adjusting your information to see more options.
              </p>
              <button 
                onClick={() => {
                  resetForm();
                  navigate('/');
                }}
                className="bg-brand-500 hover:bg-brand-600 text-white py-2 px-4 rounded-md font-medium"
              >
                Start Over
              </button>
            </FormCard>
          )}
        </div>
      </div>
      
      <div className="mt-auto py-8 bg-black/10 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Understanding Car Insurance: Your Complete Guide</h2>
            <p className="text-white/80 mb-6">
              Shopping for car insurance shouldn't be overwhelming. With today's online tools, finding the right coverage is easier than ever. Let's explore the essentials you need to know before making your decision, so you can drive with complete confidence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Coverage Types</h3>
                <ul className="text-white/80 space-y-2">
                  <li>• Liability Coverage</li>
                  <li>• Collision Coverage</li>
                  <li>• Comprehensive Coverage</li>
                  <li>• Personal Injury Protection</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Factors Affecting Rates</h3>
                <ul className="text-white/80 space-y-2">
                  <li>• Driving History</li>
                  <li>• Vehicle Type</li>
                  <li>• Credit Score</li>
                  <li>• Location and Age</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
