export interface ShortenResult {
  target_url: string;
  short_url: string;
  title: string;
}

export interface ApiErrorResponse {
  error?: string;
  errors?: string[];
}
