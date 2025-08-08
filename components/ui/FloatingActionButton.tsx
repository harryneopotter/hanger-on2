'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface FloatingActionButtonProps {
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

// Hanger SVG Icon Component
const HangerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2Z" 
      fill="currentColor"
    />
    <path 
      d="M19 8H14.5C14.2 8 14 7.8 14 7.5C14 7.2 14.2 7 14.5 7H15C15.6 7 16 6.4 16 5.8C16 5.2 15.6 4.6 15 4.6H12C11.4 4.6 11 5.2 11 5.8V6.2C11 6.6 11.4 7 11.8 7H12.5C12.8 7 13 7.2 13 7.5C13 7.8 12.8 8 12.5 8H5C3.9 8 3 8.9 3 10V11C3 12.1 3.9 13 5 13H19C20.1 13 21 12.1 21 11V10C21 8.9 20.1 8 19 8Z" 
      fill="currentColor"
    />
    <path 
      d="M5 15V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V15H5Z" 
      fill="currentColor" 
      fillOpacity="0.6"
    />
  </svg>
);

export default function FloatingActionButton({ 
  href, 
  onClick, 
  icon, 
  className = '', 
  ariaLabel = 'Add new item'
}: FloatingActionButtonProps) {
  const buttonContent = (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-hanger-blue to-blue-600 text-white rounded-full shadow-[8px_8px_20px_rgba(0,0,0,0.15),-4px_-4px_12px_rgba(255,255,255,0.1)] hover:shadow-[12px_12px_30px_rgba(0,0,0,0.25),-6px_-6px_18px_rgba(255,255,255,0.15)] flex items-center justify-center z-50 backdrop-blur-sm border border-white/10 ${className}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ 
        scale: 1.1,
        rotate: 15,
        boxShadow: "0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)"
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.6
      }}
      aria-label={ariaLabel}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatDelay: 2
        }}
      >
        {icon || <HangerIcon className="w-7 h-7" />}
      </motion.div>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 0], opacity: [0, 0.3, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeOut",
          repeatDelay: 1
        }}
      />
    </motion.button>
  );

  if (href) {
    return (
      <Link href={href}>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}

// Alternative FAB with Plus icon for general use
export function PlusFAB({ 
  href, 
  onClick, 
  className = '', 
  ariaLabel = 'Add new'
}: Omit<FloatingActionButtonProps, 'icon'>) {
  return (
    <FloatingActionButton
      href={href}
      onClick={onClick}
      icon={<Plus className="w-7 h-7" />}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}

// Hanger-themed FAB specifically for adding garments
export function HangerFAB({ 
  href = '/add', 
  onClick, 
  className = '', 
  ariaLabel = 'Add new garment',
  isGuest = false
}: Omit<FloatingActionButtonProps, 'icon'> & { isGuest?: boolean }) {
  const handleClick = () => {
    if (isGuest) {
      alert('Please sign in to add garments');
      return;
    }
    if (onClick) onClick();
  };

  return (
    <FloatingActionButton
      href={isGuest ? undefined : href}
      onClick={isGuest ? handleClick : onClick}
      icon={<HangerIcon className="w-7 h-7" />}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}