import cx from 'classnames';
import { type FC, useCallback } from 'react';

import { useSidebar } from 'components/SidebarContent';
import { ApiSubPathTag, ClusterTag, IndexTag, MethodTag, StatusCodeTag } from 'components/Tags';
import type { Request } from 'utils';

interface LineProps {
  request: Request;
}

export const RequestLine: FC<LineProps> = ({ request }) => {
  const { id, method, statusCode, time, url, cluster, apiSubPath, index } = request;
  const { selectedLine, setSelectedLine } = useSidebar();

  const onClick = useCallback(() => {
    setSelectedLine(request);
  }, [request, setSelectedLine]);

  return (
    <tr
      key={id}
      className={cx('group', selectedLine?.id === id && 'bg-grey-100')}
      onClick={onClick}
    >
      <td className="whitespace-nowrap space-x-1 group-hover:bg-grey-100">
        <MethodTag method={method} />
        <StatusCodeTag statusCode={statusCode} />
        <span>{Math.round(time)} ms</span>
      </td>
      <td
        className={cx(
          'space-x-1 leading-lg group-hover:bg-grey-100',
          selectedLine?.id !== id && 'truncate'
        )}
      >
        {cluster && <ClusterTag cluster={cluster} />}
        {index && <IndexTag index={index} />}
        {apiSubPath && <ApiSubPathTag apiSubPath={apiSubPath} />}
        <span title={decodeURIComponent(url)} className="px-1">
          {decodeURI(url)}
        </span>
      </td>
    </tr>
  );
};
