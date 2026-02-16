import type { ApiError } from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export class ApiClientError extends Error {
  statusCode: number;
  details?: ApiError;

  constructor(statusCode: number, message: string, details?: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let details: ApiError | undefined;
    try {
      details = await response.json();
    } catch {
      // response body isn't JSON
    }
    const message = details
      ? Array.isArray(details.message)
        ? details.message.join(', ')
        : details.message
      : response.statusText;
    throw new ApiClientError(response.status, message, details);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  return handleResponse<T>(response);
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function upload<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<T>(response);
}

export async function put<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function del<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
  });
  return handleResponse<T>(response);
}
