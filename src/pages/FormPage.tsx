import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import ProgressBar from '@/components/ProgressBar';
import FormCard from '@/components/FormCard';
import OptionCard from '@/components/OptionCard';
import LoadingAnimation from '@/components/LoadingAnimation';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { fetchWithRetry } from '@/utils/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const INSURANCE_CARRIERS = [
  'AAA INSURANCE CO',
  'ALLSTATE INSURANCE',
  'FARM BUREAU/FARM FAMILY/RURAL',
  'FARMERS INSURANCE',
  'GEICO',
  'HART ACCIDENT AND INDEMNITY',
  'NATIONWIDE GENERAL INSURANCE',
  'PROGRESSIVE',
  'SAFECO',
  'STATE FARM COUNTY',
  'USAA',
  'Other'
];

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    formState,
    setVehicleCount,
    setHomeowner,
    setCurrentlyInsured,
    setCurrentCarrier,
    setCreditScore,
    setMilitaryAffiliation,
    setZipCode,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    getTotalSteps,
    isFormComplete,
  } = useFormContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [zipError, setZipError] = useState('');

  const handleOptionSelect = (setter: Function, value: any) => {
    setter(value);
    
    if (currentStep === 3 && value === 'Yes') {
      nextStep();
      return;
    }
    
    if (currentStep === 3 && value === 'No') {
      setCurrentStep(4);
      return;
    }
    
    if (currentStep < getTotalSteps()) {
      nextStep();
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    setZipError('');
  };

  const validateZip = () => {
    if (!formState.zipCode || formState.zipCode.length !== 5) {
      setZipError('Please enter a valid 5-digit zip code');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Store form data in sessionStorage for access in the results page
      sessionStorage.setItem('formData', JSON.stringify(formState));
      console.log('Form data stored in sessionStorage:', formState);
      
      // Clear any existing providers to prevent showing stale data
      sessionStorage.removeItem('insuranceProviders');
      console.log('Cleared existing providers from sessionStorage');
      
      // Force a small delay so any UI updates can happen before the network request
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch providers data with detailed logging
      console.log('STARTING API CALL to fetch providers...');
      const response = await fetchWithRetry(formState, 3, 1000);
      console.log('API CALL COMPLETED with response:', response);
      
      if (response.success && response.providers && response.providers.length > 0) {
        console.log('Success! Providers returned:', response.providers);
        
        // Double-check the providers are getting saved
        const savedProviders = sessionStorage.getItem('insuranceProviders');
        console.log('Providers in sessionStorage after API call:', savedProviders);
        
        // Determine which results page to show based on the API response
        if (response.useAlternateResults) {
          console.log('Navigating to alternate results page (/results2)');
          navigate('/results2');
        } else {
          console.log('Navigating to standard results page (/results)');
          navigate('/results');
        }
      } else {
        console.error('No valid providers returned from API');
        toast.error('No insurance providers found. Please try different criteria.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (currentStep === getTotalSteps()) {
      if (!validateZip()) return;
      
      if (isFormComplete()) {
        handleSubmit();
        return;
      }
    }
    
    nextStep();
  };

  const renderStep = () => {
    const effectiveStep = formState.currentlyInsured === 'No' && currentStep > 3 ? currentStep + 1 : currentStep;
    
    switch (effectiveStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">How many vehicles are you insuring today?</h2>
            <div className="space-y-3">
              <OptionCard
                option="One"
                value="1"
                selected={formState.vehicleCount === '1'}
                onClick={() => handleOptionSelect(setVehicleCount, '1')}
                iconCount={1}
              />
              <OptionCard
                option="Two"
                value="2"
                selected={formState.vehicleCount === '2'}
                onClick={() => handleOptionSelect(setVehicleCount, '2')}
                iconCount={2}
              />
              <OptionCard
                option="Three +"
                value="3+"
                selected={formState.vehicleCount === '3+'}
                onClick={() => handleOptionSelect(setVehicleCount, '3+')}
                iconCount={3}
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Are you a homeowner?</h2>
            <div className="space-y-3">
              <OptionCard
                option="Yes"
                value="Yes"
                selected={formState.homeowner === 'Yes'}
                onClick={() => handleOptionSelect(setHomeowner, 'Yes')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                }
              />
              <OptionCard
                option="No"
                value="No"
                selected={formState.homeowner === 'No'}
                onClick={() => handleOptionSelect(setHomeowner, 'No')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              />
            </div>
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Are you currently insured?</h2>
            <div className="space-y-3">
              <OptionCard
                option="Yes"
                value="Yes"
                selected={formState.currentlyInsured === 'Yes'}
                onClick={() => handleOptionSelect(setCurrentlyInsured, 'Yes')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              />
              <OptionCard
                option="No"
                value="No"
                selected={formState.currentlyInsured === 'No'}
                onClick={() => handleOptionSelect(setCurrentlyInsured, 'No')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              />
            </div>
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
      
      case 4:
        if (formState.currentlyInsured === 'Yes') {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Current Insurance Company</h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {INSURANCE_CARRIERS.map((carrier) => (
                  <div
                    key={carrier}
                    className={`p-3 rounded-lg cursor-pointer text-center transition-all ${
                      formState.currentCarrier === carrier 
                        ? 'bg-brand-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => {
                      setCurrentCarrier(carrier);
                      nextStep();
                    }}
                  >
                    <div className="font-medium">{carrier}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">What's your credit score?</h2>
            <div className="space-y-3">
              <OptionCard
                option="Excellent"
                value="Excellent"
                selected={formState.creditScore === 'Excellent'}
                onClick={() => handleOptionSelect(setCreditScore, 'Excellent')}
              />
              <OptionCard
                option="Good"
                value="Good"
                selected={formState.creditScore === 'Good'}
                onClick={() => handleOptionSelect(setCreditScore, 'Good')}
              />
              <OptionCard
                option="Fair"
                value="Fair"
                selected={formState.creditScore === 'Fair'}
                onClick={() => handleOptionSelect(setCreditScore, 'Fair')}
              />
              <OptionCard
                option="Poor"
                value="Poor"
                selected={formState.creditScore === 'Poor'}
                onClick={() => handleOptionSelect(setCreditScore, 'Poor')}
              />
            </div>
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">What's your credit score?</h2>
            <div className="space-y-3">
              <OptionCard
                option="Excellent"
                value="Excellent"
                selected={formState.creditScore === 'Excellent'}
                onClick={() => handleOptionSelect(setCreditScore, 'Excellent')}
              />
              <OptionCard
                option="Good"
                value="Good"
                selected={formState.creditScore === 'Good'}
                onClick={() => handleOptionSelect(setCreditScore, 'Good')}
              />
              <OptionCard
                option="Fair"
                value="Fair"
                selected={formState.creditScore === 'Fair'}
                onClick={() => handleOptionSelect(setCreditScore, 'Fair')}
              />
              <OptionCard
                option="Poor"
                value="Poor"
                selected={formState.creditScore === 'Poor'}
                onClick={() => handleOptionSelect(setCreditScore, 'Poor')}
              />
            </div>
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Are either you or your spouse an active member, or an honorably discharged veteran of the US military?</h2>
            <div className="space-y-3">
              <OptionCard
                option="Yes"
                value="Yes"
                selected={formState.militaryAffiliation === 'Yes'}
                onClick={() => handleOptionSelect(setMilitaryAffiliation, 'Yes')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              />
              <OptionCard
                option="No"
                value="No"
                selected={formState.militaryAffiliation === 'No'}
                onClick={() => handleOptionSelect(setMilitaryAffiliation, 'No')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              />
            </div>
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 7:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">What's your zip code?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your 5-digit zip code
                </label>
                <Input
                  type="text"
                  value={formState.zipCode || ''}
                  onChange={handleZipChange}
                  maxLength={5}
                  placeholder="e.g. 12345"
                  className={cn(
                    "border-gray-300 focus:border-brand-500 text-lg rounded-md", 
                    zipError ? 'border-red-500' : ''
                  )}
                />
                {zipError && (
                  <p className="text-red-500 text-sm mt-1">{zipError}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formState.zipCode || formState.zipCode.length !== 5}
                className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-6"
              >
                Get My Quotes
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <div className="max-w-2xl mx-auto">
            <FormCard>
              <LoadingAnimation />
            </FormCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col items-center mb-4 md:mb-8">
          <Logo />
          <h1 className={cn(
            "font-semibold text-gray-700 text-center",
            isMobile ? "text-2xl mt-4 mb-2" : "text-3xl mt-6 mb-2"
          )}>
            Let's drop your auto rate today!
          </h1>
        </div>
        
        <div className="max-w-xl mx-auto footer-space">
          <ProgressBar currentStep={currentStep} totalSteps={getTotalSteps()} />
          
          <FormCard className={isMobile ? "p-4" : ""}>
            {renderStep()}
          </FormCard>
        </div>
      </div>
      
      <footer className="bg-gray-100 text-gray-600 py-8 border-t border-gray-200 fixed-footer">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm mb-6">
              <p className="mb-4">
                The products on the websites (and any subdomains of those websites) listed above are from companies from which we may receive compensation. Compensation may impact where products appear on these websites (including the order in which they appear). These websites do not include all insurance companies or all types of products available in the marketplace. We encourage you to research all available insurance options for your situation.
              </p>
              <p>
                Disclaimer: The operator of this website is not an insurance broker or an insurance company, is not a representative or an agent to any broker or insurance company, does not endorse any particular broker or insurance provider, and does not make any insurance decisions. We will submit the information you provide to a broker and/or an insurance company. This website does not constitute an offer or solicitation for automobile or other insurance. Providing your information on this site does not guarantee that you will be approved for automobile or other insurance. Not all insurance providers can or will insure your vehicle. The quotes, rates, or savings advertised on this website are not necessarily available from all providers or advertisers. Your actual quotes, rates, or savings will vary based on many different factors like: Coverage Limits, Deductibles, Driving History, Education, Occupation Type, Vehicle Location, and more. For questions regarding your insurance policy, please contact your broker or insurance company directly. Residents of some states may not be eligible for insurance or may be subject to large premiums. You are under no obligation to use our website or service to initiate contact nor apply for insurance or any product with any broker or insurance company. We receive compensation in the form of referral fees from the insurance carriers, aggregators, or other offers that we direct you to. Therefore, the amount of compensation provided, along with other factors, may impact which policy or offer you are presented. The offer you receive may be coming from the company that bid the most for your information. This website does not always provide you with an offer with the best rates or terms. Our website does not include all companies or all available offers. We encourage you to research all available insurance policy options relative to your situation. All trademarks and copyrights are the property of their respective owners.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-600">
              <Link to="/terms" className="hover:text-brand-800 transition-colors">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-brand-800 transition-colors">Privacy Policy</Link>
            </div>
            <div className="text-center mt-6 text-sm">
              &copy; {new Date().getFullYear()} AutoRateSaver. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FormPage;
