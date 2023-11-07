import { isDefined, type YarnVersion, parseSemantic } from 'utils';

interface PackageInfo extends Required<YarnVersion> {
  name: string;
}

const packageInfo = new RegExp(/^(?<name>[\w\-. ]+) \((?<version>[0-9.]+)\)$/);

export const getPackagesInfo = (algoliaAgent?: string): PackageInfo[] => {
  if (!algoliaAgent) return [];

  const packages = algoliaAgent.split('; ').filter((x) => x.indexOf('(') >= 0);
  return packages
    .map((packageAsString) => {
      const info = packageInfo.exec(packageAsString);
      if (info?.groups) {
        const { name, version } = info.groups;
        const semRes = parseSemantic(version);
        const { major, minor, patch } = semRes;
        if (major !== undefined && minor !== undefined && patch !== undefined) {
          return { name, version, major, minor, patch };
        }
      }
      return null;
    })
    .filter(isDefined);
};
