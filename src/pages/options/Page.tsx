import { Toggle, stl } from '@algolia/satellite';
import cx from 'classnames';
import { useState, type FC, useEffect, type ChangeEvent } from 'react';
import { Loader } from 'react-feather';

import { isDashboardApiActive, saveDashboardApiActive } from 'utils';

export const Page: FC = () => {
  const [dashboardSate, setDashboardState] = useState<boolean>();

  const updateDashboardApiActive = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const value = Boolean(e.currentTarget.checked);
    await saveDashboardApiActive(value);
    setDashboardState(value);
  };

  useEffect(() => {
    const getValue = async (): Promise<void> => {
      setDashboardState(await isDashboardApiActive());
    };
    getValue();
  }, []);

  return isDashboardApiActive !== undefined ? (
    <section className={cx(stl`display-body`, 'p-6 space-y-3')}>
      <h2 className={stl`display-heading`}>Optional APIs to capture:</h2>
      <div className="flex items-center space-x-3">
        <span>Dashboard API</span>
        <Toggle checked={dashboardSate} onChange={updateDashboardApiActive} />
      </div>
    </section>
  ) : (
    <Loader className="mx-auto my-10 animate-spin" />
  );
};
