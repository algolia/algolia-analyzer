import { type Option } from '@algolia/satellite';

export const generalTypes = ['method', 'statusCode'] as const;
type GeneralOptionType = (typeof generalTypes)[number];

export interface GeneralOption extends Option {
  type: GeneralOptionType;
  reversed: boolean;
}

export const urlTypes = ['cluster', 'index', 'apiSubPath', 'api'] as const;
type UrlOptionType = (typeof urlTypes)[number];

export interface UrlOption extends Option {
  type: UrlOptionType;
  reversed: boolean;
}

export const allFilterTypes = [...generalTypes, ...urlTypes] as const;
export type FilterType = GeneralOptionType | UrlOptionType;
export type FilteringOption = GeneralOption | UrlOption;

export const noValueText: Record<FilterType, `no ${string}`> = {
  api: 'no API',
  apiSubPath: 'no API path',
  cluster: 'no cluster',
  index: 'no index',
  method: 'no method',
  statusCode: 'no status code',
};
