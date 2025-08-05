"use client";

import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Aethel AI and how does it work?",
      answer: "Aethel AI is a blockchain analysis platform powered by the JuliaOS framework. It provides AI-driven Solana wallet analysis, smart money insights, and intelligent agent management through an intuitive interface that simplifies complex blockchain data."
    },
    {
      question: "How do I analyze a Solana wallet?",
      answer: "Simply create a Smart Money Analysis agent, start it, and enter any Solana wallet address. Aethel AI will analyze portfolio composition, trading metrics, P&L calculations, risk scoring, and provide AI-powered recommendations using real-time data from Helius RPC."
    },
    {
      question: "What makes Aethel AI's analysis different?",
      answer: "Our platform combines high-performance Julia computing with Gemini AI for comprehensive analysis. We provide behavioral pattern recognition, risk assessment scoring, trading frequency analysis, and personalized investment insights that go beyond basic wallet tracking."
    },
    {
      question: "How do I create and manage AI agents?",
      answer: "Use our one-click agent creation system to deploy LLM Chat agents or Smart Money Analysis agents. Monitor their status in real-time, start/stop operations, and manage multiple agents through our intuitive dashboard with batch operations support."
    },
    {
      question: "Is my wallet data secure and private?",
      answer: "Yes, Aethel AI only uses publicly available blockchain data and never requires private keys or wallet connections. All analysis is read-only, and we implement enterprise-grade security with the JuliaOS framework's Rust security layer for cryptographic operations."
    },
    {
      question: "What blockchain networks does Aethel AI support?",
      answer: "Currently, Aethel AI specializes in Solana blockchain analysis with deep integration through Helius RPC for real-time data, transaction history, DeFi positions, and NFT holdings. Our focus on Solana allows us to provide the most comprehensive analysis possible."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6" style={{ fontFamily: '"Poppins", sans-serif' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-teal-200/80">
            Everything you need to know about Aethel AI
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-teal-500/10 backdrop-blur-md border border-teal-400/30 rounded-xl overflow-hidden hover:border-teal-400/50 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-inset"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg 
                    className={`w-5 h-5 text-teal-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6">
                  <div className="border-t border-teal-400/20 pt-4">
                    <p className="text-teal-200/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}