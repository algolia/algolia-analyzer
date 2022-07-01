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
  if (!result.success) {
    console.info('RequestBody could not be parsed', result.error);
    return raw;
  }
  return result.data;
};
