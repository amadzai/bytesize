import { useState } from 'react';
import { CircleAlert, Link } from 'lucide-react';
import { toast } from 'react-hot-toast';
import icon from '../assets/icon.png';
import { ShortenedUrl } from '../components/ShortenedUrl';
import { urlApi } from '../api/urlApi';
import {
  addRecentUrl,
  readRecentUrls,
  writeRecentUrls,
} from '../utils/recentUrlsStorage';
import { getApiErrorMessage } from '../utils/errorMessages';
import type { RecentUrlItem } from '../types/urls';

const isValidHttpUrl = (value: string) => {
  try {
    const parsedUrl = new URL(value.trim());
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

export function Home() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivacyTooltipOpen, setIsPrivacyTooltipOpen] = useState(false);
  const [recentUrls, setRecentUrls] = useState<RecentUrlItem[]>(() =>
    readRecentUrls(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidHttpUrl(url)) {
      setUrlError('Invalid URL');
      toast.error('Invalid URL');
      return;
    }

    setUrlError('');

    try {
      setIsLoading(true);
      const response = await urlApi.shorten({ target_url: url.trim() });
      const updatedRecentUrls = addRecentUrl(response);

      setRecentUrls(updatedRecentUrls);
      setUrl('');
      toast.success('URL shortened successfully');
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Unable to shorten URL. Please try again.',
      );
      setUrlError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecentUrl = (id: string) => {
    setRecentUrls((previousRecentUrls) => {
      const updatedRecentUrls = previousRecentUrls.filter(
        (item) => item.short_url !== id,
      );
      writeRecentUrls(updatedRecentUrls);
      return updatedRecentUrls;
    });

    toast.success('Removed from recent URLs');
  };

  return (
    <div
      className="container mx-auto max-w-5xl px-6 py-12 md:px-4"
      onTouchEndCapture={() => setIsPrivacyTooltipOpen(false)}
    >
      {/* Header */}
      <div className="mb-6 text-center md:mb-8">
        <div className="inline-flex h-20 w-32 items-center justify-center">
          <img
            src={icon}
            alt="Bytesize logo"
            className="h-full w-full object-contain"
          />
        </div>
        <h1 className="text-foreground mb-2 text-4xl font-bold md:text-5xl">
          bytesize
        </h1>
        <p className="text-muted-foreground text-xs md:text-base">
          Transform long URLs into short, shareable links
        </p>
      </div>

      {/* Main Form Card */}
      <div className="border-border bg-card mb-6 rounded-2xl border p-8 shadow-xl md:mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2">
              <Link className="text-muted-foreground h-4 w-4" />
              <label
                htmlFor="url"
                className="text-card-foreground text-sm font-medium"
              >
                Long URL
              </label>
              <span
                className="group relative inline-flex items-center"
                onTouchEnd={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="text-muted-foreground inline-flex h-4 w-4 cursor-pointer items-center justify-center"
                  aria-label="Show privacy warning"
                  aria-expanded={isPrivacyTooltipOpen}
                  aria-controls="url-privacy-warning"
                  onClick={() =>
                    setIsPrivacyTooltipOpen((previous) => !previous)
                  }
                  onBlur={() => setIsPrivacyTooltipOpen(false)}
                >
                  <CircleAlert className="h-3 w-3" />
                </button>
                <span
                  id="url-privacy-warning"
                  role="tooltip"
                  className={`bg-foreground text-background pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 rounded-md px-3 py-2 text-xs leading-relaxed shadow-md transition-opacity ${
                    isPrivacyTooltipOpen
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  Do not shorten private or sensitive URLs. Anyone with the
                  short link can access the destination.
                </span>
              </span>
            </div>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) setUrlError('');
              }}
              placeholder="Paste long URL here"
              className="border-border bg-input-background focus:ring-ring w-full rounded-lg border px-4 py-3 transition-all outline-none focus:ring-2"
              disabled={isLoading}
            />
            {urlError && <p className="text-error mt-2 text-sm">{urlError}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="bg-primary text-primary-foreground w-full cursor-pointer rounded-lg py-3 font-medium shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {recentUrls.length === 0 ? (
          <div className="text-muted-foreground text-center text-xs md:text-base">
            <p>No shortened URLs yet. Create your first one above!</p>
          </div>
        ) : (
          <>
            <h2 className="text-foreground text-lg font-semibold md:text-xl">
              Your recent URLs
            </h2>
            <div className="space-y-4">
              {recentUrls.map((item) => (
                <ShortenedUrl
                  key={item.short_url}
                  mapping={{
                    id: item.short_url,
                    longUrl: item.target_url,
                    shortUrl: item.short_url,
                    createdAt: item.created_at,
                    title: item.title ?? undefined,
                  }}
                  onDelete={handleDeleteRecentUrl}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
