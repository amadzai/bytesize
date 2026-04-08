## General Info

- **Project Title:** URL Shortener
- **Project Name:** Bytesize
- **Submission Date:** 10th April 2026
- **GitLab URL:** [GitLab Bytesize](https://gitlab.com/amadzai/bytesize)
- **Linear URL:** [Linear Amad Zai](https://linear.app/amad-zai/team/AMA/all)

### Tech Stack

- **Backend:** Ruby on Rails
- **Frontend:** React (Vite) + Tailwind
- **Database:** PostgreSQL
- **Hosting:** Contabo + Vercel

### Functional Requirements

1. The system shall generate a public short URL from a target URL and return it along with the target URL and the page title.
2. The system shall generate short URLs with a path of no more than 15 characters following any valid URI pattern.
3. The system shall redirect users to the target URL when a short URL is accessed.
4. The system shall allow multiple short URLs to share the same target URL.
5. The system shall be able to track for each short URL the click count, originating geolocation, and timestamp of each visit for analytics.

### Non-Functional Requirements

1. The system shall ensure generated short URLs are unique.
2. The system shall respond to URL redirection requests almost instantly.
3. The system shall prevent abuse by implementing rate limiting for certain API requests.

## Data Model

### 1. URLs Table

Stores mapping between original target URLs and generated short URLs.

| FIELD       | TYPE     | DESCRIPTION                                    |
| ----------- | -------- | ---------------------------------------------- |
| id          | UUID     | Primary key                                    |
| title       | String   | Page title from the target URL                 |
| target_url  | String   | The original long target URL                   |
| short_url   | String   | The generated short URL (8 chars)              |
| click_count | Integer  | Number of times the short URL has been visited |
| created_at  | Datetime | Timestamp when the URL was created             |
| updated_at  | Datetime | Timestamp when the URL was last updated        |

### 2. Analytics Table

Stores a record of each visit to a short URL, with a foreign key reference to the corresponding URL.

| FIELD      | TYPE     | DESCRIPTION                                   |
| ---------- | -------- | --------------------------------------------- |
| id         | UUID     | Primary key                                   |
| url_id     | FK       | References URLs table                         |
| location   | String   | Visitor geolocation as { City, Country }      |
| created_at | Datetime | Timestamp when the Analytics was created      |
| updated_at | Datetime | Timestamp when the Analytics was last updated |

## API Endpoints

### 1. Shorten a target URL

- Endpoint: **POST /urls**
- Request Body:
  - target_url: string (e.g., "https://example.com")
- Response:
  - short_url: string (e.g., "er4Gt1Aa")
  - target_url: string (e.g., "https://example.com")
  - title: string (e.g., “Example Title”)

### 2. Redirect to target URL

- Endpoint: **GET /:short_url**
- Response:
  - Redirects the user to the target URL (e.g., "https://example.com")

### 3. Get summary of all Short URLs (Paginated)

- Endpoint: **GET /urls**
- Response:
  - short_url: string (e.g., "er4Gt1Aa")
  - original_url: string (e.g., "https://example.com")
  - title: string (e.g., “Example Title”)
  - click_count: integer (e.g., 24\)

### 4. Get analytics for a specific Short URL (Paginated)

- Endpoint: **GET urls/:short_url/analytics**
- Response:
  - location: string (e.g., "Kuala Lumpur, Malaysia")
  - timestamp: string (e.g., "2026-03-30T12:15:00Z")

## Technical Decisions

### Short URL Generation (15 Max Chars)

- Use Base62 as character set OR SecureRandom alphanumeric
- Generate random url using the char set
- Check for collisions during creation, use retry

### Title Tag from Target URL

- Use Ruby’s Net HTTP to fetch the HTML from target URL
- Use [nokogiri](https://nokogiri.org/index.html) to parse HTML from response
- Include when creating entry and include in response

### Tracking and Saving Geolocation

- Capture visitor IP during redirect
- Convert IP to location via external tool (ipinfo, ip-api, ipstack)
- Get city and country, include as location during analytics creation
- Make async to prevent blocking the redirect process
