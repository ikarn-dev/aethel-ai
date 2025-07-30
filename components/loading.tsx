"use client";

import { useState, useEffect, useRef } from "react";
import LoadingIcon from "./loading-icon";

interface LoadingProps {
  onComplete?: () => void;
  isTransitioning?: boolean;
}

export default function Loading({ onComplete, isTransitioning = false }: LoadingProps) {
  const [showContent, setShowContent] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    // Animate loading percentage from 0 to 100 over 2.2 seconds
    const duration = 2200; // 2.2 seconds
    const interval = 20; // Update every 20ms for smooth animation
    const increment = 100 / (duration / interval);

    const percentageTimer = setInterval(() => {
      setLoadingPercentage(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(percentageTimer);
          return 100;
        }
        return next;
      });
    }, interval);

    // Show loading for 2.5 seconds, then trigger completion
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(percentageTimer);
    };
  }, [onComplete]);

  // Fade out content when sliding starts
  useEffect(() => {
    if (isTransitioning) {
      setTimeout(() => {
        setShowContent(false);
      }, 500);
    }
  }, [isTransitioning]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 transition-transform duration-1200 ease-in-out bg-slate-900 ${isTransitioning ? 'transform -translate-y-full' : 'transform translate-y-0'}`}
    >
      {showContent && (
        <>
          {/* Top Progress Bar - Thick teal line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-75 ease-out"
              style={{ width: `${loadingPercentage}%` }}
            />
          </div>

          <div className="flex flex-col items-center justify-center h-full">
            {/* Main Brand Section - Tight spacing */}
            <div className="flex flex-col items-center">
              {/* Logo and Text Row - No bottom margin */}
              <div className="flex items-center">
                {/* Brand Text: Aethel | AI */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide">
                    Aethel
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-light text-teal-400">
                    |
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-400">
                    AI
                  </span>
                </div>

                {/* Rotating Flames Logo - Right side, very close to text */}
                <LoadingIcon
                  size={320}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 -ml-2"
                  animate={true}
                />
              </div>

              {/* Powered by JuliaOS - Very close to main text */}
              <p className="text-sm text-gray-400 font-medium tracking-wide -mt-1">
                Powered by JuliaOS
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}