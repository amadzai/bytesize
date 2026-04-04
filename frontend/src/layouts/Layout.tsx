import { Link as RouterLink } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import icon from '../assets/icon.png';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
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
              <span className="text-foreground group-hover:text-primary text-2xl font-bold transition-colors">
                bytesize
              </span>
            </RouterLink>

            <nav className="flex items-center gap-4">
              <RouterLink
                to="/history"
                className="group flex items-center gap-2 py-2"
              >
                <BarChart3 className="text-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                <span className="text-foreground group-hover:text-primary text-lg font-bold transition-colors">
                  Analytics
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-muted-foreground text-center text-sm">
            <p>
              © {new Date().getFullYear()} Bytesize. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
