import { useMemo, type FC } from 'react';

import { TagVersion } from './TagVersion';
import { getPackagesInfo } from './utils';

interface LibVersionProps {
  algoliaAgent?: string;
}

export const LibVersions: FC<LibVersionProps> = ({ algoliaAgent }) => {
  const packagesInfo = useMemo(() => getPackagesInfo(algoliaAgent), [algoliaAgent]);
  return (
    <div className="space-x-2 space-y-2 [&>*:first-child]:ml-2 mb-2 ml-4">
      {packagesInfo.map(({ name, ...currentVersion }) => (
        <TagVersion key={name} packageName={name} currentVersion={currentVersion} />
      ))}
    </div>
  );
};
