import { describe, expect, it } from 'vitest';
import { ApiError, errorMessage, shouldRetry } from 'src/api/client';

const response = (status: number, body: unknown, statusText = '') =>
  new Response(body === undefined ? null : JSON.stringify(body), { status, statusText });

describe('errorMessage', () => {
  it('uses a string message as it is', async () => {
    expect(await errorMessage(response(404, { message: 'No poll has that link.' }))).toBe(
      'No poll has that link.',
    );
  });

  it('joins a validation failure’s messages', async () => {
    const body = { message: ['The poll needs a title.', 'Every option needs a label.'] };
    expect(await errorMessage(response(400, body))).toBe(
      'The poll needs a title. Every option needs a label.',
    );
  });

  it('explains a rate limit in words', async () => {
    expect(await errorMessage(response(429, undefined))).toMatch(/Too many requests/);
  });

  it('falls back to the status when there is no body', async () => {
    expect(await errorMessage(response(502, undefined))).toBe('Request failed (502)');
  });
});

describe('shouldRetry', () => {
  it('retries a server error once', () => {
    expect(shouldRetry(0, new ApiError('boom', 500))).toBe(true);
    expect(shouldRetry(1, new ApiError('boom', 500))).toBe(false);
  });

  it('never retries a client error', () => {
    expect(shouldRetry(0, new ApiError('missing', 404))).toBe(false);
  });
});
