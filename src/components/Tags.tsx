import { Tag, type TagVariants, type TagProps } from '@algolia/satellite';
import type { FC } from 'react';

import { type ApiType } from 'utils';

export type CustomTagProps = Omit<TagProps, 'ref'> & { reversed?: boolean };

const getStatusColor = (statusCode: number): TagVariants => {
  if (statusCode < 200) return 'blue';
  if (statusCode < 300) return 'green';
  if (statusCode < 400) return 'orange';
  if (statusCode < 600) return 'red';
  return 'grey';
};

export const StatusCodeTag: FC<CustomTagProps & { statusCode: number }> = ({
  statusCode,
  reversed,
  ...props
}) => (
  <Tag {...props} variant={getStatusColor(statusCode)} title="status code" placeholder={undefined}>
    {reversed && '!'}
    {statusCode}
  </Tag>
);

export const MethodTag: FC<CustomTagProps & { method: string }> = ({
  method,
  reversed,
  ...props
}) => (
  <Tag {...props} title="method" placeholder={undefined}>
    {reversed && '!'}
    {method}
  </Tag>
);

export const ClusterTag: FC<CustomTagProps & { cluster: string }> = ({
  cluster,
  reversed,
  ...props
}) => (
  <Tag {...props} variant="blue" title="cluster" placeholder={undefined}>
    {reversed && '!'}
    {cluster}
  </Tag>
);

export const IndexTag: FC<CustomTagProps & { index: string | null }> = ({
  index,
  reversed,
  ...props
}) => (
  <Tag {...props} variant="accent" title="index" placeholder={undefined}>
    {reversed && '!'}
    {index || 'no index'}
  </Tag>
);

export const ApiSubPathTag: FC<CustomTagProps & { subPath: string | null }> = ({
  subPath,
  reversed,
  ...props
}) => (
  <Tag {...props} variant="pink" title="api path" placeholder={undefined}>
    {reversed && '!'}
    {subPath || 'no API path'}
  </Tag>
);

const apiString: Record<ApiType, string> = {
  analytics: 'analytics',
  automation: 'automation',
  insights: 'insights',
  merchandising: 'merch',
  'query-categorization': 'queryCat',
  're-ranking': 'reRanking',
  search: 'search',
  dashboard: 'dashboard',
  neuralperso: 'neuralPerso',
};

export const ApiTag: FC<CustomTagProps & { api: ApiType }> = ({ api, reversed, ...props }) => (
  <Tag {...props} variant="orange" title="API" placeholder={undefined}>
    {reversed && '!'}
    {apiString[api]}
  </Tag>
);
