import { string, array, object } from 'zod';

const RequestBody = object({
  requests: array(
    object({
      params: string().transform(decodeURIComponent),
    }).passthrough()
  ).optional(),
}).passthrough();

export const requestBody = (raw?: unknown): unknown | undefined => {
  if (!raw) {
    return undefined;
  }

  const result = RequestBody.safeParse(raw);
  return result.success ? result.data : raw;
};
