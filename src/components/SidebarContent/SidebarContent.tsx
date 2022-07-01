import { Sidebar } from '@algolia/satellite';
import type { FC } from 'react';
import { Upload, Download } from 'react-feather';

import type { Request } from 'utils';

import { Code } from '../Code';

interface SidebarProps {
  request: Request;
}

export const SidebarContent: FC<SidebarProps> = ({
  request: { requestHeaders, requestBody, responseBody, queryStringParameters },
}) => (
  <>
    {queryStringParameters && (
      <div className="w-full border-t border-black">
        <Sidebar.Header className="bg-grey-900 !text-white">
          <Upload className="p-1 mr-2" />
          Query String Parameters
        </Sidebar.Header>
        <Code code={queryStringParameters} />
      </div>
    )}
    {requestHeaders.length > 0 && (
      <div className="w-full border-t border-black">
        <Sidebar.Header className="bg-grey-900 !text-white">
          <Upload className="p-1 mr-2" />
          Request Headers
        </Sidebar.Header>
        <Code code={requestHeaders} />
      </div>
    )}
    {requestBody && (
      <div className="w-full border-t border-black">
        <Sidebar.Header className="bg-grey-900 !text-white">
          <Upload className="p-1 mr-2" />
          Request Body
        </Sidebar.Header>
        <Code code={requestBody} />
      </div>
    )}
    {responseBody && (
      <div className="w-full border-t border-black">
        <Sidebar.Header className="bg-grey-900 !text-white">
          <Download className="p-1 mr-2" />
          Response Body
        </Sidebar.Header>
        <Code code={responseBody} />
      </div>
    )}
  </>
);
