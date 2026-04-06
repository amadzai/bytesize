export interface AnalyticsItem {
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

export interface AnalyticsVisit {
  key: string;
  timestamp: number;
  location: string;
}

export interface AnalyticsUrlMapping {
  id: string;
  longUrl: string;
  shortUrl: string;
  createdAt?: number;
  title?: string;
  clicks: number;
}
