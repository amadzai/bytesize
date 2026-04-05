import axios from 'axios';
import type { ApiErrorResponse } from '../types/urls';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const errors = error.response?.data?.errors;
    const message = error.response?.data?.error;

    if (errors?.length) {
      return errors[0];
    }

    if (message) {
      return message;
    }
  }

  return fallback;
}
