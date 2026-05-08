import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for fade out
    }, 4500); // Bloom duration + pause
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Colors based on user palette
  const colors = {
    large: '#A48CEF', // Lavender
    mid: '#6D58C7',   // Deep Purple
    small: '#92B061', // Light Green
    center: '#274D00' // Dark Forest
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#B0ADD0]/20 backdrop-blur-3xl overflow-hidden"
        >
          <div className="relative w-96 h-96 flex items-center justify-center">
            
            {/* Background Glow */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.15 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-accent blur-[100px]"
            />

            {/* Bloom Container */}
            <div className="relative scale-150">
              {/* Large Petals Layer */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`large-${i}`}
                  initial={{ scale: 0, rotate: i * 30 + 45 }}
                  animate={{ scale: 1, rotate: i * 30 }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 0.5 + (i * 0.05),
                    ease: [0.18, 0.89, 0.32, 1.28] 
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-[15%] shadow-xl shadow-black/5"
                  style={{ 
                    backgroundColor: colors.large,
                    transformOrigin: 'center center',
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                  }}
                />
              ))}

              {/* Mid Petals Layer */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`mid-${i}`}
                  initial={{ scale: 0, rotate: i * 30 - 45 }}
                  animate={{ scale: 1, rotate: i * 30 + 15 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 1.2 + (i * 0.05),
                    ease: [0.68, -0.55, 0.27, 1.55] 
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-[10%]"
                  style={{ 
                    backgroundColor: colors.mid,
                    transformOrigin: 'center center',
                    clipPath: 'polygon(50% 0%, 80% 50%, 50% 100%, 20% 50%)'
                  }}
                />
              ))}

              {/* Small Petals Layer */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`small-${i}`}
                  initial={{ scale: 0, rotate: i * 45 }}
                  animate={{ scale: 1, rotate: i * 45 + 22.5 }}
                  transition={{ 
                    duration: 1, 
                    delay: 1.8 + (i * 0.08),
                    ease: "easeOut"
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
                  style={{ 
                    backgroundColor: colors.small,
                    transformOrigin: 'center center',
                    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
                  }}
                />
              ))}

              {/* Center / Shutter */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 1, 
                  delay: 2.5,
                  type: "spring",
                  stiffness: 100 
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-white/20 shadow-inner overflow-hidden"
                style={{ backgroundColor: colors.center }}
              >
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
