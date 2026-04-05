export interface ApiErrorResponse {
  error?: string;
  errors?: string[];
}

export interface ShortenUrlPayload {
  target_url: string;
}

export interface ShortenUrlResponse {
  target_url: string;
  short_url: string;
  title: string | null;
}

export interface UrlListItem {
  target_url: string;
  short_url: string;
  title: string | null;
  click_count: number;
}

export interface UrlsPagination {
  page: number;
  previous: number | null;
  next: number | null;
  previous_url: string | null;
  next_url: string | null;
}

export interface ListUrlsResponse {
  data: UrlListItem[];
  pagination: UrlsPagination;
}
