const dashboardApiActive = 'dashboardApiActive';

export const isDashboardApiActive = async (): Promise<boolean> => {
  const value = await chrome.storage.local.get(dashboardApiActive);
  return Boolean(value[dashboardApiActive]);
};

export const saveDashboardApiActive = async (value: boolean): Promise<void> => {
  await chrome.storage.local.set({ [dashboardApiActive]: value });
};
