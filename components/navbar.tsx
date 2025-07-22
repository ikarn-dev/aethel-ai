"use client";

import Link from "next/link";
import LoadingIcon from "./loading-icon";

export default function Navbar() {
    return (
        <header className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50">
            <nav className="bg-slate-900/30 backdrop-blur-md border border-teal-500/20 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl mx-auto flex justify-between items-center px-4 sm:px-8 py-2">
                <div className="flex items-center -space-x-1 sm:-space-x-2">
                    {/* Loading Icon as Logo (without rotation) - Responsive Size */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16">
                        <LoadingIcon size={48} className="w-12 h-12 sm:w-16 sm:h-16" animate={false} />
                    </div>

                    {/* Logo Text with Loading Font Style - Responsive */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="banana-grotesk text-lg sm:text-xl font-extrabold text-white uppercase tracking-wide transform scale-x-110 filter blur-[0.3px]"
                            style={{ textShadow: '0 0 1px rgba(0, 206, 209, 0.3)' }}>
                            AETHEL
                        </span>
                        <span className="playfair-display italic text-base sm:text-lg font-bold text-teal-300 lowercase"
                            style={{ letterSpacing: '-0.1em', fontStyle: 'italic' }}>
                            ai
                        </span>
                    </div>
                </div>

                <Link
                    href="/app"
                    className="banana-grotesk bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
                >
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                </Link>
            </nav>
        </header>
    );
}