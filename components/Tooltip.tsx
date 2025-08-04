import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className="absolute z-10 w-64 p-3 text-left text-gray-200 bg-gray-800 rounded-lg shadow-xl -top-2 left-1/2 -translate-x-1/2 -translate-y-full transform transition-opacity duration-300 border border-gray-700"
          style={{ pointerEvents: 'none' }}
        >
          {content}
          <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-gray-700"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;