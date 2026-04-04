import { Link as RouterLink } from 'react-router-dom';
import { Link, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <RouterLink
              to="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="bg-primary inline-flex h-10 w-10 items-center justify-center rounded-lg shadow-md">
                <Link className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-foreground text-xl font-bold">
                Bytesize
              </span>
            </RouterLink>

            <nav className="flex items-center gap-4">
              <RouterLink
                to="/history"
                className="text-muted-foreground hover:text-primary flex items-center gap-2 px-4 py-2 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
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
