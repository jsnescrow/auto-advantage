
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
  iconCount?: number;
}

const CarIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 512 512" 
    className="w-10 h-10 fill-brand-500"
    aria-hidden="true"
  >
    <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"/>
  </svg>
);

const VehicleIcons = ({ count = 1 }: { count?: number }) => {
  if (count === 1) {
    return (
      <div className="flex justify-center">
        <CarIcon />
      </div>
    );
  } else if (count === 2) {
    return (
      <div className="flex justify-center -space-x-3">
        <div className="translate-x-1.5">
          <CarIcon />
        </div>
        <div className="translate-x-0.5">
          <CarIcon />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center -space-x-5 relative">
        <div className="translate-x-3 z-30">
          <CarIcon />
        </div>
        <div className="translate-x-1.5 z-20">
          <CarIcon />
        </div>
        <div className="translate-x-0 z-10">
          <CarIcon />
        </div>
      </div>
    );
  }
};

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  value,
  icon,
  selected,
  onClick,
  autoAdvance = true,
  iconCount,
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
        {iconCount ? (
          <div className={isMobile ? "scale-90 mb-2" : "mb-3"}>
            <VehicleIcons count={iconCount} />
          </div>
        ) : icon ? (
          <div className={cn("mb-2", isMobile ? "scale-90" : "mb-3")}>{icon}</div>
        ) : null}
        <div className={cn("font-medium", isMobile ? "text-base" : "text-lg")}>{option}</div>
      </div>
    </div>
  );
};

export default OptionCard;
