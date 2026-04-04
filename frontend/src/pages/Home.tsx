import { useState } from 'react';
import { Link } from 'lucide-react';
import icon from '../assets/icon.png';

export function Home() {
  const [url, setUrl] = useState('');
  const urlsCount = 0;
  const isLoading = false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-28 pb-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex h-20 w-32 items-center justify-center">
          <img
            src={icon}
            alt="Bytesize logo"
            className="h-full w-full object-contain"
          />
        </div>
        <h1 className="text-foreground mb-2 text-5xl font-bold">bytesize</h1>
        <p className="text-muted-foreground">
          Transform long URLs into short, shareable links
        </p>
      </div>

      {/* Main Form Card */}
      <div className="border-border bg-card mb-8 rounded-2xl border p-8 shadow-xl">
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
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste long URL here"
              className="border-border bg-input-background focus:ring-ring w-full rounded-lg border px-4 py-3 transition-all outline-none focus:ring-2"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="bg-primary text-primary-foreground w-full rounded-lg py-3 font-medium shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>
      </div>

      {urlsCount === 0 && (
        <div className="text-muted-foreground py-4a text-center">
          <p>No shortened URLs yet. Create your first one above!</p>
        </div>
      )}
    </div>
  );
}
