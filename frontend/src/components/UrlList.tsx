import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, MapPin } from 'lucide-react';
import { urlApi } from '../api/urlApi';
import { getApiErrorMessage } from '../utils/errorMessages';
import { BACKEND_REDIRECT_URL } from '../utils/constants';
import type { AnalyticsUrlMapping, AnalyticsVisit } from '../types/analytics';

interface UrlVisitState {
  visits: AnalyticsVisit[];
  isLoading: boolean;
  hasLoaded: boolean;
  hasMore: boolean;
  nextCursor: string | number | null;
  error?: string;
}

const defaultVisitState: UrlVisitState = {
  visits: [],
  isLoading: false,
  hasLoaded: false,
  hasMore: false,
  nextCursor: null,
};

interface UrlListProps {
  urls: AnalyticsUrlMapping[];
}

export function UrlList({ urls }: UrlListProps) {
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());
  const [visitStateByUrl, setVisitStateByUrl] = useState<
    Record<string, UrlVisitState>
  >({});

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true,
    });

  const getVisitState = (urlId: string): UrlVisitState =>
    visitStateByUrl[urlId] ?? defaultVisitState;

  const updateVisitState = (urlId: string, update: Partial<UrlVisitState>) => {
    setVisitStateByUrl((previous) => ({
      ...previous,
      [urlId]: { ...getVisitState(urlId), ...previous[urlId], ...update },
    }));
  };

  const loadVisits = async (
    url: AnalyticsUrlMapping,
    options?: { cursor?: string | number | null; append?: boolean },
  ) => {
    const cursor = options?.cursor;
    const append = options?.append ?? false;
    const state = getVisitState(url.id);

    if (state.isLoading) {
      return;
    }

    if (append && (cursor === undefined || cursor === null)) {
      return;
    }

    updateVisitState(url.id, { isLoading: true, error: undefined });

    try {
      const response = await urlApi.analytics(url.shortUrl, cursor);
      const mappedVisits: AnalyticsVisit[] = response.data.map(
        (visit, index) => ({
          key: `${visit.created_at}-${visit.location ?? 'unknown'}-${index}`,
          timestamp: Date.parse(visit.created_at),
          location: visit.location || 'Unknown Location',
        }),
      );

      setVisitStateByUrl((previous) => {
        const current = previous[url.id] ?? defaultVisitState;
        return {
          ...previous,
          [url.id]: {
            visits: append
              ? [...current.visits, ...mappedVisits]
              : mappedVisits,
            isLoading: false,
            hasLoaded: true,
            hasMore: response.pagination.has_more,
            nextCursor: response.pagination.next,
          },
        };
      });
    } catch (error) {
      updateVisitState(url.id, {
        isLoading: false,
        error: getApiErrorMessage(
          error,
          'Unable to load visit analytics. Please try again.',
        ),
      });
    }
  };

  const toggleExpanded = (url: AnalyticsUrlMapping) => {
    setExpandedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url.id)) {
        next.delete(url.id);
      } else {
        next.add(url.id);
      }
      return next;
    });

    if (!getVisitState(url.id).hasLoaded) {
      void loadVisits(url);
    }
  };

  return (
    <div className="space-y-4">
      {urls.map((url) => {
        const isExpanded = expandedUrls.has(url.id);
        const shortUrl = `${BACKEND_REDIRECT_URL}/${url.shortUrl}`;
        const { visits, isLoading, hasLoaded, hasMore, nextCursor, error } =
          getVisitState(url.id);
        const canShowAnalytics = url.clicks > 0;

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

                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-muted-foreground shrink-0 text-xs md:text-sm">
                        Created:
                      </span>
                      <span className="text-card-foreground min-w-0 flex-1 truncate text-xs md:text-sm">
                        {url.createdAt ? formatTimestamp(url.createdAt) : 'N/A'}
                      </span>
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

              {canShowAnalytics && (
                <button
                  onClick={() => toggleExpanded(url)}
                  className="text-primary hover:text-primary/80 mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-medium md:text-sm"
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
                      Show visit analytics
                    </>
                  )}
                </button>
              )}
            </div>

            {isExpanded && canShowAnalytics && (
              <div className="border-border bg-secondary/30 border-t p-4 md:p-6">
                <h4 className="text-card-foreground mb-4 inline-flex items-center gap-2 text-sm font-semibold md:text-base">
                  <MapPin className="h-4 w-4" />
                  Visit Analytics
                </h4>

                <div
                  className="max-h-80 space-y-2 overflow-y-auto"
                  onScroll={(event) => {
                    const element = event.currentTarget;
                    const nearBottom =
                      element.scrollTop + element.clientHeight >=
                      element.scrollHeight - 40;

                    if (nearBottom && hasMore && !isLoading) {
                      void loadVisits(url, {
                        cursor: nextCursor,
                        append: true,
                      });
                    }
                  }}
                >
                  {visits.map((visit) => (
                    <div
                      key={visit.key}
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

                  {isLoading && (
                    <p className="text-muted-foreground px-1 py-2 text-xs md:text-sm">
                      Loading visit analytics...
                    </p>
                  )}

                  {error && (
                    <div className="space-y-2 px-1 py-2">
                      <p className="text-error text-xs md:text-sm">{error}</p>
                      <button
                        type="button"
                        className="text-primary hover:text-primary/80 cursor-pointer text-xs font-medium md:text-sm"
                        onClick={() =>
                          void loadVisits(url, {
                            cursor: hasLoaded ? nextCursor : undefined,
                            append: hasLoaded,
                          })
                        }
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!isLoading && hasLoaded && !error && visits.length === 0 && (
                    <p className="text-muted-foreground px-1 py-2 text-xs md:text-sm">
                      No visit analytics yet.
                    </p>
                  )}

                  {!isLoading && hasMore && visits.length > 0 && (
                    <p className="text-muted-foreground px-1 py-2 text-center text-xs md:text-sm">
                      Scroll to load more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
