import React from 'react';

interface DescriptionProps {
  description: string;
  className?: string;
  [key: string]: any;
}

const Description = ({ description, className = '', ...props }: DescriptionProps) => {
  return (
    <div 
      className={`text-[3.5vw] lg:text-[16px] text-[#141414] font-medium leading-relaxed px-4 lg:px-0 text-justify ${className}`}
      {...props}
    >
      {description}
    </div>
  );
};

export default Description; 