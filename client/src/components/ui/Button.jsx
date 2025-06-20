import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-6 py-3 rounded-md font-medium transition-all duration-300 inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-cta hover:bg-cta-hover text-white shadow-sm hover:shadow",
    secondary: "bg-transparent border-2 border-cta text-cta hover:bg-cta hover:text-white",
    accent: "bg-accent hover:bg-accent-dark text-white shadow-sm hover:shadow",
    minimal: "bg-transparent text-text-dark hover:text-accent underline-offset-4 hover:underline"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Usage example:
export const ButtonExample = () => {
  return (
    <div className="space-y-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="accent">Accent Button</Button>
      <Button variant="minimal">Minimal Button</Button>
      
      {/* Button with icon */}
      <Button variant="primary">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Get Started
      </Button>
    </div>
  );
};

export default Button;
