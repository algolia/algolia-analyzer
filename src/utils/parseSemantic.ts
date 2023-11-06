export interface YarnVersion {
  version: string;
  major?: number;
  minor?: number;
  patch?: number;
}

const semantic = new RegExp(/^(?<major>\d+).(?<minor>\d+).(?<patch>\d+)$/);

export const parseSemantic = (version: string): YarnVersion => {
  const response: YarnVersion = { version };
  const res = semantic.exec(version);
  if (res?.groups?.major !== undefined) {
    response.major = parseInt(res.groups.major, 10);
  }
  if (res?.groups?.minor !== undefined) {
    response.minor = parseInt(res.groups.minor, 10);
  }
  if (res?.groups?.patch !== undefined) {
    response.patch = parseInt(res.groups.patch, 10);
  }
  return response;
};
