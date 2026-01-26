import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const BACKEND_URL = import.meta.env.BACKEND_URL || 'https://api.trafficbox.com';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
});

export async function apiHandler<T>(
  fn: () => Promise<AxiosResponse<T>>
): Promise<{ data: T | null; error: AxiosError | null }> {
  try {
    const response = await fn();
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { data: null, error: error as AxiosError };
    }
    return { data: null, error: error as AxiosError };
  }
}

export default {
  server: (config: AxiosRequestConfig) => axiosInstance.request(config),
};
