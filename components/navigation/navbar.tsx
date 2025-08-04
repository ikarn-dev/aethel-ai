"use client";

import Link from "next/link";
import LoadingIcon from "../ui/common/loading-icon";
import { WalletConnectButton } from "../wallet/wallet-connect-button";
import { useWallet } from "../../hooks/use-wallet";

export default function Navbar() {
    const { connected, connecting, publicKey, formatAddress } = useWallet();

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

                <div className="flex items-center gap-3">
                    {/* Connect Wallet / Launch App Button */}
                    {connected ? (
                        <Link
                            href="/app/agents"
                            prefetch={true}
                            className="banana-grotesk bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
                        >
                            <span className="hidden sm:inline">Launch App</span>
                            <span className="sm:hidden">App</span>
                        </Link>
                    ) : (
                        <>
                            {/* Desktop Connect Wallet Button */}
                            <div className="hidden sm:block">
                                <Link
                                    href="/app/agents"
                                    prefetch={true}
                                    className="text-xs px-3 py-1.5 border border-teal-400/50 text-teal-100 hover:bg-teal-500/10 hover:border-teal-400 backdrop-blur-sm rounded-lg transition-all duration-200 inline-flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Connect Wallet</span>
                                </Link>
                            </div>

                            {/* Mobile Connect Wallet Button */}
                            <div className="sm:hidden">
                                <Link
                                    href="/app/agents"
                                    prefetch={true}
                                    className="text-xs px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 inline-flex items-center space-x-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Connect</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}