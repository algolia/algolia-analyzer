import { type ColorVariant, TooltipWrapper, Badge, BaseLink } from '@algolia/satellite';
import { useMemo, type FC } from 'react';
import { AlertOctagon, AlertTriangle, Check, type Icon, Info } from 'react-feather';

import { type YarnVersion } from 'utils';

import { useYarnVersion } from './useYarnVersion';

interface TagVersionProps {
  packageName: string;
  currentVersion: Required<YarnVersion>;
}

const getPackageName = (packageName: string): string => {
  switch (packageName.toLowerCase()) {
    case 'algolia for javascript':
      return 'algoliasearch';
    case 'js helper':
      return 'algoliasearch-helper';
    default:
      return packageName;
  }
};

const icon: Record<ColorVariant, Icon | undefined> = {
  grey: undefined,
  green: Check,
  blue: Info,
  orange: AlertTriangle,
  red: AlertOctagon,
  accent: undefined,
};

export const TagVersion: FC<TagVersionProps> = ({ packageName, currentVersion }) => {
  const yarnName = getPackageName(packageName);
  const yarn = useYarnVersion(yarnName);

  const color: ColorVariant = useMemo(() => {
    if (yarn) {
      if (yarn.major && currentVersion.major < yarn.major) return 'red';
      if (yarn.minor && currentVersion.minor < yarn.minor) return 'orange';
      if (yarn.patch && currentVersion.patch < yarn.patch) return 'blue';
      return 'green';
    }
    return 'grey';
  }, [currentVersion.major, currentVersion.minor, currentVersion.patch, yarn]);

  return yarn ? (
    <TooltipWrapper content={`latest version: ${yarn.version}`} hideDelay={0} side="top">
      <Badge variant={color} icon={icon[color]}>
        {packageName}
        {yarnName !== packageName && <> ({yarnName})</>} {currentVersion.version}
        <BaseLink
          href={`https://www.npmjs.com/package/${yarnName}`}
          target="_blank"
          className="inline-block ml-2 w-3 h-3 opacity-40"
          style={{ color: 'inherit' }}
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <title>npm</title>
            <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
          </svg>
        </BaseLink>
      </Badge>
    </TooltipWrapper>
  ) : null;
};
