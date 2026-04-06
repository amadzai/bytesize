# Frontend - React (TS Vite)

Built from the Vite React TypeScript template, this frontend provides the UI for creating short URLs and viewing analytics.

## Core Components

### Files

- **Pages**
  - [`src/pages/Home.tsx`](src/pages/Home.tsx): main page for creating short URLs and showing recently shortened URLs (local storage, 5 max per browser).
  - [`src/pages/Analytics.tsx`](src/pages/Analytics.tsx): analytics page for viewing visits and pagination.
- **API and Routing**
  - [`src/api/urlApi.ts`](src/api/urlApi.ts): API client for URL creation, listing, and analytics endpoints.
  - [`src/router.tsx`](src/router.tsx): app route configuration.
- **Components**
  - [`src/components/ShortenedUrl.tsx`](src/components/ShortenedUrl.tsx): reusable UI for displaying shortened URL results.
  - [`src/components/AnalyticsUrlList.tsx`](src/components/AnalyticsUrlList.tsx): reusable analytics URL list UI.
- **Hooks**
  - [`src/hooks/useAnalyticsData.ts`](src/hooks/useAnalyticsData.ts): analytics data-fetching and pagination hook.
- **Utilities and Types**
  - [`src/utils/constants.ts`](src/utils/constants.ts): frontend environment constants (API and redirect base URLs).
  - [`src/types/urls.ts`](src/types/urls.ts) and [`src/types/analytics.ts`](src/types/analytics.ts): shared TypeScript response/payload types.

### Libraries

- **Routing and API**
  - `react-router-dom`: client-side routing.
  - `axios`: HTTP client for backend API requests.
- **UI and Styling**
  - `tailwindcss` and `@tailwindcss/vite`: utility-first styling and Vite integration.
  - `react-hot-toast`: toast notifications for user feedback.
  - `lucide-react`: icon set used in the UI.
- **Formatting**
  - `prettier` + `prettier-plugin-tailwindcss`: code formatting and Tailwind class sorting.
