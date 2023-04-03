import cx from 'classnames';
import type { FC } from 'react';
import JsonView from 'react-json-view';

interface CodeProps {
  code?: unknown;
  leftPadding?: boolean;
}

export const Code: FC<CodeProps> = ({ code, leftPadding = true }) =>
  code ? (
    <div className={cx('py-2 break-all overflow-x-hidden', leftPadding && 'pl-6')}>
      <JsonView
        src={code as Record<string, unknown>}
        name={null}
        iconStyle="triangle"
        indentWidth={2}
        collapsed={3}
        displayDataTypes={false}
        quotesOnKeys={false}
        style={{ fontSize: '12px' }}
      />
    </div>
  ) : null;
