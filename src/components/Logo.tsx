
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="text-2xl md:text-3xl font-bold">
        <span className="text-brand-700">AUTO</span>
        <span className="text-gray-800">RATE</span>
        <span className="text-brand-500">SAVER</span>
      </div>
    </div>
  );
};

export default Logo;
