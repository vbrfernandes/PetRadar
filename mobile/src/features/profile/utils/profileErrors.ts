import axios from "axios";

interface ProfileErrorData {
  detail?: unknown;
}

export function getProfileErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (axios.isAxiosError<ProfileErrorData>(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string" && detail) {
      return detail;
    }
  }

  return fallback;
}

export function getProfileErrorContext(error: unknown) {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status,
      details: error.response?.data || error.message,
    };
  }

  return {
    status: undefined,
    details: error,
  };
}
