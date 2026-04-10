# Backend - Ruby on Rails

This backend was bootstrapped as an API-only Rails app with PostgreSQL and then scaffolded using Rails generators for models, controllers, and jobs.

## Core Components

### Files

- **Controllers**
  - [`UrlsController`](app/controllers/urls_controller.rb): create short URLs, list URLs, and handle redirects.
  - [`AnalyticsController`](app/controllers/analytics_controller.rb): return paginated visit analytics for a short URL.
- **Service Objects**
  - [`Urls::GenerateShortUrl`](app/services/urls/generate_short_url.rb): generates unique 8 char short codes.
  - [`Urls::FetchTitle`](app/services/urls/fetch_title.rb): fetches the target page title.
  - [`Analytics::FetchLocation`](app/services/analytics/fetch_location.rb): resolves IP geolocation.
- **Background Jobs**
  - [`Analytics::TrackVisitJob`](app/jobs/analytics/track_visit_job.rb): records visit analytics asynchronously on redirect (Active Job w/ Solid Queue).

### Libraries

- **Ruby Standard Libs**
  - `net/http`: outbound HTTP calls (title + geolocation lookup)
  - `json`: parse geolocation API responses
  - `securerandom`: generate short URL codes
- **External Libs**
  - `nokogiri`: parse HTML title tags
  - [`pagy`](https://ddnexus.github.io/pagy/): pagination for URL and analytics endpoints

## Testing

This backend uses **Minitest** for testing and [**SimpleCov**](https://github.com/simplecov-ruby/simplecov) for coverage, and includes:

- **Model tests** ([`test/models`](test/models)): model behavior/validations.
- **Service tests** ([`test/services`](test/services)): business logic in service objects.
- **Job tests** ([`test/jobs`](test/jobs)): background job behavior.
- **Integration tests** ([`test/integration`](test/integration)): end-to-end API flows.

### Run Tests (Docker)

From `backend/`, start the backend services:

```bash
docker compose -f docker-compose.dev.yml up --build
```

In a new terminal, run tests inside the running `web` container:

```bash
docker compose -f docker-compose.dev.yml exec web bin/rails test
```

### Run Tests (Local Rails)

If you prefer running tests directly with `bin/rails test`, ensure local Ruby (project version) and a local PostgreSQL instance are installed and running first, then run:

```bash
bin/rails test
```

### Test Coverage

After running tests, open the coverage report at [`backend/coverage/index.html`](coverage/index.html).
