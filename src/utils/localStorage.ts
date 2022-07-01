export const getLocalStorageValue = async <T>(key: string): Promise<T | undefined> => {
  const value = await chrome.storage.local.get(key);
  return value[key] as T;
};

export const setLocalStorageValue = async <T>(key: string, value: T): Promise<void> =>
  await chrome.storage.local.set({ [key]: value });
