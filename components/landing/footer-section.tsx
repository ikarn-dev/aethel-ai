"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FooterSection() {
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // Import the same fonts used in loading screen
  useEffect(() => {
    // Import Bitcount Prop Single for "AI"
    const bitcountLink = document.createElement('link');
    bitcountLink.href = 'https://fonts.googleapis.com/css2?family=Bitcount+Prop+Single:wght@100..900&display=swap';
    bitcountLink.rel = 'stylesheet';
    document.head.appendChild(bitcountLink);
    
    // Import Climate Crisis for "Aethel"
    const climateLink = document.createElement('link');
    climateLink.href = 'https://fonts.googleapis.com/css2?family=Climate+Crisis&display=swap';
    climateLink.rel = 'stylesheet';
    document.head.appendChild(climateLink);
    
    return () => {
      // Clean up on unmount
      if (document.head.contains(bitcountLink)) {
        document.head.removeChild(bitcountLink);
      }
      if (document.head.contains(climateLink)) {
        document.head.removeChild(climateLink);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Logo and brand animation
      gsap.fromTo(logoRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: logoRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Tagline animation
      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Social links animation
      gsap.fromTo(socialRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: socialRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );


    });

    return () => ctx.revert();
  }, []);
  return (
    <footer className="relative bg-slate-900/50 border-t border-teal-500/20 py-12 px-6 overflow-hidden" style={{ fontFamily: '"Poppins", sans-serif' }}>
      {/* Footer Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/landing-page/footer-video.mp4" type="video/mp4" />
      </video>
      
      {/* Footer Overlay */}
      <div className="absolute inset-0 bg-slate-900/80 z-5" />
      
      {/* Footer Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/40 pointer-events-none z-5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Side - App Name, Logo and Tagline */}
          <div className="flex flex-col">
            <div 
              ref={logoRef}
              className="flex items-center space-x-3 mb-4 will-change-transform"
            >
              <img 
                src="/assets/logo.png" 
                alt="Aethel AI Logo" 
                className="w-10 h-10"
              />
              <div className="flex items-center space-x-1">
                <span className="text-4xl text-white tracking-tight" style={{ 
                  fontFamily: '"Climate Crisis", sans-serif',
                  fontOpticalSizing: 'auto',
                  fontWeight: '400',
                  fontStyle: 'normal'
                }}>
                  Aethel
                </span>
                <span className="text-teal-400 font-light mx-1" style={{ fontFamily: 'monospace' }}>|</span>
                <span className="text-4xl text-teal-400" style={{ 
                  fontFamily: '"Bitcount Prop Single", system-ui',
                  fontOpticalSizing: 'auto',
                  fontWeight: '400',
                  fontStyle: 'normal'
                }}>
                  AI
                </span>
              </div>
            </div>
            
            {/* Tagline below name */}
            <div 
              ref={taglineRef}
              className="ml-13 will-change-transform"
            >
              <p className="text-teal-200/80 text-base mb-1">
                Simplifying blockchain analysis and AI agent management through intuitive design.
              </p>
              <p className="text-teal-300/70 text-sm">Powered by JuliaOS</p>
            </div>
          </div>

          {/* Right Side - Twitter Only */}
          <motion.div 
            ref={socialRef}
            className="flex items-center will-change-transform"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.a 
              href="https://x.com/iKK6600" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-teal-300 transition-colors flex items-center gap-2 text-teal-200/70"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </motion.a>
          </motion.div>
        </div>


      </div>
    </footer>
  );
}