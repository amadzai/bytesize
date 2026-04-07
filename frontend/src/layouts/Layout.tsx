import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { BarChart3, Play, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import icon from '../assets/icon.png';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isUsageReport = location.pathname === '/usage-report';
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            },
            iconTheme: {
              primary: 'var(--primary-foreground)',
              secondary: 'var(--primary)',
            },
          },
          error: {
            style: {
              background: 'var(--error)',
              color: 'var(--primary-foreground)',
            },
            iconTheme: {
              primary: 'var(--primary-foreground)',
              secondary: 'var(--error)',
            },
          },
        }}
      />

      {/* Header */}
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
        {showDemoBanner && (
          <div className="bg-primary text-background border-border border-b">
            <div className="relative container mx-auto flex max-w-5xl items-center justify-center px-4 py-2">
              <a
                href="https://www.youtube.com/watch?v=q9ao-LVQBLE"
                onClick={() => setShowDemoBanner(false)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 text-center text-sm font-semibold underline underline-offset-2 transition-opacity hover:opacity-80 md:text-base"
              >
                <Play className="h-3.5 w-3.5 opacity-85 md:h-4 md:w-4" />
                <span>Click here to watch the demo!</span>
              </a>
              <button
                type="button"
                onClick={() => setShowDemoBanner(false)}
                aria-label="Close demo banner"
                className="absolute right-4 cursor-pointer rounded p-1 transition-opacity hover:opacity-80"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>
        )}
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <RouterLink
              to="/"
              className="group flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="inline-flex h-10 w-12 items-center justify-center">
                <img
                  src={icon}
                  alt="Bytesize logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span
                className={`text-lg font-bold transition-colors md:text-2xl ${
                  isHome
                    ? 'text-primary'
                    : 'text-foreground group-hover:text-primary'
                }`}
              >
                bytesize
              </span>
            </RouterLink>

            <nav className="flex items-center gap-4">
              <RouterLink
                to="/usage-report"
                className="group flex items-center gap-1.5 py-2"
              >
                <BarChart3
                  className={`h-5 w-5 transition-colors ${
                    isUsageReport
                      ? 'text-primary'
                      : 'text-foreground group-hover:text-primary'
                  }`}
                />
                <span
                  className={`text-sm font-bold transition-colors md:text-lg ${
                    isUsageReport
                      ? 'text-primary'
                      : 'text-foreground group-hover:text-primary'
                  }`}
                >
                  Usage Report
                </span>
              </RouterLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-background/80 border-border border-t backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="text-muted-foreground text-center text-xs md:text-sm">
            <p>© {new Date().getFullYear()} Bytesize. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
