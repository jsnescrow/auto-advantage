
import React, { createContext, useContext, useState, ReactNode } from 'react';

type CreditScoreType = 'Excellent' | 'Good' | 'Fair' | 'Poor';
type YesNoType = 'Yes' | 'No';
type VehicleCountType = '1' | '2' | '3+';

interface FormState {
  vehicleCount: VehicleCountType | null;
  homeowner: YesNoType | null;
  currentlyInsured: YesNoType | null;
  currentCarrier: string | null;
  creditScore: CreditScoreType | null;
  militaryAffiliation: YesNoType | null;
  zipCode: string | null;
}

interface FormContextType {
  formState: FormState;
  setVehicleCount: (value: VehicleCountType) => void;
  setHomeowner: (value: YesNoType) => void;
  setCurrentlyInsured: (value: YesNoType) => void;
  setCurrentCarrier: (value: string) => void;
  setCreditScore: (value: CreditScoreType) => void;
  setMilitaryAffiliation: (value: YesNoType) => void;
  setZipCode: (value: string) => void;
  resetForm: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFormComplete: () => boolean;
  getTotalSteps: () => number;
}

const initialState: FormState = {
  vehicleCount: null,
  homeowner: null,
  currentlyInsured: null,
  currentCarrier: null,
  creditScore: null,
  militaryAffiliation: null,
  zipCode: null,
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [currentStep, setCurrentStep] = useState(1);

  const setVehicleCount = (value: VehicleCountType) => {
    setFormState(prev => ({ ...prev, vehicleCount: value }));
  };

  const setHomeowner = (value: YesNoType) => {
    setFormState(prev => ({ ...prev, homeowner: value }));
  };

  const setCurrentlyInsured = (value: YesNoType) => {
    setFormState(prev => ({ ...prev, currentlyInsured: value }));
    // Reset carrier if not insured
    if (value === 'No') {
      setFormState(prev => ({ ...prev, currentCarrier: null }));
    }
  };

  const setCurrentCarrier = (value: string) => {
    setFormState(prev => ({ ...prev, currentCarrier: value }));
  };

  const setCreditScore = (value: CreditScoreType) => {
    setFormState(prev => ({ ...prev, creditScore: value }));
  };

  const setMilitaryAffiliation = (value: YesNoType) => {
    setFormState(prev => ({ ...prev, militaryAffiliation: value }));
  };

  const setZipCode = (value: string) => {
    setFormState(prev => ({ ...prev, zipCode: value }));
  };

  const resetForm = () => {
    setFormState(initialState);
    setCurrentStep(1);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const getTotalSteps = () => {
    // If user is currently insured, include the carrier selection step
    return formState.currentlyInsured === 'Yes' ? 8 : 7;
  };

  const isFormComplete = () => {
    // Check if all required fields are filled
    const { vehicleCount, homeowner, currentlyInsured, creditScore, militaryAffiliation, zipCode } = formState;
    
    // If currently insured, carrier is required
    const carrierRequired = currentlyInsured === 'Yes';
    const hasCarrier = carrierRequired ? !!formState.currentCarrier : true;
    
    return !!(
      vehicleCount &&
      homeowner &&
      currentlyInsured &&
      hasCarrier &&
      creditScore &&
      militaryAffiliation &&
      zipCode &&
      zipCode.length === 5
    );
  };

  return (
    <FormContext.Provider
      value={{
        formState,
        setVehicleCount,
        setHomeowner,
        setCurrentlyInsured,
        setCurrentCarrier,
        setCreditScore,
        setMilitaryAffiliation,
        setZipCode,
        resetForm,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        isFormComplete,
        getTotalSteps,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
