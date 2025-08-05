"use client";

import { useState, useEffect } from "react";
import Loading from "../components/ui/common/loading";
import Navbar from "../components/navigation/navbar";
import {
  FontLoader,
  HeroSection,
  FeaturesSection,
  DemoSection,
  FAQSection,
  FooterSection
} from "../components/landing";

// Import smooth scroll CSS
import "../styles/smooth-scroll.css";

export default function LandingPage() {
  const [showLoading, setShowLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLoadingComplete = () => {
    setIsTransitioning(true);
    // Hide loading screen exactly when slide animation completes
    setTimeout(() => {
      setShowLoading(false);
    }, 1200);
  };

  return (
    <>
      {/* Font Loader */}
      <FontLoader />
      
      {/* Persistent background to prevent white screen during transition */}
      <div className="fixed inset-0 bg-slate-900 -z-10" />

      {/* Landing page content - always rendered behind loading screen */}
      <div className="relative min-h-screen bg-slate-900" style={{ fontFamily: '"Prosto One", sans-serif', scrollBehavior: 'smooth' }}>
        {/* Navbar Component */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Demo Section */}
        <DemoSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Footer Section */}
        <FooterSection />
      </div>

      {/* Loading component with slide-up transition - renders on top */}
      {showLoading && (
        <Loading
          onComplete={handleLoadingComplete}
          isTransitioning={isTransitioning}
        />
      )}
    </>
  );
} 