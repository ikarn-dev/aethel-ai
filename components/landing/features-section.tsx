"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturesSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const performanceCardsRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Subtitle animation
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Performance cards stagger animation
      gsap.fromTo(performanceCardsRef.current?.children || [],
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: performanceCardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Feature cards stagger animation
      gsap.fromTo(featureCardsRef.current?.children || [],
        { opacity: 0, y: 80, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: featureCardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="features-section" className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white mb-6 will-change-transform"
          >
            Aethel AI Features
          </h2>
          <p 
            ref={subtitleRef}
            className="text-xl text-teal-200/80 max-w-3xl mx-auto will-change-transform"
          >
            Simplifying blockchain analysis and AI agent management for everyone
          </p>
        </div>

        {/* Performance Metrics Cards */}
        <div 
          ref={performanceCardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-16"
        >
          {/* 100x Faster Card */}
          <motion.div 
            className="relative group will-change-transform"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-6 text-center hover:border-teal-400/50 transition-all duration-300 min-h-[200px] flex flex-col justify-center">
              {/* Decorative dots */}
              <div className="absolute top-4 left-4 flex space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
              </div>
              <div className="absolute top-4 right-4 flex space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
              </div>

              <div className="py-4">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">100x</span>
                  <span className="text-white ml-2">Faster</span>
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto mb-3"></div>
                <p className="text-teal-200/80 text-sm">Agent Response Time</p>
              </div>
            </div>
          </motion.div>

          {/* 10x More Productive Card */}
          <motion.div 
            className="relative group will-change-transform"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-6 text-center hover:border-teal-400/50 transition-all duration-300 min-h-[200px] flex flex-col justify-center">
              {/* Decorative dots */}
              <div className="absolute top-4 left-4 flex space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
              </div>
              <div className="absolute top-4 right-4 flex space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
              </div>

              <div className="py-4">
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">10x</span>
                  <span className="text-white ml-2">More</span>
                </div>
                <div className="text-xl font-bold text-white mb-2">Productive</div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto mb-3"></div>
                <p className="text-teal-200/80 text-sm">User-Friendly Interface</p>
              </div>
            </div>
          </motion.div>

          {/* 90% Efficiency Card */}
          <motion.div 
            className="relative group will-change-transform"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-6 text-center hover:border-teal-400/50 transition-all duration-300 min-h-[200px] flex flex-col justify-center">
              {/* Decorative dots */}
              <div className="absolute top-4 left-4 flex space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
              </div>
              <div className="absolute top-4 right-4 flex space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
              </div>

              <div className="py-4">
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">90%</span>
                </div>
                <div className="text-xl font-bold text-white mb-2">Efficiency</div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto mb-3"></div>
                <p className="text-teal-200/80 text-sm">in Blockchain Analysis</p>
              </div>
            </div>
          </motion.div>

          {/* 10x Faster Card */}
          <motion.div 
            className="relative group will-change-transform"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-6 text-center hover:border-teal-400/50 transition-all duration-300 min-h-[200px] flex flex-col justify-center">
              {/* Decorative dots */}
              <div className="absolute top-4 left-4 flex space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
              </div>
              <div className="absolute top-4 right-4 flex space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
              </div>

              <div className="py-4">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">10x</span>
                  <span className="text-white ml-2">Faster</span>
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto mb-3"></div>
                <p className="text-teal-200/80 text-sm">Setup & Deployment</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div 
          ref={featureCardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" 
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {/* Smart Money Analysis Card */}
          <motion.div 
            className="relative group will-change-transform"
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-4 sm:p-6 md:p-8 hover:border-teal-400/50 transition-all duration-300 h-[340px] sm:h-[320px] md:h-[300px] flex flex-col overflow-hidden">
              {/* Decorative dots */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-60"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-20"></div>
              </div>
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-20"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-60"></div>
              </div>

              <div className="pt-6 sm:pt-8 flex-1 flex flex-col min-h-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 leading-tight flex-shrink-0">Smart Money Analysis</h3>
                <p className="text-teal-200/80 text-xs sm:text-sm mb-3 leading-snug flex-shrink-0">AI-powered Solana wallet analysis with comprehensive trading insights</p>
                <ul className="text-teal-200/70 text-xs sm:text-sm space-y-1 flex-1 overflow-hidden">
                  <li className="leading-snug">• Helius RPC integration for real-time data</li>
                  <li className="leading-snug">• Trading metrics & P&L calculations</li>
                  <li className="leading-snug">• Risk scoring & behavioral patterns</li>
                  <li className="leading-snug">• Gemini AI-powered recommendations</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* JuliaOS Backend Integration Card */}
          <motion.div 
            className="relative group will-change-transform"
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-4 sm:p-6 md:p-8 hover:border-teal-400/50 transition-all duration-300 h-[340px] sm:h-[320px] md:h-[300px] flex flex-col overflow-hidden">
              {/* Decorative dots */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-60"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-20"></div>
              </div>
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-20"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-60"></div>
              </div>

              <div className="pt-6 sm:pt-8 flex-1 flex flex-col min-h-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 leading-tight flex-shrink-0">JuliaOS Backend Integration</h3>
                <p className="text-teal-200/80 text-xs sm:text-sm mb-3 leading-snug flex-shrink-0">High-performance Julia framework with enterprise-grade infrastructure</p>
                <ul className="text-teal-200/70 text-xs sm:text-sm space-y-1 flex-1 overflow-hidden">
                  <li className="leading-snug">• Multi-layered architecture with Julia core</li>
                  <li className="leading-snug">• Agent orchestration & swarm algorithms</li>
                  <li className="leading-snug">• RESTful API with webhook support</li>
                  <li className="leading-snug">• Rust security layer for crypto operations</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Agent Lifecycle Management Card */}
          <motion.div 
            className="relative group will-change-transform"
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-4 sm:p-6 md:p-8 hover:border-teal-400/50 transition-all duration-300 h-[340px] sm:h-[320px] md:h-[300px] flex flex-col overflow-hidden">
              {/* Decorative dots */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-60"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-20"></div>
              </div>
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-20"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-40"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full opacity-60"></div>
              </div>

              <div className="pt-6 sm:pt-8 flex-1 flex flex-col min-h-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 leading-tight flex-shrink-0">Agent Lifecycle Management</h3>
                <p className="text-teal-200/80 text-xs sm:text-sm mb-3 leading-snug flex-shrink-0">Complete agent management with real-time monitoring and control</p>
                <ul className="text-teal-200/70 text-xs sm:text-sm space-y-1 flex-1 overflow-hidden">
                  <li className="leading-snug">• Create, start, stop & delete operations</li>
                  <li className="leading-snug">• Real-time status monitoring & health checks</li>
                  <li className="leading-snug">• Chat persistence & message templates</li>
                  <li className="leading-snug">• Batch operations with optimistic UI</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}