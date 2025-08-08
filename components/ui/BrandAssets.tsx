'use client';

import { motion } from 'framer-motion';

// Main HangerOn Logo Component
export function HangerOnLogo({ 
  className = "w-32 h-12", 
  animated = false,
  variant = "full" // "full", "icon", "text"
}: { 
  className?: string;
  animated?: boolean;
  variant?: "full" | "icon" | "text";
}) {
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (variant === "icon") {
    return (
      <motion.svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={animated ? logoVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      >
        {/* Hanger Hook */}
        <motion.circle
          cx="24"
          cy="8"
          r="4"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          variants={animated ? pathVariants : undefined}
        />
        
        {/* Hanger Bar */}
        <motion.path
          d="M8 20C8 18 9 16 11 16H37C39 16 40 18 40 20C40 22 39 24 37 24H11C9 24 8 22 8 20Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="url(#hangerGradient)"
          variants={animated ? pathVariants : undefined}
        />
        
        {/* Hanger Hook Connection */}
        <motion.path
          d="M24 12V16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={animated ? pathVariants : undefined}
        />
        
        {/* Clothing Silhouette */}
        <motion.path
          d="M12 28C12 28 16 36 24 36C32 36 36 28 36 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 3"
          fill="none"
          variants={animated ? pathVariants : undefined}
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="hangerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--hanger-blue)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--hanger-amber)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </motion.svg>
    );
  }

  if (variant === "text") {
    return (
      <motion.div
        className={`font-bold text-2xl ${className}`}
        variants={animated ? textVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      >
        <span className="bg-gradient-to-r from-hanger-blue to-hanger-amber bg-clip-text text-transparent">
          HangerOn
        </span>
      </motion.div>
    );
  }

  // Full logo with icon and text
  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      variants={animated ? logoVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
    >
      <HangerOnLogo variant="icon" className="w-10 h-10" animated={animated} />
      <HangerOnLogo variant="text" className="" animated={animated} />
    </motion.div>
  );
}

// Simplified Hanger Icon for UI elements
export function HangerIcon({ 
  className = "w-6 h-6",
  animated = false 
}: { 
  className?: string;
  animated?: boolean;
}) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={animated ? { rotate: [0, 5, -5, 0] } : undefined}
      transition={animated ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
      <path 
        d="M5 12C5 11 6 10 7 10H17C18 10 19 11 19 12C19 13 18 14 17 14H7C6 14 5 13 5 12Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path d="M12 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path 
        d="M7 16C7 16 9 20 12 20C15 20 17 16 17 16" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeDasharray="2 2"
      />
    </motion.svg>
  );
}

// Wardrobe/Closet Icon
export function WardrobeIcon({ 
  className = "w-6 h-6",
  animated = false 
}: { 
  className?: string;
  animated?: boolean;
}) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={animated ? { scale: 1.1 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 3V21" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <path d="M6 8H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 16H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 16H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  );
}

// Laundry Basket Icon
export function LaundryIcon({ 
  className = "w-6 h-6",
  animated = false 
}: { 
  className?: string;
  animated?: boolean;
}) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={animated ? { y: [0, -2, 0] } : undefined}
      transition={animated ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <path 
        d="M6 8L4 20H20L18 8H6Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path d="M6 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 4H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="12" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="14" cy="14" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="16" r="1" fill="currentColor" opacity="0.6" />
    </motion.svg>
  );
}

// Collection/Tag Icon
export function CollectionIcon({ 
  className = "w-6 h-6",
  animated = false 
}: { 
  className?: string;
  animated?: boolean;
}) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={animated ? { rotate: 5 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <path 
        d="M3 7V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="currentColor"
        fillOpacity="0.1"
      />
      <circle cx="7" cy="9" r="1.5" fill="currentColor" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" />
      <circle cx="17" cy="9" r="1.5" fill="currentColor" />
      <path d="M7 13H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 15H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  );
}

// Status Indicator Icons
export function StatusIcon({ 
  status,
  className = "w-4 h-4",
  animated = false 
}: { 
  status: 'clean' | 'worn' | 'dirty' | 'washing';
  className?: string;
  animated?: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'text-emerald-500';
      case 'worn': return 'text-amber-500';
      case 'dirty': return 'text-red-500';
      case 'washing': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean':
        return (
          <motion.svg
            className={`${className} ${getStatusColor(status)}`}
            viewBox="0 0 24 24"
            fill="none"
            animate={animated ? { scale: [1, 1.2, 1] } : undefined}
            transition={animated ? { duration: 2, repeat: Infinity } : undefined}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        );
      case 'worn':
        return (
          <motion.svg
            className={`${className} ${getStatusColor(status)}`}
            viewBox="0 0 24 24"
            fill="none"
            animate={animated ? { rotate: [0, 10, -10, 0] } : undefined}
            transition={animated ? { duration: 3, repeat: Infinity } : undefined}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        );
      case 'dirty':
        return (
          <motion.svg
            className={`${className} ${getStatusColor(status)}`}
            viewBox="0 0 24 24"
            fill="none"
            animate={animated ? { y: [0, -2, 0] } : undefined}
            transition={animated ? { duration: 1.5, repeat: Infinity } : undefined}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
            <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
        );
      case 'washing':
        return (
          <motion.svg
            className={`${className} ${getStatusColor(status)}`}
            viewBox="0 0 24 24"
            fill="none"
            animate={animated ? { rotate: 360 } : undefined}
            transition={animated ? { duration: 2, repeat: Infinity, ease: "linear" } : undefined}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 6V12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        );
      default:
        return (
          <div className={`${className} ${getStatusColor(status)} rounded-full bg-current`}></div>
        );
    }
  };

  return getStatusIcon(status);
}

// Animated Brand Loader
export function BrandLoader({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <HangerIcon className="w-full h-full text-hanger-blue" animated={true} />
    </motion.div>
  );
}

// Export all icons as a collection
export const BrandIcons = {
  HangerOnLogo,
  HangerIcon,
  WardrobeIcon,
  LaundryIcon,
  CollectionIcon,
  StatusIcon,
  BrandLoader
};

export default BrandIcons;