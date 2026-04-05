import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AnalyticsUrlList,
  type AnalyticsUrlMapping,
} from '../components/AnalyticsUrlList';
import { urlApi } from '../api/urlApi';
import type { ApiErrorResponse, UrlsPagination } from '../types/urls';

export function Analytics() {
  const [urls, setUrls] = useState<AnalyticsUrlMapping[]>([]);
  const [pagination, setPagination] = useState<UrlsPagination | null>(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [currentPageUrl, setCurrentPageUrl] = useState<string | null>(null);
  const [pageUrlByNumber, setPageUrlByNumber] = useState<
    Partial<Record<number, string | null>>
  >({
    1: null,
  });
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.error;

      if (errors?.length) {
        return errors[0];
      }

      if (message) {
        return message;
      }
    }

    return 'Unable to load analytics. Please try again.';
  };

  useEffect(() => {
    let isActive = true;

    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await urlApi.list(currentPageUrl);
        const mappedUrls: AnalyticsUrlMapping[] = response.data.map((item) => ({
          id: item.short_url,
          longUrl: item.target_url,
          shortUrl: item.short_url,
          createdAt: item.created_at ? Date.parse(item.created_at) : undefined,
          title: item.title ?? undefined,
          clicks: item.click_count,
        }));

        if (!isActive) {
          return;
        }

        setUrls(mappedUrls);
        setTotalClicks(response.total_click_count);
        setPagination(response.pagination);
        setPageUrlByNumber((previous) => {
          const next = {
            ...previous,
            [response.pagination.page]: currentPageUrl,
          };

          if (response.pagination.previous_url) {
            next[response.pagination.page - 1] =
              response.pagination.previous_url;
          }

          if (response.pagination.next_url) {
            next[response.pagination.page + 1] = response.pagination.next_url;
          }

          return next;
        });

        if (response.pagination.page === 1 && response.pagination.next_url) {
          void urlApi
            .list(response.pagination.next_url)
            .then((nextPageResponse) => {
              if (!isActive) {
                return;
              }

              setPageUrlByNumber((previous) => {
                if (previous[3] !== undefined) {
                  return previous;
                }

                const next: Partial<Record<number, string | null>> = {
                  ...previous,
                  2: response.pagination.next_url,
                };

                if (nextPageResponse.pagination.next_url) {
                  next[3] = nextPageResponse.pagination.next_url;
                }

                return next;
              });
            })
            .catch(() => {});
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        setUrls([]);
        setTotalClicks(0);
        setPagination(null);
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchPageData();

    return () => {
      isActive = false;
    };
  }, [currentPageUrl, retryCount]);

  const sortedUrls = useMemo(
    () => [...urls].sort((a, b) => b.clicks - a.clicks),
    [urls],
  );
  const currentPage = pagination?.page ?? 1;
  const visiblePages = useMemo(() => {
    if (!pagination) {
      return [1];
    }

    if (pagination.page <= 1) {
      const pages = [1];
      if (pagination.next_url) {
        pages.push(2);
      }
      if (pageUrlByNumber[3] !== undefined) {
        pages.push(3);
      }
      return pages;
    }

    if (pagination.previous_url && pagination.next_url) {
      return [pagination.page - 1, pagination.page, pagination.page + 1];
    }

    if (!pagination.next_url) {
      const start = Math.max(1, pagination.page - 2);
      return Array.from(
        { length: pagination.page - start + 1 },
        (_, index) => start + index,
      );
    }

    return [pagination.page, pagination.page + 1];
  }, [pagination, pageUrlByNumber]);

  const getPageUrl = (page: number): string | null | undefined => {
    if (page === 1) {
      return null;
    }

    return pageUrlByNumber[page];
  };

  const urlsCount = pagination?.count ?? sortedUrls.length;
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

      {errorMessage ? (
        <div className="border-border bg-card rounded-xl border p-8 text-center shadow-md">
          <BarChart3 className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <p className="text-foreground mb-4 text-sm md:text-base">
            {errorMessage}
          </p>
          <button
            type="button"
            className="bg-primary text-primary-foreground cursor-pointer rounded-lg px-4 py-2 text-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setRetryCount((count) => count + 1)}
            disabled={isLoading}
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="border-border bg-card rounded-xl border p-8 text-center shadow-md">
          <p className="text-muted-foreground text-sm md:text-base">
            Loading analytics...
          </p>
        </div>
      ) : sortedUrls.length > 0 ? (
        <AnalyticsUrlList
          key={currentPageUrl ?? `page-${pagination?.page ?? 1}`}
          urls={sortedUrls}
        />
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

      {/* Pagination */}
      {(pagination?.previous_url || pagination?.next_url) && !errorMessage && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentPageUrl(pagination.previous_url)}
            disabled={!pagination.previous_url || isLoading}
            className="text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {visiblePages.map((page) => {
              const isCurrentPage = page === currentPage;
              const targetPageUrl = getPageUrl(page);
              const isDisabled =
                isLoading || (!isCurrentPage && targetPageUrl === undefined);

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    if (!isCurrentPage) {
                      setCurrentPageUrl(targetPageUrl ?? null);
                    }
                  }}
                  disabled={isDisabled}
                  className={
                    isCurrentPage
                      ? 'bg-primary text-primary-foreground h-8 min-w-8 rounded-md px-2 text-sm font-medium'
                      : 'border-border text-foreground h-8 min-w-8 cursor-pointer rounded-md border px-2 text-sm hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40'
                  }
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPageUrl(pagination.next_url)}
            disabled={!pagination.next_url || isLoading}
            className="text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
