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
import { CarFront } from 'lucide-react';
import { cn } from '@/lib/utils';

// Insurance carriers
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

  const fillTestData = () => {
    setVehicleCount('2');
    setHomeowner('Yes');
    setCurrentlyInsured('Yes');
    setCurrentCarrier('ALLSTATE INSURANCE');
    setCreditScore('Good');
    setMilitaryAffiliation('No');
    setZipCode('15014');
  };

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
      
      const response = await fetchWithRetry(formState);
      
      if (response.success && response.providers) {
        sessionStorage.setItem('insuranceProviders', JSON.stringify(response.providers));
        navigate('/results');
      } else {
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
            <h2 className={cn("font-bold text-center", isMobile ? "text-xl mb-4" : "text-2xl mb-8")}>How many vehicles are you insuring today?</h2>
            <div className="space-y-4">
              <OptionCard
                option="One"
                value="1"
                selected={formState.vehicleCount === '1'}
                onClick={() => handleOptionSelect(setVehicleCount, '1')}
                icon={
                  <CarFront className="w-10 h-10 text-brand-500" />
                }
              />
              <OptionCard
                option="Two"
                value="2"
                selected={formState.vehicleCount === '2'}
                onClick={() => handleOptionSelect(setVehicleCount, '2')}
                icon={
                  <CarFront className="w-10 h-10 text-brand-500" />
                }
              />
              <OptionCard
                option="Three +"
                value="3+"
                selected={formState.vehicleCount === '3+'}
                onClick={() => handleOptionSelect(setVehicleCount, '3+')}
                icon={
                  <CarFront className="w-10 h-10 text-brand-500" />
                }
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-center">Are you a homeowner?</h2>
            <div className="space-y-4">
              <OptionCard
                option="Yes"
                value="Yes"
                selected={formState.homeowner === 'Yes'}
                onClick={() => handleOptionSelect(setHomeowner, 'Yes')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-500">
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              />
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-brand-300 text-brand-500 hover:bg-brand-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-center">Are you currently insured?</h2>
            <div className="space-y-4">
              <OptionCard
                option="Yes"
                value="Yes"
                selected={formState.currentlyInsured === 'Yes'}
                onClick={() => handleOptionSelect(setCurrentlyInsured, 'Yes')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-500">
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              />
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-brand-300 text-brand-500 hover:bg-brand-50"
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
              <h2 className="text-2xl font-bold mb-8 text-center">Current Insurance Company</h2>
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
              <div className="mt-8 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="border-brand-300 text-brand-500 hover:bg-brand-50"
                >
                  Back
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-center">What's your credit score?</h2>
            <div className="space-y-4">
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
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-brand-300 text-brand-500 hover:bg-brand-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-center">What's your credit score?</h2>
            <div className="space-y-4">
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
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-brand-300 text-brand-500 hover:bg-brand-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-center">Are either you or your spouse an active member, or an honorably discharged veteran of the US military?</h2>
            <div className="space-y-4">
              <OptionCard
                option="Yes"
                value="Yes"
                selected={formState.militaryAffiliation === 'Yes'}
                onClick={() => handleOptionSelect(setMilitaryAffiliation, 'Yes')}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-500">
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              />
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-brand-300 text-brand-500 hover:bg-brand-50"
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 7:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-center">What's your zip code?</h2>
            <div className="space-y-6">
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
                  className={zipError ? 'border-red-500' : ''}
                />
                {zipError && (
                  <p className="text-red-500 text-sm mt-1">{zipError}</p>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-brand-300 text-brand-500 hover:bg-brand-50"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formState.zipCode || formState.zipCode.length !== 5}
                className="bg-brand-500 hover:bg-brand-600 text-white"
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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-800 to-brand-900">
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-800 to-brand-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col items-center mb-4 md:mb-8">
          <Logo />
          <h1 className={cn(
            "font-bold text-white text-center",
            isMobile ? "text-2xl mt-2 mb-1" : "text-3xl sm:text-4xl mt-6 mb-2"
          )}>
            Let's drop your auto rate today!
          </h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentStep={currentStep} totalSteps={getTotalSteps()} />
          
          <FormCard className={isMobile ? "p-4" : ""}>
            {renderStep()}
          </FormCard>
          
          {/* For development - Test Data Button */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-center">
              <button 
                onClick={fillTestData}
                className="text-xs text-white/70 hover:text-white underline"
              >
                Fill with Test Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
