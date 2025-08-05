"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Hero text animations
      gsap.fromTo(titleRef.current, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3
        }
      );

      gsap.fromTo(subtitleRef.current,
        { 
          opacity: 0, 
          y: 30 
        },
        { 
          opacity: 1, 
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.6
        }
      );

      gsap.fromTo(buttonsRef.current,
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.9
        }
      );

      // Scroll-triggered animations
      gsap.fromTo(imageRef.current,
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);
  return (
    <section className="relative px-6 py-20 pt-32 min-h-screen flex items-center overflow-hidden">
      {/* Hero Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/landing-page/hero-video.mp4" type="video/mp4" />
      </video>
      
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-slate-900/70 z-5" />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900/30 via-slate-800/40 to-slate-900/50 pointer-events-none z-5" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center">
          {/* Main Heading */}
          <h1 
            ref={titleRef}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight max-w-5xl mx-auto will-change-transform"
          >
            From wallet analysis to
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">intelligent agent management</span>
          </h1>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-base md:text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed will-change-transform"
          >
            Powered by JuliaOS framework for AI-driven Solana blockchain insights and smart money analysis
          </p>

          {/* CTA Buttons */}
          <motion.div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 will-change-transform"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.button 
              onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-full font-medium text-base hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-teal-500/25"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Explore Features
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/app/agents"
                prefetch={true}
                className="bg-slate-800/50 border border-teal-400/30 text-teal-100 px-8 py-3 rounded-full font-medium text-base hover:bg-slate-700/50 hover:border-teal-400/50 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              >
                Start Analysis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            ref={imageRef}
            className="relative max-w-6xl mx-auto will-change-transform gpu-accelerated"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div 
              className="relative bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-2xl p-1 shadow-2xl overflow-hidden"
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Revolving Pulse Border */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `conic-gradient(from 0deg, transparent 70%, rgba(20, 184, 166, 0.8) 85%, rgba(6, 182, 212, 0.8) 90%, transparent 100%)`,
                  animation: 'revolve 3s linear infinite',
                  zIndex: 1
                }}
              />
              
              {/* Inner container */}
              <div className="relative rounded-xl overflow-hidden bg-slate-900/20 backdrop-blur-sm" style={{ display: 'inline-block', width: '100%', zIndex: 2 }}>
                <Image
                  src="/landing-page/hero-image.png"
                  alt="Aethel AI Platform Interface - AI-driven Solana blockchain insights and agent management"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-xl"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes revolve {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}