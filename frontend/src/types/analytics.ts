export interface AnalyticsItem {
  id: string;
  url_id: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsPagination {
  next: unknown | null;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface UrlAnalyticsResponse {
  data: AnalyticsItem[];
  pagination: AnalyticsPagination;
}
