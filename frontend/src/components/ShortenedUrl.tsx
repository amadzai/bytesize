import { Copy, ExternalLink } from 'lucide-react';

interface UrlMapping {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: number;
  title?: string;
  clicks?: number;
}

interface ShortenedUrlProps {
  mapping: UrlMapping;
}

export function ShortenedUrl({ mapping }: ShortenedUrlProps) {
  const shortUrl = `${window.location.origin}/${mapping.shortCode}`;

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="border-border bg-card rounded-xl border p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="space-y-3">
        {/* Title */}
        {mapping.title && (
          <div>
            <h3 className="text-card-foreground font-semibold">
              {mapping.title}
            </h3>
          </div>
        )}

        {/* Short URL */}
        <div className="flex items-center gap-3">
          <div className="border-border bg-secondary flex-1 rounded-lg border px-4 py-3">
            <p className="text-muted-foreground mb-1 text-sm">Short URL</p>
            <p className="text-primary font-mono font-semibold break-all">
              {shortUrl}
            </p>
          </div>
          <button
            className="bg-accent hover:bg-accent/80 shrink-0 rounded-lg p-3 transition-colors"
            title="Copy action will be added during integration"
            type="button"
          >
            <Copy className="text-primary h-5 w-5" />
          </button>
        </div>

        {/* Original URL */}
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-muted-foreground mb-1 text-sm">Original URL</p>
            <div className="flex items-center gap-2">
              <p
                className="text-card-foreground text-sm break-all"
                title={mapping.originalUrl}
              >
                {truncateUrl(mapping.originalUrl, 60)}
              </p>
              <a
                href={mapping.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="border-border border-t pt-2">
          <p className="text-muted-foreground text-xs">
            Created {new Date(mapping.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
