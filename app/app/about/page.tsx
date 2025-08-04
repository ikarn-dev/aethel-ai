import React from "react";
import Image from "next/image";


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-6">
            Aethel AI
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A next-generation AI platform built on JuliaOS, specializing in Solana wallet analysis
            and intelligent agent management for the blockchain ecosystem.
          </p>
        </div>

        {/* What is Aethel AI */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">What is Aethel AI?</h2>
          <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
            <p>
              Aethel AI is a sophisticated web platform that serves as the frontend interface for the powerful
              JuliaOS framework. Built with Next.js 15 and TypeScript, it provides an intuitive experience for
              creating, managing, and interacting with AI agents powered by enterprise-grade backend infrastructure.
            </p>
            <p>
              The platform specializes in Solana blockchain integration, offering advanced wallet analysis and
              smart money insights through AI-powered agents that leverage JuliaOS's modular strategy and tool system.
            </p>
          </div>

          {/* Core Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  width={48}
                  height={48}
                  src="https://img.icons8.com/ios-filled/50/12B886/ai-chatting.png"
                  alt="ai-chatting"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Agent Management</h3>
              <p className="text-slate-400">Create and manage multiple AI agents with different capabilities and tools</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  width={48}
                  height={48}
                  src="https://img.icons8.com/dotty/80/12B886/stocks-growth.png"
                  alt="stocks-growth"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Money Analysis</h3>
              <p className="text-slate-400">Advanced Solana wallet analysis with AI-powered trading insights</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  width={48}
                  height={48}
                  src="https://img.icons8.com/ios/50/12B886/link--v1.png"
                  alt="link"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Solana Integration</h3>
              <p className="text-slate-400">Full Solana wallet connectivity with real-time blockchain data</p>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">JuliaOS Architecture</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Aethel AI serves as a modern web frontend that communicates with the JuliaOS backend through REST APIs.
            JuliaOS provides the core agent orchestration, strategy execution, and tool management capabilities, while
            Aethel AI delivers an intuitive interface for creating agents and interacting with them through real-time chat.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-teal-300 mb-6">Frontend Layer</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Next.js 15.4.2 with TypeScript for modern web development</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Tailwind CSS with Radix UI for accessible components</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Framer Motion for smooth animations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Zustand + React Context for state management</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-300 mb-6">JuliaOS Backend</h3>
              <p className="text-slate-300 mb-4 text-sm">
                The core agent framework with accompanying server and database infrastructure.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Julia Core (v1.11.4+) for agent orchestration and strategy execution</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">OpenAPI Server with auto-generated REST endpoints</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">PostgreSQL Database with Docker deployment support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Gemini AI 1.5 Pro integration for LLM chat capabilities</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">How Aethel AI Works</h2>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-6 lg:gap-2 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Agents",
                description: "Design AI agents with LLM Chat or Smart Money Analysis capabilities",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "Connect Wallet",
                description: "Link your Solana wallet for blockchain analysis and insights",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Analyze & Chat",
                description: "Interact with agents for wallet analysis and AI conversations",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              },
              {
                step: "04",
                title: "Get Insights",
                description: "Receive AI-powered trading insights and smart money analysis",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((step, index) => (
              <React.Fragment key={index}>
                <div className="text-center flex-shrink-0 w-full lg:w-48">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm px-2">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="flex items-center justify-center lg:mx-2 my-4 lg:my-0">
                    {/* Arrow for desktop (horizontal) */}
                    <svg className="hidden lg:block w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {/* Arrow for mobile (vertical) */}
                    <svg className="lg:hidden w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Why Choose Aethel AI */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Why Choose Aethel AI?</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-teal-300 mb-6">Enterprise-Grade Capabilities</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className="text-slate-300">Scalable architecture that grows with your needs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className="text-slate-300">Advanced security and privacy protection</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className="text-slate-300">Integration with existing business systems</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className="text-slate-300">24/7 autonomous operation capabilities</span>
                </li>
              </ul>
            </div>


          </div>
        </section>

        {/* Integrations */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Blockchain & API Integrations</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Aethel AI integrates with leading blockchain APIs and services to provide comprehensive
            wallet analysis and real-time market data for the Solana ecosystem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Solana Integration",
                description: "Full Solana wallet connectivity with multiple wallet adapters",
                services: ["Phantom", "Solflare", "Backpack", "Ledger"]
              },
              {
                title: "Blockchain Data",
                description: "Real-time blockchain data and transaction analysis",
                services: ["Helius RPC", "Web3.js", "Wallet Adapters"]
              },
              {
                title: "Market Data",
                description: "Live token prices and market analytics",
                services: ["Birdeye API", "Price Feeds", "Market Analytics"]
              }
            ].map((category, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-semibold text-teal-300 mb-3">{category.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="text-xs text-slate-500 bg-slate-800/50 rounded px-3 py-1 inline-block mr-2 border border-teal-500/30">
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}