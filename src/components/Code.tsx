import type { FC } from 'react';
import JsonView from 'react-json-view';

interface CodeProps {
  code?: unknown;
}

export const Code: FC<CodeProps> = ({ code }) =>
  code ? (
    <div className="pl-6 py-2 break-all overflow-x-hidden">
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
