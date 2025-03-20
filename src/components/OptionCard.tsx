
import React from 'react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  option: string;
  value: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  autoAdvance?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  value,
  icon,
  selected,
  onClick,
  autoAdvance = true,
}) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div
      className={cn(
        "option-card flex items-center justify-center p-6 mb-4 transition-all cursor-pointer border rounded-lg",
        selected ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {icon && <div className="mb-3">{icon}</div>}
        <div className="text-lg font-medium">{option}</div>
      </div>
    </div>
  );
};

export default OptionCard;
