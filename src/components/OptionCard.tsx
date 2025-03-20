
import React from 'react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  option: string;
  value: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  value,
  icon,
  selected,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "option-card flex items-center justify-center mb-4 transition-all",
        selected ? "selected" : ""
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {icon && <div className="mb-3">{icon}</div>}
        <div className="text-lg font-medium">{option}</div>
      </div>
    </div>
  );
};

export default OptionCard;
