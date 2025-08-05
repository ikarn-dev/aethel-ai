"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Loading from "../components/ui/common/loading";
import Navbar from "../components/navigation/navbar";

export default function LandingPage() {
  const [showLoading, setShowLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Import fonts
  useEffect(() => {
    // Import Prosto One font for general use
    const prostoLink = document.createElement('link');
    prostoLink.href = 'https://fonts.googleapis.com/css2?family=Prosto+One&display=swap';
    prostoLink.rel = 'stylesheet';
    document.head.appendChild(prostoLink);

    // Import Nova Flat font for FAQ section
    const novaLink = document.createElement('link');
    novaLink.href = 'https://fonts.googleapis.com/css2?family=Nova+Flat&display=swap';
    novaLink.rel = 'stylesheet';
    document.head.appendChild(novaLink);

    // Import Inter font for feature cards
    const interLink = document.createElement('link');
    interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    interLink.rel = 'stylesheet';
    document.head.appendChild(interLink);

    return () => {
      document.head.removeChild(prostoLink);
      document.head.removeChild(novaLink);
      document.head.removeChild(interLink);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsTransitioning(true);
    // Hide loading screen exactly when slide animation completes
    setTimeout(() => {
      setShowLoading(false);
    }, 1200);
  };

  return (
    <>
      {/* Persistent background to prevent white screen during transition */}
      <div className="fixed inset-0 bg-slate-900 -z-10" />

      {/* Landing page content - always rendered behind loading screen */}
      <div className="relative min-h-screen bg-slate-900" style={{ fontFamily: '"Prosto One", sans-serif' }}>
        {/* Navbar Component */}
        <Navbar />

        {/* Hero Section */}
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
              {/* Main Heading - Reduced Size with Better Alignment */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight max-w-5xl mx-auto">
                From wallet analysis to
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">intelligent agent management</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Powered by JuliaOS framework for AI-driven Solana blockchain insights and smart money analysis
              </p>

              {/* CTA Buttons - Teal & Dark Theme */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-full font-medium text-base hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-teal-500/25"
                >
                  Explore Features
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
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
              </div>

              {/* Hero Image */}
              <div className="relative max-w-6xl mx-auto">
                <div className="relative bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-2xl p-1 shadow-2xl overflow-hidden">
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
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" className="py-20 px-6 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Aethel AI Features
              </h2>
              <p className="text-xl text-teal-200/80 max-w-3xl mx-auto">
                Simplifying blockchain analysis and AI agent management for everyone
              </p>
            </div>

            {/* Performance Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-16">
              {/* 100x Faster Card */}
              <div className="relative group">
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
              </div>

              {/* 10x More Productive Card */}
              <div className="relative group">
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
              </div>

              {/* 90% Efficiency Card */}
              <div className="relative group">
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
              </div>

              {/* 10x Faster Card */}
              <div className="relative group">
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
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ fontFamily: '"Inter", sans-serif' }}>
              {/* Smart Money Analysis Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-8 hover:border-teal-400/50 transition-all duration-300 h-[280px] flex flex-col">
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

                  <div className="pt-8 flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">Smart Money Analysis</h3>
                    <p className="text-teal-200/80 text-sm mb-4">AI-powered Solana wallet analysis with comprehensive trading insights</p>
                    <ul className="text-teal-200/70 text-sm space-y-2">
                      <li>• Helius RPC integration for real-time data</li>
                      <li>• Trading metrics & P&L calculations</li>
                      <li>• Risk scoring & behavioral patterns</li>
                      <li>• Gemini AI-powered recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* JuliaOS Backend Integration Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-8 hover:border-teal-400/50 transition-all duration-300 h-[280px] flex flex-col">
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

                  <div className="pt-8 flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">JuliaOS Backend Integration</h3>
                    <p className="text-teal-200/80 text-sm mb-4">High-performance Julia framework with enterprise-grade infrastructure</p>
                    <ul className="text-teal-200/70 text-sm space-y-2">
                      <li>• Multi-layered architecture with Julia core</li>
                      <li>• Agent orchestration & swarm algorithms</li>
                      <li>• RESTful API with webhook support</li>
                      <li>• Rust security layer for crypto operations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Agent Lifecycle Management Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-slate-800/80 backdrop-blur-md border border-teal-400/30 rounded-2xl p-8 hover:border-teal-400/50 transition-all duration-300 h-[280px] flex flex-col">
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

                  <div className="pt-8 flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">Agent Lifecycle Management</h3>
                    <p className="text-teal-200/80 text-sm mb-4">Complete agent management with real-time monitoring and control</p>
                    <ul className="text-teal-200/70 text-sm space-y-2">
                      <li>• Create, start, stop & delete operations</li>
                      <li>• Real-time status monitoring & health checks</li>
                      <li>• Chat persistence & message templates</li>
                      <li>• Batch operations with optimistic UI</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section (Empty for now) */}
        <section className="py-20 px-6 bg-teal-900/20">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See Aethel AI in Action
            </h2>
            <p className="text-xl text-teal-200/80 mb-12 max-w-3xl mx-auto">
              Experience the power of our AI platform through interactive demonstrations
            </p>

            {/* Demo Video */}
            <div className="relative max-w-5xl mx-auto">
              <div className="relative bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-2xl p-4 shadow-2xl overflow-hidden">
                {/* Revolving Pulse Border */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 70%, rgba(20, 184, 166, 0.6) 85%, rgba(6, 182, 212, 0.6) 90%, transparent 100%)`,
                    animation: 'demoRevolve 4s linear infinite',
                    zIndex: 1
                  }}
                />

                {/* Decorative dots */}
                <div className="absolute top-6 left-6 flex space-x-1 z-20">
                  <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
                </div>
                <div className="absolute top-6 right-6 flex space-x-1 z-20">
                  <div className="w-2 h-2 bg-teal-400 rounded-full opacity-20"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full opacity-40"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-slate-900/20 backdrop-blur-sm z-10">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-auto rounded-xl"
                    preload="auto"
                  >
                    <source src="/landing-page/demo-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Video description */}
              <div className="mt-6 text-center">
                <p className="text-teal-200/80 text-sm max-w-2xl mx-auto">
                  Watch how Aethel AI simplifies blockchain analysis and agent management with its intuitive interface and powerful JuliaOS backend integration.
                </p>
              </div>

              {/* CSS Animation Styles for Demo Video */}
              <style jsx>{`
                @keyframes demoRevolve {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6" style={{ fontFamily: '"Nova Flat", system-ui', fontWeight: 400, fontStyle: 'normal' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-teal-200/80">
                Get answers to common questions about Aethel AI
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What makes Aethel AI different?</h3>
                <p className="text-teal-200/80">Aethel AI combines cutting-edge AI technology with an intuitive interface, offering lightning-fast responses and enterprise-grade security for all your AI needs.</p>
              </div>

              <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Is my data secure?</h3>
                <p className="text-teal-200/80">Yes, we implement enterprise-grade security measures including end-to-end encryption, secure data storage, and strict privacy protocols to protect your information.</p>
              </div>

              <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Can I integrate Aethel AI with my existing tools?</h3>
                <p className="text-teal-200/80">Absolutely! Aethel AI offers comprehensive API access and integrations with popular productivity tools and platforms to seamlessly fit into your workflow.</p>
              </div>

              <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">What kind of support do you offer?</h3>
                <p className="text-teal-200/80">We provide 24/7 customer support, comprehensive documentation, video tutorials, and a dedicated community forum to help you get the most out of Aethel AI.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900/50 border-t border-teal-500/20 py-12 px-6" style={{ fontFamily: '"Nova Flat", system-ui', fontWeight: 400, fontStyle: 'normal' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <span className="text-slate-900 font-bold text-sm">A</span>
                  </div>
                  <span className="text-2xl font-bold text-white">Aethel AI</span>
                </div>
                <p className="text-teal-200/70 mb-4 max-w-md">
                  Experience the future of artificial intelligence with our cutting-edge platform designed for modern workflows.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-teal-200/70">
                  <li><a href="#" className="hover:text-teal-300 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-teal-300 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-teal-300 transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-teal-300 transition-colors">Documentation</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-teal-200/70">
                  <li><a href="#" className="hover:text-teal-300 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-teal-300 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-teal-300 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-teal-300 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-teal-500/20 pt-8 text-center">
              <p className="text-teal-200/60">&copy; 2024 Aethel AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
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