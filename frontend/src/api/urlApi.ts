import axios from 'axios';
import type {
  ListUrlsResponse,
  ShortenUrlPayload,
  ShortenUrlResponse,
} from '../types/urls';
import type { UrlAnalyticsResponse } from '../types/analytics';

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const urlApi = {
  async shorten(payload: ShortenUrlPayload): Promise<ShortenUrlResponse> {
    const { data } = await client.post<ShortenUrlResponse>(
      '/urls/shorten',
      payload,
    );
    return data;
  },

  async list(): Promise<ListUrlsResponse> {
    const { data } = await client.get<ListUrlsResponse>('/urls');
    return data;
  },

  async analytics(shortUrl: string): Promise<UrlAnalyticsResponse> {
    const { data } = await client.get<UrlAnalyticsResponse>(
      `/urls/${shortUrl}/analytics`,
    );
    return data;
  },
};
