"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  Users,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  BarChart3,
  Zap,
  HelpCircle,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LoadingIcon from './loading-icon';
import ComingSoonModal from './coming-soon-modal';
import { useMenuCollapse } from '@/lib/navigation-context';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  isDisabled?: boolean;
  badge?: string | number;
  comingSoonMessage?: string;
  category?: 'primary' | 'secondary' | 'future';
}

interface SideMenuProps {
  currentPath?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navigationItems: NavigationItem[] = [
  // Primary navigation items (currently available)
  {
    id: 'chat',
    label: 'Chat',
    href: '/app',
    icon: MessageCircle,
    category: 'primary',
  },
  {
    id: 'agents',
    label: 'Agents',
    href: '/app/agents',
    icon: Users,
    category: 'primary',
  },
  
  // Secondary navigation items (coming soon)
  {
    id: 'documents',
    label: 'Documents',
    href: '/app/documents',
    icon: FileText,
    isDisabled: true,
    category: 'secondary',
    comingSoonMessage: 'Document management and knowledge base features are coming soon. You\'ll be able to upload, organize, and search through your documents.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/app/analytics',
    icon: BarChart3,
    isDisabled: true,
    category: 'secondary',
    comingSoonMessage: 'Analytics dashboard will provide insights into your chat history, agent performance, and usage patterns.',
  },
  {
    id: 'automations',
    label: 'Automations',
    href: '/app/automations',
    icon: Zap,
    isDisabled: true,
    category: 'secondary',
    comingSoonMessage: 'Create automated workflows and triggers to streamline your AI interactions and boost productivity.',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/app/notifications',
    icon: Bell,
    isDisabled: true,
    category: 'secondary',
    comingSoonMessage: 'Stay updated with real-time notifications about agent activities, system updates, and important events.',
  },
  
  // Future navigation items (planned features)
  {
    id: 'settings',
    label: 'Settings',
    href: '/app/settings',
    icon: Settings,
    isDisabled: true,
    category: 'future',
    comingSoonMessage: 'Customize your experience with personalized settings, preferences, and account management options.',
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/app/help',
    icon: HelpCircle,
    isDisabled: true,
    category: 'future',
    comingSoonMessage: 'Access comprehensive help documentation, tutorials, and support resources to get the most out of the platform.',
  },
];

export default function SideMenu({
  onToggleCollapse
}: SideMenuProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');
  const [comingSoonModal, setComingSoonModal] = useState<{
    isOpen: boolean;
    item: NavigationItem | null;
  }>({ isOpen: false, item: null });
  const { isCollapsed: isMenuCollapsed, toggle: toggleMenuCollapse } = useMenuCollapse();

  // Announce navigation changes to screen readers
  const announceToScreenReader = (message: string) => {
    setAnnounceMessage(message);
    // Clear the message after a short delay to allow for re-announcements
    setTimeout(() => setAnnounceMessage(''), 1000);
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    const wasOpen = isMobileMenuOpen;
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Announce menu state change to screen readers
    announceToScreenReader(wasOpen ? 'Navigation menu closed' : 'Navigation menu opened');
    
    // Focus management for accessibility
    if (!wasOpen) {
      // Menu is opening - focus the first navigation item after animation
      setTimeout(() => {
        const firstMenuItem = document.querySelector('#mobile-navigation [role="menuitem"]:not([disabled])') as HTMLElement;
        firstMenuItem?.focus();
      }, 100);
    } else {
      // Menu is closing - return focus to hamburger button
      setTimeout(() => {
        const hamburgerButton = document.querySelector('[aria-controls="mobile-navigation"]') as HTMLElement;
        hamburgerButton?.focus();
      }, 100);
    }
  };

  // Handle desktop menu collapse - use context function
  const handleToggleCollapse = () => {
    toggleMenuCollapse();
    onToggleCollapse?.();
    // Announce menu collapse state change to screen readers
    announceToScreenReader(isMenuCollapsed ? 'Navigation menu expanded' : 'Navigation menu collapsed');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      announceToScreenReader('Navigation menu closed due to page change');
    }
  }, [pathname, isMobileMenuOpen]);

  // Focus trap for mobile menu accessibility
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const mobileMenu = document.getElementById('mobile-navigation');
    if (!mobileMenu) return;

    // Get all focusable elements within the mobile menu
    const getFocusableElements = () => {
      return Array.from(
        mobileMenu.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];
    };

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add focus trap listener
    document.addEventListener('keydown', handleFocusTrap);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isMobileMenuOpen]);

  // Touch gesture support for mobile menu
  useEffect(() => {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let menuElement: HTMLElement | null = null;
    let startTime = 0;
    let hasTriggeredHaptic = false;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      currentX = touch.clientX;
      startTime = Date.now();
      isDragging = true;
      
      // Get the mobile menu element
      menuElement = document.getElementById('mobile-navigation');
      
      // Only handle gestures near the left edge when menu is closed, or anywhere when menu is open
      const isNearLeftEdge = startX < 30; // Increased touch area for better UX
      const shouldHandle = isMobileMenuOpen || isNearLeftEdge;
      
      if (!shouldHandle) {
        isDragging = false;
        return;
      }
      
      // Prevent default to avoid scrolling when menu is open
      if (isMobileMenuOpen) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      currentX = touch.clientX;
      const deltaX = currentX - startX;
      
      if (menuElement) {
        // Calculate transform based on gesture
        let transform = 0;
        
        if (isMobileMenuOpen) {
          // Menu is open, allow swiping left to close
          if (deltaX < 0) {
            transform = Math.max(deltaX, -256); // 256px is menu width
            menuElement.style.transform = `translateX(${transform}px)`;
          }
        } else {
          // Menu is closed, allow swiping right to open
          if (deltaX > 0) {
            transform = Math.min(deltaX - 256, 0); // Start from -256px (closed position)
            menuElement.style.transform = `translateX(${transform}px)`;
          }
        }
        
        // Update overlay opacity based on menu position
        const overlay = document.querySelector('.lg\\:hidden.fixed.inset-0.bg-black\\/50') as HTMLElement;
        if (overlay) {
          const progress = Math.abs(transform) / 256;
          const opacity = isMobileMenuOpen ? (1 - progress) : (1 - progress);
          overlay.style.opacity = opacity.toString();
        }
        
        // Trigger haptic feedback at threshold points
        const hapticThreshold = 128; // Half the menu width
        if (!hasTriggeredHaptic && Math.abs(transform) > hapticThreshold) {
          hasTriggeredHaptic = true;
          // Trigger haptic feedback if available
          if ('vibrate' in navigator) {
            navigator.vibrate(10); // Short vibration
          }
        }
      }
      
      // Prevent scrolling when dragging
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      isDragging = false;
      hasTriggeredHaptic = false; // Reset haptic flag for next gesture
      const deltaX = currentX - startX;
      const deltaTime = Date.now() - startTime;
      const velocity = Math.abs(deltaX) / deltaTime; // pixels per millisecond
      
      // Dynamic threshold based on velocity for better UX
      const baseThreshold = 100;
      const velocityThreshold = 0.3; // minimum velocity for quick swipes
      const threshold = velocity > velocityThreshold ? baseThreshold * 0.6 : baseThreshold;
      
      if (menuElement) {
        // Reset transform with transition
        menuElement.style.transition = 'transform 0.3s ease-out';
        menuElement.style.transform = '';
        
        // Reset overlay
        const overlay = document.querySelector('.lg\\:hidden.fixed.inset-0.bg-black\\/50') as HTMLElement;
        if (overlay) {
          overlay.style.opacity = '';
        }
        
        // Remove transition after animation completes
        setTimeout(() => {
          if (menuElement) {
            menuElement.style.transition = '';
          }
        }, 300);
      }
      
      // Determine if we should toggle the menu based on swipe distance, direction, and velocity
      const shouldToggle = Math.abs(deltaX) > threshold || velocity > velocityThreshold;
      
      if (shouldToggle) {
        if (isMobileMenuOpen && deltaX < -threshold) {
          // Swipe left to close
          setIsMobileMenuOpen(false);
        } else if (!isMobileMenuOpen && deltaX > threshold) {
          // Swipe right to open
          setIsMobileMenuOpen(true);
        }
      }
    };

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileMenuOpen]);

  // Enhanced keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape key to close mobile menu
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        // Return focus to hamburger button
        setTimeout(() => {
          const hamburgerButton = document.querySelector('[aria-controls="mobile-navigation"]') as HTMLElement;
          hamburgerButton?.focus();
        }, 100);
        event.preventDefault();
        return;
      }

      // Handle keyboard navigation within menu
      if (event.target instanceof HTMLElement && event.target.closest('[role="menu"]')) {
        const currentMenu = event.target.closest('[role="menu"]');
        const menuItems = Array.from(
          currentMenu?.querySelectorAll('[role="menuitem"]:not([disabled]):not([tabindex="-1"])') || []
        ) as HTMLElement[];
        
        if (menuItems.length === 0) return;
        
        const target = event.target as HTMLElement;
        const currentIndex = menuItems.findIndex(item => {
          return item === target || item.contains(target) || target.closest('[role="menuitem"]') === item;
        });
        
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight': // Support both arrow keys for better UX
            event.preventDefault();
            const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % menuItems.length;
            menuItems[nextIndex]?.focus();
            break;
          case 'ArrowUp':
          case 'ArrowLeft': // Support both arrow keys for better UX
            event.preventDefault();
            const prevIndex = currentIndex === -1 ? menuItems.length - 1 : 
                             currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
            menuItems[prevIndex]?.focus();
            break;
          case 'Home':
            event.preventDefault();
            menuItems[0]?.focus();
            break;
          case 'End':
            event.preventDefault();
            menuItems[menuItems.length - 1]?.focus();
            break;
          case 'Enter':
          case ' ': // Space key
            // Let the default behavior handle activation for links and buttons
            break;
          case 'Tab':
            // Allow normal tab behavior but close mobile menu if tabbing away
            if (isMobileMenuOpen && !event.shiftKey) {
              // Check if next focusable element is outside the menu
              const nextFocusable = document.querySelector('[tabindex]:not([tabindex="-1"]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], area[href], iframe, object, embed, [contenteditable]') as HTMLElement;
              if (nextFocusable && !currentMenu?.contains(nextFocusable)) {
                setTimeout(() => setIsMobileMenuOpen(false), 0);
              }
            }
            break;
        }
      }

      // Handle keyboard shortcuts for menu toggle
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        if (window.innerWidth < 1024) { // Mobile breakpoint
          toggleMobileMenu();
        } else {
          handleToggleCollapse();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, toggleMobileMenu, handleToggleCollapse]);

  // Determine active navigation item
  const getActiveItem = (href: string) => {
    if (!pathname) return false; // Handle null pathname
    if (href === '/app' && pathname === '/app') return true;
    if (href !== '/app' && pathname.startsWith(href)) return true;
    return false;
  };

  // Group navigation items by category for better organization
  const groupedNavigationItems = React.useMemo(() => {
    const primary = navigationItems.filter(item => item.category === 'primary');
    const secondary = navigationItems.filter(item => item.category === 'secondary');
    const future = navigationItems.filter(item => item.category === 'future');
    
    return { primary, secondary, future };
  }, []);

  // Navigation item component
  const NavigationItem = ({ item }: { item: NavigationItem }) => {
    const isActive = getActiveItem(item.href);
    const IconComponent = item.icon;

    const itemContent = (
      <>
        <IconComponent className={cn(
          "w-5 h-5 transition-all duration-200",
          isActive && "text-teal-400",
          item.isDisabled && "opacity-50"
        )} />
        {!isMenuCollapsed && (
          <span className={cn(
            "font-medium transition-all duration-200",
            isActive && "text-white",
            item.isDisabled && "opacity-50"
          )}>
            {item.label}
          </span>
        )}
        {item.badge && !isMenuCollapsed && (
          <Badge 
            variant="secondary" 
            className={cn(
              "ml-auto transition-all duration-200",
              isActive 
                ? "bg-teal-500 text-white hover:bg-teal-600" 
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            )}
          >
            {item.badge}
          </Badge>
        )}
      </>
    );

    if (item.isDisabled) {
      const handleDisabledClick = () => {
        setComingSoonModal({ isOpen: true, item });
        announceToScreenReader(`${item.label} feature is coming soon`);
      };

      const disabledButton = (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-slate-400 hover:text-slate-300 hover:bg-slate-800/30 transition-all duration-200 cursor-pointer",
            isMenuCollapsed && "justify-center px-2"
          )}
          onClick={handleDisabledClick}
          aria-label={`${item.label} - Coming Soon (click for more info)`}
          aria-describedby={`${item.id}-description`}
          role="menuitem"
        >
          {itemContent}
          <span id={`${item.id}-description`} className="sr-only">
            This feature is not yet available. Click to learn more.
          </span>
        </Button>
      );

      if (isMenuCollapsed) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {disabledButton}
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                <p>{item.label} (Coming Soon)</p>
                <p className="text-xs text-slate-400 mt-1">Click for details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return disabledButton;
    }

    const activeButton = (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start transition-all duration-200 group relative",
          "hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white",
          "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
          isActive && "bg-slate-800/70 text-white shadow-lg",
          isActive && "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-teal-500 before:rounded-r",
          !isActive && "text-slate-300",
          isMenuCollapsed && "justify-center px-2"
        )}
        asChild
      >
        <Link 
          href={item.href}
          prefetch={true}
          aria-label={isActive ? `${item.label} (current page)` : item.label}
          aria-current={isActive ? "page" : undefined}
          role="menuitem"
          className="flex items-center w-full h-full"
          onClick={() => {
            // Announce navigation to screen readers
            if (!isActive) {
              announceToScreenReader(`Navigating to ${item.label}`);
            }
          }}
        >
          {itemContent}
        </Link>
      </Button>
    );

    if (isMenuCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {activeButton}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return activeButton;
  };

  // Mobile hamburger button
  const MobileMenuButton = () => (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMobileMenu}
      className={cn(
        "lg:hidden fixed top-4 left-4 z-50 transition-all duration-300",
        "bg-slate-900/90 backdrop-blur-md border-teal-500/20 text-white",
        "hover:bg-slate-800 hover:text-white hover:border-teal-400/40",
        "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
        "active:scale-95 transform"
      )}
      aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-navigation"
    >
      <div className="relative w-6 h-6">
        <Menu className={cn(
          "w-6 h-6 absolute inset-0 transition-all duration-200",
          isMobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
        )} />
        <X className={cn(
          "w-6 h-6 absolute inset-0 transition-all duration-200",
          isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
        )} />
      </div>
    </Button>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <aside 
      id="navigation"
      className={cn(
        "hidden lg:flex flex-col h-screen bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300",
        isMenuCollapsed ? "w-16" : "w-64"
      )}
      aria-label="Main navigation"
      role="navigation"
    >
      {/* Header with logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {!isMenuCollapsed && (
          <Link 
            href="/" 
            prefetch={true}
            className={cn(
              "flex items-center space-x-2 transition-all duration-200",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
            )}
            aria-label="Go to home page"
          >
            <div className="w-8 h-8">
              <LoadingIcon size={32} className="w-8 h-8" animate={false} />
            </div>
            <div className="flex items-center space-x-1">
              <span className="banana-grotesk text-sm font-extrabold text-white uppercase tracking-wide">
                AETHEL
              </span>
              <span className="playfair-display italic text-sm font-bold text-teal-300 lowercase">
                ai
              </span>
            </div>
          </Link>
        )}
        {isMenuCollapsed && (
          <Link 
            href="/" 
            prefetch={true}
            className={cn(
              "flex justify-center w-full transition-all duration-200",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
            )}
            aria-label="Go to home page"
          >
            <div className="w-8 h-8">
              <LoadingIcon size={32} className="w-8 h-8" animate={false} />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleCollapse}
          className={cn(
            "text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
          )}
          aria-label={isMenuCollapsed ? "Expand navigation menu" : "Collapse navigation menu"}
        >
          <div className="relative w-4 h-4">
            <ChevronRight className={cn(
              "w-4 h-4 absolute inset-0 transition-all duration-200",
              isMenuCollapsed ? "opacity-100 rotate-0" : "opacity-0 rotate-180"
            )} />
            <ChevronLeft className={cn(
              "w-4 h-4 absolute inset-0 transition-all duration-200",
              isMenuCollapsed ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
            )} />
          </div>
        </Button>
      </div>

      {/* Navigation items */}
      <nav 
        className="flex-1 px-3 py-4" 
        role="menu"
        aria-label="Main navigation menu"
      >
        {/* Primary navigation items */}
        <div className="space-y-1 mb-4">
          {groupedNavigationItems.primary.map((item) => (
            <NavigationItem key={item.id} item={item} />
          ))}
        </div>

        {/* Secondary navigation items (if not collapsed) */}
        {groupedNavigationItems.secondary.length > 0 && (
          <>
            {!isMenuCollapsed && (
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Coming Soon
                </p>
              </div>
            )}
            <div className="space-y-1 mb-4">
              {groupedNavigationItems.secondary.map((item) => (
                <NavigationItem key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        {/* Future navigation items (if not collapsed) */}
        {groupedNavigationItems.future.length > 0 && (
          <>
            {!isMenuCollapsed && (
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Planned
                </p>
              </div>
            )}
            <div className="space-y-1">
              {groupedNavigationItems.future.map((item) => (
                <NavigationItem key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </nav>

      <Separator className="bg-slate-700/50" />

      {/* User profile section */}
      <div className="p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-auto p-3 text-white hover:bg-slate-800/50 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
            isMenuCollapsed && "justify-center px-2"
          )}
          aria-label="User profile"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback className="bg-teal-500 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {!isMenuCollapsed && (
            <div className="flex-1 min-w-0 ml-3 text-left">
              <p className="text-sm font-medium text-white truncate">User</p>
              <p className="text-xs text-muted-foreground truncate">user@example.com</p>
            </div>
          )}
        </Button>

        {!isMenuCollapsed && (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start mt-2 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            )}
            asChild
          >
            <Link href="/" prefetch={true} aria-label="Return to home page">
              <LogOut className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:translate-x-1" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </Button>
        )}
      </div>
    </aside>
  );

  // Mobile sidebar overlay
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside 
        id="mobile-navigation"
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 transform transition-all duration-300 z-50 shadow-2xl",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <Link 
            href="/" 
            prefetch={true}
            className={cn(
              "flex items-center space-x-2 transition-all duration-200",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
            )}
            onClick={toggleMobileMenu}
            aria-label="Go to home page"
          >
            <div className="w-8 h-8">
              <LoadingIcon size={32} className="w-8 h-8" animate={false} />
            </div>
            <div className="flex items-center space-x-1">
              <span className="banana-grotesk text-sm font-extrabold text-white uppercase tracking-wide">
                AETHEL
              </span>
              <span className="playfair-display italic text-sm font-bold text-teal-300 lowercase">
                ai
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className={cn(
              "text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            )}
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation items */}
        <nav 
          className="flex-1 px-3 py-4" 
          role="menu"
          aria-label="Mobile navigation menu"
        >
          {/* Primary navigation items */}
          <div className="space-y-1 mb-4">
            {groupedNavigationItems.primary.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </div>

          {/* Secondary navigation items */}
          {groupedNavigationItems.secondary.length > 0 && (
            <>
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Coming Soon
                </p>
              </div>
              <div className="space-y-1 mb-4">
                {groupedNavigationItems.secondary.map((item) => (
                  <NavigationItem key={item.id} item={item} />
                ))}
              </div>
            </>
          )}

          {/* Future navigation items */}
          {groupedNavigationItems.future.length > 0 && (
            <>
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Planned
                </p>
              </div>
              <div className="space-y-1">
                {groupedNavigationItems.future.map((item) => (
                  <NavigationItem key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </nav>

        <Separator className="bg-slate-700/50" />

        {/* User profile section */}
        <div className="p-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-auto p-3 text-white hover:bg-slate-800/50 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            )}
            aria-label="User profile"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="bg-teal-500 text-white">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 ml-3 text-left">
              <p className="text-sm font-medium text-white truncate">User</p>
              <p className="text-xs text-muted-foreground truncate">user@example.com</p>
            </div>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start mt-2 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            )}
            asChild
          >
            <Link href="/" prefetch={true} onClick={toggleMobileMenu} aria-label="Return to home page">
              <LogOut className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:translate-x-1" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announceMessage}
      </div>

      <MobileMenuButton />
      <DesktopSidebar />
      <MobileSidebar />
      
      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonModal.isOpen}
        onClose={() => setComingSoonModal({ isOpen: false, item: null })}
        featureName={comingSoonModal.item?.label || ''}
        description={comingSoonModal.item?.comingSoonMessage || 'This feature is coming soon!'}
        icon={comingSoonModal.item?.icon}
      />
    </>
  );
}