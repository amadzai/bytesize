import { useState } from 'react';
import { Link } from 'lucide-react';
import icon from '../assets/icon.png';
import { ShortenedUrl } from '../components/ShortenedUrl';

const mockUrls = [
  {
    id: '1',
    longUrl:
      'https://www.example.com/blog/how-to-build-a-scalable-url-shortener-system',
    shortUrl: 'a1b2c3a1b2c3a1b2c3a1b2c3a1b2c3',
    createdAt: 1712311200000,
    title: 'URL Shortener Architecture Guide',
    clicks: 42,
  },
  {
    id: '2',
    longUrl: 'https://react.dev/learn/you-might-not-need-an-effect',
    shortUrl: 'react7',
    createdAt: 1712293200000,
    title: 'React Docs - Effects',
    clicks: 18,
  },
  {
    id: '3',
    longUrl: 'https://tailwindcss.com/docs/responsive-design#overview',
    shortUrl: 'twresp',
    createdAt: 1712221200000,
    title: 'Tailwind Responsive Design',
    clicks: 7,
  },
];

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
  const urlsCount = mockUrls.length;
  const isLoading = false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidHttpUrl(url)) {
      setUrlError('Invalid URL');
      return;
    }

    setUrlError('');
  };

  return (
    <div className="container mx-auto max-w-5xl px-6 py-12 md:px-4">
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
            <label
              htmlFor="url"
              className="text-card-foreground mb-2 inline-flex items-center gap-2 text-sm font-medium"
            >
              <Link className="text-muted-foreground h-4 w-4" />
              Long URL
            </label>
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
        <h2 className="text-foreground text-lg font-semibold md:text-xl">
          Your recent URLs
        </h2>

        {urlsCount === 0 ? (
          <div className="text-muted-foreground text-center text-xs md:text-base">
            <p>No shortened URLs yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockUrls.map((mapping) => (
              <ShortenedUrl key={mapping.id} mapping={mapping} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
