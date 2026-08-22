import axios from 'axios';

interface AuthErrorResponse {
  detail?: unknown;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<AuthErrorResponse>(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string' && detail) {
      return detail;
    }
  }

  return fallback;
}
