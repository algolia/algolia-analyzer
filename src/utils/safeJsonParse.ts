export const safeJsonParse = (data: string, ...message: any[]): unknown | undefined => {
  if (!data) {
    return undefined;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.info(...message, e);
    return undefined;
  }
};
