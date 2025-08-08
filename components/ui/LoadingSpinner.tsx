import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'swing' | 'spin' | 'pulse';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'swing',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const animationClasses = {
    swing: 'hanger-loading',
    spin: 'hanger-spin',
    pulse: 'animate-pulse'
  };

  // Hanger SVG Icon
  const HangerIcon = () => (
    <svg 
      className={`${sizeClasses[size]} ${animationClasses[variant]} text-blue-600`}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hanger hook */}
      <path 
        d="M12 2C12.5523 2 13 2.44772 13 3V4" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      {/* Hanger body */}
      <path 
        d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V8C20 9.10457 19.1046 10 18 10H6C4.89543 10 4 9.10457 4 8V8Z" 
        stroke="currentColor" 
        strokeWidth="2"
      />
      {/* Hanger arms */}
      <path 
        d="M6 10L8 18C8.2 18.8 8.8 19 9 19H15C15.2 19 15.8 18.8 16 18L18 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Connection point */}
      <circle 
        cx="12" 
        cy="8" 
        r="1" 
        fill="currentColor"
      />
    </svg>
  );

  // Simple emoji fallback for quick loading
  const EmojiHanger = () => (
    <div className={`${sizeClasses[size]} ${animationClasses[variant]} flex items-center justify-center text-2xl`}>
      👔
    </div>
  );

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {variant === 'pulse' ? <EmojiHanger /> : <HangerIcon />}
    </div>
  );
}

// Additional loading components for different contexts
export function HangerLoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
    </div>
  );
}

export function HangerLoadingText({ text = 'Loading...', className = '' }: { text?: string; className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LoadingSpinner size="sm" variant="swing" />
      <span className="text-gray-600 font-medium">{text}</span>
    </div>
  );
}