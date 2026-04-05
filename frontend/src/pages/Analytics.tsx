import { BarChart3 } from 'lucide-react';
import {
  AnalyticsUrlList,
  type AnalyticsUrlMapping,
} from '../components/AnalyticsUrlList';

const mockUrls: AnalyticsUrlMapping[] = [
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
  const urls = mockUrls;

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
          <a href="/" className="text-primary text-sm hover:opacity-80">
            Create the first shortened URL
          </a>
        </div>
      )}
    </div>
  );
}
