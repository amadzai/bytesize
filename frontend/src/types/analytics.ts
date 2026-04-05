export interface AnalyticsItem {
  id: string;
  url_id: string;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsPagination {
  next: string | number | null;
  page: string | number;
  limit: number;
  has_more: boolean;
}

export interface UrlAnalyticsResponse {
  data: AnalyticsItem[];
  pagination: AnalyticsPagination;
}
