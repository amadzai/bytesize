import { useEffect, useState } from 'react';
import { Check, Copy, Loader2, TriangleAlert } from 'lucide-react';
import { shortenUrl } from '../api/urlApi';
import type { ShortenResult } from '../types/urls';
import { getApiErrorMessage } from '../utils/errorMessages';
import icon from '../assets/icon.png';

const REDIRECT_BASE =
  import.meta.env.VITE_BACKEND_REDIRECT_URL ?? 'http://localhost:3000';

type State =
  | { status: 'idle'; currentUrl: string }
  | { status: 'loading'; currentUrl: string }
  | {
      status: 'success';
      currentUrl: string;
      result: ShortenResult;
      copied: boolean;
    }
  | { status: 'error'; currentUrl: string; message: string };

function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function Popup() {
  const [state, setState] = useState<State>({ status: 'idle', currentUrl: '' });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url ?? '';
      setState({ status: 'idle', currentUrl: url });
    });
  }, []);

  const handleShorten = async () => {
    if (state.status === 'loading') return;

    const currentUrl = state.currentUrl;

    if (!isHttpUrl(currentUrl)) {
      setState({
        status: 'error',
        currentUrl,
        message: 'Only HTTP and HTTPS URLs can be shortened.',
      });
      return;
    }

    setState({ status: 'loading', currentUrl });

    try {
      const result = await shortenUrl(currentUrl);
      setState({ status: 'success', currentUrl, result, copied: false });
    } catch (error) {
      setState({
        status: 'error',
        currentUrl,
        message: getApiErrorMessage(
          error,
          'Unable to shorten URL. Please try again.',
        ),
      });
    }
  };

  const handleCopy = async () => {
    if (state.status !== 'success') return;
    const fullShortUrl = `${REDIRECT_BASE}/${state.result.short_url}`;
    await navigator.clipboard.writeText(fullShortUrl).catch(() => {});
    setState({ ...state, copied: true });
    setTimeout(
      () =>
        setState((prev) =>
          prev.status === 'success' ? { ...prev, copied: false } : prev,
        ),
      2000,
    );
  };

  const handleRetry = () => {
    setState({ status: 'idle', currentUrl: state.currentUrl });
  };

  const shortUrl =
    state.status === 'success'
      ? `${REDIRECT_BASE}/${state.result.short_url}`
      : null;

  const isInvalidPage = state.currentUrl !== '' && !isHttpUrl(state.currentUrl);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex flex-col items-center">
        <div className="inline-flex h-10 w-14 items-center justify-center">
          <img
            src={icon}
            alt="bytesize logo"
            className="h-full w-full object-contain"
          />
        </div>
        <span className="text-foreground text-xl font-semibold tracking-tight">
          bytesize
        </span>
      </div>

      {/* Current URL */}
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Current page
        </p>
        <p
          className="text-card-foreground truncate text-sm"
          title={state.currentUrl || 'Loading...'}
        >
          {state.currentUrl || 'Loading...'}
        </p>
      </div>

      {/* Error banner */}
      {state.status === 'error' && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <TriangleAlert
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span>{state.message}</span>
        </div>
      )}

      {/* Result box */}
      {state.status === 'success' && shortUrl && (
        <div className="border-border bg-secondary flex items-center gap-2 rounded-lg border px-3 py-2">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary min-w-0 flex-1 truncate text-sm font-semibold hover:opacity-80"
            title={shortUrl}
          >
            {shortUrl}
          </a>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open short URL"
            className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
          ></a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={state.copied ? 'Copied' : 'Copy short URL'}
            className="text-primary hover:text-primary/80 shrink-0 cursor-pointer transition-colors"
          >
            {state.copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      {/* Action button */}
      {state.status === 'success' ? (
        <button
          type="button"
          onClick={handleRetry}
          className="bg-primary text-primary-foreground flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium shadow-sm transition-all hover:opacity-90"
        >
          Shorten again
        </button>
      ) : (
        <button
          type="button"
          onClick={state.status === 'error' ? handleRetry : handleShorten}
          disabled={state.status === 'loading' || isInvalidPage}
          className="bg-primary text-primary-foreground flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Shortening...
            </>
          ) : state.status === 'error' ? (
            'Try again'
          ) : (
            'Shorten URL'
          )}
        </button>
      )}

      {isInvalidPage && state.status !== 'error' && (
        <p className="text-muted-foreground text-center text-xs">
          Only HTTP/HTTPS pages can be shortened.
        </p>
      )}
    </div>
  );
}
