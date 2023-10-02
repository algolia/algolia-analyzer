import type { FC } from 'react';
import { Upload, Download, Link2, X } from 'react-feather';

import type { Request } from 'utils';

import { Code } from '../Code';

interface SidebarProps {
  request: Request;
  close: () => void;
}

const stickyTitle =
  'sticky border-t border-white top-[calc(2.5rem+1px)] z-10 min-h-10 w-full pl-6 pr-2 flex items-center display-subheading uppercase text-white bg-grey-900';
const scrollingContent = 'table w-full';

export const SidebarContent: FC<SidebarProps> = ({
  request: { requestHeaders, requestBody, responseBody, queryStringParameters, displayableUrl },
  close,
}) => (
  <>
    <div className="sticky top-0 flex items-center z-20 w-full border-t border-black text-white bg-grey-900">
      <h3 className="grow min-h-10 pl-6 pr-2 py-2 flex items-center display-subheading">
        <Link2 className="p-1 mr-2 shrink-0" />
        <span className="break-words">{displayableUrl.replaceAll('/', '/​')}</span>
      </h3>
      <button type="button" className="w-10 h-10 flex items-center justify-center" onClick={close}>
        <X />
      </button>
    </div>
    {queryStringParameters && (
      <>
        <h3 className={stickyTitle}>
          <Upload className="p-1 mr-2" />
          Query String Parameters
        </h3>
        <Code code={queryStringParameters} className={scrollingContent} />
      </>
    )}
    {requestHeaders.length > 0 && (
      <>
        <h3 className={stickyTitle}>
          <Upload className="p-1 mr-2" />
          Request Headers
        </h3>
        <Code code={requestHeaders} className={scrollingContent} />
      </>
    )}
    {requestBody && (
      <>
        <h3 className={stickyTitle}>
          <Upload className="p-1 mr-2" />
          Request Body
        </h3>
        <Code code={requestBody} className={scrollingContent} />
      </>
    )}
    {responseBody && (
      <>
        <h3 className={stickyTitle}>
          <Download className="p-1 mr-2" />
          Response Body
        </h3>
        <Code code={responseBody} className={scrollingContent} />
      </>
    )}
  </>
);
