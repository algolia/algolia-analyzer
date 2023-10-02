import { IconButton, ContentTabs, stl } from '@algolia/satellite';
import cx from 'classnames';
import { type FC, useCallback, useEffect, useState } from 'react';
import { ChevronsLeft, Slash } from 'react-feather';

import { RequestsGrid } from 'components/RequestsGrid';
import { SidebarContent, SidebarContext } from 'components/SidebarContent';
import { Tools } from 'components/Tools';
import { requestBody } from 'models/RequestBody';
import { responseBody } from 'models/ResponseBody';
import {
  urlPattern,
  type Request,
  safeJsonParse,
  requestHeaderFilter,
  urlPattern2,
  getUrlData,
} from 'utils';

export const Page: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedLine, setSelectedLine] = useState<Request>();

  const selectLine = useCallback((request: Request) => {
    setSelectedLine(request);
    setSidebarOpen(true);
  }, []);

  useEffect(() => {
    if (selectedLine === null) {
      setSidebarOpen(false);
    }
  }, [selectedLine]);

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
    setSelectedLine(undefined);
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener(onRequestFinishedListener);
    chrome.devtools.network.onNavigated.addListener(clearRequests);

    return () => {
      chrome.devtools.network.onRequestFinished.removeListener(onRequestFinishedListener);
      chrome.devtools.network.onNavigated.removeListener(clearRequests);
    };
  }, [onRequestFinishedListener, clearRequests]);

  return (
    <SidebarContext.Provider value={{ selectedLine, selectLine }}>
      <main className="h-screen flex flex-col text-grey-900 overflow-x-hidden">
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
        <div className="h-[calc(100vh-3rem)] bg-grey-100 relative overflow-x-hidden">
          <section className="min-w-1/2 space-y-8 overflow-y-auto">
            <ContentTabs
              className={`sticky top-0 z-10 pt-4 mb-4 pl-[calc(25%-62px)] px-[calc(0.5rem+3px)] bg-grey-100 ${stl`shadow-z100`}`}
              tabs={[
                { label: 'Network', content: <RequestsGrid requests={requests} /> },
                { label: 'Tools', content: <Tools /> },
              ]}
            />
          </section>
          {selectedLine && !sidebarOpen && (
            <aside
              className={cx(
                `absolute top-0 right-0 z-10 transition-transform
                text-white bg-grey-900 rounded-bl ${stl`shadow-z100`}`,
                sidebarOpen ? 'translate-x-full' : 'translate-x-0'
              )}
            >
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center"
                onClick={(): void => setSidebarOpen(true)}
              >
                <ChevronsLeft />
              </button>
            </aside>
          )}
          <aside
            className={cx(
              sidebarOpen ? 'translate-x-0' : 'translate-x-full',
              `absolute top-0 right-0 w-1/2 h-[calc(100vh-3rem)] overflow-y-auto z-10
              flex flex-col items-start bg-white ${stl`shadow-z100`} transition-transform`
            )}
          >
            {selectedLine && (
              <SidebarContent request={selectedLine} close={(): void => setSidebarOpen(false)} />
            )}
          </aside>
        </div>
      </main>
    </SidebarContext.Provider>
  );
};
