import { string, object } from 'zod';

import { parseSemantic, type YarnVersion } from 'utils';

const YarnVersionModel = object({
  'dist-tags': object({
    latest: string().transform(parseSemantic).optional(),
  }),
}).transform((x) => x['dist-tags'].latest);

export const parseYarnVersion = (raw?: unknown): YarnVersion | null => {
  if (!raw) {
    return null;
  }

  const result = YarnVersionModel.safeParse(raw);
  return result.success ? result.data ?? null : null;
};
