import { BarChart3 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AnalyticsUrlList,
  type AnalyticsUrlMapping,
} from '../components/AnalyticsUrlList';

export function Analytics() {
  const urls: AnalyticsUrlMapping[] = [];

  const sortedUrls = [...urls].sort((a, b) => b.clicks - a.clicks);
  const urlsCount = sortedUrls.length;
  const totalClicks = sortedUrls.reduce((sum, url) => sum + url.clicks, 0);
  const averageClicks = urlsCount > 0 ? Math.round(totalClicks / urlsCount) : 0;

  return (
    <div className="container mx-auto max-w-5xl px-6 py-12 md:px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-lg">
            <BarChart3 className="text-primary-foreground h-6 w-6" />
          </div>
          <div>
            <h1 className="text-foreground text-xl font-bold md:text-3xl">
              Platform Analytics
            </h1>
            <p className="text-muted-foreground text-xs md:text-base">
              View all shortened URLs and their visit analytics
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-6 shadow-md">
          <p className="text-muted-foreground mb-1 text-sm">Total URLs</p>
          <p className="text-primary text-3xl font-bold">{urlsCount}</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-6 shadow-md">
          <p className="text-muted-foreground mb-1 text-sm">Total Clicks</p>
          <p className="text-primary text-3xl font-bold">{totalClicks}</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-6 shadow-md">
          <p className="text-muted-foreground mb-1 text-sm">
            Avg. Clicks per URL
          </p>
          <p className="text-primary text-3xl font-bold">{averageClicks}</p>
        </div>
      </div>

      {/* URL List */}
      {sortedUrls.length > 0 ? (
        <AnalyticsUrlList urls={sortedUrls} />
      ) : (
        <div className="border-border bg-card rounded-xl border p-12 text-center shadow-md">
          <BarChart3 className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <p className="text-muted-foreground mb-2">
            No URLs in the platform yet
          </p>
          <RouterLink to="/" className="text-primary text-sm hover:opacity-80">
            Create the first shortened URL
          </RouterLink>
        </div>
      )}
    </div>
  );
}
