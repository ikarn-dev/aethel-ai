import type { Metadata } from "next";
import SideMenu from "@/components/navigation/side-menu";
import { NavigationProvider } from "@/lib/navigation-context";
import BrowserNavigationInit from "@/components/navigation/browser-navigation-init";
import { ErrorBoundary } from "@/components/error-handling/error-boundary";
import NavigationErrorFallback from "@/components/navigation/navigation-error-fallback";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Aethel AI - Agent Management",
  description: "Manage your AI agents, create new ones, and interact with them through an intuitive interface.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ErrorBoundary fallback={<NavigationErrorFallback />}>
        <NavigationProvider>
          <BrowserNavigationInit />
          
          {/* Skip Navigation Links */}
          <div className="sr-only focus-within:not-sr-only">
            <a
              href="#main-content"
              className="fixed top-4 left-4 z-[100] bg-slate-900 text-white px-4 py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
            >
              Skip to main content
            </a>
            <a
              href="#navigation"
              className="fixed top-4 left-32 z-[100] bg-slate-900 text-white px-4 py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
            >
              Skip to navigation
            </a>
          </div>

          <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Side Menu Navigation */}
            <ErrorBoundary fallback={<NavigationErrorFallback />}>
              <SideMenu />
            </ErrorBoundary>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
              {/* Content wrapper - removed top padding that was causing white space */}
              <main 
                id="main-content"
                className="flex-1 overflow-y-auto"
                role="main"
                aria-label="Main content"
              >
                <div className="h-full">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </div>
              </main>
            </div>
          </div>
        </NavigationProvider>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}