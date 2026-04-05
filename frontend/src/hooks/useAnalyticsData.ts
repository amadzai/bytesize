import { useCallback, useEffect, useMemo, useState } from 'react';
import { urlApi } from '../api/urlApi';
import { getApiErrorMessage } from '../utils/errorMessages';
import type { AnalyticsUrlMapping } from '../types/analytics';
import type { UrlsPagination } from '../types/urls';

interface PaginationState {
  currentPage: number;
  visiblePages: number[];
  hasPrevious: boolean;
  hasNext: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
  goToPage: (page: number) => void;
  canGoToPage: (page: number) => boolean;
}

interface UseAnalyticsDataReturn {
  sortedUrls: AnalyticsUrlMapping[];
  totalClicks: number;
  urlsCount: number;
  averageClicks: number;
  isLoading: boolean;
  errorMessage: string;
  retry: () => void;
  pagination: PaginationState | null;
}

export function useAnalyticsData(): UseAnalyticsDataReturn {
  const [urls, setUrls] = useState<AnalyticsUrlMapping[]>([]);
  const [paginationResponse, setPaginationResponse] =
    useState<UrlsPagination | null>(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [currentPageUrl, setCurrentPageUrl] = useState<string | null>(null);
  const [pageUrlByNumber, setPageUrlByNumber] = useState<
    Partial<Record<number, string | null>>
  >({ 1: null });
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        setPaginationResponse(response.pagination);
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
        setPaginationResponse(null);
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Unable to load analytics. Please try again.',
          ),
        );
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

  const currentPage = paginationResponse?.page ?? 1;

  const visiblePages = useMemo(() => {
    if (!paginationResponse) {
      return [1];
    }

    if (paginationResponse.page === 1) {
      const pages = [1];
      if (paginationResponse.next_url) {
        pages.push(2);
      }
      if (pageUrlByNumber[3] !== undefined) {
        pages.push(3);
      }
      return pages;
    }

    if (paginationResponse.page === 2) {
      const pages = [1, 2];
      if (paginationResponse.next_url) {
        pages.push(3);
      }
      return pages;
    }

    if (paginationResponse.next_url) {
      return [
        1,
        paginationResponse.page - 1,
        paginationResponse.page,
        paginationResponse.page + 1,
      ];
    }

    return [1, paginationResponse.page - 1, paginationResponse.page];
  }, [paginationResponse, pageUrlByNumber]);

  const getPageUrl = useCallback(
    (page: number): string | null | undefined => {
      if (page === 1) {
        return null;
      }
      return pageUrlByNumber[page];
    },
    [pageUrlByNumber],
  );

  const urlsCount = paginationResponse?.count ?? sortedUrls.length;
  const averageClicks = urlsCount > 0 ? Math.round(totalClicks / urlsCount) : 0;

  const hasPrevious = !!paginationResponse?.previous_url;
  const hasNext = !!paginationResponse?.next_url;
  const showPagination = (hasPrevious || hasNext) && !errorMessage;

  const pagination: PaginationState | null = showPagination
    ? {
        currentPage,
        visiblePages,
        hasPrevious,
        hasNext,
        goToPrevious: () => setCurrentPageUrl(paginationResponse!.previous_url),
        goToNext: () => setCurrentPageUrl(paginationResponse!.next_url),
        goToPage: (page: number) => {
          if (page !== currentPage) {
            setCurrentPageUrl(getPageUrl(page) ?? null);
          }
        },
        canGoToPage: (page: number) =>
          !isLoading &&
          (page === currentPage || getPageUrl(page) !== undefined),
      }
    : null;

  return {
    sortedUrls,
    totalClicks,
    urlsCount,
    averageClicks,
    isLoading,
    errorMessage,
    retry: () => setRetryCount((count) => count + 1),
    pagination,
  };
}
