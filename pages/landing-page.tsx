"use client";

import { useState } from "react";
import Link from "next/link";
import Loading from "../components/loading";
import Navbar from "../components/navbar";

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
      {/* Persistent background to prevent white screen during transition */}
      <div className="fixed inset-0 bg-slate-900 -z-10" />

      {/* Landing page content - always rendered behind loading screen */}
      <div className="relative min-h-screen bg-slate-900">
        {/* Navbar Component */}
        <Navbar />

        {/* Hero Section */}
        <section className="relative px-6 py-20 pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Next Generation
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Platform
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-teal-100/80 mb-12 max-w-4xl mx-auto leading-relaxed">
                Experience the future of artificial intelligence with Aethel AI.
                Discover, create, and innovate with cutting-edge AI technology designed for modern workflows.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link
                  href="/app/agents"
                  prefetch={true}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
                >
                  Manage Your Agents
                </Link>
                <button className="border-2 border-teal-400/50 text-teal-100 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-teal-500/10 hover:border-teal-400 transition-all duration-300 backdrop-blur-sm">
                  Watch Demo
                </button>
              </div>

              {/* Hero Visual Element */}
              <div className="relative max-w-4xl mx-auto">
                <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-2xl p-8 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-teal-600/20 rounded-xl p-6 border border-teal-500/30">
                      <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                      <p className="text-teal-200/70 text-sm">Instant AI responses with optimized performance</p>
                    </div>

                    <div className="bg-teal-600/20 rounded-xl p-6 border border-teal-500/30">
                      <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Intelligent</h3>
                      <p className="text-teal-200/70 text-sm">Advanced AI models for accurate insights</p>
                    </div>

                    <div className="bg-teal-600/20 rounded-xl p-6 border border-teal-500/30">
                      <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Secure</h3>
                      <p className="text-teal-200/70 text-sm">Enterprise-grade security and privacy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-teal-200/80 max-w-3xl mx-auto">
                Discover the capabilities that make Aethel AI the perfect choice for your workflow
              </p>
            </div>

            {/* Features will be added here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature cards will be implemented later */}
              <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Smart Conversations</h3>
                <p className="text-teal-200/70">Engage in natural, context-aware conversations with advanced AI</p>
              </div>

              <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Data Analytics</h3>
                <p className="text-teal-200/70">Transform your data into actionable insights with AI-powered analysis</p>
              </div>

              <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Code Assistant</h3>
                <p className="text-teal-200/70">Write, debug, and optimize code with intelligent AI assistance</p>
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

            {/* Demo content will be added here */}
            <div className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-2xl p-16">
              <div className="text-teal-300/60">
                <svg className="w-24 h-24 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg text-teal-200/60">Interactive demo coming soon...</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6">
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
        <footer className="bg-slate-900/50 border-t border-teal-500/20 py-12 px-6">
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