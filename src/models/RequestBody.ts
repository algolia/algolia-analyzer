import { string, array, object } from 'zod';

import { paramsToObject } from './paramsToObject';

const RequestBody = object({
  requests: array(
    object({
      params: string().transform(paramsToObject),
    }).passthrough(),
  ).optional(),
}).passthrough();

export const requestBody = (raw?: unknown): unknown | undefined => {
  if (!raw) {
    return undefined;
  }

  const result = RequestBody.safeParse(raw);
  return result.success ? result.data : raw;
};
