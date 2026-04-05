import { useState } from 'react';
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Eye,
  MapPin,
} from 'lucide-react';

interface Visit {
  id: string;
  timestamp: number;
  location: string;
}

interface UrlMapping {
  id: string;
  longUrl: string;
  shortUrl: string;
  createdAt: number;
  title?: string;
  clicks: number;
  visits: Visit[];
}

const mockUrls: UrlMapping[] = [
  {
    id: 'url-1',
    title: 'Spring Launch Campaign',
    longUrl:
      'https://www.example.com/blog/spring-launch-campaign-announcement-and-feature-breakdown',
    shortUrl: 'sprng26',
    createdAt: 1712311200000,
    clicks: 14,
    visits: [
      {
        id: 'visit-1',
        timestamp: 1712314800000,
        location: 'San Francisco, CA',
      },
      {
        id: 'visit-2',
        timestamp: 1712318400000,
        location: 'New York, NY',
      },
      {
        id: 'visit-3',
        timestamp: 1712322000000,
        location: 'London, UK',
      },
    ],
  },
  {
    id: 'url-2',
    title: 'React Effects Guide',
    longUrl: 'https://react.dev/learn/you-might-not-need-an-effect',
    shortUrl: 'rctfx',
    createdAt: 1712293200000,
    clicks: 9,
    visits: [
      {
        id: 'visit-4',
        timestamp: 1712296800000,
        location: 'Berlin, Germany',
      },
      {
        id: 'visit-5',
        timestamp: 1712300400000,
        location: 'Toronto, Canada',
      },
    ],
  },
  {
    id: 'url-3',
    title: 'Tailwind Responsive Design',
    longUrl: 'https://tailwindcss.com/docs/responsive-design',
    shortUrl: 'twrsp',
    createdAt: 1712221200000,
    clicks: 5,
    visits: [
      {
        id: 'visit-6',
        timestamp: 1712224800000,
        location: 'Tokyo, Japan',
      },
    ],
  },
  {
    id: 'url-4',
    title: 'Q2 Internal Playbook',
    longUrl: 'https://docs.example.com/internal/q2-playbook',
    shortUrl: 'q2pb',
    createdAt: 1712134800000,
    clicks: 0,
    visits: [],
  },
];

export function Analytics() {
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());
  const urls = mockUrls;
  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true,
    });

  const sortedUrls = [...urls].sort((a, b) => b.clicks - a.clicks);
  const urlsCount = sortedUrls.length;
  const totalClicks = sortedUrls.reduce((sum, url) => sum + url.clicks, 0);
  const averageClicks = urlsCount > 0 ? Math.round(totalClicks / urlsCount) : 0;

  const toggleExpanded = (urlId: string) => {
    setExpandedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(urlId)) {
        next.delete(urlId);
      } else {
        next.add(urlId);
      }
      return next;
    });
  };

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
              Plaform Analytics
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
        <div className="space-y-4">
          {sortedUrls.map((url) => {
            const isExpanded = expandedUrls.has(url.id);
            const shortUrl = `${window.location.origin}/${url.shortUrl}`;

            return (
              <div
                key={url.id}
                className="border-border bg-card overflow-hidden rounded-xl border shadow-md"
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-3 md:gap-4">
                    <div className="min-w-0 flex-1">
                      {url.title && (
                        <h3
                          className="text-card-foreground mb-2 truncate text-base font-semibold"
                          title={url.title}
                        >
                          {url.title}
                        </h3>
                      )}

                      <div className="space-y-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="text-muted-foreground shrink-0 text-xs md:text-sm">
                            Short URL:
                          </span>
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 block min-w-0 flex-1 truncate text-xs md:text-sm"
                            title={shortUrl}
                          >
                            {shortUrl}
                          </a>
                        </div>

                        <div className="flex min-w-0 items-center gap-2">
                          <span className="text-muted-foreground shrink-0 text-xs md:text-sm">
                            Long URL:
                          </span>
                          <a
                            href={url.longUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 block min-w-0 flex-1 truncate text-xs md:text-sm"
                            title={url.longUrl}
                          >
                            {url.longUrl}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-primary flex items-center justify-end gap-1 text-lg font-bold md:text-2xl">
                        <Eye className="h-4 w-4 md:h-5 md:w-5" />
                        {url.clicks}
                      </div>
                      <p className="text-muted-foreground ml-auto w-fit text-xs">
                        clicks
                      </p>
                    </div>
                  </div>

                  {url.visits.length > 0 && (
                    <button
                      onClick={() => toggleExpanded(url.id)}
                      className="text-primary hover:text-primary/80 mt-3 inline-flex items-center gap-2 text-xs font-medium md:text-sm"
                      type="button"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Hide visit analytics
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4" />
                          Show visit analytics ({url.visits.length} visits)
                        </>
                      )}
                    </button>
                  )}
                </div>

                {isExpanded && url.visits.length > 0 && (
                  <div className="border-border bg-secondary/30 border-t p-4 md:p-6">
                    <h4 className="text-card-foreground mb-4 inline-flex items-center gap-2 text-sm font-semibold md:text-base">
                      <MapPin className="h-4 w-4" />
                      Visit Analytics
                    </h4>

                    <div className="max-h-80 space-y-2 overflow-y-auto">
                      {url.visits.map((visit) => (
                        <div
                          key={visit.id}
                          className="border-border bg-card flex items-center justify-between rounded-lg border p-3 md:p-4"
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <MapPin className="text-primary h-4 w-4" />
                            <span className="text-card-foreground text-xs font-medium md:text-sm">
                              {visit.location}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-xs md:text-sm">
                            {formatTimestamp(visit.timestamp)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-border bg-card rounded-xl border p-12 text-center shadow-md">
          <BarChart3 className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <p className="text-muted-foreground mb-2">
            No URLs in the platform yet
          </p>
          <a href="/" className="text-primary text-sm hover:opacity-80">
            Create the first shortened URL
          </a>
        </div>
      )}
    </div>
  );
}
