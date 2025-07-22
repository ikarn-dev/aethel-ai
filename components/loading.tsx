"use client";

import { useState, useEffect, useRef } from "react";
import LoadingIcon from "./loading-icon";

interface LoadingProps {
  onComplete?: () => void;
  isTransitioning?: boolean;
}

export default function Loading({ onComplete, isTransitioning = false }: LoadingProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showContent, setShowContent] = useState(true);
  const fullText = "aethel      ai";
  const textRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);

  // State for per-character opacity
  const [charOpacities, setCharOpacities] = useState(Array(fullText.length).fill(0));

  useEffect(() => {
    let currentIndex = 0;
    let rafId: number | null = null;
    let lastTextTime = performance.now();
    const textTypingDelay = 120; // ms per character, much slower for smoothness
    const typingPhase = 'text' as const;
    let localCharOpacities = Array(fullText.length).fill(0);
    setCharOpacities(localCharOpacities);

    function typeText(now: number) {
      // Stop animation if transitioning has started
      if (isTransitioning) {
        if (rafId) cancelAnimationFrame(rafId);
        return;
      }

      if (typingPhase === 'text') {
        if (currentIndex <= fullText.length) {
          if (now - lastTextTime >= textTypingDelay) {
            setDisplayedText(fullText.slice(0, currentIndex));
            localCharOpacities = localCharOpacities.map((op, idx) => idx < currentIndex ? 1 : op);
            setCharOpacities([...localCharOpacities]);
            currentIndex++;
            lastTextTime = now;
          }
          rafId = requestAnimationFrame(typeText);
        } else {
          // Typing animation completed, wait 0.3s then trigger slide
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 300);
        }
      }
    }

    // Only start animation if not transitioning
    if (!isTransitioning) {
      rafId = requestAnimationFrame(typeText);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onComplete, isTransitioning]);

  // Fade out text only when sliding starts
  useEffect(() => {
    if (isTransitioning && textGroupRef.current) {
      // Apply CSS transition for fade out
      textGroupRef.current.style.transition = 'opacity 0.5s ease-out';
      textGroupRef.current.style.opacity = '0';

      // Handle completion
      setTimeout(() => {
        setShowContent(false);
        setTimeout(() => {
          onComplete?.();
        }, 300);
      }, 500);
    }
  }, [isTransitioning, onComplete]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 transition-transform duration-1200 ease-in-out ${isTransitioning ? 'transform -translate-y-full' : 'transform translate-y-0'}`}
      style={{ backgroundColor: '#2a5a5a' }}
    >
      {/* Centered Logo */}
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <LoadingIcon
          size={120}
          className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 mx-auto"
        />
      </div>
      {/* Large Typewriter Text at Bottom Right */}
      {showContent && (
        <div
          ref={textRef}
          className="josefin-sans fixed left-0 right-0 bottom-0 w-full text-left px-0 pb-0 text-[15vw] xs:text-[14vw] sm:text-[13vw] md:text-[12vw] lg:text-[11vw] xl:text-[10vw] 2xl:text-[9vw] tracking-widest select-none flex items-end"
          style={{ color: '#00CED1', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.25em', whiteSpace: 'nowrap', width: '100vw' }}
        >
          <div ref={textGroupRef} className="flex items-end">
            <span>
              {displayedText.split('').map((char, idx) => {
                // Special styling for AETHEL characters (0-5) with BananaGrotesk font
                if (idx >= 0 && idx <= 5) {
                  return (
                    <span
                      key={idx}
                      className="banana-grotesk inline-block"
                      style={{
                        opacity: charOpacities[idx],
                        transition: 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)',
                        fontWeight: 900,
                        fontSize: '1em',
                        textTransform: 'uppercase',
                        fontStretch: 'expanded',
                        transform: 'scaleX(1.1)',
                        filter: 'blur(0.3px)',
                        textShadow: '0 0 1px rgba(0, 206, 209, 0.3)',
                      }}
                    >
                      {char}
                    </span>
                  );
                }
                // Special styling for 'a' and 'i' in 'ai' at the end
                if (displayedText.length >= 13 && idx === 12 && displayedText[12].toLowerCase() === 'a') {
                  // 'a' in 'ai' with Playfair italic
                  return (
                    <span
                      key={idx}
                      className="playfair-display italic inline-block"
                      style={{
                        opacity: charOpacities[idx],
                        transition: 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)',
                        fontWeight: 900,
                        fontSize: '1em',
                        textTransform: 'lowercase',
                        fontStyle: 'italic',
                        letterSpacing: '-0.1em',
                      }}
                    >
                      a
                    </span>
                  );
                }
                if (displayedText.length >= 14 && idx === 13 && displayedText[13].toLowerCase() === 'i') {
                  // 'i' in 'ai' with Playfair italic
                  return (
                    <span
                      key={idx}
                      className="playfair-display italic inline-block"
                      style={{
                        opacity: charOpacities[idx],
                        transition: 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)',
                        fontWeight: 900,
                        fontSize: '0.8em',
                        textTransform: 'lowercase',
                        verticalAlign: 'baseline',
                        fontStyle: 'italic',
                        letterSpacing: '-0.15em',
                      }}
                    >
                      i
                    </span>
                  );
                }
                // Default styling for other chars
                return (
                  <span key={idx} className="inline-block" style={{ opacity: charOpacities[idx], transition: 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)' }}>{char}</span>
                );
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}