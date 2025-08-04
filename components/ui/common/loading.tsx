"use client";

import { useState, useEffect } from "react";
import LoadingIcon from "./loading-icon";
import { Badge } from "../badge";

interface LoadingProps {
  onComplete?: () => void;
  isTransitioning?: boolean;
}

export default function Loading({ onComplete, isTransitioning = false }: LoadingProps) {
  const [showContent, setShowContent] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  const text = "Aethel|AI";
  const totalLetters = text.length;

  useEffect(() => {
    // Letter-by-letter animation
    const letterInterval = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev < totalLetters) {
          return prev + 1;
        } else {
          clearInterval(letterInterval);
          // Show logo after all letters are visible
          setTimeout(() => setShowLogo(true), 200);
          // Show badge with stamp effect after logo
          setTimeout(() => setShowBadge(true), 600);
          return prev;
        }
      });
    }, 150); // Show each letter every 150ms

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

    // Calculate total animation time and add buffer
    // Letters: 9 letters * 150ms = 1350ms
    // Logo delay: +200ms = 1550ms
    // Badge delay: +600ms = 1950ms
    // Badge animation: +400ms = 2350ms
    // Buffer time: +1500ms = 3850ms total
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3850);

    return () => {
      clearTimeout(timer);
      clearInterval(percentageTimer);
      clearInterval(letterInterval);
    };
  }, [onComplete, totalLetters]);

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
            {/* Main Brand Section - Reduced spacing */}
            <div className="flex flex-col items-center -mt-8">
              {/* Logo and Text Row - Letter by letter animation */}
              <div className="flex items-center">
                {/* Brand Text: Letter-by-letter fade reveal */}
                <div className="flex items-center">
                  {text.split('').map((letter, index) => {
                    const isVisible = index < visibleLetters;
                    const isSeparator = letter === '|';
                    const isAI = index > 6; // "AI" comes after separator

                    return (
                      <span
                        key={index}
                        className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-mono rounded-lg text-shadow-sm transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
                          } ${isSeparator
                            ? 'text-teal-400 font-light mx-1'
                            : isAI
                              ? 'text-teal-400'
                              : 'text-white'
                          }`}
                        style={{
                          fontFamily: isSeparator ? 'monospace' : 'Comic Sans MS, cursive, system-ui',
                          transitionDelay: `${index * 100}ms`
                        }}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </div>

                {/* Rotating Flames Logo - Slides in after text */}
                <LoadingIcon
                  size={280}
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 -ml-1 transition-all duration-500 ease-out ${showLogo
                    ? 'opacity-100 transform translate-x-0 scale-100'
                    : 'opacity-0 transform translate-x-8 scale-75'
                    }`}
                  animate={showLogo}
                />
              </div>

              {/* Powered by JuliaOS - Badge with stamp effect */}
              <Badge
                variant="outline"
                className={`text-xs text-gray-400 border-gray-600 bg-slate-800/50 backdrop-blur-sm font-bold tracking-wide -mt-2 transition-all duration-300 ease-out ${showBadge
                  ? 'opacity-100 transform scale-100 rotate-0'
                  : 'opacity-0 transform scale-0 rotate-12'
                  } ${isTransitioning ? 'transform rotate-3 scale-105 opacity-80' : ''
                  }`}
                style={{
                  transformOrigin: 'center',
                  background: 'linear-gradient(90deg, rgba(51, 65, 85, 0.5) 0%, rgba(71, 85, 105, 0.6) 50%, rgba(51, 65, 85, 0.5) 100%)',
                  backgroundSize: '200% 100%',
                  animation: showBadge ? 'stampIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards' : 'none'
                }}
              >
                Powered by JuliaOS
              </Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );
}