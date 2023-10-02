import cx from 'classnames';
import type { FC } from 'react';
import JsonView, { type OnCopyProps } from 'react-json-view';

interface CodeProps {
  code?: unknown;
  leftPadding?: boolean;
  className?: string;
}

const copyToClipboard = ({ src }: OnCopyProps): void => {
  const container = document.createElement('textarea');

  switch (typeof src) {
    case 'string':
      container.innerHTML = src;
      break;
    default:
      container.innerHTML = JSON.stringify(src, null, 2);
      break;
  }

  document.body.appendChild(container);
  container.select();
  document.execCommand('copy');
  document.body.removeChild(container);
};

export const Code: FC<CodeProps> = ({ code, leftPadding = true, className }) =>
  code ? (
    <div
      className={cx('py-2 break-all overflow-x-hidden bg-white', leftPadding && 'pl-6', className)}
    >
      <JsonView
        src={code as Record<string, unknown>}
        name={null}
        iconStyle="triangle"
        indentWidth={2}
        collapsed={3}
        displayDataTypes={false}
        quotesOnKeys={false}
        style={{ fontSize: '12px' }}
        enableClipboard={copyToClipboard}
      />
    </div>
  ) : null;
