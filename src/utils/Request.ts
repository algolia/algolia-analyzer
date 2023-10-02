export type ApiType =
  | 'analytics'
  | 'automation'
  | 'dashboard'
  | 'insights'
  | 'merchandising'
  | 'query-categorization'
  | 'search';

export interface Request {
  id: string;
  method: string;
  url: string;
  displayableUrl: string;
  time: number;
  cluster?: string;
  api: ApiType;
  apiSubPath: string | null;
  index: string | null;
  queryStringParameters: Record<string, string>;
  requestBody: unknown | undefined;
  statusCode: number;
  requestHeaders: chrome.webRequest.HttpHeader[];
  responseBody: unknown | undefined;
}

export interface RequestFilter {
  tabId?: number | undefined;
  urls: string[];
}
