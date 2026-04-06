import axios from 'axios';
import type {
  ListUrlsResponse,
  ShortenUrlPayload,
  ShortenUrlResponse,
} from '../types/urls';
import type { UrlAnalyticsResponse } from '../types/analytics';
import { BACKEND_API_URL } from '../utils/constants';

const client = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const urlApi = {
  async shorten(payload: ShortenUrlPayload): Promise<ShortenUrlResponse> {
    const { data } = await client.post<ShortenUrlResponse>('/urls', payload);
    return data;
  },

  async list(pageUrl?: string | null): Promise<ListUrlsResponse> {
    const { data } = await client.get<ListUrlsResponse>(pageUrl ?? '/urls');
    return data;
  },

  async analytics(
    shortUrl: string,
    cursor?: string | number | null,
  ): Promise<UrlAnalyticsResponse> {
    const params =
      cursor === undefined || cursor === null ? undefined : { page: cursor };

    const { data } = await client.get<UrlAnalyticsResponse>(
      `/urls/${shortUrl}/analytics`,
      { params },
    );
    return data;
  },
};
