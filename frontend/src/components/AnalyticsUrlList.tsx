import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, MapPin } from 'lucide-react';

export interface AnalyticsVisit {
  id: string;
  timestamp: number;
  location: string;
}

export interface AnalyticsUrlMapping {
  id: string;
  longUrl: string;
  shortUrl: string;
  createdAt: number;
  title?: string;
  clicks: number;
  visits: AnalyticsVisit[];
}

interface AnalyticsUrlListProps {
  urls: AnalyticsUrlMapping[];
}

export function AnalyticsUrlList({ urls }: AnalyticsUrlListProps) {
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true,
    });

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
    <div className="space-y-4">
      {urls.map((url) => {
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
  );
}
