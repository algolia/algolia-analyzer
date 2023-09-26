import type { FC } from 'react';
import { Upload, Download, Link2 } from 'react-feather';

import type { Request } from 'utils';

import { Code } from '../Code';

interface SidebarProps {
  request: Request;
}

const stickyTitle =
  'sticky border-t border-white top-[calc(4rem+1px)] z-10 min-h-10 w-full pl-6 pr-2 flex items-center display-subheading uppercase text-white bg-grey-900';
const scrollingContent = 'table w-full';

export const SidebarContent: FC<SidebarProps> = ({
  request: { requestHeaders, requestBody, responseBody, queryStringParameters, displayableUrl },
}) => (
  <>
    <div className="sticky top-6 z-20 w-full border-t border-black">
      <h3 className="min-h-10 pl-6 pr-2 py-2 flex items-center display-subheading text-white bg-grey-900">
        <Link2 className="p-1 mr-2 shrink-0" />
        <span className="break-words">{displayableUrl.replaceAll('/', '/​')}</span>
      </h3>
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
