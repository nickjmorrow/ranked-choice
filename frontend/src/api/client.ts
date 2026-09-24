/**
 * The HTTP boundary: `/api` on this origin, JSON in and out, and a non-2xx
 * status turned into an `ApiError` carrying the server's own message.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * The human-readable message out of an error response. Nest sends
 * `{ message }`, where a validation failure's message is an array — one entry
 * per rule broken. With no body at all, name the status rather than show nothing.
 */
export async function errorMessage(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  const message = (body as { message?: unknown } | null)?.message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) {
    const lines = message.filter((line): line is string => typeof line === 'string');
    if (lines.length > 0) return lines.join(' ');
  }
  if (response.status === 429) return 'Too many requests. Wait a minute and try again.';
  return response.statusText || `Request failed (${String(response.status)})`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  new Headers(init?.headers).forEach((value, name) => headers.set(name, value));

  let response: Response;
  try {
    response = await fetch(`/api${path}`, { ...init, headers });
  } catch {
    // fetch rejects only when no response arrived at all.
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  if (!response.ok) throw new ApiError(await errorMessage(response), response.status);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** Retry a failed read once — but not a 4xx, which will fail the same way again. */
export function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  return failureCount < 1;
}
