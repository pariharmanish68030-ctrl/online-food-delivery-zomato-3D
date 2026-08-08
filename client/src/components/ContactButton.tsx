import React from 'react';

interface ContactButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({ 
  onClick, 
  className = '', 
  label = "Order Now" 
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #E23744 37%, #900C1D 72%, #FF5A36 100%)',
        boxShadow: '0px 4px 12px rgba(226, 55, 68, 0.35), inset 4px 4px 12px #900C1D',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
      className={`rounded-full text-white font-medium uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer inline-flex items-center justify-center ${className}`}
    >
      {label}
    </button>
  );
};
