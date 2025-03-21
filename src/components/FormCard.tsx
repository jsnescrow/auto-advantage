
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, className = '' }) => {
  return (
    <div className={cn(
      "w-full max-w-xl mx-auto bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden animate-fade-in",
      className
    )}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default FormCard;
