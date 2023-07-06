import type { ApiType, Request } from './Request';
import { spliceItemAt } from './spliceItemAt';

export type UrlData = Pick<
  Request,
  'api' | 'apiSubPath' | 'cluster' | 'displayableUrl' | 'index' | 'queryStringParameters'
>;

const getApiPathCluster = (url: URL): Pick<UrlData, 'api' | 'cluster'> & { apiPath: string } => {
  const splitHostName = url.hostname.split('.');
  let cluster: string | undefined = splitHostName[0];
  const country: string | undefined = splitHostName[1];
  let api: ApiType = 'search';
  let apiPath = url.pathname;

  if (url.pathname.startsWith('/merchandising')) {
    api = 'merchandising';
    apiPath = url.pathname.split('/merchandising')[1];
  }

  if (url.host.startsWith('analytics.')) {
    api = 'analytics';
  }

  if (url.host.startsWith('automation')) {
    api = 'automation';
  }

  if (url.host.startsWith('query-categorization')) {
    api = 'query-categorization';
  }

  if (url.host.startsWith('insights')) {
    api = 'insights';
  }

  if (cluster === api) {
    cluster = country;
  }

  if (cluster.includes('-staging')) {
    cluster = 'staging';
  }

  return { api, apiPath, cluster };
};

const getQueryStringParameters = (searchParams: URLSearchParams): Record<string, string> => {
  const queryStringParameters: Record<string, string> = {};
  const parameters = Array.from(searchParams.keys());
  for (const parameter of parameters) {
    const value = searchParams.get(parameter);
    if (value !== null) {
      queryStringParameters[parameter] = value;
    }
  }
  return queryStringParameters;
};

const getIndexAndSubPath = (
  api: ApiType,
  apiPath: string,
  searchParams: URLSearchParams
): Pick<UrlData, 'apiSubPath' | 'index' | 'queryStringParameters'> => {
  const queryStringParameters = getQueryStringParameters(searchParams);

  const [_slash, version, ...apiPathParts] = apiPath.split('/');
  if (isNaN(parseInt(version, 10)) && version !== 'unstable') {
    apiPathParts.unshift(version);
  }

  let apiSubPath: UrlData['apiSubPath'] = apiPathParts.join('/');
  let index: UrlData['index'] = null;

  switch (api) {
    case 'analytics':
      if (queryStringParameters.index) {
        index = queryStringParameters.index;
      }
      break;
    case 'query-categorization':
    case 'merchandising':
    case 'insights':
    case 'automation': {
      const { array, item } = spliceItemAt(apiPathParts, 1, null);
      apiSubPath = array.join('/');
      index = item ?? queryStringParameters.index ?? null;
      break;
    }
    case 'search': {
      const { array, item } = spliceItemAt(apiPathParts, 1, null);
      // don't show 'indexes' in subPath unless it's the only subPath
      if (array[0] === 'indexes' && array.length > 1) {
        array.splice(0, 1);
      }
      if (array[0] === 'rules' && array[1] !== 'search') {
        array.splice(1);
        array.push('{id}');
      }
      apiSubPath = array.join('/');
      index = item;
      break;
    }
    default:
      break;
  }

  return { index, apiSubPath, queryStringParameters };
};

export const getUrlData = (url: URL): UrlData => {
  const { api, cluster, apiPath } = getApiPathCluster(url);
  const { index, apiSubPath, queryStringParameters } = getIndexAndSubPath(
    api,
    apiPath,
    url.searchParams
  );

  return {
    api,
    cluster,
    apiSubPath,
    displayableUrl: `${url.host}${url.pathname}`,
    index,
    queryStringParameters,
  };
};
