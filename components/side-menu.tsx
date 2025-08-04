"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  Users,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}



const navigationItems: NavigationItem[] = [
  {
    id: 'agents',
    label: 'Agents',
    href: '/app/agents',
    icon: Users,
  },
  {
    id: 'chat',
    label: 'Chat',
    href: '/app',
    icon: MessageCircle,
  },
];

export default function SideMenu() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Determine active navigation item
  const isActiveItem = (href: string) => {
    if (!pathname) return false;
    if (href === '/app' && pathname === '/app') return true;
    if (href !== '/app' && pathname.startsWith(href)) return true;
    return false;
  };

  // Logo component
  const Logo = ({ onClick }: { onClick?: () => void }) => (
    <Link
      href="/"
      prefetch={true}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 transition-all duration-200 rounded-lg p-2",
        "hover:bg-slate-800/50 focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      )}
      aria-label="Go to home page"
    >
      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
        <Image
          src="/assets/logo.png"
          alt="Aethel AI Logo"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
      </div>
      <span className="text-lg font-bold text-white tracking-wide">
        Aethel
      </span>
      <span className="text-lg font-light text-teal-400">|</span>
      <span className="text-lg font-bold text-teal-400 italic">AI</span>
    </Link>
  );

  // Navigation item component
  const NavigationItem = ({
    item,
    onClick
  }: {
    item: NavigationItem;
    onClick?: () => void;
  }) => {
    const isActive = isActiveItem(item.href);
    const IconComponent = item.icon;

    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start transition-all duration-200 relative group px-4 py-3 h-auto",
          "hover:bg-slate-800/50 hover:text-white",
          "focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
          isActive && [
            "bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-white border-l-2 border-teal-400",
            "shadow-lg shadow-teal-500/10"
          ]
        )}
        asChild
      >
        <Link
          href={item.href}
          prefetch={true}
          onClick={onClick}
          aria-label={isActive ? `${item.label} (current page)` : item.label}
          aria-current={isActive ? "page" : undefined}
          className="flex items-center gap-3 w-full"
        >
          <IconComponent
            className={cn(
              "w-5 h-5 shrink-0 transition-colors",
              isActive ? "text-teal-400" : "text-gray-400 group-hover:text-white"
            )}
          />
          <span className={cn(
            "font-medium transition-colors truncate",
            isActive ? "text-white" : "text-gray-300 group-hover:text-white"
          )}>
            {item.label}
          </span>
        </Link>
      </Button>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMobileMenu}
        className={cn(
          "fixed top-4 left-4 z-50 lg:hidden",
          "bg-slate-900/90 backdrop-blur-md border-slate-700/50 shadow-lg text-white",
          "hover:bg-slate-800 hover:text-white hover:border-teal-500/50",
          "focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        )}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col h-screen w-64 bg-slate-900 border-r border-slate-700/50"
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <aside
          className={cn(
            "lg:hidden fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 z-50 shadow-xl",
            "transform transition-transform duration-300 ease-in-out"
          )}
          aria-label="Mobile navigation"
          role="navigation"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <Logo onClick={() => setIsMobileMenuOpen(false)} />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className={cn(
                "text-gray-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              )}
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </div>
          </nav>
        </aside>
      )}
    </>
  );
}