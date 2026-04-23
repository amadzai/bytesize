import axios from 'axios';
import type { ShortenResult } from '../types/urls';

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function shortenUrl(targetUrl: string): Promise<ShortenResult> {
  const { data } = await client.post<ShortenResult>('/urls', {
    target_url: targetUrl,
  });
  return data;
}
