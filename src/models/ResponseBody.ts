import { string, array, object } from 'zod';

const ResponseBody = object({
  results: array(
    object({
      params: string().transform(decodeURIComponent),
    }).passthrough()
  ).optional(),
}).passthrough();

export const responseBody = (raw?: unknown): unknown | undefined => {
  if (!raw) {
    return undefined;
  }

  const result = ResponseBody.safeParse(raw);
  return result.success ? result.data : raw;
};
