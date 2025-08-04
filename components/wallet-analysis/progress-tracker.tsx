'use client';

import React, { useState, useEffect } from 'react';
import LoadingIcon from '../ui/common/loading-icon';

interface ProgressTrackerProps {
  agentId?: string;
  isAnalyzing: boolean;
  onAnalysisComplete?: () => void;
}

export function ProgressTracker({ agentId, isAnalyzing, onAnalysisComplete }: ProgressTrackerProps) {
  const [animatedText, setAnimatedText] = useState("Analyzing trading patterns...");

  // Random engaging text animation
  useEffect(() => {
    if (!isAnalyzing) return;

    const analysisTexts = [
      "Analyzing trading patterns...",
      "Processing wallet behavior...",
      "Evaluating risk factors...",
      "Calculating copyability score...",
      "Identifying trading style...",
      "Generating insights...",
      "Examining transaction history...",
      "Assessing portfolio strategy...",
      "Analyzing market activity...",
      "Evaluating token holdings...",
      "Studying trading frequency...",
      "Predicting trader profile..."
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      setAnimatedText(analysisTexts[currentIndex]);
      currentIndex = (currentIndex + 1) % analysisTexts.length;
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Reset text when analysis starts
  useEffect(() => {
    if (isAnalyzing) {
      setAnimatedText("Analyzing trading patterns...");
    }
  }, [isAnalyzing]);

  return (
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 relative flex-shrink-0 overflow-visible">
        <LoadingIcon
          size={52}
          animate={true}
          className="w-13 h-13 absolute -top-3.5 -left-3.5 text-teal-400"
        />
      </div>
      <span className="text-teal-600 text-sm font-medium">
        {animatedText}
      </span>
    </div>
  );
}