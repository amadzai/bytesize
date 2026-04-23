# Extension - Chrome (MV3)

Built with Vite, React, and TypeScript, this browser extension lets users shorten the current tab's URL instantly without leaving the page.

## Core Components

### Files

- **Popup**
  - [`src/popup/Popup.tsx`](src/popup/Popup.tsx): main popup UI — reads current tab URL, triggers shortening, and displays the result with a copy button.
  - [`src/main.tsx`](src/main.tsx): React entry point for the popup.
  - [`index.html`](index.html): popup HTML entry referenced by the manifest.
- **API**
  - [`src/api/urlApi.ts`](src/api/urlApi.ts): axios client for the `POST /urls` shorten endpoint.
- **Utilities and Types**
  - [`src/utils/errorMessages.ts`](src/utils/errorMessages.ts): extracts user-facing error messages from axios errors.
  - [`src/types/urls.ts`](src/types/urls.ts): shared TypeScript types for API responses and errors.

### Libraries

- **UI and Styling**
  - `react` + `react-dom`: popup UI.
  - `tailwindcss` + `@tailwindcss/vite`: utility-first styling and Vite integration.
  - `lucide-react`: icon set used in the UI.
- **API**
  - `axios`: HTTP client for backend API requests.
- **Build**
  - `vite` + `vite-plugin-web-extension`: bundles the extension with MV3 manifest support.
- **Formatting**
  - `prettier` + `prettier-plugin-tailwindcss`: code formatting and Tailwind class sorting.

## Local Development

### Build

From `extension/`:

```bash
pnpm install
pnpm build
```

### Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `extension/dist/`

### Environment

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_BACKEND_API_URL` | Backend API base URL for `POST /urls` | `http://localhost:3000` |
| `VITE_BACKEND_REDIRECT_URL` | Base URL used to construct the full short URL | `http://localhost:3000` |

> Re-run `pnpm build` after changing `.env` — values are baked in at build time.

### Watch Mode

```bash
pnpm dev
```

Rebuilds to `dist/` on file changes. Reload the extension in Chrome after each build.
