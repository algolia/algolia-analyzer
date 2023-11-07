import { useQuery } from '@tanstack/react-query';

import { type YarnVersion } from 'utils';

import { parseYarnVersion } from './YarnVersion';

const queryPackageVersion = async (packageName: string): Promise<YarnVersion | null> => {
  const data = await fetch(`https://registry.yarnpkg.com/${packageName}`)
    .then((res) => res.json())
    .then(parseYarnVersion);
  return data;
};

export const useYarnVersion = (packageName: string): YarnVersion | undefined => {
  const { data } = useQuery({
    queryKey: ['yarn-version', packageName],
    queryFn: () => queryPackageVersion(packageName),
    staleTime: Infinity,
  });

  return data ?? undefined;
};
