import { getUrlData } from '../getUrlData';

describe('getUrlData', () => {
  describe('search', () => {
    it('/indexes/*/top', () => {
      expect(getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/*/top'))).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        subPath: 'top',
        index: '*',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/*/top',
      });
    });

    it('/indexes', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes?prefix=products&page=0'))
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        subPath: 'indexes',
        index: null,
        queryStringParameters: { prefix: 'products', page: '0' },
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes',
      });
    });

    it('/indexes/*/queries', () => {
      expect(getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/*/queries'))).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        subPath: 'queries',
        index: '*',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/*/queries',
      });
    });

    it('/indexes/*/rules/search', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/rules/search'))
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        subPath: 'rules/search',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/rules/search',
      });
    });

    it('/indexes/*/rules/{id}', () => {
      expect(
        getUrlData(
          new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/rules/qr-1676451640489')
        )
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        subPath: 'rules/{id}',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/rules/qr-1676451640489',
      });
    });

    it('indexes/*/synonyms/search', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/synonyms/search'))
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        subPath: 'synonyms/search',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/synonyms/search',
      });
    });

    it('indexes/settings', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/settings'))
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        subPath: 'settings',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/settings',
      });
    });
  });

  describe('analytics', () => {
    it('/tags', () => {
      expect(
        getUrlData(
          new URL(
            'https://analytics.de.algolia.com/2/tags?index=products&limit=1000&startDate=2023-06-26&endDate=2023-07-02'
          )
        )
      ).toEqual({
        api: 'analytics',
        cluster: 'de',
        subPath: 'tags',
        index: 'products',
        queryStringParameters: {
          index: 'products',
          limit: '1000',
          startDate: '2023-06-26',
          endDate: '2023-07-02',
        },
        displayableUrl: 'analytics.de.algolia.com/2/tags',
      });
    });

    it('/status', () => {
      expect(
        getUrlData(new URL('https://analytics.de.algolia.com/2/status?index=products'))
      ).toEqual({
        api: 'analytics',
        cluster: 'de',
        subPath: 'status',
        index: 'products',
        queryStringParameters: { index: 'products' },
        displayableUrl: 'analytics.de.algolia.com/2/status',
      });
    });

    it('/categories/count (unstable)', () => {
      expect(
        getUrlData(
          new URL(
            'https://analytics.de.algolia.com/unstable/categories/count?index=products&filterAttributes=categories&startDate=2023-06-26&endDate=2023-07-02'
          )
        )
      ).toEqual({
        api: 'analytics',
        cluster: 'de',
        subPath: 'categories/count',
        index: 'products',
        queryStringParameters: {
          index: 'products',
          filterAttributes: 'categories',
          startDate: '2023-06-26',
          endDate: '2023-07-02',
        },
        displayableUrl: 'analytics.de.algolia.com/unstable/categories/count',
      });
    });

    it('/categories (unstable)', () => {
      expect(
        getUrlData(
          new URL(
            'https://analytics.de.algolia.com/unstable/categories?index=products&clickAnalytics=true&limit=1000&category.attribute=categories&orderBy=searchCount&direction=desc&startDate=2023-06-26&endDate=2023-07-02'
          )
        )
      ).toEqual({
        api: 'analytics',
        cluster: 'de',
        subPath: 'categories',
        index: 'products',
        queryStringParameters: {
          index: 'products',
          clickAnalytics: 'true',
          limit: '1000',
          'category.attribute': 'categories',
          orderBy: 'searchCount',
          direction: 'desc',
          startDate: '2023-06-26',
          endDate: '2023-07-02',
        },
        displayableUrl: 'analytics.de.algolia.com/unstable/categories',
      });
    });

    it('/abtests', () => {
      expect(getUrlData(new URL('https://analytics.de.algolia.com/2/abtests'))).toEqual({
        api: 'analytics',
        cluster: 'de',
        subPath: 'abtests',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'analytics.de.algolia.com/2/abtests',
      });
    });
  });

  describe('query categorization', () => {
    it('/predictions-bins', () => {
      expect(
        getUrlData(new URL('https://query-categorization.de.algolia.com/1/predictions-bins'))
      ).toEqual({
        api: 'query-categorization',
        cluster: 'de',
        subPath: 'predictions-bins',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'query-categorization.de.algolia.com/1/predictions-bins',
      });
    });

    it('/configs', () => {
      expect(getUrlData(new URL('https://query-categorization.de.algolia.com/1/configs'))).toEqual({
        api: 'query-categorization',
        cluster: 'de',
        subPath: 'configs',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'query-categorization.de.algolia.com/1/configs',
      });
    });

    it('/status/*', () => {
      expect(
        getUrlData(new URL('https://query-categorization.de.algolia.com/1/status/products'))
      ).toEqual({
        api: 'query-categorization',
        cluster: 'de',
        subPath: 'status',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'query-categorization.de.algolia.com/1/status/products',
      });
    });

    it('/taxonomy/*', () => {
      expect(
        getUrlData(new URL('https://query-categorization.de.algolia.com/1/taxonomy/products'))
      ).toEqual({
        api: 'query-categorization',
        cluster: 'de',
        subPath: 'taxonomy',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'query-categorization.de.algolia.com/1/taxonomy/products',
      });
    });
  });

  describe('merchandising', () => {
    it('/indexes/*/custom-rankings', () => {
      expect(
        getUrlData(
          new URL(
            'https://merchandising-staging.de.algolia.com/merchandising/1/indexes/products/custom-rankings'
          )
        )
      ).toEqual({
        api: 'merchandising',
        cluster: 'staging',
        subPath: 'indexes/custom-rankings',
        index: 'products',
        queryStringParameters: {},
        displayableUrl:
          'merchandising-staging.de.algolia.com/merchandising/1/indexes/products/custom-rankings',
      });
    });
  });

  describe('automation', () => {
    it('/indices', () => {
      expect(getUrlData(new URL('https://automation.de.algolia.com/1/indices'))).toEqual({
        api: 'automation',
        cluster: 'de',
        subPath: 'indices',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'automation.de.algolia.com/1/indices',
      });
    });

    it('/synonyms/*/count', () => {
      expect(
        getUrlData(new URL('https://automation.de.algolia.com/1/synonyms/products/count'))
      ).toEqual({
        api: 'automation',
        cluster: 'de',
        subPath: 'synonyms/count',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'automation.de.algolia.com/1/synonyms/products/count',
      });
    });

    it('/synonyms/*', () => {
      expect(
        getUrlData(new URL('https://automation.de.algolia.com/1/synonyms/products?status=pending'))
      ).toEqual({
        api: 'automation',
        cluster: 'de',
        subPath: 'synonyms',
        index: 'products',
        queryStringParameters: { status: 'pending' },
        displayableUrl: 'automation.de.algolia.com/1/synonyms/products',
      });
    });
  });

  describe('insights', () => {
    it('/metrics', () => {
      expect(
        getUrlData(
          new URL(
            'https://insights.de.algolia.io/1/metrics?startDate=2023-04-06T00:00:00.000Z&endDate=2023-07-04T23:59:59.999Z&granularity=day&index=products'
          )
        )
      ).toEqual({
        api: 'insights',
        cluster: 'de',
        subPath: 'metrics',
        index: 'products',
        queryStringParameters: {
          startDate: '2023-04-06T00:00:00.000Z',
          endDate: '2023-07-04T23:59:59.999Z',
          granularity: 'day',
          index: 'products',
        },
        displayableUrl: 'insights.de.algolia.io/1/metrics',
      });
    });
  });
});
