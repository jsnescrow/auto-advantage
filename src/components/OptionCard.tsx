
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const handleClick = () => {
    onClick();
  };

  return (
    <div
      className={cn(
        "option-card flex items-center justify-center transition-all cursor-pointer border rounded-lg",
        isMobile ? "p-4 mb-2" : "p-6 mb-4",
        selected ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"
      )}
      onClick={handleClick}
      data-testid={`option-${value}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {icon && <div className={cn("mb-2", isMobile ? "scale-90" : "mb-3")}>{icon}</div>}
        <div className={cn("font-medium", isMobile ? "text-base" : "text-lg")}>{option}</div>
      </div>
    </div>
  );
};

export default OptionCard;
