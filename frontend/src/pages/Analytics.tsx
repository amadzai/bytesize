import { BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { AnalyticsUrlList } from '../components/AnalyticsUrlList';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

export function Analytics() {
  const {
    sortedUrls,
    totalClicks,
    urlsCount,
    averageClicks,
    isLoading,
    errorMessage,
    retry,
    pagination,
  } = useAnalyticsData();

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
            onClick={retry}
            disabled={isLoading}
          >
            Retry
          </button>
        </div>
      ) : sortedUrls.length > 0 ? (
        <AnalyticsUrlList urls={sortedUrls} />
      ) : isLoading ? (
        <div className="border-border bg-card rounded-xl border p-8 text-center shadow-md">
          <p className="text-muted-foreground text-sm md:text-base">
            Loading analytics...
          </p>
        </div>
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
      {pagination && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={pagination.goToPrevious}
            disabled={!pagination.hasPrevious || isLoading}
            className="text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {pagination.visiblePages.map((page) => {
              const isCurrentPage = page === pagination.currentPage;

              return (
                <div key={page} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => pagination.goToPage(page)}
                    disabled={!pagination.canGoToPage(page)}
                    className={
                      isCurrentPage
                        ? 'bg-primary text-primary-foreground h-8 min-w-8 rounded-md px-2 text-sm font-medium'
                        : 'border-border text-foreground h-8 min-w-8 cursor-pointer rounded-md border px-2 text-sm hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40'
                    }
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                  {page === 1 && pagination.currentPage >= 3 ? (
                    <span
                      className="text-muted-foreground text-sm select-none"
                      aria-hidden="true"
                    >
                      ..
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={pagination.goToNext}
            disabled={!pagination.hasNext || isLoading}
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
