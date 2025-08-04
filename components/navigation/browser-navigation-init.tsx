"use client";

import { useEffect } from 'react';
import { BrowserNavigationHandler } from '@/lib/browser-navigation';

/**
 * Client component to initialize browser navigation handling
 * This component should be included in the app layout to ensure
 * proper browser back/forward navigation handling
 */
export default function BrowserNavigationInit() {
  useEffect(() => {
    // Initialize browser navigation handling
    BrowserNavigationHandler.initialize();

    // Cleanup on unmount
    return () => {
      BrowserNavigationHandler.cleanup();
    };
  }, []);

  // This component doesn't render anything
  return null;
}