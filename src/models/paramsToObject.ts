export const paramsToObject = (params: string): Record<string, string> => {
  const searchParams = new URLSearchParams(params);
  const object: Record<string, string> = {};
  searchParams.forEach((value, key) => (object[key] = value));
  if (object.rulesAtQueryTime) {
    try {
      object.rulesAtQueryTime = JSON.parse(object.rulesAtQueryTime);
    } catch (e) {
      console.info('error while trying to parse rulesAtQueryTime, continuing...', e);
    }
  }
  return object;
};
