
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Modified progress calculation to make the form appear shorter
  let progress = 0;
  
  if (currentStep === 1) {
    progress = 20; // Initial state
  } else if (currentStep === 2) {
    progress = 54; // After first question
  } else if (currentStep === 3) {
    progress = 75; // After second question
  } else {
    // Distribute remaining progress evenly
    const remainingSteps = totalSteps - 3;
    const remainingProgress = 100 - 75;
    const progressPerStep = remainingProgress / (remainingSteps > 0 ? remainingSteps : 1);
    progress = 75 + ((currentStep - 3) * progressPerStep);
  }
  
  return (
    <div className="w-full mb-4 animate-fade-in">
      <div className="flex justify-end items-center mb-2">
        <span className="text-sm font-medium text-brand-500">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
