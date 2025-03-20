
import React, { ReactNode } from 'react';

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in ${className}`}>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default FormCard;
