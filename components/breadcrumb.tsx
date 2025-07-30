"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActiveNavigation } from '@/lib/navigation-context';
import { NavigationUtils } from '@/lib/navigation-utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  const { currentPath } = useActiveNavigation();

  // Generate breadcrumb items automatically if not provided
  const breadcrumbItems = items || NavigationUtils.generateBreadcrumbs(currentPath);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm text-gray-500", className)}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" aria-hidden="true" />
            )}
            {item.isActive ? (
              <span 
                className="font-medium text-gray-900"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                prefetch={true}
                className={cn(
                  "hover:text-gray-700 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 rounded-md px-1 py-0.5",
                  index === 0 && "flex items-center"
                )}
                aria-label={index === 0 ? "Go to home page" : `Go to ${item.label}`}
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" aria-hidden="true" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Export the breadcrumb item type for external use
export type { BreadcrumbItem };