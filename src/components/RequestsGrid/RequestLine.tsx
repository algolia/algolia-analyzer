import cx from 'classnames';
import { type FC } from 'react';

import { useSidebar } from 'components/SidebarContent';
import {
  ApiSubPathTag,
  ClusterTag,
  IndexTag,
  ApiTag,
  MethodTag,
  StatusCodeTag,
} from 'components/Tags';
import type { Request } from 'utils';

interface LineProps {
  request: Request;
}

export const RequestLine: FC<LineProps> = ({ request }) => {
  const { id, method, statusCode, time, url, displayableUrl, cluster, apiSubPath, index, api } =
    request;
  const { selectedLine, selectLine } = useSidebar();

  return (
    <tr
      key={id}
      className={cx('group', selectedLine?.id === id && 'bg-grey-100')}
      onClick={(): void => selectLine(request)}
    >
      <td className="space-x-1 leading-lg group-hover:bg-grey-100">
        <MethodTag method={method} />
        <StatusCodeTag statusCode={statusCode} />
        <span>{Math.round(time)} ms</span>
      </td>
      <td
        className={cx('space-x-1 leading-lg group-hover:bg-grey-100', !selectedLine && 'truncate')}
      >
        {cluster && <ClusterTag cluster={cluster} />}
        {api && <ApiTag api={api} />}
        {index && <IndexTag index={index} />}
        {apiSubPath && <ApiSubPathTag subPath={apiSubPath} />}
        {!selectedLine && (
          <span title={decodeURIComponent(url)} className="px-1">
            {displayableUrl}
          </span>
        )}
      </td>
    </tr>
  );
};
