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
          <div className="min-w-0">
            <h3
              className="text-card-foreground truncate text-base font-semibold"
              title={mapping.title}
            >
              {mapping.title}
            </h3>
          </div>
        )}

        {/* Short URL */}
        <div className="flex min-w-0 items-center md:gap-3">
          <div className="border-border bg-secondary min-w-0 flex-1 rounded-lg border px-2 py-2 md:px-4">
            <p className="text-muted-foreground mb-1 text-sm">Short URL</p>
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0 flex-1">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 block truncate text-sm font-semibold transition-colors md:text-base"
                  title={shortUrl}
                >
                  {shortUrl}
                </a>
              </div>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
                title="Open short URL"
              >
                <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
              </a>
            </div>
          </div>
          <button
            className="shrink-0 cursor-pointer rounded-lg pl-3 transition-colors md:p-3"
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
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground mb-1 text-sm">Long URL</p>
            <div className="flex min-w-0 flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
              <p
                className="text-card-foreground w-full min-w-0 truncate text-sm lg:flex-1"
                title={mapping.longUrl}
              >
                {mapping.longUrl}
              </p>
              <p className="text-muted-foreground shrink-0 text-xs lg:ml-auto">
                Created {createdAtLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
