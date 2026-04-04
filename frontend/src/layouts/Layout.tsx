import { Link as RouterLink } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import icon from '../assets/icon.png';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <RouterLink
              to="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="inline-flex h-10 w-12 items-center justify-center">
                <img
                  src={icon}
                  alt="Bytesize logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-foreground text-2xl font-bold">
                bytesize
              </span>
            </RouterLink>

            <nav className="flex items-center gap-4">
              <RouterLink
                to="/history"
                className="group flex items-center gap-2 py-2"
              >
                <BarChart3 className="text-foreground h-6 w-6 transition-colors group-hover:text-primary" />
                <span className="text-foreground text-xl font-bold transition-colors group-hover:text-primary">
                  Analytics
                </span>
              </RouterLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
