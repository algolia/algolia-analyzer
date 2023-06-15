import { IconButton, ContentTabs, stl } from '@algolia/satellite';
import cx from 'classnames';
import { type FC, type ReactNode, useCallback, useEffect, useState } from 'react';
import { Slash, X } from 'react-feather';

import { AclCheck } from 'components/AclCheck';
import { RequestsGrid } from 'components/RequestsGrid';
import { SidebarContent, SidebarContext } from 'components/SidebarContent';
import { requestBody } from 'models/RequestBody';
import { responseBody } from 'models/ResponseBody';
import {
  urlPattern,
  type Request,
  safeJsonParse,
  requestHeaderFilter,
  type ApiType,
  urlPattern2,
} from 'utils';

type UrlData = Pick<
  Request,
  | 'api'
  | 'apiPath'
  | 'apiSubPath'
  | 'cluster'
  | 'displayableUrl'
  | 'index'
  | 'queryStringParameters'
>;

const getCluster = (hostname: string, api: ApiType, apiPathParts: string[]): string | undefined => {
  const splitHostName = hostname.split('.');
  let cluster: string | undefined = splitHostName[0];

  if (cluster === api && splitHostName[1].length === 2) {
    // gets country
    cluster = splitHostName[1];
  }
  if (cluster.includes('-staging')) {
    cluster = 'staging';
  } else if (cluster === 'analytics') {
    cluster = apiPathParts.length >= 1 && apiPathParts[0] === 'unstable' ? 'unstable' : undefined;
  }
  return cluster;
};

const getUrlData = (url: URL): UrlData => {
  let apiPath = url.pathname;
  let api: ApiType = 'search';
  if (apiPath.startsWith('/merchandising')) {
    api = 'merchandising';
    apiPath = url.pathname.split('/merchandising')[1];
  } else if (url.host.startsWith('analytics.')) {
    api = 'analytics';
  } else if (url.host.startsWith('automation')) {
    api = 'automation';
  } else if (url.host.startsWith('query-categorization')) {
    api = 'query-categorization';
  }
  const [_, ...apiPathParts] = apiPath.split('/');

  const queryStringParameters: Record<string, string> = {};
  const parameters = Array.from(url.searchParams.keys());
  for (const parameter of parameters) {
    const value = url.searchParams.get(parameter);
    if (value !== null) {
      queryStringParameters[parameter] = value;
    }
  }

  const cluster = getCluster(url.hostname, api, apiPathParts);

  let apiSubPath = null;
  let index = null;
  if (
    apiPathParts.length >= 3 &&
    ['search', 'merchandising', 'automation', 'query-categorization'].includes(api)
  ) {
    if (apiPathParts.length > 3) {
      apiSubPath = apiPathParts.slice(3).reduce((a, b) => `${a}/${b}`);
      if (api === 'automation') {
        index = apiPathParts[2];
        apiSubPath = `${apiPathParts[1]}/${apiSubPath}`;
      }
    } else if (api === 'query-categorization') {
      index = apiPathParts[2];
      apiSubPath = apiPathParts[1];
    } else if (apiPathParts[1] === 'indexes') {
      index = apiPathParts[2];
    }
  } else if (apiPathParts.length >= 1) {
    if (
      apiPathParts.length > 1 &&
      (!isNaN(parseInt(apiPathParts[0], 10)) || apiPathParts[0] === 'unstable')
    ) {
      apiSubPath = apiPathParts.slice(1).reduce((a, b) => `${a}/${b}`);
    } else {
      apiSubPath = apiPathParts.reduce((a, b) => `${a}/${b}`);
    }
  }

  const displayableUrl = `${url.host}${url.pathname}`;

  return { cluster, api, apiPath, apiSubPath, displayableUrl, index, queryStringParameters };
};

export const Page: FC = () => {
  const [sidebarContent, setSidebarContent] = useState<ReactNode>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedLine, setSelectedLine] = useState<Request>();

  useEffect(() => {
    setSidebarContent(selectedLine ? <SidebarContent request={selectedLine} /> : null);
  }, [selectedLine]);

  const closeSidebar = useCallback(() => {
    setSelectedLine(undefined);
  }, []);

  const onRequestFinishedListener = useCallback((details: chrome.devtools.network.Request) => {
    if (!urlPattern.test(details.request.url) && !urlPattern2.test(details.request.url)) {
      return;
    }

    const time = new Date().getTime();
    const random = Math.random();

    details.getContent((content) => {
      const id = `${time}-${random}`;
      const request: Request = {
        id,
        method: details.request.method.toUpperCase(),
        url: details.request.url,
        time: details.time,
        ...getUrlData(new URL(details.request.url)),
        requestBody: requestBody(
          safeJsonParse(
            details.request.postData?.text ?? '',
            `error parsing requestBody for requestId ${id}`
          )
        ),
        requestHeaders: details.request.headers.filter((header) =>
          header.name.startsWith(requestHeaderFilter)
        ),
        statusCode: details.response.status,
        responseBody: responseBody(
          safeJsonParse(content, `error parsing responseBody for requestId ${id}`)
        ),
      };
      setRequests((reqs) => [...reqs, request]);
    });
  }, []);

  const clearRequests = useCallback(() => {
    setRequests([]);
    closeSidebar();
  }, [closeSidebar]);

  useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener(onRequestFinishedListener);
    chrome.devtools.network.onNavigated.addListener(clearRequests);

    return () => {
      chrome.devtools.network.onRequestFinished.removeListener(onRequestFinishedListener);
      chrome.devtools.network.onNavigated.removeListener(clearRequests);
    };
  }, [onRequestFinishedListener, clearRequests]);

  return (
    <SidebarContext.Provider value={{ selectedLine, setSelectedLine }}>
      <main className="h-screen flex flex-col text-grey-900">
        <header className="h-12 sticky flex items-center top-0 left-0 w-full bg-white stl-card-z200 space-x-2 p-2 z-30">
          <IconButton
            icon={Slash}
            variant="subtle"
            size="large"
            title="clear list"
            disabled={requests.length <= 0}
            onClick={clearRequests}
          />
          <h1 className="stl-display-medium grow mb-1">Algolia Analyzer</h1>
        </header>
        <div className="h-[calc(100vh-3rem)] flex bg-grey-100">
          <section
            className={cx(
              sidebarContent ? 'w-1/2' : 'w-full',
              'transition-width space-y-8 overflow-y-auto',
              sidebarContent ? 'sidebar-opened' : 'sidebar-closed'
            )}
          >
            <ContentTabs
              className={`sticky top-0 z-10 pt-4 mb-4 px-[calc(0.5rem+3px)] flex justify-center bg-grey-100 ${stl`shadow-z100`}`}
              tabs={[
                { label: 'Network', content: <RequestsGrid requests={requests} /> },
                { label: 'Tools', content: <AclCheck /> },
              ]}
            />
          </section>
          <aside
            className={cx(
              sidebarContent ? '!w-1/2' : '!w-0',
              'relative bg-white display-body border-r border-grey-200/50 transition-width flex flex-col items-start overflow-y-auto'
            )}
          >
            <div className="sticky top-0 w-full bg-white z-20">
              <IconButton
                icon={X}
                size="small"
                variant="subtle"
                title="close panel"
                onClick={closeSidebar}
              />
            </div>
            {sidebarContent}
          </aside>
        </div>
      </main>
    </SidebarContext.Provider>
  );
};
