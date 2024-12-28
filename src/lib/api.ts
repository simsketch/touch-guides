import { auth } from '@clerk/nextjs';

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      error.message || 'An error occurred',
      response.status,
      error
    );
  }

  return response;
}

export async function get<T>(url: string) {
  const response = await fetchWithAuth(url);
  return response.json() as Promise<T>;
}

export async function post<T>(url: string, data: unknown) {
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json() as Promise<T>;
}

export async function put<T>(url: string, data: unknown) {
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json() as Promise<T>;
}

export async function del(url: string) {
  await fetchWithAuth(url, {
    method: 'DELETE',
  });
} 