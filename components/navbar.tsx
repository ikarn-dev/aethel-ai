"use client";

import Link from "next/link";
import LoadingIcon from "./loading-icon";

export default function Navbar() {
    return (
        <header className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50">
            <nav className="bg-slate-900/30 backdrop-blur-md border border-teal-500/20 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl mx-auto flex justify-between items-center px-4 sm:px-8 py-2">
                <div className="flex items-center">
                    {/* Larger Loading Icon as Logo (without rotation) */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12">
                        <LoadingIcon size={40} className="w-10 h-10 sm:w-12 sm:h-12" animate={false} />
                    </div>

                    {/* Brand Text: Aethel | AI - Smaller text size */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                            Aethel
                        </span>
                        <span className="text-sm sm:text-base font-light text-teal-400">
                            |
                        </span>
                        <span className="text-sm sm:text-base font-bold text-teal-400 italic">
                            AI
                        </span>
                    </div>
                </div>

                <Link
                    href="/app/agents"
                    prefetch={true}
                    className="banana-grotesk bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
                >
                    <span className="hidden sm:inline">Launch App</span>
                    <span className="sm:hidden">App</span>
                </Link>
            </nav>
        </header>
    );
}