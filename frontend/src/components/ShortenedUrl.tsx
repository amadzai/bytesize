import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

interface UrlMapping {
  id: string;
  longUrl: string;
  shortUrl: string;
  createdAt: number;
  title?: string;
  clicks?: number;
}

interface ShortenedUrlProps {
  mapping: UrlMapping;
}

export function ShortenedUrl({ mapping }: ShortenedUrlProps) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${window.location.origin}/${mapping.shortUrl}`;
  const createdAtLabel = new Date(mapping.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  });

  const truncateUrl = (url: string, maxLength: number = 80) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-border bg-card rounded-xl border px-6 py-4 shadow-md transition-shadow hover:shadow-lg">
      <div className="space-y-3">
        {/* Title */}
        {mapping.title && (
          <div>
            <h3 className="text-card-foreground text-sm font-semibold md:text-base">
              {mapping.title}
            </h3>
          </div>
        )}

        {/* Short URL */}
        <div className="flex items-center gap-3">
          <div className="border-border bg-secondary flex-1 rounded-lg border px-4 py-2">
            <p className="text-muted-foreground mb-1 text-xs md:text-sm">
              Short URL
            </p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-mono text-sm font-semibold break-all transition-colors md:text-base"
                title={shortUrl}
              >
                {shortUrl}
              </a>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
                title="Open short URL"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <button
            className="shrink-0 cursor-pointer rounded-lg p-3 transition-colors"
            title={copied ? 'Copied' : 'Copy short URL'}
            type="button"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="text-primary h-5 w-5" />
            ) : (
              <Copy className="text-primary h-5 w-5 transition-colors" />
            )}
          </button>
        </div>

        {/* Long URL */}
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-muted-foreground mb-1 text-sm">Long URL</p>
            <div className="flex items-center gap-2">
              <p
                className="text-card-foreground text-sm break-all"
                title={mapping.longUrl}
              >
                {truncateUrl(mapping.longUrl, 90)}
              </p>
              <p className="text-muted-foreground ml-auto shrink-0 text-xs">
                Created {createdAtLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
