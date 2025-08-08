import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  type?: 'garments' | 'collections' | 'search';
}

export default function EmptyState({
  title = "Nothing here yet",
  message = "Start organizing your wardrobe",
  actionText = "Add your first item",
  actionHref = "/add",
  onAction,
  type = 'garments'
}: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'collections':
        return {
          title: "No collections yet",
          message: "Create your first collection to organize your wardrobe",
          actionText: "Create collection",
          actionHref: "/collections"
        };
      case 'search':
        return {
          title: "No results found",
          message: "Try adjusting your search or filters",
          actionText: "Clear filters",
          actionHref: "/"
        };
      default:
        return {
          title,
          message,
          actionText,
          actionHref
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="relative mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
      >
        {/* Enhanced Hanger illustration with animations */}
        <motion.div
          animate={{ 
            rotate: [-2, 2, -2],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: 1
          }}
        >
          <svg 
            className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" 
            viewBox="0 0 64 64" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path 
              d="M32 12C28 12 25 15 25 19C25 23 28 26 32 26C36 26 39 23 39 19C39 15 36 12 32 12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
            <motion.path 
              d="M10 30C10 28 11 26 13 26H51C53 26 54 28 54 30C54 32 53 34 51 34H13C11 34 10 32 10 30Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.1"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: 0.1 }}
              transition={{ delay: 0.7, duration: 1 }}
            />
            <motion.path 
              d="M32 26V30" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            />
            <motion.path 
              d="M15 40C15 40 20 50 32 50C44 50 49 40 49 40" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.1, duration: 1.5 }}
            />
          </svg>
        </motion.div>
        
        {/* Animated decorative elements */}
        <motion.div 
          className="absolute -top-2 -right-2 w-4 h-4 bg-hanger-blue/30 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
        ></motion.div>
        <motion.div 
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-hanger-amber/30 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        
        {/* Floating particles */}
        <motion.div 
          className="absolute top-0 left-1/2 w-1 h-1 bg-hanger-blue/40 rounded-full"
          animate={{ 
            y: [-10, -30, -10],
            x: [-5, 5, -5],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        ></motion.div>
        <motion.div 
          className="absolute top-5 right-0 w-1 h-1 bg-hanger-amber/40 rounded-full"
          animate={{ 
            y: [-5, -25, -5],
            x: [5, -5, 5],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2.5
          }}
        ></motion.div>
      </motion.div>

      <motion.h3 
        className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {content.title}
      </motion.h3>
      <motion.p 
        className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {content.message}
      </motion.p>

      <AnimatePresence>
        {(actionHref || onAction) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 200 }}
          >
            {onAction ? (
              <motion.button 
                onClick={onAction}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-hanger-blue to-blue-600 text-white rounded-xl font-medium shadow-[4px_4px_12px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.2),-3px_-3px_12px_rgba(255,255,255,0.15)] backdrop-blur-sm border border-white/10"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.svg 
                  className="w-5 h-5 mr-2" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <path 
                    d="M12 2V12M12 12V22M12 12H2M12 12H22" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </motion.svg>
                {actionText}
              </motion.button>
            ) : (
              <Link href={content.actionHref}>
                <motion.div
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-hanger-blue to-blue-600 text-white rounded-xl font-medium shadow-[4px_4px_12px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_18px_rgba(0,0,0,0.2),-3px_-3px_12px_rgba(255,255,255,0.15)] backdrop-blur-sm border border-white/10 cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.svg 
                    className="w-5 h-5 mr-2" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path 
                      d="M12 2V12M12 12V22M12 12H2M12 12H22" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  {content.actionText}
                </motion.div>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}